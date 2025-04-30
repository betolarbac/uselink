'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/lib/auth/auth";
import { useRouter } from "next/navigation";

export default function UserPerfil() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{"U"}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link
          href="/dashboard/settings"
          className="flex w-full cursor-pointer items-center"
        >
          <User className="mr-2 h-4 w-4" />
          Perfil
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link
          href="/dashboard/settings"
          className="flex w-full cursor-pointer items-center"
        >
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={handleLogout}
        className="cursor-pointer"
      >
        Sair
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  );
}