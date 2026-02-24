const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./myusers.db', (err) =>{
    if(err){
        return console.log(err)
    }
    console.log("connection etablished successfully")
});

const userName = "CJ"
const email = "cj@cj.dev"
const passWord = "1234Qwerty"

//CREATING USERTABLE
db.run(`
    CREATE TABLE IF NOT EXISTS users(
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    userName TEXT NOT NULL,
    email TEXT NOT NULL,
    passWord TEXT NOT NULL);`,
    (error) => {
        //INSERTING VLUES TO USERS TABLE
           query = `INSERT INTO users(userName, email, passWord) VALUES(?, ?, ?);`
    values = [`${userName}, ${email}, ${passWord}`]
    db.run(query, values, (err) => {
        if(err){
            return console.log(err)
        }
        console.log("user added successfully")
    })

db.close((err) => {
    if(err){
        return console.log(err)
    }
    console.log("connection closed successfully")
});
    }
)



 