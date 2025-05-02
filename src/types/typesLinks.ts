export type Link = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  categoryId?: string | null;
  folderId?: string | null;
  folder?: { id: string; name: string; isSecret: boolean } | null;
  category?: { id: string; name: string } | null;
};

export type Folder = {
  id: string;
  name: string;
  isSecret: boolean;
};

