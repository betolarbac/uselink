"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { deleteLink } from "../../actions/linksActions";

type Link = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  categoryId?: string | null;
  folderId?: string | null;
  folder?: { id: string; name: string; isSecret: boolean } | null;
  category?: { id: string; name: string } | null;
};

interface LinkTableProps {
  links: Link[];
}

export function LinkTable({ links: dataLinks }: LinkTableProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

  const linksPerPage = 10;

  useEffect(() => {
    async function fetchLinks() {
      try {
        setLoading(true);
        setLinks(dataLinks);
      } catch (error) {
        console.error("Erro ao buscar links:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, [dataLinks]);

  const visibleLinks = links.filter((link) => !link.folder?.isSecret);

  const filteredLinks = visibleLinks.filter(
    (link) =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);
  const startIndex = (currentPage - 1) * linksPerPage;
  const paginatedLinks = filteredLinks.slice(
    startIndex,
    startIndex + linksPerPage
  );

  const handleDeleteClick = (id: string) => {
    setLinkToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (linkToDelete) {
      try {
        await deleteLink(linkToDelete);
        setLinks(links.filter((link) => link.id !== linkToDelete));
      } catch (error) {
        console.error("Erro ao excluir link:", error);
      }
    }
    setLinkToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Buscar links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">URL</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead className="hidden md:table-cell">Pasta</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Carregando links...
                </TableCell>
              </TableRow>
            ) : paginatedLinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum link encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginatedLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">{link.title}</TableCell>
                  <TableCell className="hidden max-w-[200px] truncate md:table-cell">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      {link.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {link.category && (
                      <Badge variant="outline" className="bg-muted">
                        {link.category.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {link.folder && link.folder.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex cursor-pointer items-center"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Abrir Link
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="flex cursor-pointer items-center"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                          onSelect={() => handleDeleteClick(link.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <div className="text-sm">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este link? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
