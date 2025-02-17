import prisma from "../prisma/client.js";

interface DispatchData {
  Voucher: number;
  VCN: string;
  challanNo: string;
  challanDate: Date | null;
  cancelInfo: string;
}

interface MasterDispatchData {
  CID: string;
  MR: string;
  Final?: number;
  Others?: number;
  Date?: string;
  Voucher?: number;
}

interface PartyData {
  partyName: string;
  partyCode: string;
  salesRep: string;
}

export async function syncDispatch(): Promise<any> {
  try {
    // Register any new challan data first.
    await registerChallanData();

    // Get dispatch records that need to be synced.
    const dispatchRecords = await prisma.dispatch.findMany({
      where: {
        invoiceNo: null,
        OR: [
          { orderStatus: { not: "Cancelled" } },
          { orderStatus: null },
        ],
      },
    });
    console.log("Dispatch Records:", dispatchRecords.length);

    // Process records in chunks of 5 to limit concurrent DB connections.
    const chunkSize = 5;
    for (let i = 0; i < dispatchRecords.length; i += chunkSize) {
      const chunk = dispatchRecords.slice(i, i + chunkSize);
      // Process the current chunk concurrently.
      await Promise.all(chunk.map((record) => processRecord(record)));
    }

    return "Dispatch table synced successfully!";
  } catch (error) {
    console.error("Error in syncDispatch:", error);
  }
}

async function processRecord(record: any): Promise<void> {
  console.log("Processing challan:", record.challanNo);
  const { challanNo, id } = record;

  // Try fetching dispatch data (Type "I").
  const dispatchData = await getDispatchData(challanNo ?? "", "I");
  if (dispatchData) {
    const { Voucher, VCN, challanDate, cancelInfo } = dispatchData;
    const masterDispatchData = await getMasterDispatchData(Voucher);
    if (masterDispatchData) {
      const { CID, MR, Final = 0, Others = 0, Date: invoiceDate } =
        masterDispatchData;
      const partyData = await getPartyData(CID, MR);
      if (partyData) {
        const { partyName, partyCode, salesRep } = partyData;
        const orderAmt = Final - Others;
        const orderStatus = (cancelInfo || "").includes("CANCELLED")
          ? "Cancelled"
          : "Packed";

        await prisma.dispatch.update({
          where: { id },
          data: {
            challanDate,
            partyCode,
            partyName,
            orderAmt,
            salesRep,
            invoiceNo: VCN,
            invoiceDate,
            orderStatus,
            Voucher,
          },
        });
      }
    }
  } else {
    // Fallback: try fetching dispatch challan data (Type "C").
    const dispatchChallan = await getDispatchChallan(challanNo ?? "", "C");
    if (dispatchChallan) {
      const { cancelInfo } = dispatchChallan;
      const masterDispatchDataChallan = await getMasterDispatchDataChallan(
        challanNo ?? ""
      );
      if (masterDispatchDataChallan) {
        const { CID, MR, Final = 0, Others = 0, Date: challanDate, Voucher } =
          masterDispatchDataChallan;
        const partyData = await getPartyData(CID, MR);
        if (partyData) {
          const { partyName, partyCode, salesRep } = partyData;
          const orderAmt = Final - Others;
          const orderStatus = (cancelInfo || "").includes("CANCELLED")
            ? "Cancelled"
            : "Not Printed";
          await prisma.dispatch.update({
            where: { id },
            data: {
              challanDate,
              partyCode,
              partyName,
              orderAmt,
              salesRep,
              Voucher,
              orderStatus,
            },
          });
        }
      }
    }
  }
}

