const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./myusers.db', connected);

//checking connection
function connected(err) {
    if(err){
        return console.log(err)
    }
    console.log("connection etablished successfully")
}

const userName = "CJ"
const email = "cj@cj.dev"
const passWord = "1234Qwerty"

//CREATING USERTABLE
db.run(`
    CREATE TABLE IF NOT EXISTS users(
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    pass_word TEXT NOT NULL);`,
    (error) => {
        //INSERTING VLUES TO USERS TABLE
           query = `INSERT INTO users(user_name, email, pass_word) VALUES(?, ?, ?);`
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



 export default db;