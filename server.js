const express = require("express"); // Routes
const bodyParser = require("body-parser"); // Middleware
const pgp = require("pg-promise")(); // PG-Promise is how Postgres and Node communicate
const db = pgp("postgres://localhost:5432/todo_app"); // connecting to the "todo_app DB"
const app = express();
const PORT = 3000;

app.use(bodyParser.json());


// CREATE a task
app.post("/tasks", (req, res) => {
    const newTaskTitle = req.body.title;
    db.none("INSERT INTO TASKS (title) VALUES ($1)", [newTaskTitle])
    .then(() => {
        res.send(`Tasks "${newTaskTitle}" was created`);
    })
    .catch(() => {
        res.send({
            message: "Task could not be created"
        });
    });
});

// READ all tasks
app.get("/tasks", (_, res) => {
    db.any("SELECT * from TASKS")
    .then((tasks) => res.send(tasks))
    .catch(() => {
        res.send({
            message: "No tasks found or incorrect route"
        });
    });
});

// UPDATE a task
app.patch("/tasks/:id/title", (req, res) => {
    const taskId = req.params.id;
    const tasktitle = req.body.title;
    db.none("UDATE tasks SET title = $1 WHERE id = $2", [
        tasktitle, // is now $1
        taskId // is now $2
    ])
    .then (() => {
        res.send(`Task ${taskId} is updated to ${tasktitle}`)
    })
    .catch(() => {
        res.send({
            message: `Task ${taskId} could not be updated to ${tasktitle}`
        });
    })
});

// DELETE a task
app.delete("/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    db.none("DELETE FROM tasks WHERE id = $1", [taskId])
    .then(() => {
        res.send(`Task ${taskId} was deleted`);
    })
    .catch(() => {
        res.send({
            message: `Task ${taskId} could not be deleted`
        });
    });
});

// UPDATE if a task is completed
app.patch("/tasks/:id/is_completed", (req, res) => {
    const taskId = req.params.id;
    const taskIsCompleted = req.body.is_completed;
    db.none("UPDATE tasks SET is_completed = $1 WHERE id = $2", [
        taskIsCompleted,
        taskId
    ])
    .then(() => {
        const result = taskIsCompleted ? "completed" : "not completed";
        res.send(`Task ${taskId} is ${result} (${taskIsCompleted})`)
    });
});

// Turns our app "on" on port 3000
app.listen(PORT, () => {
    console.log(`Express application is running on port ${PORT}`);
});