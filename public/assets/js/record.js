
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

//Recording Pages
let recordingPage = $("#recording")
let info1Page = $("#info1")
let info2Page = $("#info2")
let submittedPage = $("#submitted")
let loadingPage = $("#loading")
let aboutPage = $("#about")
let currentPage = null;

//Wavesurfer audio visualizer
let wavesurfer = WaveSurfer.create({
    container: document.querySelector('#waveform'),
    barWidth: 4,
    height: 82,
    waveColor: 'rgb(40, 43, 47)',
    progressColor: '#dee5f3',
    barRadius: 2,
    normalize: true,
    barHeight: 1,
    barGap: .3,
});

//Recording Data
let chunks = [];
let mediaRecorder = null;
let audioBlob = null;
let audioURL = null;
let formData = new FormData()

//Countdown Timer, starts paused
const countDownTimer = document.getElementById('countDownTimer');
const startingMinutes = 15; //set this variable for desired time limit
let time = startingMinutes * 60;
setInterval(countdown, 1000);
let startCountDown = false;

/**
 * Records audio using mediaDevices and mediaRecorder to start and stop. 
 * Also handles setting up audio html once audio is recorded.
 * 
 * Record gets called twice, once to start, once to stop.
 * 
 */
function record() {
    /* this seems to not be working, maybe we can find a way to update this */
    if (!navigator.mediaDevices) {
        // alert('Your browser does not support recording! We would still love to hear from you, come by and see us to tell your story');
        return;
    }

    // begin timer countdown
    startCountDown = true;

    // change button to a stop button
    // $("#recordButton").attr("style", "display:none");
    // $("#stopButton").attr("style", "display:inital");
    // $("#recordText").text("Press Again to Stop Recording");
    $("#recordText").fadeOut(200, function() {
        $(this).text("Press Again to Stop Recording").fadeIn(200);
      });
    $("#recordButton").fadeOut(200, function () { $("#stopButton").fadeIn(200) });


    if (!mediaRecorder) {
        // start recording
        navigator.mediaDevices.getUserMedia({
            audio: true,
        })
            .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                mediaRecorder.ondataavailable = function (e) {
                    chunks.push(e.data);
                };
                mediaRecorder.onstop = mediaRecorderStop;
                /* this doesn't seem to be working, need to find way to stop recording when time expires. */
                if (time < 0) {
                    clearInterval(countdown);
                    mediaRecorder.stop();
                }
            })
            .catch((err) => {
                alert(`The following error occurred: ${err}`);
            });
    } else {
        // stop recording
        mediaRecorder.stop();
        startCountDown = false; // stop countdown
        countDownTimer.innerHTML = ''; //make the counter disappear
        time = 15 * 60;
    }
}

/**
 * Stops recording and sets up an html element for audio.
 */
function mediaRecorderStop() {

    audioBlob = new Blob(chunks, { type: 'audio/mp3' });
    audioURL = window.URL.createObjectURL(audioBlob);

    // recordingPage.attr("style", "display:none")
    // info1Page.attr("style", "display:initial")
    recordingPage.fadeOut(300, function () {
        info1Page.fadeIn(300, function () {
            wavesurfer.load(audioURL);
        })
    });

    //Set up play button when ready
    wavesurfer.on('ready', function () {
        $("#playButton").attr("style", "display:initial")
        $("#playButton").on('click', function () {
            play();
        });
    });

    //If the audio reaches the end, switch button to pause.
    wavesurfer.on('finish', function () {
        pause();
    });

    //reset to default
    mediaRecorder = null;
    chunks = [];
}


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
        countDownTimer.innerHTML = `${minutes}:${seconds}`
        time--;
        time = time < 0 ? 0 : time;
    }
}


/**
 * Play audio and switch click handler to pause 
 */
function play() {
    wavesurfer.play()
    document.getElementById("playButton").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="24" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>';
    $("#playButton").on('click', function () {
        pause()
    });
}

/**
 * Pause audio and switch click handler to play 
 */
function pause() {
    wavesurfer.pause()
    document.getElementById("playButton").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="24" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"> <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/> </svg>';

    $("#playButton").on('click', function () {
        play()
    });
}

