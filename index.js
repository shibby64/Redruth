/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser")
const multer = require('multer');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://dskrocks:a3blog@cluster0.0dnde.mongodb.net/?retryWrites=true&w=majority';//update this to remove usr/pw using .env

const aws = require('aws-sdk');
aws.config.region = 'eu-west-2';
const S3_BUCKET = process.env.S3_BUCKET;
const uploadAudio = require('./public/assets/js/aws');
const { memoryStorage } = require('multer');
const axios = require('axios');
let dbArray = [];
let aFile = 0;

// What collection the app in looking at  
var collection = 'Redruth Reading Room';

/* const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const fileNameArr = file.originalname.split('.');
    aFile = Date.now();
    cb(null, `${aFile}.${fileNameArr[fileNameArr.length - 1]}`);
  },
}); */

const storage = memoryStorage();
const upload = multer({ storage });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.use(express.static('public/assets'));
//app.use(express.static('uploads'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

/* create a filename for record using current date  */
function filename() {
  aFile = Date.now();
  return (aFile + '.mp3');
};

app.post('/record', upload.single('audio'), async (req, res) => {
  const bucketname = S3_BUCKET;
  const file = req.file.buffer;
  const fileName = filename();
  const link = await uploadAudio(fileName, bucketname, file)
  return res.json({ success: true});
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  if (err) {
    return console.log(err);
  }
  app.post("/insert", function (req, res) {
    var title = req.body.title;
    var comments = req.body.comments;
    var prompt = req.body.prompt;
    var project = req.body.project;
    var postCode = req.body.postCode;
    var fullName = req.body.fullName;
    var email = req.body.email;
    var phone = req.body.phone;
    const timeStamp = TimeStamp();
    var audio = `https://${S3_BUCKET}.s3.eu-west-2.amazonaws.com/` + aFile + ".mp3";
    const public = false;
    console.log(audio);
    if (aFile != 0)/* && req.body.key === req.body.passkey */ {
      myFunction(title, comments, prompt, project, timeStamp, audio, postCode, fullName, email, phone, public);
    }
    aFile =0;
  });
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
    return "" + hour + ":" + minute + " " + months[month] + " " + day + ", " + year;//swap day month
  }
  // Specify database you want to access
  const db = client.db('Redruth');
    const record = db.collection(collection);//temp change to test new collection created with admin page
    record.find().toArray(function (err, filed) {
      //console.log(filed); // output all records
      app.post('/metaArr', function (req, res) {
        return res.json({ success: true, filed });
      });
      /* app.post('/saved', function (req, res) {
        return res.json({ success: true, filed });
      }); */
    });
  
  function myFunction(title, comments, prompt, project, timeStamp, audio, postCode, fullName, email, phone, public) {
    record.insertOne({
      adminData: {
        Project: project,
        Prompt: prompt,
        TimeStamp: timeStamp,
      },
      Audio: { url: audio },
      metaData: {
        Title: title,
        Comments: comments,
        PostalCode: postCode,
        Name: fullName,
        Email: email,
        Phone: phone
      },
      Public: public
    }, (err, result) => { });
    console.log(`MongoDB Connected: ${url}`);
  }
  //location.reload();
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
/* get info from admin form */
app.get('/admin', (req, res) => {
  var project = req.query.project;
  var prompt = req.query.prompt;
  //createNewTable(project, prompt); //TEMP NOT WORKING FOR BETA WEEKEND
  //console.log("project" + project, "prompt" + prompt);//testing
  console.log("disabled for beta weekend");
});

/* create new collection */
function createNewTable(project, prompt) {
  /* working, however will crash when you attempt to create a collection that already exists */
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbase = db.db("Redruth");
    dbase.createCollection(project, function (err, res) {
      if (err) throw err;
      console.log("created collection");
    });
  });
}
//update to get audio files from s3 bucket or try to get url from mongoDB

/* gets record id to update public boolean from admin page */
app.get('/updatePublic', (req, res) => {
  var id = req.query.updatePublic;
  updateTable(id);
  res.redirect('back');
  //res.sendFile(path.join(__dirname, 'public/admin.html'));
});

/* add public true to record ID */
function updateTable(id) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbase = db.db('Redruth');
    dbase.collection(collection)
      .updateOne(
        { '_id': ObjectId(id) },
        { $set: { Public: true } },
        function (err, res) {
          if (err) throw err;
          console.log('updated public flag for record ' + id);
        });
  });
}

/* get record id from admin page to delete record */
app.get('/deleteRecord', (req, res) => {
  var id = req.query.deletePublic;
  deleteRecord(id);
  res.redirect('back');
  //res.sendFile(path.join(__dirname, 'public/admin.html'));
});

/* delete record from collection */
function deleteRecord(id) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbase = db.db('Redruth');//eliminates 'db.collection is not a function' TypeError
    dbase.collection(collection).deleteOne({ '_id': ObjectId(id) },
      function (err, res) {
        if (err) throw err;
        console.log('deleted record ' + id);
      }
    );
  });
}