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

getCollections();

async function metaGrab() {
  fetch('/metaArr', { method: 'POST' })
    .then((object) => object.json())
    .then((object) => {
      if (object.success && object.filed) {
        for (i = 0; i < object.filed.length; i++) {
          if (!object.filed[i].Public){
              metaArr[i] = object.filed[i];
          }
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
            const audioTag = document.createElement('div');
            audioTag.classList.add("playStory");



            /* meta data */
            var meta = document.createElement('div');
            meta.innerHTML =
              'Title: ' + object.filed[i].metaData.Title + ', ' +
              'Comments: ' + object.filed[i].metaData.Comments + ', ' +
              'PostalCode: ' + object.filed[i].metaData.PostalCode + ', ' +
              'Name: ' + object.filed[i].metaData.Name + ', ' +
              'Email: ' + object.filed[i].metaData.Email + ', ' +
              'Phone: ' + object.filed[i].metaData.Phone + ', ' +
              'URL: ' + object.filed[i].Audio.url
              ;

              audioTag.innerHTML = '<audio id="audio-player" controls="controls" src= ' + object.filed[i].Audio.url + ' type="audio/mpeg">';
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
            recordContainer.appendChild(audioTag);
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

/* update the pull from the db after a admin updates or deletes from the db */
function updatePageView() { 
  window.location.reload(true);
}



