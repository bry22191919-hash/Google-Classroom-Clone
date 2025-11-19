const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./tables");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/register", (req, res) => {
  const  {name, email, password, role} = req.body;
  const hashed = bcrypt.hashSync(password, 10);

  const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
  db.run(query, [name, email, hashed, role], function(err) {
    if(err) return res.status(400).json({error: "email already exists"});
    console.log("Registered successfully");
    res.json({
      message: "User successfully registered",
      user_id: this.lastID
    });
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (!user) return res.status(400).json({ error: "User not found" });

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: "Wrong password" });
    }

    res.json({ message: "Login success", user });
  });
});

function generateClassCode(lenght = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i<length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

//show studnt class 
app.get("/api/my-classes/:student_id", (req, res) => {
    const { student_id } = req.params;

    const query = `
        SELECT class.*
        FROM class
        INNER JOIN class_students ON class_students.class_id = class.id
        WHERE class_students.student_id = ?
    `;

    db.all(query, [student_id], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });

        return res.json(rows);
    });
});

//show teacher classes
app.get("/api/teacher-classes/:teacher_id", (req, res) => {
    const { teacher_id } = req.params;

    const query = `
        SELECT *
        FROM class
        WHERE teacher_id = ?
    `;

    db.all(query, [teacher_id], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });

        return res.json(rows);
    });
});


app.listen(3001, () => console.log("Running on http://localhost:3001"));
