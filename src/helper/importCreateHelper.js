var moment = require("moment");
export default {
  GetExcelToJson(data) {
    data.shift();
    let listImportExcel = [];
    data.forEach((row) => {
      if (checkHeader(data)) {
        let importData = {};
        importData.orderNo = row[0];
        importData.marketplace = row[1];
        importData.orderTime = moment(row[3]).format("DD/MM/YYYY hh:mm");
        importData.productName = row[4] + variationName(row[5]);
        importData.price = row[6];
        importData.quantity = row[7];
        importData.commodityCost = row[9];
        importData.voucher = row[10];
        importData.managementFee = row[11];
        importData.transactionFee = row[12];
        importData.shippingFee = row[13];
        importData.orderMark = row[14];
        importData.existed = row[15];
        importData.profit = row[21];
        listImportExcel.push(importData);
      }
    });
    let summaryTransaction = getSummaryTotalFee(listImportExcel);
    console.log("summaryTransaction", summaryTransaction);
    return listImportExcel;
  },
};

function variationName(dataRow) {
  if (dataRow) {
    return " " + dataRow;
  } else {
    return "";
  }
}

function checkHeader(dataRow) {
  if (dataRow[0]) {
    return true;
  }
  return true;
}

function getSummaryTotalFee(listImportExcel) {
  if (listImportExcel.length > 0) {
    listImportExcel.forEach((data) => {
      if (data.marketplace === "Shopee") {
        let managementFee = data.managementFee
          ? data.managementFee.split(" ")
          : 0;
        let transactionFee = data.transactionFee
          ? data.transactionFee.split(" ")
          : 0;
        data.totalFee =
          (parseInt(managementFee[1]) + parseInt(transactionFee[1])) /
          parseInt(data.existed);
        data.totalFee.toFixed(2);
      } else if (data.marketplace === "Lazada") {
        let price = data.price ? data.price.split(" ") : 0;
        data.totalFee = parseInt(price[1]) * 0.135;
        data.totalFee.toFixed(2);
      } else if (data.marketplace === "TikTok") {
        let price = data.price ? data.price.split(" ") : 0;
        data.totalFee = parseInt(price[1]) * 0.04 + 12;
        data.totalFee.toFixed(2);
      } else {
        data.totalFee = 0;
      }
    });
    let summaryPackaging = getSummaryPackaging(listImportExcel);
    return summaryPackaging;
  }
}

function getSummaryPackaging(listImportExcel) {
  if (listImportExcel.length > 0) {
    listImportExcel.forEach((data) => {
      let usePackaging = data.orderMark.split(",");
      if (usePackaging.length > 1) {
        if (usePackaging[1] === "Package:B") {
          data.packaging = 3.4 / parseInt(data.existed);
          data.packaging.toFixed(2);
        } else if (usePackaging[1] === "Package:2B") {
          data.packaging = 4.4 / parseInt(data.existed);
          data.packaging.toFixed(2);
        } else if (usePackaging[1] === "Package:C") {
          data.packaging = 4.6 / parseInt(data.existed);
          data.packaging.toFixed(2);
        } else if (usePackaging[1] === "Package:C+8") {
          data.packaging = 6.2 / parseInt(data.existed);
          data.packaging.toFixed(2);
        } else if (usePackaging[1] === "Package:E") {
          data.packaging = 7.7 / parseInt(data.existed);
          data.packaging.toFixed(2);
        } else {
          data.packaging = 0;
        }
      } else {
        data.packaging = 0;
      }
    });
    let summaryTapeAndLabel = getSummaryTapeAndLabel(listImportExcel);
    return summaryTapeAndLabel;
  }
}

function getSummaryTapeAndLabel(listImportExcel) {
  if (listImportExcel.length > 0) {
    listImportExcel.forEach((data) => {
      data.tapeAndLabel = 0.5 / parseInt(data.existed);
    });
    return listImportExcel;
  }
}
