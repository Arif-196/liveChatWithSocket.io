const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", "views");

const db = mysql.createConnection({
  host: "localhost",
  database: "schol",
  user: "root",
  password: "",
})

db.connect((err) => {
  if (err) throw err
  console.log("database running");

// get Data Murid
  app.get("/", (req, res) => {
    const sql = "SELECT * FROM students" ;
    db.query(sql, (err, result) => {
      const students = JSON.parse(JSON.stringify(result));
      res.render("index", {students: students, title: "DAFTAR MURID"});
    })
  })

  app.get('/chat', (req, res) => {
    res.render('chat', {loginTitle: "MASUK FORUM", chatroomTitle: "DISKUSI TERBUKA"});
  })

// Insert Data
  app.post("/tambah", (req, res)=> {
    const InsertSql = `INSERT INTO students (name, kelas) VALUES ('${req.body.nama}', '${req.body.kelas}');`
    db.query(InsertSql, (err, result) => {
      if(err) throw err
      res.redirect("/")
    });
  })
})

io.on("connection", (socket) => {
  socket.on("message", (id, message) => {
    // const {id, message} = data;
    // console.log("Ini adalah DATA => ", data);
    socket.broadcast.emit("message", message, id)
  })
})
server.listen(8000, () => {
  console.log('server running...');
})