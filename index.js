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
const mysql = require('mysql');
const bodyParser = require("body-parser")
const multer = require('multer');

require('dotenv').config();

const aws = require('aws-sdk');
aws.config.region = 'eu-west-2';
const S3_BUCKET = process.env.S3_BUCKET;
const uploadAudio = require('./public/assets/js/aws');
const { memoryStorage } = require('multer');
const axios = require('axios');
let dbArray = [];
let aFile = 0;

// Create connection to mySQL db using variables in .env
var connection = mysql.createConnection({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT,
    database : 'redruthdb',
    ssl      : 'Amazon RDS'
});

// Attempt connection, log results
connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
  
    console.log('Connected to database.');
});


const storage = memoryStorage();
const upload = multer({ storage });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(express.static('public/assets'));


/**
 * Comment below when pushing to heroku
 */

app.listen(port,'0.0.0.0', () => {
    console.log(`App listening at http://localhost:${port}`);
    
});


/**
 * Uncomment below when pushing to heroku
 */

// var enforce = require('express-sslify');
// var http = require('http');
// app.use(enforce.HTTPS({ trustProtoHeader: true }));

// http.createServer(app).listen(port, () => {
//         console.log('Express server listening on port ' + port);
// });





app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

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




/**
 * if collection exists, swap to that collection
 * otherwise create new and swap
 */
/* create new collection and update universal prompt */
app.get('/updateCollection', (req, res) => {
    var newCollectionName = req.query.collection;
    connection.query('SELECT 1 FROM t_collection WHERE nme = ', [newCollectionName], function (error, results, fields) {
        if (error) throw error;
        if (results) {
            alert('Collection already exists!');
        } else {
            connection.query('INSERT INTO t_collection (user_id, title, description, public_flg) VALUES (1, "Hello World", "Hello World 2", false)', function (error, results, fields) {
                if (error) throw error;
            });
        }

    });

    res.redirect('/admin.html');
    // res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/updatePrompt', (req, res) => {
    var prompt = req.query.prompt;
    updatePrompt(prompt);
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

/* update prompt data in PromptData collection, prompt data read from index.html */
function updatePrompt(newPrompt) {
    connection.query('UPDATE t_prompt SET prompt = ?', [newPrompt], function (error, results, fields) {
        if (error) throw error;
        /*dynamically updates admin page with prompt data*/
        app.post('/saved', function(req, res) {
            connection.query('SELECT * FROM t_prompt', function (error, results, fields) {
                if (error) throw error;
                return res.json({ success: true, results});
            });
        });
        /*dynamically updates admin and listen pages with story data*/
        app.post('/metaArr', function(req, res) {
            connection.query('SELECT * FROM t_prompt', function (error, results, fields) {
                if (error) throw error;
                return res.json({ success: true, results});
            });
        });
    });
}

/* get prompt from db */
app.get('/prompt', (req, res) => {
    connection.query('SELECT * FROM t_prompt LIMIT 1', function (error, results, fields) {
        if (error) throw error;
        res.json(results[0].prompt); // sends a JSON response containing the first prompt.
    });
});


/**
 * Generates a timestamp string for the database entry.
 * 
 * @returns String 
 */
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

/**
 * Takes upload request, formats it, then uploads the audio file. 
 * Afterward, it sends all necessary data to the database. 
 * 
 * Replies 200 if everything worked
 * 
 * Try to respond 403 if something fails
 * Something breaks when sending to the db, we have to 
 * log the error and cant save the client
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
        fileName: Date.now() + '.mp3',
        public: false,
        link: "",
    }
    audio.link = 'https://' + S3_BUCKET + '.s3.eu-west-2.amazonaws.com/' + audio.fileName;

    //try to upload file, if it doesnt work, exit and dont send to db
    try {
      //upload file 
      const file = req.file.buffer;
      link = await uploadAudio(audio.fileName, S3_BUCKET, file);

    } catch (error) {
      console.error(error);
      res.sendStatus(403);
      return;
    }

    //send to database
    connection.query('INSERT INTO t_user (email, name, phone_num, postal_code, usertype) VALUES (?, ?, ?, ?, 3)', [audio.email, audio.fullName, audio.phone, audio.postCode], function (error, results, fields) { // TODO create a sproc to do this
        if (error) throw error;
        var insertid = results.insertId
        connection.query('INSERT INTO t_audio_file (user_id, prompt_id, filepath, timestamp, title, remarks, public_flg) VALUES (?, 1, ?, ?, ?, ?, ?)', [insertid, audio.link, audio.timeStamp, audio.title, audio.comments, audio.public], function (error, results, fields) { // TODO create a sproc to do this
            if (error) throw error;
        });
    });


    res.sendStatus(200);
});

/*initial listen query for db data*/
app.post('/metaArr', function(req, res) {
    connection.query('SELECT t_collection.title AS collection_name, t_audio_file.title AS audio_name, t_audio_file.public_flg AS public_flg, t_prompt.prompt AS prompt, t_audio_file.remarks AS remarks, t_audio_file.timestamp AS timestamp, t_user.postal_code AS postal_code, t_audio_file.filepath AS filepath FROM t_audio_file JOIN t_user on t_audio_file.user_id = t_user.user_id JOIN t_prompt ON t_audio_file.prompt_id = t_prompt.prompt_id JOIN t_collection ON t_prompt.collection_id = t_collection.collection_id', function (error, results, fields) {
        if (error) throw error;
        return res.json({ success: true, results});
    });
  });
  




/**
 * 
 * ADMIN routes
 * 
 */

/**
 * Lists collections that store audio.
 * 
 * Does not list promptData
 */
app.get('/collections', (req, res) => {
    connection.query('SELECT * FROM t_collection', function (error, results, fields) {
        if (error) throw error;
        return res.json({ success: true, results});
    });
});

/*initial admin query for db data*/
app.post('/saved', function(req, res) {
    connection.query('SELECT * FROM t_audio_file JOIN t_user ON t_audio_file.user_id = t_user.user_id JOIN t_prompt ON t_audio_file.prompt_id = t_prompt.prompt_id', function (error, results, fields) {
        if (error) throw error;
        return res.json({ success: true, results});
    });
});


/* get record id from admin page to delete record */
app.get('/deleteRecord', (req, res) => {
    var file_id = req.query.deletePublic;
    connection.query('DELETE FROM t_audio_file WHERE file_id = ?', [file_id], function (error, results, fields) {
        if (error) throw error;
        console.log('deleted record ' + file_id);
        return res.json({ success: true, results});
    });
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

/* gets record id to update public boolean from admin page to false */
app.get('/removePublic', (req, res) => {
    var id = req.query.takeOffSite;
    connection.query('UPDATE t_audio_file SET public_flg = false where file_id = ?', [id], function (error, results, fields) {
        if (error) throw error;
    });
    res.sendFile(path.join(__dirname, 'public/admin.html'));
})

/* gets record id to update public boolean from admin page to true */
app.get('/updatePublic', (req, res) => {
    var id = req.query.updatePublic;
    connection.query('UPDATE t_audio_file SET public_flg = true where file_id = ?', [id], function (error, results, fields) {
        if (error) throw error;
    });
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});


