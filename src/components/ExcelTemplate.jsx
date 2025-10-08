import { IoCloudDownloadOutline } from "react-icons/io5";
import * as XLSX from "xlsx";
import "./DownloadButton.css";
import { useState } from "react";

export const DownloadButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDownload = () => {
    const data = [
      ["Name", "Price", "Category", "PrepTime", "Type"],
      ["Paneer Butter Masala", 250, "mains", 30, "veg"],
      ["Ice Cream", 150, "Snacks", 5, "veg"],
      ["Chicken Biryani", 320, "Mains", 40, "non-veg"],
      ["Masala Dosa", 180, "Breakfast", 20, "veg"],
      ["French Fries", 100, "Snacks", 10, "veg"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "BulkUploadTemplate.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setIsLoading(false);
  };

  return (
      <a onClick={handleDownload} className="l1">
        Download template file
      </a>
  );
};
