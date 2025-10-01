import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./table.css";

export default function TableComp({ data, columns }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data: data,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    if (table) {
      table.setColumnFilters([]);

      table.setPageIndex(0);
    }
  }, [table]);

  useEffect(() => {
    if (table?.setPageIndex) table.setPageIndex(0);
  }, [globalFilter, table]);

  return (
    <>
      <div className="table-responsive">
        <table className="table orders-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {/* Row for headers */}
                <tr>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        width: header.column.columnDef.size,
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
                <tr>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.column.getCanFilter() ? (
                        header.column.id === "isActive" ? (
                          <select
                            value={header.column.getFilterValue() ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              header.column.setFilterValue(
                                val === "" ? undefined : val === "true"
                              );
                            }}
                          >
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        ) : (
                          header.column.id === "name" && (
                            <input
                              type="text"
                              value={header.column.getFilterValue() ?? ""}
                              onChange={(e) =>
                                header.column.setFilterValue(e.target.value)
                              }
                              placeholder="Filter..."
                              style={{ width: "80%" }}
                            />
                          )
                        )
                      ) : null}
                    </th>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="order-row">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          className="btn btn-pagination"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <i className="fas fa-angle-double-left"></i>
        </button>
        <button
          className="btn btn-pagination"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <i className="fas fa-angle-left"></i>
        </button>
        <span className="page-info">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          className="btn btn-pagination"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <i className="fas fa-angle-right"></i>
        </button>
        <button
          className="btn btn-pagination"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>
    </>
  );
}
