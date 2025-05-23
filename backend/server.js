import express, { json } from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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
app.post('/api/post', (req, res) => {
  console.log(req.body)
})



app.listen(5000, () => {
  console.log("it is working");
})