/**
 * Pause audio and switch click handler to play 
 */
 function discard() {
    if(confirm("Are you sure you want to discard your recorded audio?")){
        window.location.reload()
    }
}



//event handler for moving from info 1 to info 2
$("#info1NextButton").on('click', function () {
    if (checkInfo1()) {
        // switch to info2
        wavesurfer.stop();
        info1Page.fadeOut(300, function () { info2Page.fadeIn(300) });

        // info1Page.attr("style", "display:none")
        // info2Page.attr("style", "display:initial")
    }

});

//event handler for moving from info 1 to submission page
$("#info1SubmitButton").on('click', function () {
    if (checkInfo1()) {
        // switch to submission page
        wavesurfer.stop();
        info1Page.fadeOut(300, function () { loadingPage.fadeIn(300) });

        // info1Page.attr("style", "display:none")
        // loadingPage.attr("style", "display:initial")
        submitFormData()
    }
});

//event handler for moving from info 2 to submission page
$("#info2SubmitButton").on('click', function () {
    checkInfo2()
    // switch to submission page

    // info2Page.attr("style", "display:none")
    // loadingPage.attr("style", "display:initial")
    info2Page.fadeOut(300, function () { loadingPage.fadeIn(300) });
    submitFormData()
});

//event handler for moving from any page to an about page
$("#aboutButton").on('click', function () {
    if (recordingPage[0].style.display == "") {
        console.log("on recording page");
        currentPage = recordingPage;
    } else if (info1Page[0].style.display == "") {
        console.log("on info1Page page");
        currentPage = info1Page;
    } else if (info2Page[0].style.display == "") {
        console.log("on info2Page page");
        currentPage = info2Page;
    } else if (submittedPage[0].style.display == "") {
        console.log("on submittedPage page");
        currentPage = submittedPage; 
    }else{
        return;
    }
    
    currentPage.fadeOut(300, function () { aboutPage.fadeIn(300) });
    aboutPage.find("#backButton").on("click", function (){
        aboutPage.fadeOut(300, function () { currentPage.fadeIn(300) });
    });
});



/**
 * Checks that comments and title are filled out before moving to the next page
 * @returns true if values exist, otherwise show error message and return false
 */
function checkInfo1() {
    if ($("#comments").val() && $('#title').val()) {
        //save values to global form including audio and hidden values
        formData.append('audio', audioBlob, 'recording.mp3');

        formData.append('title', $('#title').val().trim())
        formData.append('comments', $('#comments').val().trim())
        formData.append('project', document.getElementById("projectVal").value.trim())
        formData.append('prompt', document.getElementById("prompt").value.trim())
        return true;
    } else {
        //show error message
        $('#errorMessage').attr("style", "display:initial")
        return false;
    }
}

/**
 * Adds info from info page two to the formdata, 
 * no checking needed because these values are optional.
 */
function checkInfo2() {
    //save values to global form, no need to check for null
    formData.append('fullName', $('#name').val().trim())
    formData.append('email', $('#email').val().trim())
    formData.append('phone', $('#phone').val().trim())
    formData.append('postCode', $('#post').val().trim())
}


/**
 * If the response is 200 (good), then we transition to the submitted page, 
 * otherwise alert and refresh.
 * 
 * This is called when user hits a submit button.
 */
function submitFormData() {
    for (const [key, value] of formData) {
        console.log(`${key}: ${value}\n`);
    }
    let request = fetch('/insert', {
        method: 'POST',
        body: formData,
    }).then(response => {
        //if our response is good, then redirect to saved
        if (response.status == 200) {
            // alert("Your Recording Saved!")
            // loadingPage.attr("style", "display:none")
            // submittedPage.attr("style", "display:initial")
            loadingPage.fadeOut(300, function () { submittedPage.fadeIn(300) });
        } else if (response.status == 401) {
            alert("Invalid passkey selection recording not saved, try again");
        } else {
            throw "request failed";
        }
    }).catch((error) => {
        //otherwise alert then refresh
        alert("Sorry! Something broke on our end!")
        window.location.assign('/');
    });
}



