/**
 * Summary.     Handles the routing and main database setup of the application.
 *              
 * Description. Some routes send a related html file, other routes send an 
 *              API response for something to respond to. For example, 
 *              uploading a recording sends a 200 response when complete.
 *
 */


/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser")
    // var enforce = require('express-sslify');
    // var http = require('http');
const multer = require('multer');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://dskrocks:a3blog@cluster0.0dnde.mongodb.net/?retryWrites=true&w=majority'; //update this to remove usr/pw using .env

const aws = require('aws-sdk');
aws.config.region = 'eu-west-2';
const S3_BUCKET = process.env.S3_BUCKET;
const uploadAudio = require('./public/assets/js/aws');
const { memoryStorage } = require('multer');
const axios = require('axios');
let dbArray = [];
let aFile = 0;

// What collection in Mongo the app in looking at, in future have admin page set this var from available collections 
var collection = 'test';
//var collection = 'Redruth Reading Room';
const storage = memoryStorage();
const upload = multer({ storage });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(express.static('public/assets'));


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
// app.use(enforce.HTTPS({ trustProtoHeader: true }));

// http.createServer(app).listen(port, () => {
//     console.log('Express server listening on port ' + port);
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

/* create a filename for record using current date  */
function filename() {
    aFile = Date.now();
    return aFile + '.mp3';
};


// app.post('/record', upload.single('audio'), async(req, res) => {
//     const bucketname = S3_BUCKET;
//     const file = req.file.buffer;
//     const fileName = filename();
//     const link = await uploadAudio(fileName, bucketname, file)
//     res.sendStatus(200);
// });




/* listen page route */
app.get('/listen.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/listen.html'));
});

/* admin page route */
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/saved.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/saved.html'));
});

/* create new collection and update universal prompt */
app.get('/admin', (req, res) => {
    var project = req.query.project;
    //var prompt = req.query.prompt;
    createNewTable(project);
    //updateMongoDBPrompt(prompt);
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/adminPrompt', (req, res) => {
    var prompt = req.query.prompt;
    updateMongoDBPrompt(prompt);
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

/* create new collection */

function createNewTable(project) {
    /* working, however will crash when you attempt to create a collection that already exists */
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbase = db.db("Redruth");
        dbase.createCollection(project, function(err, res) {
            if (err) throw err;
        });
    })
}

/* update prompt data in PromptData collection, prompt data read from index.html */
function updateMongoDBPrompt(newPrompt) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbase = db.db('Redruth');
        dbase.collection('PromptData')
            .updateOne({ '_id': ObjectId('62cccad3158754c692f78794') }, { $set: { Prompt: newPrompt } },
                function(err, res) {
                    if (err) throw err;
                    console.log('updated prompt: ' + newPrompt);
                });
        /*dynamically updates admin page with prompt data*/
        app.post('/saved', function(req, res) {
            record.find().toArray(function(err, filed) {
                return res.json({ success: true, filed });
            });
        });
        /*dynamically updates admin and listen pages with story data*/
        app.post('/metaArr', function(req, res) {
            record.find().toArray(function(err, filed) {
                return res.json({ success: true, filed });
            });
        });
    });
}

/* get prompt from db */
app.get('/prompt', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbase = db.db('Redruth');
        dbase.collection('PromptData').findOne({ '_id': ObjectId('62cccad3158754c692f78794') }, function(err, prompt) {
            //console.log("prompt in /prompt get: " + prompt.Prompt);
            if (err) {
                console.log(err);
                res.json(err);
            } else {
                res.json(prompt.Prompt);
            }
        })
    });
});

/* gets record id to update public boolean from admin page to true */
app.get('/updatePublic', (req, res) => {
    var id = req.query.updatePublic;
    updateTable(id);
    res.redirect('back');
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

/* add public true to record ID */
function updateTable(id) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbase = db.db('Redruth');
        dbase.collection(collection)
            .updateOne({ '_id': ObjectId(id) }, { $set: { Public: true } },
                function(err, res) {
                    if (err) throw err;
                    console.log('updated public flag for record ' + id);
                });
        /*dynamically updates admin and listen pages with story data*/
        app.post('/metaArr', function(req, res) {
            record.find().toArray(function(err, filed) {
                return res.json({ success: true, filed });
            });
        });
    });
}

