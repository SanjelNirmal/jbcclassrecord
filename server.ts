import express from 'express';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
app.use('/uploads', express.static(uploadsDir));

// Initialize Database
const db = new Database('database.sqlite');
db.pragma('journal_mode = WAL');

// Migrations
db.exec(`
  CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    width REAL NOT NULL,
    height REAL NOT NULL,
    image_url TEXT,
    coordinate_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT,
    program_year TEXT,
    month TEXT,
    template_id INTEGER,
    user_id TEXT, -- Added for future Supabase user correlation
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS record_rows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER,
    date TEXT,
    period TEXT,
    subject TEXT,
    topic TEXT,
    start_time TEXT,
    end_time TEXT,
    pedagogy TEXT,
    FOREIGN KEY(record_id) REFERENCES records(id) ON DELETE CASCADE
  );
`);

try { db.exec("ALTER TABLE records ADD COLUMN program TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE records ADD COLUMN academic_level TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE records ADD COLUMN academic_year TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE records ADD COLUMN user_id TEXT"); } catch (e) {} // Supabase user mapping

// Seed a default template if none exist
const defaultFields = {"fields":[{"id":"level","key":"level","label":"Level","x":100,"y":100,"fontSize":14,"fontFamily":"Arial","align":"left","width":150},{"id":"program_year","key":"program_year","label":"Program Year","x":400,"y":100,"fontSize":14,"fontFamily":"Arial","align":"left","width":150},{"id":"month","key":"month","label":"Month","x":800,"y":100,"fontSize":14,"fontFamily":"Arial","align":"left","width":150},{"id":"date","key":"date","label":"Date","x":80,"y":200,"fontSize":12,"fontFamily":"Arial","align":"center","width":60,"isRepeating":true,"rowSpacing":40},{"id":"period","key":"period","label":"Period","x":150,"y":200,"fontSize":12,"fontFamily":"Arial","align":"center","width":60,"isRepeating":true,"rowSpacing":40},{"id":"subject","key":"subject","label":"Subject","x":220,"y":200,"fontSize":12,"fontFamily":"Arial","align":"left","width":250,"isRepeating":true,"rowSpacing":40},{"id":"topic","key":"topic","label":"Topic","x":500,"y":200,"fontSize":12,"fontFamily":"Arial","align":"left","width":250,"isRepeating":true,"rowSpacing":40},{"id":"start_time","key":"start_time","label":"Start Time","x":780,"y":200,"fontSize":12,"fontFamily":"Arial","align":"center","width":80,"isRepeating":true,"rowSpacing":40},{"id":"end_time","key":"end_time","label":"End Time","x":880,"y":200,"fontSize":12,"fontFamily":"Arial","align":"center","width":80,"isRepeating":true,"rowSpacing":40},{"id":"pedagogy","key":"pedagogy","label":"Pedagogy","x":980,"y":200,"fontSize":12,"fontFamily":"Arial","align":"center","width":100,"isRepeating":true,"rowSpacing":40}]};
db.prepare(`
  INSERT INTO templates (name, width, height, image_url, coordinate_json)
  SELECT 'Default A4 Landscape', 1123, 794, '', ?
  WHERE NOT EXISTS (SELECT 1 FROM templates)
`).run(JSON.stringify(defaultFields));

// API Routes
app.get('/api/templates', (req, res) => {
  const templates = db.prepare('SELECT * FROM templates').all();
  res.json(templates);
});

app.post('/api/templates', upload.single('image'), (req, res) => {
  const { name, width, height, coordinate_json } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  
  const stmt = db.prepare('INSERT INTO templates (name, width, height, image_url, coordinate_json) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(name, width, height, image_url, coordinate_json);
  
  res.json({ id: info.lastInsertRowid });
});

app.get('/api/templates/:id', (req, res) => {
  const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(req.params.id);
  res.json(template);
});

app.put('/api/templates/:id', (req, res) => {
  const { name, width, height, coordinate_json } = req.body;
  const stmt = db.prepare('UPDATE templates SET name = ?, width = ?, height = ?, coordinate_json = ? WHERE id = ?');
  stmt.run(name, width, height, coordinate_json, req.params.id);
  res.json({ success: true });
});

app.post('/api/templates/:id/image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image provided' });
  const image_url = `/uploads/${req.file.filename}`;
  const stmt = db.prepare('UPDATE templates SET image_url = ? WHERE id = ?');
  stmt.run(image_url, req.params.id);
  res.json({ image_url });
});

app.get('/api/records', (req, res) => {
  const records = db.prepare('SELECT * FROM records ORDER BY created_at DESC').all();
  res.json(records);
});

app.get('/api/records/:id', (req, res) => {
  const record = db.prepare('SELECT * FROM records WHERE id = ?').get(req.params.id) as object;
  if (!record) return res.status(404).json({ error: 'Not found' });
  const rows = db.prepare('SELECT * FROM record_rows WHERE record_id = ?').all(req.params.id);
  res.json({ ...record, rows });
});

app.post('/api/records', (req, res) => {
  const { level, program_year, month, template_id, program, academic_level, academic_year, rows } = req.body;
  
  const insertRecord = db.transaction(() => {
    const stmt = db.prepare('INSERT INTO records (level, program_year, month, template_id, program, academic_level, academic_year) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(level, program_year, month, template_id, program, academic_level, academic_year);
    const recordId = info.lastInsertRowid;
    
    if (rows && rows.length > 0) {
      const insertRow = db.prepare('INSERT INTO record_rows (record_id, date, period, subject, topic, start_time, end_time, pedagogy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      for (const row of rows) {
        insertRow.run(recordId, row.date, row.period, row.subject, row.topic, row.start_time, row.end_time, row.pedagogy);
      }
    }
    return recordId;
  });
  
  try {
    const id = insertRecord();
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Transaction failed' });
  }
});

app.put('/api/records/:id', (req, res) => {
  const { level, program_year, month, template_id, program, academic_level, academic_year, rows } = req.body;
  
  const updateRecord = db.transaction(() => {
    const stmt = db.prepare('UPDATE records SET level=?, program_year=?, month=?, template_id=?, program=?, academic_level=?, academic_year=? WHERE id=?');
    stmt.run(level, program_year, month, template_id, program, academic_level, academic_year, req.params.id);
    
    // Simple approach: delete existing rows and re-insert
    db.prepare('DELETE FROM record_rows WHERE record_id=?').run(req.params.id);
    
    if (rows && rows.length > 0) {
      const insertRow = db.prepare('INSERT INTO record_rows (record_id, date, period, subject, topic, start_time, end_time, pedagogy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      for (const row of rows) {
        insertRow.run(req.params.id, row.date, row.period, row.subject, row.topic, row.start_time, row.end_time, row.pedagogy);
      }
    }
    return true;
  });
  
  try {
    updateRecord();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Transaction failed' });
  }
});

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
