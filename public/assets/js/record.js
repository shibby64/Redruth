
/**
 * Summary.     Handles recording of audio on the homepage of the website. 
 *              Details about aws, checkbox, modal, and passwords are all 
 *              split out to different files. 
 * 
 * Description. The record() function is called when #recordButton is 
 *              clicked in the html. once the user stops the recording, 
 *              mediaRecorderStop() is called and the audio element is 
 *              appended to the html.
 * 
 *              When the submit button is pressed, the saveRecording() 
 *              function is called posting to /record and redirecting 
 *              the user to /saved.html when complete
 *
 */

/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
// initialize elements we'll use
const recordButton = document.getElementById('recordButton');
const recordButtonImage = recordButton.firstElementChild;
const recordedAudioContainer = document.getElementById('recordedAudioContainer');
const saveAudioButton = document.getElementById('saveButton');
// saveAudioButton.setAttribute('onclick', "window.location.assign('/saved.html')");
const discardAudioButton = document.getElementById('discardButton');
discardAudioButton.setAttribute('onclick', 'recordReset()')



let chunks = []; // will be used later to record audio
let mediaRecorder = null; // will be used later to record audio
let audioBlob = null; // the blob that will hold the recorded audio


function mediaRecorderDataAvailable(e) {
    chunks.push(e.data);
}


/**
 * Stops recording and sets up an html element for audio.
 */
function mediaRecorderStop() {
    // check if there are any previous recordings and remove them
    if (recordedAudioContainer.firstElementChild.tagName === 'AUDIO') {
        recordedAudioContainer.firstElementChild.remove();
    }
    const audioElm = document.createElement('audio');
    audioElm.setAttribute('controls', ''); // add controls
    audioBlob = new Blob(chunks, { type: 'audio/mp3' });
    const audioURL = window.URL.createObjectURL(audioBlob);
    audioElm.src = audioURL;
    // show audio
    recordedAudioContainer.insertBefore(audioElm, recordedAudioContainer.firstElementChild);
    recordedAudioContainer.classList.add('d-flex');
    recordedAudioContainer.classList.remove('d-none');
    // reset to default
    mediaRecorder = null;
    chunks = [];
}

/**
 * Records audio using mediaDevices and mediaRecorder to start and stop. 
 * Also handles setting up audio html once audio is recorded.
 * 
 */
function record() {
    /* this seems to not be working, maybe we can find a way to update this */
    if (!navigator.mediaDevices) {
        // alert('Your browser does not support recording! We would still love to hear from you, come by and see us to tell your story');
        return;
    }

    // browser supports getUserMedia
    // change image in button
    startCountDown = true; //begin timer countdown
    recordButtonImage.src = `/images/${mediaRecorder && mediaRecorder.state === 'recording' ? 'microphone' : 'stop'}.png`;
    if (!mediaRecorder) {
        // start recording
        navigator.mediaDevices.getUserMedia({
                audio: true,
            })
            .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                mediaRecorder.ondataavailable = mediaRecorderDataAvailable;
                mediaRecorder.onstop = mediaRecorderStop;
                /* this doesn't seem to be working, need to find way to stop recording when time expires. */
                if (time < 0) {
                    clearInterval(countdown);
                    mediaRecorder.stop();
                }
            })
            .catch((err) => {
                alert(`The following error occurred: ${err}`);
                // change image in button
                recordButtonImage.src = '/images/microphone.png';
            });
    } else {
        // stop recording
        mediaRecorder.stop();
        startCountDown = false; // stop countdown
        countDownTimer.innerHTML = ''; //make the counter disappear
        time = 15 * 60;
    }
}

/* line that calls recording to start when user clicks microphone jpg */
recordButton.addEventListener('click', record);

/* variables for setting time limit */
const startingMinutes = 15; //set this variable for desired time limit
let time = startingMinutes * 60;

/* grabbing html element */
const countDownTimer = document.getElementById('countDownTimer');
setInterval(countdown, 1000);
let startCountDown = false;

/**
 * setInterval calls this to set recording limit, 
 * does not run unless we start the countdown with
 * startCountDown.
 * 
 */
function countdown() {
    if (startCountDown) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        countDownTimer.innerHTML = `${minutes}: ${seconds}`
        time--;
        time = time < 0 ? 0 : time;
    }
}

/**
 * Removes audio hmtl and hides container. Deletes audioBlob.
 */
function resetRecording() {
    if (recordedAudioContainer.firstElementChild.tagName === 'AUDIO') {
        recordedAudioContainer.firstElementChild.remove();
        // hide recordedAudioContainer
        recordedAudioContainer.classList.add('d-none');
        recordedAudioContainer.classList.remove('d-flex');
    }
    audioBlob = null;
}

/**
 * Wrapper for resetRecording with confirm dialogue.
 * Also resets form entry
 */
discardAudioButton.onclick = function() {
    if (confirm('Are you sure you want to discard the recording?')) {
        resetRecording();
        document.forms[0].reset()
    }
}


/**
 * Compiles formdata and adds audio file, then posts to route
 * if the response is 200, then we redirect to saved.html, 
 * otherwise alert and refresh.
 * 
 * This is a submit handler for the first form on the page (the main form)
 */
document.forms[0].onsubmit = async(e) => {
    e.preventDefault();
    //to prevent the user from submitting multiple times, we disable the button
    saveAudioButton.disabled = true;
    formData = new FormData(document.forms[0])
    formData.append('audio', audioBlob, 'recording.mp3');
    //print form data
    for (const [key, value] of formData) {
        console.log(`${key}: ${value}\n`);
    }
    update();
    let request = fetch('/insert', {
        method: 'POST',
        body: formData,
    }).then(response => {
        //if our response is good, then redirect to saved
        if (response.status == 200) {
            // alert("Your Recording Saved!")
            window.location.assign('/saved.html');
        } else if(response.status == 401) {
            alert("Invalid passkey selection recording not saved, try again");
        } else {
            throw "request failed";
        }
    }).catch((error) => {
        //otherwise alert then refresh
        alert("Sorry! Something broke on our end!")
        window.location.assign('/');
    });
};
function update() {
    var bar = document.getElementById("progressBar");
    var status = document.getElementById("Progress_Status");
    var text = document.getElementById("loadText");

    status.style.display = "block";
    text.style.display = "block";
    var width = 1;
    var identity = setInterval(scene, 10);
    function scene() {
      if (width >= 100) {
        clearInterval(identity);
        update();
      } else {
        width++; 
        bar.style.width = width  + "%"; 
        bar.innerHTML = width + "%";
      }
    }
  }
