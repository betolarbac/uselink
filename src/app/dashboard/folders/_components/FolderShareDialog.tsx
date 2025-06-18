"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader, Search, UserPlus, X } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { findUserByEmail, getSharedUsersForFolder, inviteUserToFolder, removeFolderAccess} from "../actions/folderActions";
import { Badge } from "@/components/ui/badge";

interface FolderShareDialogProps {
  folderId: string;
  folderName: string;
  ownerInfo: { name: string | null; email: string | null; } | null;
}

type FoundUser = { id: string; name: string | null; email: string | null; } | null;
type SharedUser = { id: string; user: { id: string; name: string | null; email: string | null; }; };

export function FolderShareDialog({ folderId, folderName, ownerInfo }: FolderShareDialogProps) {
  const [emailToSearch, setEmailToSearch] = useState("");
  const [foundUser, setFoundUser] = useState<FoundUser>(null);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSearching, startSearchTransition] = useTransition();
  const [isInviting, startInviteTransition] = useTransition();

  const fetchSharedUsers = async () => {
    try {
      const users = await getSharedUsersForFolder(folderId);
      setSharedUsers(users);
    } catch (error) {
      console.error("Erro ao buscar usuários compartilhados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedUsers();
  }, [folderId]); 

  const handleSearchUser = () => {
    if (!emailToSearch.trim()) return;
    startSearchTransition(async () => {
      setFoundUser(null);
      const user = await findUserByEmail(emailToSearch);
      if (!user) {
        console.log("Usuário não encontrado");
        // toast({ variant: "destructive", title: "Usuário não encontrado", description: "Nenhum usuário encontrado com este e-mail." });
      }
      setFoundUser(user);
    });
  };

  const handleInviteUser = () => {
    if (!foundUser) return;
    startInviteTransition(async () => {
      try {
        await inviteUserToFolder(folderId, foundUser.id);
        //toast({ title: "Sucesso!", description: `${foundUser.name} foi convidado para a pasta.` });
        setFoundUser(null); 
        setEmailToSearch(""); 
        await fetchSharedUsers(); 
      } catch (error) {
        console.log("Erro ao convidar usuário:", error);
        //toast({ variant: "destructive", title: "Erro ao convidar", description: error.message || "Não foi possível adicionar o usuário." });
      }
    });
  };

  const handleRemoveAccess = async (accessId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja remover o acesso de ${userName}?`)) return;
    try {
      await removeFolderAccess(accessId);
      //toast({ title: "Acesso removido", description: `O acesso de ${userName} foi removido.` });
      await fetchSharedUsers(); 
    } catch (error) {
      console.log("Erro ao remover acesso:", error);
      // toast({ variant: "destructive", title: "Erro ao remover acesso", description: error.message });
    }
  };


  return (
    <DialogContent className="sm:max-w-[480px]">
      <DialogHeader>
        <DialogTitle>Compartilhar {folderName}</DialogTitle>
        <DialogDescription>
          Convide usuários por email para visualizar o conteúdo desta pasta.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2 py-2">
        <p className="text-sm font-medium">Convidar usuários</p>
        <div className="flex gap-2">
          <Input
            placeholder="email@exemplo.com"
            value={emailToSearch}
            onChange={(e) => setEmailToSearch(e.target.value)}
            disabled={isSearching}
          />
          <Button type="button" onClick={handleSearchUser} disabled={isSearching || !emailToSearch}>
            {isSearching ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {foundUser && (
        <div className="p-2 border rounded-md flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{foundUser.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{foundUser.name}</p>
                <p className="text-xs text-muted-foreground">{foundUser.email}</p>
              </div>
            </div>
            <Button size="sm" onClick={handleInviteUser} disabled={isInviting}>
              {isInviting ? <Loader className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
              Convidar
            </Button>
        </div>
      )}

      <div className="space-y-4 pt-2">
        <p className="text-sm font-medium">Pessoas com acesso</p>
        {isLoading ? (
          <div className="flex justify-center"><Loader className="h-5 w-5 animate-spin" /></div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {ownerInfo && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${ownerInfo.email}`} />
                    <AvatarFallback>{ownerInfo.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{ownerInfo.name}</p>
                    <p className="text-xs text-muted-foreground">{ownerInfo.email}</p>
                  </div>
                </div>
                <Badge variant="outline">Dono</Badge>
              </div>
            )}

           
            {sharedUsers.map(shared => (
              <div key={shared.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${shared.user.email}`} />
                    <AvatarFallback>{shared.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{shared.user.name}</p>
                    <p className="text-xs text-muted-foreground">{shared.user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveAccess(shared.id, shared.user.name || 'usuário')} title="Remover acesso">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DialogContent>
  );
}