const recordButton = document.getElementById('recordButton');
//const recordButtonImage = recordButton.firstElementChild;
const recordedAudioContainer = document.getElementById('recordedAudioContainer');
const saveAudioButton = document.getElementById('saveButton');
const discardAudioButton = document.getElementById('discardButton');
const recordingsContainer = document.getElementById('recordings');


let chunks = []; // will be used later to record audio
let mediaRecorder = null; // will be used later to record audio
let audioBlob = null; // the blob that will hold the recorded audio
let metaArr = [];
let placeholder = [];

metaGrab();
//console.log(metaArr);
function metaGrab() {
  fetch('/metaArr', { method: 'POST' })
    .then((object) => object.json())
    .then((object) => {
      if (object.success && object.filed) {
        for (i = 0; i < object.filed.length; i++) {
          metaArr[i] = object.filed[i];
        }
      }
    })
    .catch((err) => console.error(err));
}


/* grab records in the database and filter by ones that are not public */
async function getCollections() {
  fetch('/saved', { method: 'POST' })
    .then((object) => object.json())
    .then((object) => {
      if (object.success && object.filed) {
        for (i = 0; i < object.filed.length; i++) {
          let isPublic = object.filed[i].Public;

          /* filter by records with a false public flag */
          if (!isPublic) {
            var dataContainer = document.getElementById('collections');

            /* create individual containers */
            var recordContainer = document.createElement('div');
            recordContainer.setAttribute('id', 'cont' + i);

            /* id */
            var showId = document.createElement('div');
            showId.innerHTML = 'Record _id: ' + object.filed[i]._id;
            var id = object.filed[i]._id;

            /* admin data */
            var ad = document.createElement('div');
            ad.innerHTML =
              'Collection: ' + object.filed[i].adminData.Project + ',  ' +
              'prompt: ' + object.filed[i].adminData.Prompt + ',  ' +
              'timeStamp: ' + object.filed[i].adminData.TimeStamp + ',  ';

            /* audio */
            var audio = document.createElement('div');

            /* get audio for playback */
            fetchRecordings(audio, id);

            /* meta data */
            var meta = document.createElement('div');
            meta.innerHTML =
              'Title: ' + object.filed[i].metaData.Title + ', ' +
              'Comments: ' + object.filed[i].metaData.Comments + ', ' +
              'PostalCode: ' + object.filed[i].metaData.PostalCode + ', ' +
              'Name: ' + object.filed[i].metaData.Name + ', ' +
              'Email: ' + object.filed[i].metaData.Email + ', ' +
              'Phone: ' + object.filed[i].metaData.Phone + ', '
              ;

            const space = document.createElement('br');

            /* create update form */
            var updateForm = document.createElement('form');
            updateForm.action = '/updatePublic';
            updateForm.method = 'get';
            updateForm.name = 'makePublic';

            /* create update submit button */
            var updateButton = document.createElement('button');
            updateButton.type = 'submit';
            updateButton.value = id;
            updateButton.innerHTML = 'Add to public site';
            updateButton.name = 'updatePublic';

            /* create delete form */
            var deleteForm = document.createElement('form');
            deleteForm.action = '/deleteRecord';
            deleteForm.method = 'get';
            deleteForm.name = 'delete';

            /* create delete record button */
            var deleteButton = document.createElement('button');
            deleteButton.type = 'submit';
            deleteButton.value = id;
            deleteButton.innerHTML = 'Delete this record';
            deleteButton.name = 'deletePublic';

            /* create hr line */
            var hr = document.createElement('hr');

            /* put together html elements to create data container */
            recordContainer.appendChild(showId);
            recordContainer.appendChild(ad);
            recordContainer.appendChild(audio);
            recordContainer.appendChild(meta);
            recordContainer.appendChild(updateForm);
            updateForm.appendChild(updateButton);
            recordContainer.appendChild(deleteForm);
            deleteForm.appendChild(deleteButton);
            recordContainer.appendChild(hr);
            recordContainer.appendChild(space);

            dataContainer.appendChild(recordContainer);

            updateForm.onsubmit = e => updatePageView();
            deleteForm.onsubmit = e => updatePageView();
          }
        }
      }
    })
    .catch((err) => console.error(err));
};

setTimeout(() => getCollections(), 100);

/* update the pull from the db after a admin updates or deletes from the db */
function updatePageView() { 
  //e.preventDefault();
  console.log(id);
  location.reload();
}

function fetchRecordings(audio, id) {

  fetch('/recordings')

    .then((response) => response.json())
    .then((response) => {
      //.log("fetch recordings");
      if (response.success && response.files) {
        //audio.innerHTML = ''; // remove all children
        //audio.classList.add('col-lg-2');
        response.files.forEach((file) => {
          for (i = 0; i < metaArr.length; i++) {
            if (file.substring(1, 14) === metaArr[i].Audio.url.substring(8, 21) && !metaArr[i].Public) {
              if (metaArr[i]._id == id) {
                const recordingElement = createRecordingElement(file, i);
                placeholder[i] = file.substring(1, 14);
                recordingElement.classList.add('col-lg-2');
                audio.appendChild(recordingElement);
              }
            }
          }
        });
      }
    })
    .catch((err) => console.error(err));
}

function createRecordingElement(file, i) {
  const recordingElement = document.createElement('div');
  recordingElement.setAttribute('id', 'cont' + i)
  const audio = document.createElement('audio');
  audio.src = file;
  audio.onended = (e) => {
    e.target.nextElementSibling.firstElementChild.src = 'images/play.png';

  };
  recordingElement.appendChild(audio);
  const playButton = document.createElement('button');
  playButton.setAttribute('id', 'aButton')
  playButton.classList.add('play-button', 'btn', 'border', 'shadow-sm', 'text-center');
  const playImage = document.createElement('img');
  playImage.src = '/images/play.png';
  playImage.classList.add('img-fluid');
  playButton.appendChild(playImage);

  playButton.addEventListener('click', playRecording);
  recordingElement.appendChild(playButton);
  return recordingElement;
}

function playRecording(e) {
  let button = e.target;
  if (button.tagName === 'IMG') {
    // get parent button
    button = button.parentElement;
  }
  const audio = button.previousElementSibling;
  if (audio && audio.tagName === 'AUDIO') {
    if (audio.paused) {
      audio.play();
      button.firstElementChild.src = 'images/pause.png';
    } else {
      audio.pause();
      button.firstElementChild.src = 'images/play.png';
    }
  }
}

function resetRecording() {
  if (recordedAudioContainer.firstElementChild.tagName === 'AUDIO') {
    recordedAudioContainer.firstElementChild.remove();
    // hide recordedAudioContainer
    recordedAudioContainer.classList.add('d-none');
    recordedAudioContainer.classList.remove('d-flex');
  }
  audioBlob = null;
}

fetchRecordings();