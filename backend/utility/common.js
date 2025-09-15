import XLSX from "xlsx";
import fs from "fs";

export const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  if (isNaN(date)) return null;

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
};

export const readSheetsToJson = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const result = {};

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (data.length === 0) {
        result[sheetName] = [];
        return;
      }

      const headers = data[0].map((h) =>
        h ? String(h).toLowerCase().trim() : ""
      );

      const rows = data.slice(1)
        .map((row) => {
          const obj = {};
          headers.forEach((header, i) => {
            if (header) obj[header] = row[i] ?? null;
          });
          return obj;
        })
        // ✅ remove rows where all values are null/empty/undefined
        .filter((obj) =>
          Object.values(obj).some(
            (val) => val !== null && val !== undefined && String(val).trim() !== ""
          )
        );

      result[sheetName] = rows;
    });

    return result;
  } catch (error) {
    console.error("Error reading Excel file:", error.message);
    throw error;
  }
};