/* get record id from admin page to delete record */
app.get('/deleteRecord', (req, res) => {
    var id = req.query.deletePublic;
    deleteRecord(id);
    res.redirect('back');
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

/* delete record from collection */
function deleteRecord(id) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbase = db.db('Redruth'); //eliminates 'db.collection is not a function' TypeError
        dbase.collection(collection).deleteOne({ '_id': ObjectId(id) },
            function(err, res) {
                if (err) throw err;
                console.log('deleted record ' + id);
            }
        );

    });
}

function TimeStamp() {
    const currentDate = new Date();
    var year = currentDate.getUTCFullYear();
    var month = currentDate.getUTCMonth();
    var day = currentDate.getUTCDate();
    var hour = currentDate.getUTCHours() + 1;
    var minute = currentDate.getUTCMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (hour === 24) {
        hour = "0";
    }
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return "" + hour + ":" + minute + " " + months[month] + " " + day + ", " + year; //swap day month
}

//insert2

// get form data
//upload file to aws
//add to database


/**
 * Takes upload request, formats it, then uploads the audio file. 
 * Afterward, it sends all necessary data to the database. 
 * 
 * Replys 200 if everything worked
 * 
 * TODO: Handle server error if something broke.
 */
app.post('/insert', upload.single('audio'), async(req, res, next) => {
    //format request
    let audio = {
        title: req.body.title,
        comments: req.body.comments,
        prompt: req.body.prompt,
        project: req.body.project,
        postCode: req.body.postCode,
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        timeStamp: TimeStamp(),
        fileName: filename(),
        public: false,
        link: "",
    }
    audio.link = 'https://' + S3_BUCKET + '.s3.eu-west-2.amazonaws.com/' + audio.fileName;

    //upload file 
    const file = req.file.buffer;
    const link = await uploadAudio(audio.fileName, S3_BUCKET, file)

    //send to database
    if (req.body.key === req.body.passkey) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            const dbase = db.db('Redruth');
            const record = dbase.collection(collection);

            record.insertOne({
                adminData: {
                    Project: audio.project,
                    Prompt: audio.prompt,
                    TimeStamp: audio.timeStamp,
                },
                Audio: { url: audio.link },
                metaData: {
                    Title: audio.title,
                    Comments: audio.comments,
                    PostalCode: audio.postCode,
                    Name: audio.fullName,
                    Email: audio.email,
                    Phone: audio.phone
                },
                Public: audio.public
            }, (err, result) => {});
            /*dynamically updates admin and listen pages with story data*/
            app.post('/metaArr', function(req, res) {
                record.find().toArray(function(err, filed) {
                    return res.json({ success: true, filed });
                });
            });

        });
        res.sendStatus(200)
    } else {
        res.sendStatus(401)
    }

});
/*initial admin and listen page querries*/

app.post('/metaArr', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbase = db.db('Redruth');
        const record = dbase.collection(collection);
        record.find().toArray(function(err, filed) {
            return res.json({ success: true, filed });
        });
    });
});
app.post('/saved', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbase = db.db('Redruth');
        const record = dbase.collection(collection);
        record.find().toArray(function(err, filed) {
            return res.json({ success: true, filed });
        });
    });
});

/* gets record id to update public boolean from admin page to false */
app.get('/removePublic', (req, res) => {
    var id = req.query.takeOffSite;
    removeOffPublic(id);
    res.sendFile(path.join(__dirname, 'public/admin.html'));
})

function removeOffPublic(id) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbase = db.db('Redruth');
        dbase.collection(collection)
            .updateOne({ '_id': ObjectId(id) }, { $set: { Public: false } },
                function(err, res) {
                    if (err) throw err;
                    console.log('updated public flag for record ' + id);
                });
    });
}