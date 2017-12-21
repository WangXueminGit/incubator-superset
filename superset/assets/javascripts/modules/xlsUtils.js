import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import XLSXStyle from 'xlsx-style';

const classToCellProps = {
  'background-lightseagreen': {
    fill: {
      fgColor: {
        rgb: 'C6EFCE',
      },
    },
  },
  'background-lightpink': {
    fill: {
      fgColor: {
        rgb: 'FFC7CD',
      },
    },
  },
  'background-lightblue': {
    fill: {
      fgColor: {
        rgb: 'AED2EA',
      },
    },
  },
  'background-beige': {
    fill: {
      fgColor: {
        rgb: 'F7EDD9',
      },
    },
  },
  'background-lightgray': {
    fill: {
      fgColor: {
        rgb: 'D3D3D3',
      },
    },
  },
  bold: {
    font: {
      bold: true,
    },
  },
  'text-left': {
    alignment: {
      horizontal: 'top',
      vertical: 'top',
    },
  },
  'text-center': {
    alignment: {
      horizontal: 'center',
      vertical: 'top',
    },
  },
  'text-right': {
    alignment: {
      horizontal: 'bottom',
      vertical: 'top',
    },
  },
  'default': {
    alignment: {
      vertical: 'top',
    },
  },
};

const htmlCharMap = {
  '&': /&amp;/g,
};

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}
function decodeHtmlChars(htmlStr) {
  let decodedStr = htmlStr;
  if (typeof htmlStr === 'string') {
    Object.keys(htmlCharMap).forEach((key) => {
      decodedStr = decodedStr.replace(htmlCharMap[key], key);
    });
  }
  return decodedStr;
}
function formatHeader(refs, ws, rCount) {
  const newWs = Object.assign({}, ws);
  const headerCells = [];
  for (let R = 0; R < rCount; ++R) {
    for (let C = refs.s.c; C <= refs.e.c; ++C) {
      const cellAddress = { c: C, r: R };
      headerCells.push(XLSX.utils.encode_cell(cellAddress));
    }
  }
  headerCells.filter(v => Object.keys(ws).indexOf(v) !== -1)
    .forEach((v) => {
      const newCellContent = Object.assign({}, ws[v], {
        s: Object.assign({}, classToCellProps.bold, classToCellProps.default),
      });
      newWs[v] = newCellContent;
    });
  return newWs;
}
function formatContent(refs, ws, tBody, rCount) {
  const newWs = Object.assign({}, ws);
  for (let R = rCount; R <= refs.e.r; ++R) {
    const tr = tBody.children[R - rCount];
    const rowClassList = tr.classList;
    const rowStyles = Object.values(rowClassList)
      .map(v => classToCellProps[v]);
    for (let C = refs.s.c; C <= refs.e.c; ++C) {
      const cellAddress = { c: C, r: R };
      const cellReference = XLSX.utils.encode_cell(cellAddress);
      const cellClassList = tr.children[C].classList;
      const cellStyles = Object.values(cellClassList)
        .map(v => classToCellProps[v]);
      if (tr.children[C].tagName === 'TH') {
        cellStyles.push(classToCellProps.bold);
      }
      const finalStyles = Object.assign(
        {},
        classToCellProps.default,
        ...rowStyles,
        ...cellStyles
      );
      if (Object.keys(ws).indexOf(cellReference) !== -1) {
        const parsedCellValue = decodeHtmlChars(ws[cellReference].v);
        const newCellContent = Object.assign({}, ws[cellReference], {
          s: finalStyles,
          v: parsedCellValue,
        });
        newWs[cellReference] = newCellContent;
      }
    }
  }
  return newWs;
}
function formatTable(workbook, tableDf) {
  const ws = workbook.Sheets.Sheet1;
  const refs = XLSX.utils.decode_range(ws['!ref']);
  const rCount = tableDf.getElementsByTagName('thead')[0].childElementCount;
  const tBody = tableDf.getElementsByTagName('tbody')[0];
  const headerWs = formatHeader(refs, ws, rCount);
  const finalWs = formatContent(refs, headerWs, tBody, rCount);
  return Object.assign({}, workbook, { Sheets: { Sheet1: finalWs } });
}
function removeHiddenRows(tableDf) {
  const newDf = tableDf.cloneNode(true);
  const tableContent = newDf.children[1]
  const tableRows = tableContent.children
  Array.from(Array(tableRows.length), (_, i) => tableRows[i])
    .forEach((tableRow, rowNo) => {
      if(tableRow.style.display === 'none') {
        tableContent.removeChild(tableRow);
      }
      const tableColumns = tableRow.children
      Array.from(Array(tableColumns.length), (_, i) => tableColumns[i])
        .forEach((tableColumn, colNo) => {
          if(tableColumn.style.display === 'none') {
            tableRow.removeChild(tableColumn);
          }
        })
    });
  return newDf;
}
function freezeSheets(workbook, freezeRows, freezeColumns){
  const ws = workbook.Sheets.Sheet1;
  const topLeftCellAddress = { c: freezeColumns, r: freezeRows };
  const topLeftCellReference = XLSX.utils.encode_cell(topLeftCellAddress);
  const wsFreeze = {
    '!viewPane': {
      xSplit: String(freezeColumns),
      ySplit: String(freezeRows),
      topLeftCell: topLeftCellReference,
      activePane: "bottomRight",
      state: "frozen"
    }
  };
  const finalWs = Object.assign({}, ws, wsFreeze);
  return Object.assign({}, workbook, { Sheets: { Sheet1: finalWs } });
}
export default function downloadTable(type, title, tableDf, freezeRows, freezeColumns) {
  const newDf = removeHiddenRows(tableDf)
  const workbook = XLSX.utils.table_to_book(newDf, { raw: true });
  const formattedWb = formatTable(workbook, tableDf);
  const frozenWb =  (freezeRows || freezeColumns) ?
    freezeSheets(formattedWb, freezeRows, freezeColumns) : formattedWb
  const wopts = { bookType: type, bookSST: false, type: 'binary' };
  const wbout = XLSXStyle.write(frozenWb, wopts);
  FileSaver.saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    title + '.' + type,
  );
}
