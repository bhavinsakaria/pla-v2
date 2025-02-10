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
    await registerChallanData();
    const dispatchRecords = await prisma.dispatch.findMany({
      where: {
        invoiceNo: null,
        OR: [
          { orderStatus: { not: "Cancelled" } }, // Include orders that are not "CANCELLED"
          { orderStatus: null }, // Include orders where orderStatus is NULL
        ],
      },
    });

    for (const record of dispatchRecords) {
      const { challanNo, id } = record;
      const dispatchData = await getDispatchData(challanNo ?? "", "I");

      if (dispatchData) {
        const { Voucher, VCN, challanDate, cancelInfo } = dispatchData;
        const masterDispatchData = await getMasterDispatchData(Voucher ?? 0);

        if (masterDispatchData) {
          const {
            CID,
            MR,
            Final = 0,
            Others = 0,
            Date: invoiceDate,
          } = masterDispatchData;
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
        const dispatchchallan = await getDispatchChallan(challanNo ?? "", "C");
        if (dispatchchallan) {
          const { cancelInfo } = dispatchchallan;
          const masterDispatchDataChallan = await getMasterDispatchDataChallan(
            challanNo ?? ""
          );
          if (masterDispatchDataChallan) {
            const {
              CID,
              MR,
              Final = 0,
              Others = 0,
              Date: challanDate,
              Voucher,
            } = masterDispatchDataChallan;
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

    return "Dispatch table synced successfully!";
  } catch (error) {
    console.error("Error in syncDispatch:", error);
  }
}

async function getMasterDispatchData(
  Voucher: number
): Promise<MasterDispatchData | null> {
  try {
    const data = await prisma.mdis.findUnique({ where: { Voucher } });
    if (!data) return null;

    return {
      CID: data.CID ?? "", // Provide a default value if CID is null
      MR: data.MR ?? "",
      Final: Number(data.Final) ?? 0,
      Others: Number(data.Others) ?? 0,
      Date: data.Date?.toISOString(), // Convert Date to string
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
      CID: data.CID ?? "", // Provide a default value if CID is null
      MR: data.MR ?? "",
      Final: Number(data.Final) ?? 0,
      Others: Number(data.Others) ?? 0,
      Date: data.Date?.toISOString(), // Convert Date to string
    };
  } catch (error) {
    console.error("Error fetching master dispatch data:", error);
    return null;
  }
}

async function getDispatchChallan(
  challanNo: string,
  type: string
): Promise<DispatchData | null> {
  const { startDate, endDate } = await getFinancialYearDates();
  try {
    const records = await prisma.dis.findMany({
      where: {
        AND: [
          { AddField: { startsWith: type } },
          { VCN: challanNo },
          { Date: { gte: startDate, lte: endDate } },
        ],
      },
    });

    if (records.length === 0) return null;

    const { Voucher, VCN, AddField } = records[0];
    const dataArray = AddField?.split(";") ?? [];

    if (dataArray.length < 24) return null;

    const challanDate = parseDate(dataArray[23]);

    return {
      Voucher: records[0].Voucher?.valueOf() ?? 0,
      VCN: records[0].VCN?.toString() ?? "",
      challanNo: dataArray[22],
      challanDate,
      cancelInfo: dataArray[25],
    };
  } catch (error) {
    console.error("Error fetching dispatch data:", error);
    return null;
  }
}
async function getDispatchData(
  challanNo: string,
  type: string
): Promise<DispatchData | null> {
  const { startDate, endDate } = await getFinancialYearDates();
  try {
    const records = await prisma.dis.findMany({
      where: {
        AND: [
          { AddField: { startsWith: type } },
          { AddField: { contains: challanNo } },
          { Date: { gte: startDate, lte: endDate } },
        ],
      },
    });

    if (records.length === 0) return null;

    const { Voucher, VCN, AddField } = records[0];
    const dataArray = AddField?.split(";") ?? [];

    if (dataArray.length < 24) return null;

    const challanDate = parseDate(dataArray[23]);

    return {
      Voucher: records[0].Voucher?.valueOf() ?? 0,
      VCN: records[0].VCN?.toString() ?? "",
      challanNo: dataArray[22],
      challanDate,
      cancelInfo: dataArray[25],
    };
  } catch (error) {
    console.error("Error fetching dispatch data:", error);
    return null;
  }
}

async function getPartyData(
  CID: string,
  MR: string
): Promise<PartyData | null> {
  try {
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

  // Renaming VCN to challanNo in the result set
  const renamedResult = result.map((record) => ({
    challanNo: record.VCN ?? "", // Provide a default value when record.VCN is null
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
