import fs from 'fs';
import path from 'path';
import { StudyItem, LibraryStats } from '../src/types';
import { INITIAL_ITEMS } from './initialData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'library.json');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

class LibraryStorage {
  private items: StudyItem[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.items = JSON.parse(raw);
      } else {
        this.items = [...INITIAL_ITEMS];
        this.save();
      }
    } catch (err) {
      console.error('Error loading library data, falling back to initial seed:', err);
      this.items = [...INITIAL_ITEMS];
    }
  }

  private save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.items, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving library data:', err);
    }
  }

  public resetToDefault() {
    this.items = [...INITIAL_ITEMS];
    this.save();
    return this.items;
  }

  public getAllAdminItems(): StudyItem[] {
    return this.items.map(item => this.enrichItem(item));
  }

  public getPublishedItems(): StudyItem[] {
    // Only return published items whose all parent ancestors are also published (or root)
    const publishedIds = new Set(
      this.items.filter(i => i.status === 'published').map(i => i.id)
    );

    const isAncestorPublished = (item: StudyItem): boolean => {
      if (item.status !== 'published') return false;
      let currParentId = item.parentId;
      while (currParentId) {
        const parent = this.items.find(p => p.id === currParentId);
        if (!parent || parent.status !== 'published') return false;
        currParentId = parent.parentId;
      }
      return true;
    };

    return this.items
      .filter(isAncestorPublished)
      .map(item => this.enrichItem(item, true));
  }

  private enrichItem(item: StudyItem, publishedOnly = false): StudyItem {
    if (item.type === 'folder') {
      const childCount = this.items.filter(i => {
        if (i.parentId !== item.id) return false;
        if (publishedOnly) return i.status === 'published';
        return true;
      }).length;
      return { ...item, itemCount: childCount };
    }
    return item;
  }

  public getItemById(id: string): StudyItem | undefined {
    const item = this.items.find(i => i.id === id);
    return item ? this.enrichItem(item) : undefined;
  }

  public incrementViews(id: string): void {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.viewsCount = (item.viewsCount || 0) + 1;
      this.save();
    }
  }

  public incrementDownloads(id: string): void {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.downloadsCount = (item.downloadsCount || 0) + 1;
      this.save();
    }
  }

  public getBreadcrumbs(itemId: string | null): Array<{ id: string | null; name: string }> {
    const crumbs: Array<{ id: string | null; name: string }> = [{ id: null, name: 'Library' }];
    if (!itemId) return crumbs;

    const pathItems: Array<{ id: string; name: string }> = [];
    let currId: string | null = itemId;

    while (currId) {
      const current = this.items.find(i => i.id === currId);
      if (!current) break;
      pathItems.unshift({ id: current.id, name: current.name });
      currId = current.parentId;
    }

    return [...crumbs, ...pathItems];
  }

  public createFolder(data: {
    name: string;
    parentId: string | null;
    status?: 'published' | 'draft';
    description?: string;
  }): StudyItem {
    // derive branch/semester if parent has it
    let branch: string | undefined;
    let semester: string | undefined;
    let subject: string | undefined;

    if (data.parentId) {
      const parent = this.items.find(p => p.id === data.parentId);
      if (parent) {
        branch = parent.branch;
        semester = parent.semester;
        subject = parent.subject;
      }
    }

    const newFolder: StudyItem = {
      id: 'f-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: data.name.trim(),
      type: 'folder',
      parentId: data.parentId || null,
      status: data.status || 'published',
      size: 0,
      branch,
      semester,
      subject,
      description: data.description,
      downloadsCount: 0,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.items.push(newFolder);
    this.save();
    return this.enrichItem(newFolder);
  }

  public createFile(data: {
    name: string;
    type: 'pdf' | 'html';
    parentId: string | null;
    status?: 'published' | 'draft';
    size: number;
    fileUrl?: string;
    content?: string;
    description?: string;
  }): StudyItem {
    let branch: string | undefined;
    let semester: string | undefined;
    let subject: string | undefined;
    let unit: string | undefined;

    if (data.parentId) {
      const parent = this.items.find(p => p.id === data.parentId);
      if (parent) {
        branch = parent.branch;
        semester = parent.semester;
        subject = parent.subject;
        unit = parent.unit;
      }
    }

    const newFile: StudyItem = {
      id: 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: data.name.trim(),
      type: data.type,
      parentId: data.parentId || null,
      status: data.status || 'published',
      size: data.size || 0,
      fileUrl: data.fileUrl,
      content: data.content,
      branch,
      semester,
      subject,
      unit,
      description: data.description,
      downloadsCount: 0,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.items.push(newFile);
    this.save();
    return this.enrichItem(newFile);
  }

  public updateItem(id: string, updates: Partial<StudyItem>): StudyItem {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }

    const current = this.items[index];

    // Check if moving folder into itself or its descendants (cycle prevention)
    if (updates.parentId !== undefined && updates.parentId !== current.parentId) {
      if (updates.parentId === id) {
        throw new Error('Cannot move a folder into itself.');
      }
      if (current.type === 'folder' && updates.parentId !== null) {
        let checkId: string | null = updates.parentId;
        while (checkId) {
          if (checkId === id) {
            throw new Error('Cannot move a folder into one of its subfolders.');
          }
          const parent = this.items.find(i => i.id === checkId);
          checkId = parent ? parent.parentId : null;
        }
      }
    }

    const updated: StudyItem = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.items[index] = updated;
    this.save();
    return this.enrichItem(updated);
  }

  public deleteItem(id: string): { deletedIds: string[]; count: number } {
    const itemToDelete = this.items.find(i => i.id === id);
    if (!itemToDelete) {
      throw new Error(`Item with id ${id} not found`);
    }

    const idsToDelete = new Set<string>();

    const collectDescendants = (parentId: string) => {
      idsToDelete.add(parentId);
      const children = this.items.filter(i => i.parentId === parentId);
      for (const child of children) {
        collectDescendants(child.id);
      }
    };

    collectDescendants(id);

    // Filter out deleted items
    const beforeCount = this.items.length;
    this.items = this.items.filter(i => !idsToDelete.has(i.id));
    this.save();

    return {
      deletedIds: Array.from(idsToDelete),
      count: beforeCount - this.items.length
    };
  }

  public getStats(): LibraryStats {
    const folders = this.items.filter(i => i.type === 'folder');
    const files = this.items.filter(i => i.type !== 'folder');
    const pdfs = this.items.filter(i => i.type === 'pdf');
    const htmls = this.items.filter(i => i.type === 'html');
    const published = this.items.filter(i => i.status === 'published');
    const draft = this.items.filter(i => i.status === 'draft');
    const unpublished = this.items.filter(i => i.status === 'unpublished');
    const totalViews = this.items.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

    return {
      totalFolders: folders.length,
      totalFiles: files.length,
      totalPdfs: pdfs.length,
      totalHtmls: htmls.length,
      publishedCount: published.length,
      draftCount: draft.length,
      unpublishedCount: unpublished.length,
      totalViews
    };
  }
}

export const storage = new LibraryStorage();
export const UPLOADS_PATH = UPLOADS_DIR;
