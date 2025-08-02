"use client";
import { Edit, Trash, Users, UserPlus, FolderClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteFolder } from "../actions/folderActions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { FolderShareDialog } from "./FolderShareDialog";

interface FolderCardProps {
  id: string;
  name: string;
  subfoldersCount: number | string;
  isSecret?: boolean;
  linksCount: number | string;
  ownerId: string;
  ownerInfo: { name: string | null; email: string | null } | null;
  currentUserId?: string;
}

export default function FolderCard(dataFolder: FolderCardProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const isOwner = dataFolder.ownerId === dataFolder.currentUserId;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleDeleteFolder = () => {
    startTransition(async () => {
      try {
        await deleteFolder(dataFolder.id);
        router.refresh();
        toast.success("Pasta Excluída!", {
          description: `A pasta "${dataFolder.name}" foi excluída.`,
        });
      } catch (error) {
        console.error("Erro ao excluir pasta:", error);
        toast.error("Erro ao excluir", {
          description: "Não foi possível excluir a pasta.",
        });
      }
    });
  };

  return (
    <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
      <div className="group bg-card border border-border rounded-lg hover:shadow-md transition-all hover:border-primary/20 cursor-pointer w-fit">
        <div className="flex items-start justify-between max-w-60">
          <Link
            href={`/dashboard/folders/${dataFolder.id}`}
            className=" p-4"
          >
            <div className="flex gap-3 items-center flex-col">
                <div className="relative">
                    <FolderClosed className="w-28 h-28 stroke-1" />

                  {!isOwner && (
                    <div className="absolute bottom-3 -right-0 bg-primary text-primary-foreground rounded-full p-0.5">
                      <Users className="h-4 w-4" />
                    </div>
                  )}
                </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium line-clamp-1">{dataFolder.name}</h3>
                  {dataFolder.isSecret && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-folder-secret/10 text-folder-secret border bg-amber-500/10 text-amber-500">
                      Secreta
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {dataFolder.linksCount} links cadastrados
                </p>
              </div>
            </div>
          </Link>
          <div className="p-2 flex flex-col items-center">
            {isOwner && (
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Compartilhar pasta"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            )}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity p-4">
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
                  {isOwner && (
                    <>
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
                    </>
                  )}
                  {!isOwner && (
                    <DropdownMenuItem disabled>
                      Apenas visualização
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {isOwner && (
        <FolderShareDialog
          folderId={dataFolder.id}
          folderName={dataFolder.name}
          ownerInfo={dataFolder.ownerInfo}
        />
      )}
    </Dialog>
  );
}
