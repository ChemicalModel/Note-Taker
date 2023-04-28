// Dependencies
const express = require('express');
const path = require('path');
const fs = require("fs");

// Create an instance of Express server
const app = express();
const PORT = process.env.PORT || 3001;

// Set up data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Notes API routes
// GET request to retrieve all saved notes
app.get('/api/notes', function(req, res) {
  const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(notes);
});

// POST request to add a new note
app.post('/api/notes', function(req, res) {
  const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  const newNote = req.body;
  newNote.id = (notes.length).toString();
  notes.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  
  res.json(notes);
});

// DELETE request to remove a note by id
app.delete('/api/notes/:id', function(req, res) {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  const noteId = req.params.id;
  let newId = 0;
  notes = notes.filter(note => {
    if (note.id != noteId) {
      note.id = newId.toString();
      newId++;
      return true;
    }
    return false;
  });

  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.json(notes);
});

// HTML routes
// Route to home page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Route to notes page
app.get('/notes', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Start the server and listen for requests
app.listen(PORT, function() {
  console.log(`Server listening on PORT ${PORT}`);
});
