var http = require("http");
var mongoose = require('mongoose');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var app = express();
const https = require('https');

mongoose.connect('mongodb://localhost/imgurdb');

//Moongose schema for imgur data
var ImgurSchema = new mongoose.Schema({
  data: {
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
        section: setInterval,
        link: String
    },
    success: Boolean,
    status: Number
});

var Image = mongoose.model('Image', ImgurSchema);

//log every data entries
Image.find(function (err, images) {
  if (err) return console.error(err);
  console.log(images)
});



//0a7756c769047ea //Imgur secrets
//49c6aa66247a49a8e2257a968cb66681f060927a

//var testi = '{"data":{"id":"r5Nf3n4","title":"So some dutch guys created a channel where they try all the drugs and film the effects","description":"For science: https:\/\/www.youtube.com\/channel\/UCvRQKXtIGcK1yEnQ4Te8hWQ","datetime":1477077172,"type":"image\/gif","animated":true,"width":720,"height":404,"size":14245836,"views":820076,"bandwidth":11682668203536,"vote":null,"favorite":false,"nsfw":null,"section":null,"account_url":null,"account_id":null,"is_ad":false,"in_gallery":true,"gifv":"http:\/\/i.imgur.com\/r5Nf3n4.gifv","mp4":"http:\/\/i.imgur.com\/r5Nf3n4.mp4","mp4_size":1572442,"link":"http:\/\/i.imgur.com\/r5Nf3n4.gif","looping":true},"success":true,"status":200}'; //Testdata

var options = {
    hostname: 'api.imgur.com',
    port: 443,    
    path: '/3/image/r5Nf3n4',
    method: 'GET',
    headers: {
    'Authorization':'Client-ID 0a7756c769047ea'
  }

};

callback = function(response) {
    response.on('data', (chunk) => {
    testi += chunk;    
    });
    
    response.on('end', function () {
        console.log(req.data);       
        app.get('/', function (req, res) {
//            new Image(req.body.testi).save(function (err) {
            res.send(testi);
//            });        
        });
    });
};

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});

var req = https.request(options, callback).end(); //http req to imgur

//Server up
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
