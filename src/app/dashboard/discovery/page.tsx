import { ExternalLink } from "lucide-react";
import { LinkTable } from "../_components/links/link-table";
import { getPublicLinks } from "../actions/linksActions";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Componentes de paginação do Shadcn
import { parseAsInteger, createLoader } from 'nuqs/server';

const discoverySearchParamsParsers = {
  page: parseAsInteger.withDefault(1),
};
const loadDiscoveryParams = createLoader(discoverySearchParamsParsers);

const generatePageNumbers = (currentPage: number, totalPages: number, delta: number = 2) => {
  const left = currentPage - delta;
  const right = currentPage + delta + 1;
  const range = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined; // Definido como number | undefined

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
};

export default async function DiscoveryPage({
  searchParams,
}: {
  searchParams?: { page?: string; q?: string; };
}) {
  const { page: currentPageFromUrl } = await loadDiscoveryParams(searchParams ?? {});

  const {
    links: publicLinks,
    totalCount,
    totalPages,
    currentPage, // Este currentPage vem da action getPublicLinks, pode usar ele ou currentPageFromUrl
  } = await getPublicLinks({ page: currentPageFromUrl, limit: 9 }); // Usando 9 links por página como exemplo

  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Discovery</h2>
        <p className="text-muted-foreground">
          Explore links públicos compartilhados por outros usuários.
        </p>
      </div>

      {publicLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <ExternalLink className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Nenhum link público encontrado.</h3>
          <p className="text-muted-foreground">
            Parece que ainda não há links públicos para explorar ou você chegou ao fim.
          </p>
        </div>
      ) : (
        <LinkTable
          links={publicLinks}
          contexto="discovery"
          showInternalPagination={false} 
        />
      )}
      
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={currentPage > 1 ? `/dashboard/discovery?page=${currentPage - 1}` : undefined}
                aria-disabled={currentPage <= 1}
                tabIndex={currentPage <= 1 ? -1 : undefined}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {pageNumbers.map((pageNumber, index) => ( // Renomeado 'page' para 'pageNumber' para evitar conflito
              <PaginationItem key={index}>
                {pageNumber === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={`/dashboard/discovery?page=${pageNumber}`}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={currentPage < totalPages ? `/dashboard/discovery?page=${currentPage + 1}` : undefined}
                aria-disabled={currentPage >= totalPages}
                tabIndex={currentPage >= totalPages ? -1 : undefined}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      { totalCount > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Página {currentPage} de {totalPages}. (Total de {totalCount} links públicos)
          </p>
        )
      }
    </div>
  );
}
