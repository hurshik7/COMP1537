// Declaring Express
const express = require('express');
const app = express();
// https://github.com/request/request
const request = require('request');

var myURL = "https://api.github.com/users/jim-parry/repos";

app.get('/', function(req, res){

    let payload = "didn't change!";
    let options = {
      url: myURL,
      headers: {
        'User-Agent': 'request',
        'Content-Type': 'application/json',
      }
    }
    request(options, function(err, re, body) {
        if(err) {
          console.log(err);
        }
        payload = body;
        //console.log(res.header);
        res.setHeader("Content-Type", "application/json");
        res.send(payload);
    });

});

const port = 8000
app.listen(port, () => console.log('My app listening on port ' + port));



