import * as XLSX from "xlsx";

export default {
  ReadExcelFile(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      if (file) {
        reader.onload = (e) => {
          let contents = ProcessExcelGetFirstSheet(e.target.result);

          resolve({
            fileName: file.name,
            fileType: file.type,
            raw: e.target.result,
            contents: contents,
          });
        };
        reader.readAsBinaryString(file);
      } else {
        reject("Failed to load file");
      }
    });
  },
};

function ProcessExcelGetFirstSheet(data) {
  let workbook = XLSX.read(data, {
    type: "binary",
    cellDates: true,
    raw: true,
  });

  let firstSheetName = workbook.SheetNames[0];
  let firstSheet = workbook.Sheets[firstSheetName];

  let dataXLSX = XLSX.utils.sheet_to_json(firstSheet, {
    header: 1,
    range: ProcessExcelMaxRef(firstSheet["!ref"]),
    raw: false,
  });

  return dataXLSX;
}

function ProcessExcelMaxRef(ref) {
  let refArray = ref.split(":");
  /* eslint-disable */
  let endRefData = refArray[1].replace(/\'/g, "").split(/(\d+)/);
  let endRefColoum = LettersToNumber(endRefData[0]);
  let endRefRow = endRefData[1];

  let refEndColumn = endRefColoum >= 162 ? "FF" : endRefData[0];
  let refEndRow = endRefRow >= 10000 ? 10000 : endRefData[1];

  return refArray[0] + ":" + refEndColumn + refEndRow;
}

function LettersToNumber(letters) {
  for (var p = 0, n = 0; p < letters.length; p++) {
    n = letters[p].charCodeAt() - 64 + n * 26;
  }
  return n;
}
