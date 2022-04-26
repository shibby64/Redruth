/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser")
const multer = require('multer');
const { waitForDebugger } = require('inspector');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
let aFile = "";
// Connect to the db

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const fileNameArr = file.originalname.split('.');
    aFile = Date.now();
    cb(null, `${aFile}.${fileNameArr[fileNameArr.length - 1]}`);
  },
});
const upload = multer({ storage });
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
const port = process.env.PORT || 3000;

app.use(express.static('public/assets'));
app.use(express.static('uploads'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/record', upload.single('audio'), (req, res) => res.json({ success: true }));

app.get('/recordings', (req, res) => {
  let files = fs.readdirSync(path.join(__dirname, 'uploads'));
  files = files.filter((file) => {
    // check that the files are audio files
    const fileNameArr = file.split('.');
    return fileNameArr[fileNameArr.length - 1] === 'mp3';
  }).map((file) => `/${file}`);
  return res.json({ success: true, files });
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
  app.post("/insert", function(req, res) {
    var title = req.body.title;
    var comments = req.body.comments;
    var prompt = req.body.prompt;
    var project = req.body.project;
    var postCode = req.body.postCode;
    var fullName  = req.body.fullName;
    var email = req.body.email;
    var phone = req.body.phone;
    const timeStamp = TimeStamp();
    var audio = "uploads/" + aFile + ".mp3";
    console.log(aFile);
    myFunction(title, comments, prompt, project, timeStamp, audio, postCode, fullName, email, phone);
  });
  function TimeStamp(){
    const currentDate = new Date();
    var year = currentDate.getUTCFullYear();
    var month = currentDate.getUTCMonth();
    var day = currentDate.getUTCDate();
    var hour = currentDate.getUTCHours() +1;
    var minute = currentDate.getUTCMinutes();
    if (minute < 10){
      minute = "0" + minute;
    }
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return "" + hour + ":" + minute + " " + months[month] + " " + day + ", " + year;
  }
  // Specify database you want to access
  const db = client.db('local');
  const record = db.collection('recordedData');
  record.find().toArray(function(err, filed){
  console.log(filed); // output all records
    // app.get('/index', function(req, res){
    //   res.render(__dirname + '/public/index.html', {filed:filed})
    // })
    let i = 0;
    while(i < filed.length){
      var proj = filed[i].adminData.Project;
      var prmt = filed[i].adminData.Prompt;
      var pth = filed[i].Audio.url;
      //console.log("" + proj + " " + prmt + " " + pth)
      i++;
    }
  });
  function myFunction(title, comments, prompt, project, timeStamp, audio, postCode, fullName, email, phone){
  record.insertOne({ 
    adminData:{
      Project: project,
      Prompt: prompt,
      TimeStamp: timeStamp
    },
    Audio: {url: audio},
    metaData: {
      Title: title,  
      Comments: comments,
      PostalCode: postCode,
      Name: fullName,
      Email: email,
      Phone: phone
    }
  }, (err, result) => { });
  console.log(`MongoDB Connected: ${url}`);
  }


});