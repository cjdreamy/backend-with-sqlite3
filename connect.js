import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./myusers.db', (err) => {
    if (err) {
        return console.error('DB Connection Error:', err.message);
    }
    console.log('Connected to SQLite3 database.');
    initDB();
});

function initDB() {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
      userID    INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT    NOT NULL,
      email     TEXT    NOT NULL,
      pass_word TEXT    NOT NULL
    )`,
        (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                console.log('Users table ready.');
            }
        }
    );
}

export default db;