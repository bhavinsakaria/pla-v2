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
}

interface PartyData {
    partyName: string;
    partyCode: string;
    salesRep: string;
}

export async function syncDispatch(): Promise<void> {
    try {
        const dispatchRecords = await prisma.dispatch.findMany({ where: { Voucher: null } });
        
        for (const record of dispatchRecords) {
            const { challanNo, id } = record;
            const dispatchData = await getDispatchData(challanNo ?? "");
            
            if (dispatchData) {
                const { Voucher, VCN, challanDate, cancelInfo } = dispatchData;
                const masterDispatchData = await getMasterDispatchData(Voucher ?? 0);
                
                if (masterDispatchData) {
                    const { CID, MR, Final = 0, Others = 0, Date: invoiceDate } = masterDispatchData;
                    const partyData = await getPartyData(CID, MR);
                    
                    if (partyData) {
                        const { partyName, partyCode, salesRep } = partyData;
                        const orderAmt = Final - Others;
                        const orderStatus = cancelInfo.includes("CANCELLED") ? "Cancelled" : "Packed";
                        
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
                                Voucher
                            }
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error in syncDispatch:", error);
    }
}

async function getMasterDispatchData(Voucher: number): Promise<MasterDispatchData | null> {
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

async function getDispatchData(challanNo: string): Promise<DispatchData | null> {
    const {startDate,endDate} = await getFinancialYearDates()
    try {
        const records = await prisma.dis.findMany({
            where: {
                AND: [
                    { AddField: { startsWith: "I" } },
                    { AddField: { contains: challanNo } },
                    {Date : { gte: startDate, lte: endDate }}
                    
                ]
            }

        });

        if (records.length === 0) return null;
        
        const { Voucher, VCN, AddField } = records[0];
        const dataArray = AddField?.split(";") ?? [];
        
        if (dataArray.length < 24) return null;

        const challanDate = parseDate(dataArray[23]);
        return { Voucher: records[0].Voucher?.valueOf() ?? 0, VCN: records[0].VCN?.toString() ?? "", challanNo: dataArray[22], challanDate, cancelInfo: dataArray[24] };
    } catch (error) {
        console.error("Error fetching dispatch data:", error);
        return null;
    }
}

async function getPartyData(CID: string, MR: string): Promise<PartyData | null> {
    try {
        const [partyRec, mrRec] = await Promise.all([
            prisma.partyc.findFirst({ where: { CID } }),
            prisma.partyc.findFirst({ where: { CID: MR } })
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
        endDate: new Date(`${endYear}-03-31`)
    };
}

syncDispatch().catch(error => console.error("Unhandled error in syncDispatch:", error));