import React, { useState } from "react";

const PAGES = {
  page1: {
    title: "LL3-BVL3",
    columns: ["NUMERO VI", "DATE+RG. PREV.", "VI RECYCLE", "VEMB", "LIMOGE (ID)"],
    rows: [
      ["11MA107982 A", "13/04/26 026", "", "OUI", ""],
      ["10XA069361 A", "13/04/26 027", "", "", ""],
      ["11MA107997 M", "13/04/26 028", "", "", ""],
      ["10XA069341 G", "13/04/26 029", "", "OUI", ""],
      ["11MA107990 P", "13/04/26 030", "DECYCLE", "OUI", ""],
      ["10XA069363 W", "13/04/26 031", "ANNULE", "", ""],
      ["11MA107984 W", "13/04/26 032", "", "OUI", ""],
      ["10XA069324 U", "13/04/26 033", "MONTEE SANS", "OUI", ""],
      ["11MA107973 B", "13/04/26 034", "", "", ""],
      ["10XA069337 K", "13/04/26 035", "", "OUI", ""],
      ["10XA069358 P", "13/04/26 036", "REENGAGEE", "OUI", ""],
      ["11MA107998 X", "13/04/26 037", "", "", ""],
      ["10XA069348 E", "13/04/26 039", "", "OUI", ""],
      ["10XA069031 X", "01/04/26 029", "REENGAGEE", "OUI", ""],
      ["11MA107978 D", "13/04/26 040", "", "", ""],
    ],
  },
  page2: {
    title: "LL2-PEL2",
    columns: [
      "NUMERO VI",
      "DATE+RG. PREV.",
      "TANDEM",
      "TANDEM ADAPT CLIE",
      "VI RECYCLE",
      "ESSIEUX SUP",
      "ESSIEU SUP DAC",
      "1 PONT 3 ESS",
      "1 PONT 3 ESS DAC",
    ],
    rows: [
      ["30CT000412 K", "13/04/26 019", "", "", "", "OUI", "", "OUI", ""],
      ["11MC013406 F", "13/04/26 020", "", "", "", "OUI", "", "", ""],
      ["30CN009559 U", "13/04/26 021", "OUI", "", "DECYCLE", "", "", "", ""],
      ["11MC013407 R", "13/04/26 022", "", "", "", "OUI", "", "", ""],
      ["31KS011043 B", "13/04/26 023", "OUI", "", "", "OUI", "", "", ""],
      ["10XM003319 F", "13/04/26 024", "", "", "", "OUI", "", "", ""],
      ["31KP003642 M", "13/04/26 025", "OUI", "", "DECYCLE", "", "", "", ""],
      ["30CM007918 L", "13/04/26 026", "", "", "", "OUI", "", "", ""],
      ["31KS011038 U", "13/04/26 027", "OUI", "", "", "OUI", "", "", ""],
      ["10XM003320 W", "13/04/26 028", "", "", "", "OUI", "", "", ""],
      ["31KN006014 T", "13/04/26 029", "OUI", "", "DECYCLE", "", "", "", ""],
      ["30CA010806 C", "13/04/26 030", "", "", "", "", "", "", ""],
      ["30CR001403 K", "13/04/26 031", "OUI", "", "", "OUI", "", "", ""],
      ["10XC003238 P", "13/04/26 032", "", "", "", "OUI", "", "", ""],
      ["30CN009564 B", "13/04/26 033", "OUI", "", "DECYCLE", "", "", "", ""],
      ["11MM009619 S", "13/04/26 034", "", "", "", "OUI", "", "", ""],
    ],
  },
};

const PAGE_NAMES = Object.keys(PAGES);

function getRowKey(row, rowIndex) {
  return `${row[0] ?? "row"}-${row[1] ?? rowIndex}`;
}

function renderCellValue(cell) {
  if (cell === "" || cell == null) {
    return <span className="empty-cell">—</span>;
  }
  return cell;
}

function getRecycleColumnIndex(columns) {
  return columns.indexOf("VI RECYCLE");
}

function getRowColorClass(row, columns) {
  const recycleValue = row[getRecycleColumnIndex(columns)];
  const normalizedValue = String(recycleValue ?? "").trim().toUpperCase();

  if (normalizedValue === "ANNULE") return "row-red";
  if (["DECYCLE", "DÉCYCLÉ", "DECYCLEE"].includes(normalizedValue)) return "row-blue";
  if (["REENGAGEE", "RÉENGAGÉE"].includes(normalizedValue)) return "row-green";
  if (["MONTEE SANS", "MONTÉE SANS"].includes(normalizedValue)) return "row-gray";
  return "row-white";
}

export default function App() {
  const [selectedPage, setSelectedPage] = useState(PAGE_NAMES[0] ?? "");
  const current = PAGES[selectedPage] ?? PAGES[PAGE_NAMES[0]];

  if (!current) {
    return (
      <div className="app-shell">
        <div className="panel">
          <h1 className="page-title">Interface des tableaux</h1>
          <p className="page-subtitle">Aucune page disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="container">
        <div className="panel top-panel">
          <div>
            <h1 className="page-title">Interface des tableaux</h1>
            <p className="page-subtitle">Sélectionnez une page pour afficher le tableau correspondant.</p>
          </div>

          <div className="select-block">
            <label className="select-label" htmlFor="page-select">
              Choisir une page
            </label>
            <select
              id="page-select"
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="page-select"
            >
              {PAGE_NAMES.map((page) => (
                <option key={page} value={page}>
                  {PAGES[page].title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="panel table-panel">
          <div className="table-header">
            <h2 className="table-title">{current.title}</h2>
            <p className="table-subtitle">{current.rows.length} lignes</p>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {current.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.rows.map((row, rowIndex) => (
                  <tr key={getRowKey(row, rowIndex)} className={getRowColorClass(row, current.columns)}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${getRowKey(row, rowIndex)}-${current.columns[cellIndex] ?? cellIndex}`}>
                        {renderCellValue(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