async function getMasterDispatchData(
  Voucher: number
): Promise<MasterDispatchData | null> {
  try {
    const data = await prisma.mdis.findUnique({ where: { Voucher } });
    if (!data) return null;

    return {
      CID: data.CID ?? "",
      MR: data.MR ?? "",
      Final: Number(data.Final) ?? 0,
      Others: Number(data.Others) ?? 0,
      Date: data.Date?.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching master dispatch data:", error);
    return null;
  }
}

async function getMasterDispatchDataChallan(
  VCN: string
): Promise<MasterDispatchData | null> {
  try {
    const data = await prisma.mdis.findFirst({ where: { VCN } });
    if (!data) return null;

    return {
      CID: data.CID ?? "",
      MR: data.MR ?? "",
      Final: Number(data.Final) ?? 0,
      Others: Number(data.Others) ?? 0,
      Date: data.Date?.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching master dispatch data:", error);
    return null;
  }
}

async function getDispatchData(
  challanNo: string,
  type: string
): Promise<DispatchData | null> {
  // Compute financial year dates once.
  const { startDate, endDate } = await getFinancialYearDates();
  try {
    const record = await prisma.dis.findFirst({
      where: {
        AND: [
          { AddField: { startsWith: type } },
          { AddField: { contains: challanNo } },
          { Date: { gte: startDate, lte: endDate } },
          { Type: "G" },
        ],
      },
    });
    if (!record) return null;

    const dataArray = record.AddField?.split(";") ?? [];
    if (dataArray.length < 24) return null;

    const challanDate = parseDate(dataArray[23]);
    return {
      Voucher: record.Voucher?.valueOf() ?? 0,
      VCN: record.VCN?.toString() ?? "",
      challanNo: dataArray[22],
      challanDate,
      cancelInfo: dataArray[25],
    };
  } catch (error) {
    console.error("Error fetching dispatch data:", error);
    return null;
  }
}

async function getDispatchChallan(
  challanNo: string,
  type: string
): Promise<DispatchData | null> {
  const { startDate, endDate } = await getFinancialYearDates();
  try {
    const record = await prisma.dis.findFirst({
      where: {
        AND: [
          { AddField: { startsWith: type } },
          { VCN: challanNo },
          { Date: { gte: startDate, lte: endDate } },
        ],
      },
    });
    if (!record) return null;

    const dataArray = record.AddField?.split(";") ?? [];
    if (dataArray.length < 24) return null;

    const challanDate = parseDate(dataArray[23]);
    return {
      Voucher: record.Voucher?.valueOf() ?? 0,
      VCN: record.VCN?.toString() ?? "",
      challanNo: dataArray[22],
      challanDate,
      cancelInfo: dataArray[25],
    };
  } catch (error) {
    console.error("Error fetching dispatch challan data:", error);
    return null;
  }
}

async function getPartyData(
  CID: string,
  MR: string
): Promise<PartyData | null> {
  try {
    // Run both party queries concurrently.
    const [partyRec, mrRec] = await Promise.all([
      prisma.partyc.findFirst({ where: { CID } }),
      prisma.partyc.findFirst({ where: { CID: MR } }),
    ]);

    if (!partyRec || !mrRec) return null;
    return {
      partyName: partyRec.ParNam ?? "",
      partyCode: (partyRec.AddField ?? "").replace(";", ""),
      salesRep: mrRec.ParNam ?? "",
    };
  } catch (error) {
    console.error("Error fetching party data:", error);
    return null;
  }
}

async function registerChallanData() {
  const { startDate, endDate } = await getFinancialYearDates();
  const type = "C";
  const dispatchRecords = await prisma.dispatch.findMany({
    select: { challanNo: true },
  });

  const challanNos = dispatchRecords
    .map((record) => record?.challanNo)
    .filter((val) => val !== null);

  const result = await prisma.mdis.findMany({
    where: {
      AND: [
        { Type: "S" },
        { AddField: { startsWith: type } },
        { Date: { gte: startDate, lte: endDate } },
      ],
      NOT: {
        VCN: {
          in: challanNos,
        },
      },
    },
    select: {
      VCN: true,
      Voucher: true,
    },
  });

  // Rename VCN to challanNo for the dispatch table.
  const renamedResult = result.map((record) => ({
    challanNo: record.VCN ?? "",
    partyName: "",
    Voucher: record.Voucher,
  }));

  await prisma.dispatch.createMany({ data: renamedResult });
}

function parseDate(dateString: string): Date | null {
  return dateString.length === 8
    ? new Date(
        parseInt(dateString.slice(0, 4)),
        parseInt(dateString.slice(4, 6)) - 1,
        parseInt(dateString.slice(6, 8))
      )
    : null;
}

async function getFinancialYearDates(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const startYear = month < 4 ? year - 1 : year;
  const endYear = startYear + 1;

  return {
    startDate: new Date(`${startYear}-04-01`),
    endDate: new Date(`${endYear}-03-31`),
  };
}
