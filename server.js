const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./myusers.db', (err) =>{
    if(err){
        return console.log(err)
    }
    console.log("connection etablished successfully")
});

db.close((err) => {
    if(err){
        return console.log(err)
    }
    console.log("connection closed successfully")
});