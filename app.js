const express = require("express");
const session = require('express-session');
const cors = require('cors'); 

const app = express();
const port = 3000;

app.use(cors());

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.sqlite");

// Middleware for parsing JSON requests
app.use(express.json());




// notes section  starts
app.post("/notes", (req, res) => {
  console.log("Received a POST request to /notes");

  // Implement logic to save the note to the database
  const { id , title, content } = req.body;

  // Validate that both title and content are present
  if (!title || !content) {
    return res
      .status(400)
      .json({ error: "Both title and content are required." });
  }

  // Insert the note into the 'notes' table with the provided id
  db.run(
    "INSERT INTO notes (id, title, content) VALUES (?, ?, ?)",
    [id, title, content],
    function (err) {
      if (err) {
        console.error("Error inserting note:", err);
        return res
          .status(500)
          .json({ error: "Error saving note to the database." });
      }

      console.log("Note inserted successfully");
      res.json({ id, title, content, message: "Note created successfully" });
    }
  );

});


 // Endpoint to get all notes (GET request)
 app.get("/notes" , (req, res) => {
  console.log("Received a GET request to /notes");
  // Select all columns from the 'notes' table
  db.all("SELECT * FROM notes", (err, rows) => {
    if (err) {
      console.error("Error fetching notes:", err);
      return res
        .status(500)
        .json({ error: "Error fetching notes from the database." });
    }

    res.json({ notes: rows });
  });
});


// Endpoint to update a note (PUT request)
app.put("/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const { title, content } = req.body;

  // Validate that both title and content are present
  if (!title || !content) {
    return res
      .status(400)
      .json({ error: "Both title and content are required." });
  }

  // Update the note in the 'notes' table
  db.run(
    "UPDATE notes SET title = ?, content = ? WHERE id = ?",
    [title, content, noteId],
    (err) => {
      if (err) {
        console.error("Error updating note:", err);
        return res
          .status(500)
          .json({ error: "Error updating note in the database." });
      }

      console.log("Note updated successfully");
      res.json({ id: noteId, title, content, message: "Note updated successfully" });
    }
  );
});

// Endpoint to delete a note (DELETE request)
app.delete("/notes/:id", (req, res) => {
  const noteId = req.params.id;

  // Delete the note from the 'notes' table
  db.run("DELETE FROM notes WHERE id = ?", [noteId], (err) => {
    if (err) {
      console.error("Error deleting note:", err);
      return res
        .status(500)
        .json({ error: "Error deleting note from the database." });
    }

    console.log("Note deleted successfully");
    res.json({ id: noteId, message: "Note deleted successfully" });
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
