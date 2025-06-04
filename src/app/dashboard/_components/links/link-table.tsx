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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, ExternalLink, Eye, Loader, Trash2 } from "lucide-react";
import { deleteLink } from "../../actions/linksActions";
import { LinkEdit } from "./linkEdit";
import { Link } from "@/types/typesLinks";
import { LinkDetailsModal } from "./LinkDetailsModal";
import { toast } from "sonner";
import { FaviconDisplay } from "./FaviconDisplay";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<Link | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const linksPerPage = 10;

  useEffect(() => {
    setLinks(dataLinks);
    setLoading(false);
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
      setIsDeleting(true);
      try {
        await deleteLink(linkToDelete);
        setLinks(links.filter((link) => link.id !== linkToDelete));
        toast.success("Link Excluído!", {
          description: "O link foi excluído com sucesso.",
        });
      } catch (error) {
        toast.error("Erro ao excluir", {
          description: "Não foi possível excluir o link. Tente novamente.",
        });
        console.error("Erro ao excluir link:", error);
      } finally {
        setIsDeleting(false);
      }
    }
    setLinkToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleEditClick = (link: Link) => {
    setLinkToEdit(link);
    setEditDialogOpen(true);
  };

  const handleLinkUpdated = (updatedLink: Link) => {
    setLinks(
      links.map((link) => (link.id === updatedLink.id ? updatedLink : link))
    );
  };

  const handleViewDetails = (link: Link) => {
    setSelectedLink(link);
    setDetailsDialogOpen(true);
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
              <TableHead className="hidden md:table-cell">Estado</TableHead>
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
                      <FaviconDisplay linkUrl={link.url} size={16} className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{link.url}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {link.category && (
                      <Badge
                        variant="outline"
                        className="bg-muted"
                        style={{
                          borderColor: link.category.color,
                          background: link.category.color,
                        }}
                      >
                        {link.category.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {link.folder && link.folder.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {link.isPublic ? "Público" : "Privado"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewDetails(link)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditClick(link)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

      {selectedLink && (
        <LinkDetailsModal
          isOpen={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          links={selectedLink}
        />
      )}

      {linkToEdit && (
        <LinkEdit
          link={linkToEdit}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onLinkUpdated={handleLinkUpdated}
        />
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
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
