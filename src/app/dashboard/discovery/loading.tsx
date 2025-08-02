import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

export default function DiscoveryLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Discovery</h2>
          <p className="text-muted-foreground">
            Explore links públicos compartilhados por outros usuários
          </p>
        </div>
      </div>

      <div className="space-y-4 animate-pulse">
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">URL</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Categoria
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Usuário</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Gera 5 linhas de esqueleto para a tabela */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-24 rounded" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-40 rounded" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-20 rounded" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-20 rounded" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-24 rounded ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Paginação */}
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <Skeleton className="h-10 w-10 rounded" />
            </PaginationItem>
            {Array.from({ length: 3 }).map((_, index) => (
              <PaginationItem key={index}>
                <Skeleton className="h-10 w-10 rounded" />
              </PaginationItem>
            ))}
            <PaginationItem>
              <Skeleton className="h-10 w-10 rounded" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="text-center">
          <Skeleton className="h-5 w-64 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}