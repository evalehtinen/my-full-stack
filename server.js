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

var timeRefreshed = '';

//Connect to remote database
mongoose.connect('mongodb://imguruser:salasana@ds061354.mlab.com:61354/heroku_r8t497xt');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database');
});

//The https request for imgur images
var imagereq = function(resp) {
    
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

            //Imgur sends over 500 top images, we want only 100.
            while (i < 100)   {   
                var picdata = new Image(imgData.data[i]);

                picdata.save(function (err, kuva) {
                    if (err) return console.error(err);
                });            
                i++;
            }
            
            //On request success and everything's done, store timestamp for later use
            timeRefreshed = moment().format("DD.MM.YYYY HH:mm:ss");
            return resp(timeRefreshed);
        });
    });
    req.end();   
    req.on('error', (e) => {        
        console.log(`problem with request: ${e.message}`);        
    }); 
    
}

imagereq((resp) => {
    console.log("Database refreshed: " +resp);
});

app.use(express.static('public')); 

//Server up
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port 3000!');
});

//Send the client a timestamp when the database was refreshed last time
app.get('/date', (req, res) => { 
    res.send(timeRefreshed);
    console.log('Page load ' + timeRefreshed);
});

//Search images with search keyword
app.get('/images', (req, res) => {
    db.collection('images').find({$text: {$search: req.query.search}}).toArray((err, result) => {
    if (err) return console.log(err)
    res.send(result);
    console.log("Search with a keyword: " + req.query.search);    
    });
});

//Refresh the database on button click
app.get('/refresh', (req, res) => {     
    imagereq((resp) => {        
        res.send(resp);
        console.log('Database refreshed: ' + resp);    
    });
           
});
