const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { application } = require("express");
const { urlencoded } = require("body-parser");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
//parse application/urlencoded
app.use(express.urlencoded({ extended: false }));

//parse application/json
app.use(express.json());

//static files
app.use(express.static("public"));

//template engine
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", "hbs");

//mysql connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//connect to database
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Connected as ID " + connection.threadId);
});

const routes = require("./server/routes/student");
app.use("/", routes);

app.listen(port, () => console.log(`Listening on port ${port}`));
