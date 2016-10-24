var http = require("http");
var mongoose = require('mongoose');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var app = express();
const https = require('https');

//Connect to local database
mongoose.connect('mongodb://localhost/imgurdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database');
});

//Moongose schema for imgur data
var ImgurSchema = new mongoose.Schema({  
        id: String,
        title: String,
        description: String,
        datetime: {type: Date, default: Date.now },
        type: String,
        animated: Boolean,
        width: Number,
        height: Number,
        size: Number,
        views: Number,
        bandwidth: Number,
        deletehash: String,
        name: String,   
        section: String,
        link: String,
        gifv: String,
        mp4: String,
        mp4_size: Number,
        looping: Boolean,
        favourite: Boolean,
        nsfw: Boolean,
        vote: String,
        in_gallery: Boolean
});

var Image = mongoose.model('Image', ImgurSchema);

//Imgur secrets
//0a7756c769047ea
//49c6aa66247a49a8e2257a968cb66681f060927a

var imgData = '';
var i = 0;
var output = '';

//Options for https.request
var options = {
    hostname: 'api.imgur.com',
    port: 443,    
    path: '/3/gallery/hot/viral/2',
    method: 'GET',
    headers: {
    'Authorization':'Client-ID 0a7756c769047ea'
  }

};

//The request for imgur images
var req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (chunk) => {
        imgData += chunk;        
    });
    
    res.on('end', function() {
        imgData = JSON.parse(imgData);
        
        while (i < 100)   {   
            var kuva = new Image(imgData.data[i]);
            
            kuva.save(function (err, kuva) {
                if (err) return console.error(err);
            });

            output += imgData.data[i];
            i++;
        }
    });
});

req.end();
req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});

      
//Server up
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//log every data entries
Image.find(function (err, images) {
    if (err) return console.error(err);
    
    //send data entries to front
    app.get('/', function (req, res) { 
        res.send(images)
    })
   
});     
