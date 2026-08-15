import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { storage, UPLOADS_PATH } from './server/storage';
import { ensureSamplePdfExists, generateValidNotePdf } from './server/samplePdf';

// Ensure sample PDF is available
ensureSamplePdfExists(UPLOADS_PATH);

const app = express();
const PORT = 3000;

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer storage setup for uploads
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_PATH);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.html' || ext === '.htm') {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf and .html files are supported'));
    }
  }
});

// Admin server-side credentials
const ADMIN_ID = process.env.ADMIN_ID || 'polytechnichub.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '@Hub929678997353';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'polytechnic-hub-sec-auth-929678997353-tok';

function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized. Admin access required.' });
  }
  next();
}

// ----------------------------------------------------
// PUBLIC API ENDPOINTS (For Students)
// ----------------------------------------------------

// 1. Get published library tree
app.get('/api/public/tree', (req, res) => {
  try {
    const items = storage.getPublishedItems();
    res.json({ success: true, items });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get single public item details + increment views
app.get('/api/public/item/:id', (req, res) => {
  try {
    const item = storage.getItemById(req.params.id);
    if (!item || item.status !== 'published') {
      return res.status(404).json({ success: false, error: 'Study material not found or unpublished' });
    }
    storage.incrementViews(req.params.id);
    const breadcrumbs = storage.getBreadcrumbs(item.id);
    res.json({ success: true, item, breadcrumbs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Public library stats
app.get('/api/public/stats', (req, res) => {
  try {
    const stats = storage.getStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Download / stream file content
app.get('/api/files/:id', (req, res) => {
  try {
    const item = storage.getItemById(req.params.id);
    if (!item) {
      return res.status(404).send('File not found');
    }

    storage.incrementDownloads(item.id);

    // If file is stored on disk
    if (item.fileUrl && item.fileUrl.startsWith('/uploads/')) {
      const diskFilename = path.basename(item.fileUrl);
      const filePath = path.join(UPLOADS_PATH, diskFilename);
      if (fs.existsSync(filePath)) {
        if (item.type === 'pdf') {
          res.setHeader('Content-Type', 'application/pdf');
        } else {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
        }
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(item.name)}"`);
        return res.sendFile(filePath);
      }
    }

    // If content is embedded HTML
    if (item.type === 'html' && item.content) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(item.content);
    }

    // Dynamic generation for seeded PDF item if no disk file uploaded
    if (item.type === 'pdf') {
      const pdfBuffer = generateValidNotePdf(
        item.name,
        `Branch: ${item.branch || 'Polytechnic Engineering'} | Subject: ${item.subject || item.name} | Semester: ${item.semester || 'Academic Year'}`,
        [
          item.description || 'Verified syllabus-aligned study notes published on POLYTECHNIC HUB.',
          'Format: Certified Digital PDF Study Material',
          'Document ID: ' + item.id,
          'Branch/Discipline: ' + (item.branch || 'General Engineering'),
          'Subject: ' + (item.subject || item.name),
          'Unit/Module: ' + (item.unit || 'Standard Curriculum'),
          'Verified by: POLYTECHNIC HUB Editorial & Faculty Panel'
        ]
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(item.name)}"`);
      return res.send(pdfBuffer);
    }

    res.status(404).send('File content not available');
  } catch (err: any) {
    res.status(500).send('Error serving file: ' + err.message);
  }
});

// ----------------------------------------------------
// AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

app.post('/api/auth/login', (req, res) => {
  const { email, adminId, username, password } = req.body;
  const inputId = (adminId || email || username || '').trim().toLowerCase();

  if (!inputId || !password) {
    return res.status(400).json({ success: false, error: 'Admin ID and password are required' });
  }

  // Validate credentials securely server-side
  if (inputId === ADMIN_ID.toLowerCase() && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      user: {
        id: 'admin-primary',
        name: 'Polytechnic Hub Admin',
        adminId: ADMIN_ID,
        role: 'admin',
        token: ADMIN_TOKEN
      }
    });
  }

  return res.status(401).json({ success: false, error: 'Invalid admin credentials. Access denied.' });
});

app.get('/api/auth/verify', adminAuthMiddleware, (req, res) => {
  res.json({
    success: true,
    user: {
      id: 'admin-primary',
      name: 'Polytechnic Hub Admin',
      adminId: ADMIN_ID,
      role: 'admin'
    }
  });
});

// ----------------------------------------------------
// ADMIN PROTECTED API ENDPOINTS
// ----------------------------------------------------

// 1. Get all items (published, draft, unpublished)
app.get('/api/admin/tree', adminAuthMiddleware, (req, res) => {
  try {
    const items = storage.getAllAdminItems();
    const stats = storage.getStats();
    res.json({ success: true, items, stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Create new folder (supports unlimited nesting)
app.post('/api/admin/folders', adminAuthMiddleware, (req, res) => {
  try {
    const { name, parentId, status, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Folder name is required' });
    }

    const folder = storage.createFolder({
      name: name.trim(),
      parentId: parentId || null,
      status: status || 'published',
      description
    });

    res.json({ success: true, folder });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Upload file (PDF or HTML)
app.post('/api/admin/upload', adminAuthMiddleware, upload.single('file'), (req, res) => {
  try {
    const { parentId, status, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const type = ext === '.pdf' ? 'pdf' : 'html';
    const originalName = req.file.originalname;

    let content: string | undefined = undefined;
    if (type === 'html') {
      try {
        content = fs.readFileSync(req.file.path, 'utf-8');
      } catch (e) {
        console.error('Could not read HTML content:', e);
      }
    }

    const fileItem = storage.createFile({
      name: originalName,
      type,
      parentId: parentId || null,
      status: status === 'draft' ? 'draft' : 'published',
      size: req.file.size,
      fileUrl: `/uploads/${req.file.filename}`,
      content,
      description
    });

    res.json({ success: true, file: fileItem });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Create HTML Note directly from text/markdown/HTML editor
app.post('/api/admin/create-html-note', adminAuthMiddleware, (req, res) => {
  try {
    const { name, parentId, status, content, description } = req.body;
    if (!name || !content) {
      return res.status(400).json({ success: false, error: 'Name and content are required' });
    }

    const formattedName = name.toLowerCase().endsWith('.html') ? name : `${name}.html`;
    const size = Buffer.byteLength(content, 'utf-8');

    const fileItem = storage.createFile({
      name: formattedName,
      type: 'html',
      parentId: parentId || null,
      status: status || 'published',
      size,
      content,
      description
    });

    res.json({ success: true, file: fileItem });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Update item (rename, publish/unpublish/draft, move to folder)
app.put('/api/admin/items/:id', adminAuthMiddleware, (req, res) => {
  try {
    const { name, status, parentId, description } = req.body;
    const updates: any = {};

    if (name !== undefined) updates.name = name.trim();
    if (status !== undefined) updates.status = status;
    if (parentId !== undefined) updates.parentId = parentId === '' ? null : parentId;
    if (description !== undefined) updates.description = description;

    const updated = storage.updateItem(req.params.id, updates);
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. Delete item (file or folder with all descendants)
app.delete('/api/admin/items/:id', adminAuthMiddleware, (req, res) => {
  try {
    const result = storage.deleteItem(req.params.id);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 7. Reset to demo curriculum
app.post('/api/admin/reset-demo', adminAuthMiddleware, (req, res) => {
  try {
    const items = storage.resetToDefault();
    res.json({ success: true, message: 'Polytechnic curriculum reset to default seed', items });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve static uploads
app.use('/uploads', express.static(UPLOADS_PATH));

// ----------------------------------------------------
// VITE INTEGRATION & SERVER START
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`POLYTECHNIC APP server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
