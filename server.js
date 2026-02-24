import express from "express";
import db from "./connect.js";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.status(200);
    res.send("app online")
})

app.get('/api', (req, res) =>{

})
app.get(/api, (req, res) =>{})
app.post(/api, (req, res) =>{})
app.delete(/api, (req, res) =>{})





app.listen(PORT, (err) => {
    if(err){
        return console.log(err)
    }
    console.log(`Server is running on port ${PORT}`);
}); 