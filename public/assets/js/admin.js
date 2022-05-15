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
console.log(metaArr);
function metaGrab(){
  fetch('/metaArr', {method : 'POST'})
  .then((object) => object.json())
  .then((object) => {
    if (object.success && object.filed) {
      for(i = 0; i < object.filed.length; i++){
        metaArr[i] = object.filed[i];
      }
    }
  })
  .catch((err) => console.error(err));
}


/* grab records in the database and filter by ones that are not public */
function getCollections() {
    fetch('/saved', { method: 'POST' })
        .then((object) => object.json())
        .then((object) => {
            //console.log(object.filed)
            if (object.success && object.filed) {
                for (i = 0; i < object.filed.length; i++) {
                    let isPublic = object.filed[i].Public;
                    console.log(isPublic);
                    /* filter by records with a false public flag */
                    if (!isPublic) {
                        console.log("found false flag");
                        var dataContainer = document.getElementById('collections');

                        /* id */
                        var showId = document.createElement('div');
                        showId.innerHTML = '_id: ' + object.filed[i]._id;
                        var id = object.filed[i]._id;

                        /* admin data */
                        var ad = document.createElement('div');
                        ad.innerHTML =
                            'Collection: ' + object.filed[i].adminData.Project + ',  ' +
                            'prompt: ' + object.filed[i].adminData.Prompt + ',  ' +
                            'timeStamp: ' + object.filed[i].adminData.TimeStamp + ',  '

                            ;
                        /* audio */
                        var audio = document.createElement('div');
                        audio.innerHTML =
                            'url: ' + object.filed[i].Audio.url;

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
                        var submitButton = document.createElement('button');
                        submitButton.type = 'submit';
                        submitButton.value = id;
                        submitButton.innerHTML = 'Add to public site';
                        submitButton.name = 'updatePublic';

                        /* create delete form */
                        var deleteForm = document.createElement('form');
                        deleteForm.action = '/deleteRecord';
                        deleteForm.method = 'get';
                        deleteForm.name = 'delete';

                        /* create delete record button */
                        var deleteButton = document.createElement('button');
                        deleteButton.type  = 'submit';
                        deleteButton.value = id;
                        deleteButton.innerHTML = 'Delete this record';
                        deleteButton.name = 'deletePublic';                        

                        /* create html */
                        dataContainer.appendChild(showId);
                        dataContainer.appendChild(ad);
                        dataContainer.appendChild(audio);
                        dataContainer.appendChild(meta);
                        dataContainer.appendChild(updateForm);
                        updateForm.appendChild(submitButton);
                        dataContainer.appendChild(deleteForm);
                        deleteForm.appendChild(deleteButton);
                        dataContainer.appendChild(space);
                    }
                }
            }
        })
        .catch((err) => console.error(err));
};

setTimeout(() => getCollections(), 100);

function fetchRecordings() {

    fetch('/recordings')
        
        .then((response) => response.json())
        .then((response) => {
            console.log("fetch recordings");
            if (response.success && response.files) {
                recordingsContainer.innerHTML = ''; // remove all children
                recordingsContainer.classList.add('col-lg-2');
                response.files.forEach((file) => {
                    for(i =0; i < metaArr.length; i++){
                    if(file.substring(1, 14) === metaArr[i].Audio.url.substring(8, 21) && !metaArr[i].Public){
                        const recordingElement = createRecordingElement(file, i);
                        placeholder[i] = file.substring(1, 14);
                        recordingElement.classList.add('col-lg-2');
                        recordingsContainer.appendChild(recordingElement);
                    }
                    }
                });
            }
        })
    .catch((err) => console.error(err));
}
function createRecordingElement(file, i) {
    const recordingElement = document.createElement('div');
    let k = 0;
    if(k === 0){
      recordingElement.classList.add("slider-item", 'active');
      k++;
    } else {
      recordingElement.classList.add("slider-item");
    }
    recordingElement.setAttribute('id', 'cont' + i)
    const audio = document.createElement('audio');
    //audio.classList.add('col-lg-2');
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
function metaData(){
    for(i =0; i<metaArr.length; i++){
        for(j=0; j<placeholder.length; j++){
            if(metaArr[i].Audio.url.substring(8, 21) === placeholder[j]){
                let recordingData = metaArr[i].adminData;
                const project = document.createElement('p');
                project.classList.add('metaDataStyle');
                const projectNode = document.createTextNode("Project: " + recordingData.Project);
                project.appendChild(projectNode);
                const projectElement = document.getElementById('cont' + j);
                projectElement.appendChild(project);
                const prompt = document.createElement('p');
                prompt.classList.add('metaDataStyle');
                prompt.style.backgroundColor = "cyan";
                const promptNode = document.createTextNode("Prompt: " + recordingData.Prompt);
                prompt.appendChild(promptNode);
                const promptElement = document.getElementById('cont' + j);
                promptElement.appendChild(prompt);
                const ts = document.createElement('p');
                ts.classList.add('metaDataStyle');
                const tsnode = document.createTextNode("Timestamp: " + recordingData.TimeStamp);
                ts.appendChild(tsnode);
                const tselement = document.getElementById('cont' + j);
                tselement.appendChild(ts);
            }
        }
    }
};
    fetchRecordings();
    setTimeout(() => metaData() , 200);