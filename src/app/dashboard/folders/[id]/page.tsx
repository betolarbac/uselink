import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder } from "lucide-react";
import { CreateLink } from "../../_components/createLink";
import { LinkTable } from "../../_components/links/link-table";
import { getLinksByFolderId } from "../../actions/linksActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFolderName } from "../actions/folderActions";
import { redirect } from "next/navigation";
import Link from "next/link";

type tParams = Promise<{ id: string }>;

export default async function FolderIdPage(props: { params: tParams }) {
  const { id } = await props.params;

  const [links, folder] = await Promise.all([
    getLinksByFolderId(id),
    getFolderName(id),
  ]);

  if (!folder) {
    redirect("/dashboard/folders");
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/folders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            <h2 className="text-2xl font-bold tracking-tight">
              {folder?.name}
            </h2>
          </div>
        </div>

        <div className="max-w-28">
          <CreateLink />
        </div>
      </div>

      {links && links.length > 0 ? (
        <LinkTable links={links} />
      ) : (
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
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum link encontrado.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
