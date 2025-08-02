import FolderCard from "./_components/folderCard";
import FolderCreate from "./_components/folderCreate";
import { getFolders } from "./actions/folderActions";
import FolderSearchInput from "./_components/folderSearchInput";
import { loadSearchParams } from "./search-params";
import type { SearchParams } from 'nuqs/server'
import { getCurrentUser } from "@/lib/auth/auth";

type PageProps = {
  searchParams: Promise<SearchParams>
}
export default async function FoldersPage({ searchParams }: PageProps) {
  const { q: searchTerm } = await loadSearchParams(searchParams ?? {});

  const [folders, currentUser] = await Promise.all([
    getFolders(searchTerm),
    getCurrentUser()
  ])

  const currentUserId = currentUser?.id;
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
        <FolderSearchInput initialSearchTerm={searchTerm} />
        </div>

        {folders.length === 0 ? (
          searchTerm ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma pasta encontrada para `&quot;`{searchTerm}`&quot;`.</p>
          ) : (
            <p className="text-muted-foreground text-center py-8">Você ainda não criou nenhuma pasta.</p>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <FolderCard
                id={folder.id}
                key={folder.id}
                name={folder.name}
                ownerId={folder.userId}
                ownerInfo={folder.user}
                currentUserId={currentUserId}
                subfoldersCount={""} 
                isSecret={folder.isSecret}
                linksCount={folder.links.length}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
