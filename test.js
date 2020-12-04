const pgp = require("pg-promise")();
const db = pgp("postgress://localhost:5432/todo_app");

db.any("SELECT * from TASKS").then((tasks) => console.log(tasks));
