const sqlite3 = require ("sqlite3").verbose();

const db = new sqlite3.Database("./classroom.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXt,
        role TEXT
        )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS class(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        teacher_id INTEGER,
        class_code TEXT,
        FOREIGN KEY (teacher_id) REFERENCES users(id)
        )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS assignments(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        due_date TEXT,
        class_id INTEGER,
        FOREIGN KEY (class_id) REFERENCES class(id)
        )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS submission(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assignment_id INTEGER,
        student_id INTEGER,
        file_path TEXT,
        status TEXT,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (assignment_id) REFERENCES assignment(id)
        )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS post(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id INTEGER,
        user_id INTEGER,
        content TEXT,
        FOREIGN KEY (class_id) REFERENCES classes(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
});

module.exports = db; 