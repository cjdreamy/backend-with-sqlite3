const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./myusers.db', (err) =>{
    if(err){
        return console.log(err)
    }
    console.log("connection etablished successfully")
});

//CREATING USERTABLE
db.run(`
    CREATE TABLE IF NOT EXISTS users(
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    userName TEXT NOT NULL,
    email TEXT NOT NULL,
    passWord TEXT NOT NULL)`
)

db.close((err) => {
    if(err){
        return console.log(err)
    }
    console.log("connection closed successfully")
});