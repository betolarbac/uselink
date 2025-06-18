import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./mode-toggle";
import UserPerfil from "./userPerfil";
import { InvitationDropdown } from "./InvitationDropdown";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Não funcional"
                className="w-full pl-8 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <InvitationDropdown />
            <ModeToggle />
            <UserPerfil />
          </div>
        </div>
      </div>
    </header>
  );
}
