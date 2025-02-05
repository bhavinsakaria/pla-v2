import prisma from "../prisma/client.js";

async function getDisData() {
    try {
        return await prisma.mdis.findMany({ where: { Type: 'S' } });
    } catch (error) {
        console.error("Error fetching distribution data:", error);
        return [];
    }
}

async function fetchDispatchDetails({ Voucher, VCN, IC }) {
    try {
        const result = await prisma.dis.findMany({
            where: { Voucher, VCN, AddField: { startsWith: IC } },
        });

        if (!result.length) return null;
        
        const { AddField } = result[0];
        const dataArray = AddField.split(";");
        if (dataArray.length < 24) return null;

        const challanNo = dataArray[22];
        const challanDtString = dataArray[23];
        const cancelInfo = dataArray[24];

        const challanDate = challanDtString.length === 8
            ? new Date(challanDtString.slice(0, 4), challanDtString.slice(4, 6) - 1, challanDtString.slice(6, 8))
            : null;

        return { challanNo, challanDate, cancelInfo };
    } catch (error) {
        console.error("Error fetching dispatch details:", error);
        return null;
    }
}

async function getDispatchData(challanNo) {
    return prisma.dispatch.findFirst({ where: { challanNo } }).catch(error => {
        console.error("Error fetching dispatch data:", error);
        return null;
    });
}

async function createDispatchData(data) {
    return prisma.dispatch.create({ data }).catch(error => {
        console.error("Error creating dispatch data:", error);
        return null;
    });
}

async function updateDispatchData(id, data) {
    return prisma.dispatch.update({ where: { id }, data }).catch(error => {
        console.error("Error updating dispatch data:", error);
        return null;
    });
}

async function getPartyData({ CID, MR }) {
    try {
        const [partyRec, mrRec] = await Promise.all([
            prisma.partyc.findFirst({ where: { CID } }),
            prisma.partyc.findFirst({ where: { CID: MR } })
        ]);

        if (!partyRec || !mrRec) return null;
        
        return {
            partyName: partyRec.ParNam,
            partyCode: partyRec.AddField.replace(";", ""),
            salesRep: mrRec.ParNam,
        };
    } catch (error) {
        console.error("Error fetching party data:", error);
        return null;
    }
}

function getFinancialYearDates(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const startYear = month < 4 ? year - 1 : year;
    const endYear = startYear + 1;

    return {
        startDate: new Date(`${startYear}-04-01`),
        endDate: new Date(`${endYear}-03-31`)
    };
}

async function processBatch(records) {
    const { startDate } = getFinancialYearDates();

    const tasks = records.map(async rec => {
        const { Voucher, VCN, Date: recDate, CID, Final, Others, MR, AddField } = rec;
        const orderAmt = Final - Others;

        if (recDate < startDate) return;

        const IC = AddField.startsWith("I") ? "I" : AddField.startsWith("C") ? "C" : null;
        if (!IC) return;

        const dispatchDetails = await fetchDispatchDetails({ Voucher, VCN, IC });
        if (!dispatchDetails) return;

        const { challanNo, challanDate, cancelInfo } = dispatchDetails;
        let dispatch = await getDispatchData(challanNo);

        if (!dispatch) {
            const partyData = await getPartyData({ CID, MR });
            if (!partyData) return;

            const orderStatus = IC === "I" ? "Direct" : cancelInfo.includes("CANCELLED") ? "Cancelled" : "Not Printed";
            const payload = {
                challanNo, challanDate, invoiceNo: IC === "I" ? VCN : undefined,
                invoiceDate: recDate, ...partyData, orderAmt, orderStatus, Voucher
            };
            await createDispatchData(payload);
        } else if (!dispatch.invoiceNo || !dispatch.orderAmt) {
            const orderStatus = cancelInfo?.includes("CANCELLED") ? "Cancelled" : dispatch?.orderStatus;
            const updateData = {
                invoiceNo: dispatch.invoiceNo || (IC === "I" ? VCN : undefined),
                invoiceDate: recDate, orderAmt, orderStatus
            };
            await updateDispatchData(dispatch.id, updateData);
        }
    });
    
    await Promise.all(tasks);
}

async function processDispatchRecords() {
    try {
        const records = await getDisData();
        const batchSize = 5;

        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);
            await processBatch(batch);
        }
    } catch (error) {
        console.error("Error in processing dispatch records:", error);
    }
}

processDispatchRecords();
