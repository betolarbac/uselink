import { useState, useEffect } from 'react';
import { getFolders } from '@/app/dashboard/folders/actions/folderActions'; 
import type { Folder as FolderType } from '@/types/typesLinks'; 

interface UseFoldersReturn {
  folders: FolderType[];
  isLoadingFolders: boolean;
  foldersError: Error | null;
}

export function useFolders(enabled: boolean = true): UseFoldersReturn {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [foldersError, setFoldersError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    async function loadFoldersData() {
      setIsLoadingFolders(true);
      setFoldersError(null);
      try {
        const folderData = await getFolders();
        setFolders(folderData);
      } catch (err) {
        console.error("Erro ao carregar pastas no hook useFolders:", err);
        setFoldersError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar pastas'));
      } finally {
        setIsLoadingFolders(false);
      }
    }

    loadFoldersData();
  }, [enabled]);

  return { folders, isLoadingFolders, foldersError };
}