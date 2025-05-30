import sqlite from "sqlite3";
import { open } from "sqlite";

export const inisilizeDb = async () => {
  const db = await open({ filename: "../database/mydata.db", driver: sqlite.Database });
  await db.run("CREATE TABLE IF NOT EXISTS notes (id integer PRIMARY KEY NOT NULL ,name TEXT UNIQUE,date integer,path TEXT)");
  return db
}

export const insert = async (db, data) => {
  const time_stamp = Math.floor(Date.now() / 1000);
  try {
    await db.run("INSERT INTO notes (name,path,date) VALUES (?,?,?)", [data.name, data.file_path, time_stamp]);
    console.log(`note with the name ${data.name} was successfully inserted`);
    return { success: true };
  } catch (error) {
    if (error == "SQLITE_CONSTRAINT") {
      return { success: false, message: "Note name must be unique" };
    }
    throw error;
  }
}
export const selectDate = async (start, db) => {
  console.log(db);
  const result = await db.all("SELECT * FROM notes ORDER BY date DESC LIMIT 20 OFFSET ?", [start]);
  console.log(`selected 20 notes starting at ${start}`);
  return result;
}
export const deleteNote = async (name, db) => {
  const deleted = await db.run("DELETE FROM notes WHERE name=?", [name])
  console.log(`deleted note with the name ${name}`);
  return deleted;
}
export const closeDb = async (db) => {
  await db.close();
}
