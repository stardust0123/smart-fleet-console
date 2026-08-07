"use client";

interface Props {

  currentPage: number;

  totalItems: number;

  pageSize: number;

  onPageChange: (page: number) => void;

}

export default function Pagination({

  currentPage,

  totalItems,

  pageSize,

  onPageChange,

}: Props) {

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const start =
    totalItems === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const end = Math.min(
    currentPage * pageSize,
    totalItems
  );

  return (

    <div className="flex items-center justify-between border-t bg-white px-6 py-4">

      {/* Left */}

      <p className="text-sm text-gray-800">

        Showing

        <span className="mx-1 font-medium text-gray-800">

          {start}-{end}

        </span>

        of

        <span className="mx-1 font-medium text-gray-800">

          {totalItems}

        </span>

        records

      </p>

      {/* Right */}

      <div className="flex items-center gap-3">

        <button

          onClick={() =>
            onPageChange(currentPage - 1)
          }

          disabled={currentPage === 1}

          className="rounded-lg border px-4 py-2 text-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"

        >

          Previous

        </button>

        <span className="text-sm font-medium text-gray-800">

          Page {currentPage} / {totalPages}

        </span>

        <button

          onClick={() =>
            onPageChange(currentPage + 1)
          }

          disabled={currentPage === totalPages}

          className="rounded-lg border px-4 py-2 text-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"

        >

          Next

        </button>

      </div>

    </div>

  );

}