"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CreateLink } from "../../_components/createLink";
import { LinkTable } from "../../_components/links/link-table";

import { useEffect, useState } from "react";
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

type LinkData = Awaited<ReturnType<typeof getLinksByFolderId>>;

export default function FolderIdPage() {
  const router = useRouter();
  const params = useParams();
  const [dataLink, setDataLink] = useState<LinkData | undefined>(undefined);
  const [folderName, setFolderName] = useState<string>("");

  useEffect(() => {
    async function getLinks() {
      const links = await getLinksByFolderId(params.id as string);
      setDataLink(links);
    }

    async function getFolderIdName() {
      const folderIdName = await getFolderName(params.id as string);

      setFolderName(folderIdName?.name ?? "");
    }

    getFolderIdName();
    getLinks();
  }, [params.id]);

  console.log(dataLink);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/folders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            <h2 className="text-2xl font-bold tracking-tight">{folderName}</h2>
          </div>
        </div>

        <div className="max-w-28">
          <CreateLink />
        </div>
      </div>

      {dataLink ? (
        <LinkTable links={dataLink} />
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
                  Carregando links...
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
