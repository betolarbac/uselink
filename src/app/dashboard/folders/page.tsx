import { Search } from "lucide-react";
import FolderCard from "./_components/folderCard";
import FolderCreate from "./_components/folderCreate";
import { getFolders } from "./actions/folderActions";

export default async function FoldersPage() {
  const folders = await getFolders();

  console.log(folders);
  return (
    <div className="flex-1">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Pastas</h1>
            <p className="text-muted-foreground">
              Organize seus links em pastas e subpastas
            </p>
          </div>
          <FolderCreate />
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar pasta..."
              className="w-full max-w-md bg-background/80 pl-9 py-2 rounded-md text-sm border border-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <FolderCard
              id={folder.id}
              key={folder.id}
              name={folder.name}
              subfoldersCount=""
              isSecret={folder.isSecret}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
