import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-10 w-3xs rounded-md" />
        </div>
        <div className="max-w-28">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
      <div className="mb-6">
        <Skeleton className="h-10 w-md rounded-md" />
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
                  <TableHead className="hidden md:table-cell">Pasta</TableHead>
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
      </div>
    </div>
  );
}
