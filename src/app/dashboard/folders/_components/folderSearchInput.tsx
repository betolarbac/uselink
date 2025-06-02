"use client";

import { Input } from "@/components/ui/input"; //
import { Search } from "lucide-react"
import { useQueryState } from 'nuqs';

export default function FolderSearchInput({ initialSearchTerm }: { initialSearchTerm?: string }) {
  const [searchTerm, setSearchTerm] = useQueryState('q', {
    defaultValue: initialSearchTerm || '',
    throttleMs: 750,
    history: 'push', 
    shallow: false, 
  });

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Buscar pasta..."
        className="w-full max-w-md bg-background/80 pl-9 py-2 rounded-md text-sm border" // Removido border-border para usar o padrão
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}