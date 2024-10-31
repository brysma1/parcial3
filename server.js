const http = require("http");
const fs = require("fs").promises;
const db = require("./database");

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    // Serve HTML front-end
    const content = await fs.readFile("index.html");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
  } else if (req.method === "GET" && req.url === "/todos") {
    // Get all todos
    const todos = await db.getTodos();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todos));
  } else if (req.method === "POST" && req.url === "/todos") {
    // Add a new todo
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      const { title } = JSON.parse(body);
      const newTodo = await db.addTodo(title);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newTodo));
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/todos/")) {
    // Delete a todo by id
    const id = req.url.split("/")[2];
    await db.deleteTodo(id);
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});

