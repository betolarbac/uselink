import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 ">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pastas</h1>
          <p className="text-muted-foreground">
            Organize seus links em pastas e subpastas
          </p>
        </div>
        <div className="max-w-28">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Título da seção de Links e Tabela */}
      <div className="space-y-4 animate-pulse">
        <div className="mb-6">
          <Skeleton className="h-10 w-md rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          <Skeleton className="flex items-start justify-between w-60 h-52" />
          <Skeleton className="flex items-start justify-between w-60 h-52" />
          <Skeleton className="flex items-start justify-between w-60 h-52" />
        </div>
      </div>
    </div>
  );
}
