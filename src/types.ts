export type ItemType = 'folder' | 'pdf' | 'html';
export type ItemStatus = 'published' | 'draft' | 'unpublished';

export interface StudyItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  status: ItemStatus;
  size: number; // in bytes
  fileUrl?: string;
  content?: string; // HTML or note text
  description?: string;
  branch?: string;
  semester?: string;
  subject?: string;
  unit?: string;
  tags?: string[];
  downloadsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  itemCount?: number; // computed child count for folders
}

export interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  token?: string;
}

export interface LibraryStats {
  totalFolders: number;
  totalFiles: number;
  totalPdfs: number;
  totalHtmls: number;
  publishedCount: number;
  draftCount: number;
  unpublishedCount: number;
  totalViews: number;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc' | 'size-desc' | 'size-asc';
