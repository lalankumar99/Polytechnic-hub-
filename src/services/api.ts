import { StudyItem, LibraryStats, AdminUser } from '../types';

const API_BASE = '/api';

export const authState = {
  getToken(): string | null {
    return localStorage.getItem('polytechnic_admin_token');
  },
  setToken(token: string) {
    localStorage.setItem('polytechnic_admin_token', token);
  },
  clearToken() {
    localStorage.removeItem('polytechnic_admin_token');
  },
  getUser(): AdminUser | null {
    const raw = localStorage.getItem('polytechnic_admin_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser(user: AdminUser) {
    localStorage.setItem('polytechnic_admin_user', JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem('polytechnic_admin_user');
  }
};

function getAuthHeaders(): HeadersInit {
  const token = authState.getToken();
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Public APIs
  async getPublicTree(): Promise<StudyItem[]> {
    const res = await fetch(`${API_BASE}/public/tree`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch library tree');
    return data.items;
  },

  async getPublicItem(id: string): Promise<{ item: StudyItem; breadcrumbs: Array<{ id: string | null; name: string }> }> {
    const res = await fetch(`${API_BASE}/public/item/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Study material not found');
    return { item: data.item, breadcrumbs: data.breadcrumbs };
  },

  async getPublicStats(): Promise<LibraryStats> {
    const res = await fetch(`${API_BASE}/public/stats`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch library statistics');
    return data.stats;
  },

  // Auth APIs
  async login(adminIdOrEmail: string, password: string): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId: adminIdOrEmail, email: adminIdOrEmail, password })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Authentication failed');
    if (data.user?.token) {
      authState.setToken(data.user.token);
    }
    authState.setUser(data.user);
    return data.user;
  },

  async verifyAuth(): Promise<AdminUser | null> {
    const token = authState.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success && data.user) {
        return data.user;
      }
      authState.clearToken();
      authState.clearUser();
      return null;
    } catch {
      authState.clearToken();
      authState.clearUser();
      return null;
    }
  },

  logout() {
    authState.clearToken();
    authState.clearUser();
  },

  // Admin APIs
  async getAdminTree(): Promise<{ items: StudyItem[]; stats: LibraryStats }> {
    const res = await fetch(`${API_BASE}/admin/tree`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch admin file manager data');
    return { items: data.items, stats: data.stats };
  },

  async createFolder(name: string, parentId: string | null, status: 'published' | 'draft' = 'published', description?: string): Promise<StudyItem> {
    const res = await fetch(`${API_BASE}/admin/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ name, parentId, status, description })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create folder');
    return data.folder;
  },

  async uploadFile(file: File, parentId: string | null, status: 'published' | 'draft' = 'published', description?: string): Promise<StudyItem> {
    const formData = new FormData();
    formData.append('file', file);
    if (parentId) formData.append('parentId', parentId);
    formData.append('status', status);
    if (description) formData.append('description', description);

    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Upload failed');
    return data.file;
  },

  async createHtmlNote(name: string, content: string, parentId: string | null, status: 'published' | 'draft' = 'published', description?: string): Promise<StudyItem> {
    const res = await fetch(`${API_BASE}/admin/create-html-note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ name, content, parentId, status, description })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create HTML note');
    return data.file;
  },

  async updateItem(id: string, updates: Partial<StudyItem>): Promise<StudyItem> {
    const res = await fetch(`${API_BASE}/admin/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update item');
    return data.item;
  },

  async deleteItem(id: string): Promise<{ deletedIds: string[]; count: number }> {
    const res = await fetch(`${API_BASE}/admin/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to delete item');
    return { deletedIds: data.deletedIds, count: data.count };
  },

  async resetDemo(): Promise<StudyItem[]> {
    const res = await fetch(`${API_BASE}/admin/reset-demo`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to reset demo data');
    return data.items;
  }
};
