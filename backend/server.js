import express, { json, response } from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { inisilizeDb, insert, selectDate } from "./data_base.js";
import multer from "multer";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const sessions = {};
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../storage_area/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(json());
app.use(cookieParser());
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
app.post('/api/authenticate', (req, res) => {
  const password = req.body.password;
  if (password !== process.env.PASSWORD) {
    res.status(401).send("authentication failed");
  } else {
    const session_id = uuidv4();
    sessions[session_id] = { autherised: true };
    res.cookie("session", `${session_id}`, { maxAge: 3600000, path: '/notes' })
    res.send("authentication successfull");
  }
})
app.get('/notes', (req, res) => {
  const id = req.headers.cookie?.split('=')[1];
  const auth_state = sessions[id];
  if (!auth_state) {
    res.status(401).send(`

      <!DOCTYPE html>
      <html lang="en">

        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
        </head>
        <style>

          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 200px;
            font-size:50px;
          }
        </style>
        <body>
          <strong>You thought I was this stupid ? well I'm not you may try again in another way </strong>
        </body>

      </html>
`)
  } else {
    res.status(200).sendFile(join(__dirname, "../frontend", "notes.html"))
  }
})
async function dbRoutes() {
  const db = await inisilizeDb();
  app.get('/api/get-notes/:start', async (req, res) => {
    const notes_list = await selectDate(req.params.start, db);
    res.json(notes_list);
  })
  app.post('/api/uploadfile/:name', upload.single('file'), async (req, res) => {
    console.log(req.file);
    const data = { name: req.params.name, path: `../storage_area/${req.params.name}` };
    await insert(db, data);
    res.send('successfull');
  })
}
dbRoutes();
app.listen(5000, () => {
  console.log("it is working");
})
