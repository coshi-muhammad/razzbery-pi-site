import express, { json, response } from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(json());
app.use(express.static(join(__dirname, "../frontend")));
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, "../frontend", "index.html"));
})
app.get('/guest', (req, res) => {
  res.sendFile(join(__dirname, "../frontend", "guest.html"))
})
app.get('/password', (req, res) => {
  res.sendFile(join(__dirname, "../frontend", "password.html"))
})
app.use('/protected', (req, res, next) => {
  if (req.headers.password === process.env.PASSWORD) {
    next()
  } else {
    res.status(401).send("something went wrong")
  }
})
app.get('/protected/notes', (req, res) => {
  res.status(200).sendFile(join(__dirname, "../frontend", "notes.html"))
})



app.listen(5000, () => {
  console.log("it is working");
})
