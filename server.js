const sqlite3 = reqiure('sqlite3');
const db = new qlite3.Database('./myuser.db', (err) =>{
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