var moment = require("moment")
export default {
  GetExcelToJson(data) {
    data.shift()
    let listImportExcel = []
    data.forEach((row) => {
      if (checkHeader(data)) {
        let importData = {}
        importData.orderNo = row[0]
        importData.marketplace = row[1]
        importData.orderTime = moment(row[3]).format("DD/MM/YYYY hh:mm")
        importData.productName = row[4] + variationName(row[5])
        importData.price = row[6]
        importData.quantity = row[7]
        importData.commodityCost = row[9]
        importData.voucher = row[10]
        importData.managementFee = row[11]
        importData.transactionFee = row[12]
        importData.shippingFee = row[13]
        importData.orderMark = row[14]
        listImportExcel.push(importData)
      }
    })
    let summaryExistedCount = getSummaryExistedCount(listImportExcel)
    console.log("summaryExistedCount", summaryExistedCount)
    let summaryTransaction = getSummaryTotalFee(summaryExistedCount)
    console.log("summaryTransaction", summaryTransaction)
    return summaryTransaction
  },
}

function variationName(dataRow) {
  if (dataRow) {
    return " " + dataRow
  } else {
    return ""
  }
}

function checkHeader(dataRow) {
  if (dataRow[0]) {
    return true
  }
  return true
}

function getSummaryExistedCount(listImportExcel) {
  const orderCount = {}

  // นับจำนวนของ orderID ที่ซ้ำกัน
  listImportExcel.forEach((item) => {
    if (orderCount[item.orderNo]) {
      orderCount[item.orderNo]++
    } else {
      orderCount[item.orderNo] = 1
    }
  })

  // เพิ่ม key existed ให้กับข้อมูลที่มี orderNo ซ้ำกัน
  return listImportExcel.map((item) => ({
    ...item,
    existed: orderCount[item.orderNo],
  }))
}

function getSummaryTotalFee(listImportExcel) {
  if (listImportExcel.length > 0) {
    listImportExcel.forEach((data) => {
      if (data.marketplace === "Shopee") {
        let managementFee = data.managementFee
          ? parseInt(data.managementFee)
          : 0
        let transactionFee = data.transactionFee
          ? parseInt(data.transactionFee)
          : 0
        data.totalFee = (managementFee + transactionFee) / data.existed
      } else if (data.marketplace === "Lazada") {
        let price = data.price ? parseInt(data.price) : 0
        data.totalFee = (price * 0.135) / data.existed
      } else if (data.marketplace === "TikTok") {
        let price = data.price ? parseInt(data.price) : 0
        data.totalFee = (price * 0.04 + 12) / data.existed
      } else {
        data.totalFee = 0
      }
    })
    let summaryPackaging = getSummaryPackaging(listImportExcel)
    return summaryPackaging
  }
}

function getSummaryPackaging(listImportExcel) {
  if (listImportExcel.length > 0) {
    listImportExcel.forEach((data) => {
      let usePackaging = data.orderMark.split(",")
      if (usePackaging.length > 1) {
        if (usePackaging[1] === "Package:B") {
          data.packaging = 3.4 / parseInt(data.existed)
          data.packaging.toFixed(2)
        } else if (usePackaging[1] === "Package:2B") {
          data.packaging = 4.4 / parseInt(data.existed)
          data.packaging.toFixed(2)
        } else if (usePackaging[1] === "Package:C") {
          data.packaging = 4.6 / parseInt(data.existed)
          data.packaging.toFixed(2)
        } else if (usePackaging[1] === "Package:C+8") {
          data.packaging = 6.2 / parseInt(data.existed)
          data.packaging.toFixed(2)
        } else if (usePackaging[1] === "Package:E") {
          data.packaging = 7.7 / parseInt(data.existed)
          data.packaging.toFixed(2)
        } else {
          data.packaging = 0
        }
      } else {
        data.packaging = 0
      }
    })
    let summaryTapeAndLabel = getSummaryTapeAndLabel(listImportExcel)
    return summaryTapeAndLabel
  }
}

function getSummaryTapeAndLabel(listImportExcel) {
  if (listImportExcel.length > 0) {
    listImportExcel.forEach((data) => {
      const isManual = ["Manual", "POS Retail Orders"].includes(data.marketplace)
      data.tapeAndLabel = isManual ? 0 :  0.5 / parseInt(data.existed)
    })
    let summaryCost = getSummaryCost(listImportExcel)
    return summaryCost
  }
}

function getSummaryCost(listImportExcel) {
  if (listImportExcel.length > 0) {
    listImportExcel.forEach((data) => {
      let commodityCost = data.commodityCost
          ? parseFloat(data.commodityCost)
          : 0
        let quantity = data.quantity
          ? parseInt(data.quantity)
          : 0
      data.cost = (commodityCost * quantity) + data.totalFee + data.packaging + data.tapeAndLabel
    })
    let summaryProfit = getSummaryProfit(listImportExcel)
    return summaryProfit
  }
}

function getSummaryProfit(listImportExcel) {
  if (listImportExcel.length > 0) {
    listImportExcel.forEach((data) => {
      let price = data.price ? parseInt(data.price) : 0
      let quantity = data.quantity ? parseInt(data.quantity) : 0
      let managementFee = data.managementFee
        ? parseInt(data.managementFee)
        : 0
      let voucher = data.voucher
        ? parseInt(data.voucher)
        : 0
      let calProfit = (price * quantity)
      if (data.marketplace === "TikTok") {
        calProfit = calProfit + ((voucher + managementFee) / data.existed)
      } else {
        calProfit = calProfit / data.existed
      }
      data.profit = (calProfit - data.cost).toFixed(2)
      
    })
    return listImportExcel
  }
}
