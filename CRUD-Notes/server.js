const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001;

// In-memory notes store
let notes = [];
let nextId = 1;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// GET all notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// POST a new note
app.post("/api/notes", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  const note = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  notes.push(note);
  res.status(201).json(note);
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`CRUD Notes server running at http://localhost:${PORT}`);
});
