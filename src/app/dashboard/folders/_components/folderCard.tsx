"use client";
import { Edit, Trash, FolderLock, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteFolder } from "../actions/folderActions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FolderCardProps {
  id: string;
  name: string;
  subfoldersCount: number | string;
  isSecret?: boolean;
}

export default function FolderCard(dataFolder: FolderCardProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleDeleteFolder = () => {
    startTransition(async () => {
      await deleteFolder(dataFolder.id);
      router.refresh();
    });
  };

  return (
    <Link href={`/dashboard/folders/${dataFolder.id}`}>
    <div className="group bg-card border border-border p-4 rounded-lg hover:shadow-md transition-all hover:border-primary/20 cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex gap-3 items-center">
          <div className={`p-2.5 rounded-md`}>
            <div className="relative">
              {dataFolder.isSecret ? (
                <>
                  <FolderLock className="h-5 w-5 text-amber-500" />
                </>
              ) : (
                <Folder className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{dataFolder.name}</h3>
              {dataFolder.isSecret && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-folder-secret/10 text-folder-secret border bg-amber-500/10 text-amber-500">
                  Secreta
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {typeof dataFolder.subfoldersCount === "number"
                ? `${dataFolder.subfoldersCount} ${
                    dataFolder.subfoldersCount === 1 ? "subpasta" : "subpastas"
                  }`
                : dataFolder.subfoldersCount}
            </p>
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Edit className="h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                onClick={handleDeleteFolder}
                disabled={isPending}
              >
                <Trash className="h-4 w-4" />{" "}
                {isPending ? "Excluindo..." : "Excluir"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
    </Link>
  );
}
