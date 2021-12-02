const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const { JSDOM } = require("jsdom");

// static path mappings
app.use("/js", express.static("public/js"));
app.use("/css", express.static("public/css"));
app.use("/imgs", express.static("public/imgs"));
app.use("/fonts", express.static("public/fonts"));
app.use("/html", express.static("public/html"));
app.use("/media", express.static("public/media"));

app.use(
  session({
    secret: "extra text that no one will guess",
    name: "wazaSessionID",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/profile");
  } else {
    let doc = fs.readFileSync("./app/html/index.html", "utf8");
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(doc);
  }
});

app.get("/profile", function (req, res) {
  // check for a session
  if (req.session.loggedIn) {
    let profile = fs.readFileSync("./app/html/profile.html", "utf8");
    let profileDOM = new JSDOM(profile);

    //get the user's data and put it into the page
    profileDOM.window.document.getElementsByTagName("title")[0].innerHTML =
      req.session.name + "'s running data";
    profileDOM.window.document.getElementById("greeting-msg").innerHTML =
      "Let's run again " + req.session.name;

    const mysql = require("mysql2");
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "runner",
    });
    connection.connect();
    connection.query("SELECT * FROM user WHERE email = ?", [req.session.email],
     function(error, userData) {
        if (error) {
            console.log(error);
        }
        if (userData.length > 0) {
            profileDOM.window.document.getElementById("user-info-container").innerHTML
            += `<div id="user-info">
                    <div id="user-name">${userData[0].name}</div>
                    <div id="user-email">${userData[0].email}</div>
                    <div id="user-city">${userData[0].city}</div>
                    <div id="user-postcode">${userData[0].postcode}</div>
                    <div id="user-totaldistance">Total distance: ${userData[0].totaldistance}km</div>
                    <div id="user-averagepace">Average pace: ${userData[0].averagepace} / 1km</div>
                    <div id="user-level">Level: ${userData[0].level}</div>
        </div>`
        } else {
            // user not found
            return callback(null);
        }
    });

    connection.query("SELECT * FROM running", function (error, runningData) {
      console.log(
        "Results from DB and the # of records returned",
        runningData.length
      );

      if (error) {
        console.log(error);
      }
      if (runningData.length > 0) {
        for (let i = 0; i < runningData.length; i++) {
          profileDOM.window.document.getElementById(
            "card-container"
          ).innerHTML += `<div id="card-content${i + 1}">
                            <div id="card-wrap" class="card">
                                <h2 class="date">${runningData[i].date}
                                </h2>
                                <div class="running-img-container" style="background-image: url('/imgs/pic0${i}.PNG');"></div>
                                <div class="km runninginfo">${runningData[i].km} km</div>
                                    <div class="pace runninginfo">pace: ${
                                      runningData[i].pace
                                    }</div>
                                    <div class="time runninginfo">time: ${
                                      runningData[i].time
                                    }</div>
                                    <div class="elevation runninginfo">elevation: ${
                                      runningData[i].elevation
                                    } m</div>
                                    <div class="calorie runninginfo">${
                                      runningData[i].calorie
                                    } kcal</div>
                            </div>
                        </div>`;
        }
        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(profileDOM.serialize());
      } else {
        // user not found
        return callback(null);
      }
    });
  } else {
    // not logged in - no session and no access, redirect to home
    res.redirect("/");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  console.log("What was sent", req.body.email, req.body.password);

  let results = authenticate(
    req.body.email,
    req.body.password,
    function (userRecord) {
      if (userRecord == null) {
        // fail to fine the user
        res.send({ status: "fail", msg: "User account not found." });
      } else {
        // authenticate the user, create a session
        req.session.loggedIn = true;
        req.session.email = userRecord.email;
        req.session.name = userRecord.name;
        req.session.save(function (err) {
          // session saved, for analytics, record this in a DB
        });
        res.send({ status: "success", msg: "Logged in." });
      }
    }
  );
});

app.get("/logout", function (req, res) {
  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Unable to log out");
      } else {
        // session deleted, redirect to home
        res.redirect("/");
      }
    });
  }
});

function authenticate(email, pwd, callback) {
  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "runner",
  });
  connection.connect();
  connection.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [email, pwd],
    function (error, results, fields) {
      // results is an array of records, in JSON format
      // fields contains extra meta data about results
      console.log(
        "Results from DB",
        results,
        "and the # of records returned",
        results.length
      );

      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        // email and password found
        return callback(results[0]);
      } else {
        // user not found
        return callback(null);
      }
    }
  );
}

/* initiate DB */
async function init() {
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true,
  });
  const createDBAndTables = `CREATE DATABASE IF NOT EXISTS runner;
        use runner;
        CREATE TABLE IF NOT EXISTS user (
        ID int NOT NULL AUTO_INCREMENT,
        name varchar(30),
        email varchar(30),
        password varchar(30),
        totaldistance int,
        averagepace varchar(30),
        level varchar(30),
        city varchar(30),
        postcode varchar(10),
        PRIMARY KEY (ID));`;
  await connection.query(createDBAndTables);

  const [rows, fields] = await connection.query("SELECT * FROM user");
  if (rows.length == 0) {
    let userRecords =
      "insert into user (name, email, password, totaldistance, averagepace, level, city, postcode) values ?";
    let recordValues = [
      [
        "Shik",
        "shik@techschool.ca",
        "abc123",
        384,
        "5m 35s",
        "intermediate",
        "Burnaby",
        "V5E 3B3",
      ],
    ];
    await connection.query(userRecords, [recordValues]);
  }

  const createRunningDBAndTables = `CREATE DATABASE IF NOT EXISTS runner;
        use runner;
        CREATE TABLE IF NOT EXISTS running (
        ID int NOT NULL AUTO_INCREMENT,
        date varchar(30),
        km float,
        pace varchar(30),
        time varchar(30),
        elevation int,
        calorie int,
        PRIMARY KEY (ID));`;
  await connection.query(createRunningDBAndTables);

  const [rows2, fields2] = await connection.query("SELECT * FROM running");
  if (rows2.length == 0) {
    let userRunningRecords =
      "insert into running (date, km, pace, time, elevation, calorie) values ?";
    let recordRunningData = [
      ["26 Nov 2021", 3.01, "5m 35s", "16m 47s", 34, 226],
      ["19 Nov 2021", 1.0, "6m 21s", "6m 21s", 49, 73],
      ["16 Nov 2021", 3.41, "4m 59s", "17m 02s", 30, 260],
      ["13 Nov 2021", 3.51, "5m 43s", "20m 06s", 32, 263],
      ["12 Nov 2021", 3.0, "5m 33s", "16m 41s", 34, 225],
      ["7 Nov 2021", 2.49, "6m 12s", "15m 27s", 26, 185],
      ["30 Oct 2021", 2.92, "5m 37s", "16m 26s", 42, 220],
      ["23 Oct 2021", 2.01, "5m 57s", "11m 58s", 31, 150],
      ["22 Oct 2021", 8.01, "5m 36s", "44m 50s", 96, 601],
      ["21 Sep 2021", 4.01, "5m 20s", "21m 24s", 32, 303],
    ];
    await connection.query(userRunningRecords, [recordRunningData]);
  }
  console.log("Creating DB and inserting data are complete!");
  console.log("Listening on port " + port + "!");
}

// RUN SERVER
let port = 8000;
app.listen(port, init);
