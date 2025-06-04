"use client";

import { cn } from "@/lib/utils";
import {
  Folder,
  FolderLock,
  Home,
  Link2 as Link2Icon,
  Plus,
  Settings,
  Tag,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreateLink } from "./createLink";
import { useEffect, useState } from "react";
import { getFolders } from "../folders/actions/folderActions";

interface Folder {
  id: string;
  name: string;
  isSecret: boolean;
  links: {
    id: string;
    title: string;
  }[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [userFolders, setUserFolders] = useState<Folder[]>([]);

  useEffect(() => {
    async function loadFolders() {
      const folders = await getFolders();
      setUserFolders(folders.slice(0, 5));
    }
    
    loadFolders();
  }, []);

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Discovery", 
      icon: Compass, 
      href: "/dashboard/discovery",
      active: pathname === "/dashboard/discovery",
    },
    {
      label: "Pastas",
      icon: Folder,
      href: "/dashboard/folders",
      active: pathname === "/dashboard/folders",
    },
    {
      label: "Categorias",
      icon: Tag,
      href: "/dashboard/categories",
      active: pathname === "/dashboard/categories",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ];

  return (
    <div className="flex h-screen w-[80px] flex-col border-r md:w-[240px]">
      <div className="flex h-14 items-center border-b px-3 py-7">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold md:ml-2"
        >
          <Link2Icon className="h-5 w-5 text-primary" />
          <span className="hidden md:inline-flex">UseLink</span>
        </Link>
      </div>
      <div className="flex-1 pt-3">
        <div className="px-3 py-2">
          <div className="mb-4 px-4 text-xs font-semibold uppercase tracking-tight text-muted-foreground md:block">
            <span className="hidden md:inline-flex">Menu</span>
          </div>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  route.active
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                <route.icon className="h-5 w-5" />
                <span className="hidden md:inline-flex">{route.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 px-4 text-xs font-semibold uppercase tracking-tight text-muted-foreground">
            <span className="hidden md:inline-flex">Pastas</span>
          </div>
          <div className="mt-3 space-y-1">
            {userFolders.length > 0 ? (
              userFolders.map((folder) => (
                <Link
                  key={folder.id}
                  href={`/dashboard/folders/${folder.id}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  {folder.isSecret ? (
                    <FolderLock className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Folder className="h-5 w-5" />
                  )}
                  <span className="hidden truncate md:inline-flex">
                    {folder.name}
                  </span>
                </Link>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                <span className="hidden md:inline-flex">Nenhuma pasta encontrada</span>
              </div>
            )}

            <Link
              href="/dashboard/folders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline-flex">Ver todas</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-auto border-t p-3">
        <CreateLink />
      </div>
    </div>
  );
}
