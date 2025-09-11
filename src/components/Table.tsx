/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

import { useState } from "react";

export interface ResultI<T> {
  count: number;
  results: T[];
}

export interface TableProps<T = any> {
  columns: string[];
  data_hook: (page: number) => ResultI<{ data: T; row: string[] }>;
  onClick?: (data: T, idx: number) => void;
  paginator?: (props: PaginationProps) => React.ReactNode;
}

export const Table = <T,>({
  columns,
  data_hook,
  onClick,
  paginator,
}: TableProps<T>) => {
  const [page, setPage] = useState(1);
  const data = data_hook(page);

  const MyPaginator = paginator ?? Pagination;

  return (
    <div>
      <TableBasic
        columns={columns}
        rows={data?.results?.map((r) => r.row) ?? []}
        onClick={(_data, idx) => {
          onClick?.(data.results[idx].data, idx);
        }}
      />
      <MyPaginator
        total={data?.count ?? 0}
        page={page}
        setPage={setPage}
        pageSize={10}
        className="mt-2"
      />
    </div>
  );
};

export interface TableBasicProps {
  columns: string[];
  rows: string[][];
  onClick?: (row: string[], idx: number) => void;
}

export const TableBasic = ({ columns, rows, onClick }: TableBasicProps) => {
  return (
    <div className="table">
      <table className="table-auto">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onClick?.(row, idx)}
              className={onClick ? "clickable" : ""}
            >
              {row.map((cell, idx) => (
                <td key={idx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  total,
  page,
  setPage,
  pageSize = 10,
  className,
}: PaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={className}>
      <div className="flex gap-2 flex-row">
        {pages.map((p) => (
          <button
            key={p}
            className={`px-4 py-2 border border-gray-500 rounded-md  hover:bg-blue-600 cursor-pointer ${
              page === p ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setPage(p)}
          >
            <span>{p}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
