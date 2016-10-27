const mongoose = require('mongoose');


///Moongose schema for imgur data
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

module.exports = mongoose.model('Image', ImgurSchema);