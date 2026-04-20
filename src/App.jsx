// App.jsx — PaperLess v2
// Changes vs original:
//   1. BIG_ROWS=5 first rows rendered at larger font/padding
//   2. Page selector enlarged (font 18px, padding 14px)
//   3. ConfirmModal on NUMERO VI checkbox (check only, uncheck is direct)

import React, { useMemo, useState } from "react";

const INITIAL_PAGES = {
  page1: {
    title: "LL3-BVL3",
    columns: ["NUMERO VI", "DATE+RG. PREV.", "VI RECYCLE", "VEMB", "LIMOGE (ID)"],
    rows: [
      ["11MA107982 A","13/04/26 026","","OUI",""],
      ["10XA069361 A","13/04/26 027","","",""],
      ["11MA107997 M","13/04/26 028","","",""],
      ["10XA069341 G","13/04/26 029","","OUI",""],
      ["11MA107990 P","13/04/26 030","DECYCLE","OUI",""],
      ["10XA069363 W","13/04/26 031","ANNULE","",""],
      ["11MA107984 W","13/04/26 032","","OUI",""],
      ["10XA069324 U","13/04/26 033","MONTEE SANS","OUI",""],
      ["11MA107973 B","13/04/26 034","","",""],
      ["10XA069337 K","13/04/26 035","","OUI",""],
      ["10XA069358 P","13/04/26 036","REENGAGEE","OUI",""],
      ["11MA107998 X","13/04/26 037","","",""],
      ["10XA069348 E","13/04/26 039","","OUI",""],
      ["10XA069031 X","01/04/26 029","REENGAGEE","OUI",""],
      ["11MA107978 D","13/04/26 040","","",""],
    ],
  },
  page2: {
    title: "LL2-PEL2",
    columns: ["NUMERO VI","DATE+RG. PREV.","TANDEM","TANDEM ADAPT CLIE","VI RECYCLE","ESSIEUX SUP","ESSIEU SUP DAC","1 PONT 3 ESS","1 PONT 3 ESS DAC"],
    rows: [
      ["30CT000412 K","13/04/26 019","","","","OUI","","OUI",""],
      ["11MC013406 F","13/04/26 020","","","","OUI","","",""],
      ["30CN009559 U","13/04/26 021","OUI","","DECYCLE","","","",""],
      ["11MC013407 R","13/04/26 022","","","","OUI","","",""],
      ["31KS011043 B","13/04/26 023","OUI","","","OUI","","",""],
      ["10XM003319 F","13/04/26 024","","","","OUI","","",""],
      ["31KP003642 M","13/04/26 025","OUI","","DECYCLE","","","",""],
      ["30CM007918 L","13/04/26 026","","","","OUI","","",""],
      ["31KS011038 U","13/04/26 027","OUI","","","OUI","","",""],
      ["10XM003320 W","13/04/26 028","","","","OUI","","",""],
      ["31KN006014 T","13/04/26 029","OUI","","DECYCLE","","","",""],
      ["30CA010806 C","13/04/26 030","","","","","","",""],
      ["30CR001403 K","13/04/26 031","OUI","","","OUI","","",""],
      ["10XC003238 P","13/04/26 032","","","","OUI","","",""],
      ["30CN009564 B","13/04/26 033","OUI","","DECYCLE","","","",""],
      ["11MM009619 S","13/04/26 034","","","","OUI","","",""],
    ],
  },
};

const BIG_ROWS = 5;
const PAGE_NAMES = Object.keys(INITIAL_PAGES);
const NON_CHECKBOX_COLUMNS = new Set(["DATE+RG. PREV.", "VI RECYCLE"]);

function getRowKey(row, rowIndex) { return `${row[0] ?? "row"}-${row[1] ?? rowIndex}`; }
function getRecycleColumnIndex(columns) { return columns.indexOf("VI RECYCLE"); }

function getDefaultRowColor(row, columns) {
  const v = String(row[getRecycleColumnIndex(columns)] ?? "").trim().toUpperCase();
  if (v === "ANNULE") return "#fee2e2";
  if (v === "DECYCLE" || v === "DECYCLEE") return "#dbeafe";
  if (v === "REENGAGEE") return "#dcfce7";
  if (v === "MONTEE SANS") return "#e5e7eb";
  return "#ffffff";
}

