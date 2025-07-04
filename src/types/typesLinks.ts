export type UserInfo = {
  name: string;
}

export type Link = {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  categoryId?: string | null;
  folderId?: string | null;
  folder?: { id: string; name: string; isSecret: boolean } | null;
  category?: { id: string; name: string; color: string } | null;
  isPublic: boolean;
  user?: UserInfo | null;
  createdAt: Date;
};

export type Folder = {
  id: string;
  name: string;
  isSecret: boolean;
};

export type Category = {
  id: string;
  name: string;
  color: string; 
};

export type InvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED";