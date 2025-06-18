"use client";

import { useState, useEffect } from "react";
import {
  acceptInvitation,
  declineInvitation,
  getPendingInvitations,
} from "../folders/actions/folderActions";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Check, Loader, X } from "lucide-react";

type PendingInvitation = {
  id: string;
  folder: {
    name: string;
    user: { name: string | null };
  };
};

export function InvitationDropdown() {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  const fetchInvitations = async () => {
    const pending = await getPendingInvitations();
    setInvitations(pending as PendingInvitation[]);
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (invitation: PendingInvitation) => {
    setIsProcessingId(invitation.id);
    try {
      await acceptInvitation(invitation.id);
    } catch (error) {
      console.error("Erro ao aceitar o convite:", error);
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleDecline = async (invitationId: string) => {
    setIsProcessingId(invitationId);
    try {
      await declineInvitation(invitationId);
      await fetchInvitations();
    } catch (error) {
      console.error("Erro ao recusar o convite:", error);
    } finally {
      setIsProcessingId(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {invitations.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {invitations.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Convites de Pastas</h4>
          {invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum convite pendente.
            </p>
          ) : (
            <div className="space-y-2">
              {invitations.map((inv) => (
                <div key={inv.id} className="p-2 border rounded-md">
                  <p className="text-sm">
                    <span className="font-semibold">
                      {inv.folder.user.name}
                    </span>{" "}
                    convidou você para a pasta{" "}
                    <span className="font-semibold">{inv.folder.name}</span>.
                  </p>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecline(inv.id)}
                      disabled={isProcessingId === inv.id}
                    >
                      {isProcessingId === inv.id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAccept(inv)}
                      disabled={isProcessingId === inv.id}
                    >
                      {isProcessingId === inv.id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
