import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/types/typesLinks";

interface LinkDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: Link;
  contexto?: "dashboard" | "discovery";
}

export function LinkDetailsModal({
  isOpen,
  onClose,
  links: dataLinks,
  contexto = "dashboard",
}: LinkDetailsModalProps) {
  if (!dataLinks) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {dataLinks.title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              URL
            </h3>
            <div className="flex items-center gap-2 break-all">
              <a
                href={dataLinks.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                {dataLinks.url}
                <ExternalLink className="h-3.5 w-3.5 ml-1.5 flex-shrink-0" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Descrição
            </h3>
            <p className="text-sm">
              {dataLinks.description || "Sem descrição"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-6">
            <div className="mb-2 sm:mb-0">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Categoria
              </h3>
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-0"
              >
                {dataLinks.category?.name || "Sem categoria"}
              </Badge>
            </div>

            {contexto === "dashboard" && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Pasta
                  </h3>
                  <span className="text-sm">{dataLinks.folder?.name}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
