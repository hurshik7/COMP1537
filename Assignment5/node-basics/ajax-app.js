// https://expressjs.com/en/guide/routing.html


// REQUIRES
const lists = require('./core/data');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// https://www.npmjs.com/package/jsdom
const { JSDOM } = require('jsdom');
const fs = require("fs");


// just like a simple web server like Apache web server
app.use('/js', express.static('static/js'));
app.use('/css', express.static('static/css'));


app.get('/', function (req, res) {
    let doc = fs.readFileSync('./static/html/index.html', "utf8");

    // you can also make changes to the DOM
    let dom = new JSDOM(doc);
    // have to get the dom window's document
    let div = dom.window.document.getElementById("content");
    div.innerHTML = "<i>inserted on the server!</i>";

    res.send(dom.serialize());
    // without the DOM, just:
    //res.send(doc);
});


app.get('/ajax-date', function(req, res) {

    // set the type of response:
    res.setHeader('Content-Type', 'application/json');
    let d = new Date();

    res.send({ msg: d });

});


app.get('/ajax-GET-list', function (req, res) {

    //res.setHeader('Content-Type', 'application/json');
    //console.log(req.query['format']);
    let formatOfResponse = req.query['format'];
    //let formatOfResponse = req.query.format;
    let dataList = null;

    if(formatOfResponse == 'html-list') {

        res.setHeader('Content-Type', 'text/html');
        dataList = lists.getHTML();
        res.send(dataList);

    } else if(formatOfResponse == 'json-list') {

        res.setHeader('Content-Type', 'application/json');
        dataList = lists.getJSON();
        res.send(dataList);

    } else if(formatOfResponse == 'getJSONCourses') {
        res.setHeader('Content-Type', 'application/json');
        dataList = lists.getJSONCourses();
        res.send(dataList);

    }else {
        res.send({msg: 'Wrong format!'});
    }
});

// Notice that this is a 'POST'
app.post('/post-form', function (req, res) {
      res.setHeader('Content-Type', 'application/json');

      console.log("Stuff sent to server", req.body);

      res.send(["You sent me:", req.body]);

});

// for page not found (i.e., 404)
app.use(function (req, res, next) {
  res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});

// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});
