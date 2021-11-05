// REQUIRES
const express = require('express');
const app = express();
const fs = require("fs");

app.use('/js', express.static('./public/js'));
app.use('/css', express.static('./public/css'));
app.use('/images', express.static('./public/images'));

// Go to: http://localhost:8000
app.get('/', function (req, res) {
    let doc = fs.readFileSync('./public/html/index.html', "utf8");
    res.send(doc);
});

////////////////////////////////////
// YOU CAN CHANGE THE PATH, BUT
// YOU MUST CHANGE IT IN CLIENT.JS
// ALSO, IF YOU MAKE A FILE CALLED
// SOMETHING OTHER THAN NEWSFEED.XML
// YOU'LL HAVE TO UPDATE THIS TOO!!!
////////////////////////////////////
app.get('/data/firstyearcourses', function (req, res) {
    let doc = fs.readFileSync('./app/models/firstyearcourses.xml', "utf8");
    res.send(doc);
});

app.get('/data/secondyearcourses', function (req, res) {
    let doc = fs.readFileSync('./app/models/secondyearcourses.xml', "utf8");
    res.send(doc);
});

app.use(function (req, res) {
  res.status(404).send("Nothing there, 404.");
});

// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log('BCIT Level-1 courses list app listening on port ' + port + '!');
});
