var http = require("http");
var mongoose = require('mongoose');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var app = express();
const https = require('https');
var path = require('path');



//Connect to local database
mongoose.connect('mongodb://localhost/imgurdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database');
});
db.collection('images').remove({}); //Clean any old imagedatas

//Moongose schema for imgur data
var ImgurSchema = new mongoose.Schema({  
        id: String,
        title: {type: String, text: true },
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
var imgData = '';
var i = 0;

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
var req = https.request(options, (res) => {
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

app.use(express.static('public'));      
//Server up
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//Send index.html to client
app.get('/', (req, res) => {      
    res.sendFile(path.join(__dirname +'/index.html'));
});

//The API for searching images 
app.get('/images', (req, res) => {    
    db.collection('images').find({$text: {$search: req.query.search}}).toArray((err, result) => {
    if (err) return console.log(err)
    res.send(result);
    console.log(req.query.search);    
    });
});
