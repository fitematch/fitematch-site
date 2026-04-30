import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationBox({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex gap-2" aria-label="Paginação">
        <button
          className="px-3 py-1 rounded border border-gray-700 bg-black text-gray-300 disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="px-3 py-1 text-gray-400 select-none">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded border border-gray-700 bg-black text-gray-300 disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </nav>
    </div>
  );
}
