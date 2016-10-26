const mongoose = require('mongoose');
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const express = require('express');
const app = express();
const https = require('https');
const path = require('path');
const Image = require('./models/image');
const moment = require('moment');

module.exports = app; //For test

//Connect to remote database
mongoose.connect('mongodb://imguruser:salasana@ds061354.mlab.com:61354/heroku_r8t497xt');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database');
});

var timeRefreshed = '';

//Options for https.request
var options = {
    hostname: 'api.imgur.com',
    port: 443,    
    path: '/3/gallery/hot/viral',
    method: 'GET',
    headers: {
    'Authorization':'Client-ID 0a7756c769047ea'
  }

};

//The request for imgur images
function imagereq() {    
    db.collection('images').remove({}); //Remove any old imagedatas
    var req = https.request(options, (res) => {
        var imgData = '';
        var i = 0;
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (chunk) => {
            imgData += chunk;        
        });

        res.on('end', function() {
            imgData = JSON.parse(imgData);

            while (i < 100)   {   
                var picdata = new Image(imgData.data[i]);

                picdata.save(function (err, kuva) {
                    if (err) return console.error(err);
                });            
                i++;
            }
        });
    });
    req.end();
    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);    
    });
    
    timeRefreshed = moment().format("DD.MM.YYYY HH:mm");    
}

imagereq();

app.use(express.static('public')); 

//Server up
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port 3000!');
});
//Send the client a timestamp last time when the database was refreshed
app.get('/date', (req, res) => { 
    res.send(timeRefreshed);
    console.log('Page load');
});
//Search images with search keyword
app.get('/images', (req, res) => {
    db.collection('images').find({$text: {$search: req.query.search}}).toArray((err, result) => {
    if (err) return console.log(err)
    res.send(result);
    console.log(req.query.search);    
    });
});
//Refresh the database on button click
app.get('/refresh', (req, res) => {    
    imagereq();    
    timeRefreshed = moment().format("DD.MM.YYYY HH:mm");
    console.log('Database refreshed');
    res.send(timeRefreshed);
});