function createInitialOuiCheckboxes(pages) {
  const s = {};
  Object.values(pages).forEach((page) => {
    page.rows.forEach((row, rowIndex) => {
      const rk = getRowKey(row, rowIndex);
      page.columns.forEach((column, columnIndex) => {
        if (column === "NUMERO VI" || column === "DATE+RG. PREV." || column === "VI RECYCLE") return;
        if (String(row[columnIndex] ?? "").trim().toUpperCase() === "OUI") s[`${rk}-${column}`] = false;
      });
    });
  });
  return s;
}

function ConfirmModal({ vehicleNumber, onConfirm, onCancel }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3 style={styles.modalTitle}>Confirmer la validation</h3>
        <p style={styles.modalBody}>
          Êtes-vous sûr de valider le véhicule :{" "}
          <strong style={{ color: "#0f172a" }}>{vehicleNumber}</strong> ?
        </p>
        <div style={styles.modalButtons}>
          <button onClick={onCancel} style={styles.btnCancel}>Annuler</button>
          <button onClick={onConfirm} style={styles.btnConfirm}>Valider</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedPage, setSelectedPage] = useState(PAGE_NAMES[0]);
  const [pages] = useState(INITIAL_PAGES);
  const [checkedViRows, setCheckedViRows] = useState({});
  const [checkedOuiCells, setCheckedOuiCells] = useState(() => createInitialOuiCheckboxes(INITIAL_PAGES));
  const [pendingVi, setPendingVi] = useState(null);

  const current = pages[selectedPage] ?? pages[PAGE_NAMES[0]];

  const checkboxColumns = useMemo(
    () => current?.columns.map((column, index) => ({ column, index, isCheckbox: !NON_CHECKBOX_COLUMNS.has(column) })) ?? [],
    [current]
  );

  function getRowOuiCheckboxKeys(row, rowIndex) {
    const rk = getRowKey(row, rowIndex);
    return current.columns
      .map((column, columnIndex) => ({ column, columnIndex }))
      .filter(({ column, columnIndex }) =>
        column !== "NUMERO VI" && column !== "DATE+RG. PREV." && column !== "VI RECYCLE" &&
        String(row[columnIndex] ?? "").trim().toUpperCase() === "OUI"
      )
      .map(({ column }) => `${rk}-${column}`);
  }

  function isRowFullyChecked(row, rowIndex) {
    const keys = getRowOuiCheckboxKeys(row, rowIndex);
    return keys.length > 0 && keys.every((k) => Boolean(checkedOuiCells[k]));
  }

  function handleViClick(rowKey, vehicleNumber, currentlyChecked) {
    if (currentlyChecked) {
      setCheckedViRows((prev) => ({ ...prev, [rowKey]: false }));
    } else {
      setPendingVi({ rowKey, vehicleNumber });
    }
  }

  function getRowBackground(row, rowIndex, rowKey) {
    if (checkedViRows[rowKey] || isRowFullyChecked(row, rowIndex)) return "#d1d5db";
    return getDefaultRowColor(row, current.columns);
  }

  return (
    <div style={styles.appShell}>
      {pendingVi && (
        <ConfirmModal
          vehicleNumber={pendingVi.vehicleNumber}
          onConfirm={() => {
            setCheckedViRows((prev) => ({ ...prev, [pendingVi.rowKey]: true }));
            setPendingVi(null);
          }}
          onCancel={() => setPendingVi(null)}
        />
      )}

      <div style={styles.container}>
        <div style={styles.topPanel}>
          <div>
            <h1 style={styles.pageTitle}>PaperLess</h1>
            <p style={styles.pageSubtitle}>
              Production Assembly Process with Enhanced Real-time Line Execution & Sequencing System
            </p>
          </div>
          <div style={styles.selectBlock}>
            <label htmlFor="page-select" style={styles.selectLabel}>Choisir une page</label>
            <select
              id="page-select"
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              style={styles.pageSelect}
            >
              {PAGE_NAMES.map((page) => (
                <option key={page} value={page}>{pages[page].title}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.tablePanel}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>{current.title}</h2>
            <p style={styles.tableSubtitle}>{current.rows.length} lignes</p>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>{current.columns.map((c) => <th key={c} style={styles.th}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {current.rows.map((row, rowIndex) => {
                  const rowKey = getRowKey(row, rowIndex);
                  const autoChecked = isRowFullyChecked(row, rowIndex);
                  const isBig = rowIndex < BIG_ROWS;
                  return (
                    <tr key={rowKey} style={{ background: getRowBackground(row, rowIndex, rowKey) }}>
                      {checkboxColumns.map(({ column, index, isCheckbox }) => {
                        const cellValue = row[index];
                        const valU = String(cellValue ?? "").trim().toUpperCase();
                        return (
                          <td key={`${rowKey}-${column}`} style={isBig ? styles.tdBig : styles.td}>
                            {isCheckbox ? (
                              column === "NUMERO VI" || valU === "OUI" ? (
                                <label style={styles.checkboxLabel}>
                                  <span>{column === "NUMERO VI" ? cellValue : "OUI"}</span>
                                  <input
                                    type="checkbox"
                                    checked={column === "NUMERO VI"
                                      ? Boolean(checkedViRows[rowKey]) || autoChecked
                                      : Boolean(checkedOuiCells[`${rowKey}-${column}`])}
                                    onChange={() => {
                                      if (column === "NUMERO VI") {
                                        handleViClick(rowKey, row[0], Boolean(checkedViRows[rowKey]) || autoChecked);
                                      } else {
                                        const k = `${rowKey}-${column}`;
                                        setCheckedOuiCells((prev) => ({ ...prev, [k]: !prev[k] }));
                                      }
                                    }}
                                    style={styles.checkbox}
                                  />
                                </label>
                              ) : <span style={{ color: "#94a3b8" }}>—</span>
                            ) : (
                              cellValue ? cellValue : <span style={{ color: "#94a3b8" }}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  appShell: { minHeight: "100vh", background: "#f1f5f9", padding: "24px", fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif', color: "#0f172a" },
  container: { maxWidth: "1280px", margin: "0 auto" },
  topPanel: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "24px", boxShadow: "0 1px 2px rgba(15,23,42,0.06)", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", marginBottom: "24px", flexWrap: "wrap" },
  pageTitle: { margin: 0, fontSize: "32px", lineHeight: 1.1, fontWeight: 700, fontFamily: "'Bitcount Grid Double', monospace" },
  pageSubtitle: { margin: "8px 0 0", color: "#475569", fontSize: "14px" },
  selectBlock: { width: "100%", maxWidth: "320px" },
  selectLabel: { display: "block", marginBottom: "8px", fontSize: "16px", fontWeight: 600, color: "#334155" },
  pageSelect: { width: "100%", borderRadius: "16px", border: "1px solid #cbd5e1", background: "#ffffff", padding: "14px 16px", fontSize: "18px", fontWeight: 600, color: "#0f172a", outline: "none", cursor: "pointer" },
  tablePanel: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "24px", boxShadow: "0 1px 2px rgba(15,23,42,0.06)", overflow: "hidden" },
  tableHeader: { padding: "20px 24px", borderBottom: "1px solid #e2e8f0" },
  tableTitle: { margin: 0, fontSize: "20px", fontWeight: 600 },
  tableSubtitle: { margin: "8px 0 0", color: "#475569", fontSize: "14px" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "max-content", minWidth: "100%", borderCollapse: "collapse" },
  th: { border: "1px solid #cbd5e1", padding: "12px", textAlign: "left", whiteSpace: "nowrap", background: "#e2e8f0", color: "#1e293b", fontWeight: 700, fontSize: "14px" },
  td: { border: "1px solid #cbd5e1", padding: "10px 12px", textAlign: "left", whiteSpace: "nowrap", color: "#0f172a", fontSize: "14px" },
  tdBig: { border: "1px solid #cbd5e1", padding: "14px 16px", textAlign: "left", whiteSpace: "nowrap", color: "#0f172a", fontSize: "18px", fontWeight: 600 },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },
  checkbox: { width: "16px", height: "16px", cursor: "pointer" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal: { background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "28px 32px", maxWidth: "420px", width: "90%" },
  modalTitle: { margin: "0 0 12px", fontSize: "18px", fontWeight: 600 },
  modalBody: { margin: "0 0 24px", fontSize: "15px", color: "#475569", lineHeight: 1.6 },
  modalButtons: { display: "flex", gap: "10px", justifyContent: "flex-end" },
  btnCancel: { padding: "9px 20px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#ffffff", fontSize: "14px", fontWeight: 500, cursor: "pointer", color: "#334155" },
  btnConfirm: { padding: "9px 20px", borderRadius: "12px", border: "1px solid #bfdbfe", background: "#eff6ff", fontSize: "14px", fontWeight: 600, cursor: "pointer", color: "#1d4ed8" },
};