import * as mongoose from 'mongoose'
import * as express from 'express'
import * as https from 'https'
import * as Image from './models/image'
import * as moment from 'moment'
import {Moment} from 'moment'

const app = express();

let timeRefreshed: Moment;

//Connect to remote database
mongoose.connect('mongodb://imguruser:salasana@ds135577.mlab.com:35577/heroku_t93zv9sr');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to database');
});

//The https request for imgur images
const imageReq = resp => {
    //Options for https.request
    const options = {
        hostname: 'api.imgur.com',
        port: 443,
        path: '/3/gallery/hot/viral',
        method: 'GET',
        headers: {
            'Authorization': 'Client-ID 0a7756c769047ea'
        }
    };
    db.collection('images').remove({}); //Remove any old imagedatas
    const req = https.request(options, res => {
        let imgData: string = '';
        let i = 0;
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', chunk => {
            imgData += chunk;
        });

        res.on('end', () => {
            //Imgur sends over 500 top images, we want only 100.
            const parsedData = JSON.parse(imgData);
            while (i < 100) {
                const picData = new Image(parsedData.data[i]);

                picData.save();
                i++;
            }

            //On request success and everything's done, store timestamp for later use
            timeRefreshed = moment.utc();
            return resp(timeRefreshed);
        });
    });
    req.end(0);
    req.on('error', e => {
        console.log(`problem with request: ${e.message}`);
    });
};

imageReq(resp => {
    console.log("Database refreshed: " + moment(resp).format("YYYY-MM-DD HH:mm:ss"));
});

app.use(express.static('public'));

//Server up
app.listen(3000, () => {
    console.log('Listening on port 3000!');
});
//Send the client a timestamp when the database was refreshed last time
app.get('/date', (req, res) => {
    res.send(timeRefreshed);
    console.log('Page load ' + moment(timeRefreshed).format("YYYY-MM-DD HH:mm:ss"));
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
    imageReq((resp) => {
        res.send(resp);
        console.log('Database refreshed: ' + moment(resp).format("YYYY-MM-DD HH:mm:ss"));
    });
});
export default app
