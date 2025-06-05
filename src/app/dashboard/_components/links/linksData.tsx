"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link as LinkType } from "@/types/typesLinks";
import { LinkTable } from "./link-table";

interface LinksDataProps {
  initialLinks: LinkType[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

const generatePageNumbers = (currentPage: number, totalPages: number, delta: number = 2) => {
  const left = currentPage - delta;
  const right = currentPage + delta + 1;
  const range = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      range.push(i);
    }
  }
  for (const i of range) {
    if (l) {
      if (i - l === 2) { rangeWithDots.push(l + 1); }
      else if (i - l !== 1) { rangeWithDots.push('...'); }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
};

export default function LinksData({
  initialLinks,
  totalPages,
  currentPage,
  totalCount,
}: LinksDataProps) {
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <div className="space-y-4">
      <LinkTable
        links={initialLinks}
        contexto="dashboard"
        showInternalPagination={false} // Desabilita paginação interna da tabela
      />

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={currentPage > 1 ? `/dashboard?page=${currentPage - 1}` : undefined}
                aria-disabled={currentPage <= 1}
                tabIndex={currentPage <= 1 ? -1 : undefined}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {pageNumbers.map((pageNumber, index) => (
              <PaginationItem key={index}>
                {pageNumber === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={`/dashboard?page=${pageNumber}`}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={currentPage < totalPages ? `/dashboard?page=${currentPage + 1}` : undefined}
                aria-disabled={currentPage >= totalPages}
                tabIndex={currentPage >= totalPages ? -1 : undefined}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
       { totalCount > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-1">
            Página {currentPage} de {totalPages}. (Total de {totalCount} links)
          </p>
        )
      }
    </div>
  );
}
