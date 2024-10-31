const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data/todos.db");

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT 0
    )
  `);
});

// Get all todos
function getTodos() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM todos", (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

// Add a new todo
function addTodo(title) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO todos (title) VALUES (?)", [title], function (err) {
      if (err) reject(err);
      resolve({ id: this.lastID, title, completed: 0 });
    });
  });
}

// Delete a todo by ID
function deleteTodo(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM todos WHERE id = ?", [id], err => {
      if (err) reject(err);
      resolve();
    });
  });
}

module.exports = { getTodos, addTodo, deleteTodo };

