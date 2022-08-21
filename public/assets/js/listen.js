/**
 * Summary.     Handles the display of public files on the /listen.html route
 *               
 * Description. MetaGrab gets all required data, then metaData formats 
 *              and sends it to the page. 
 *              
 */

const recordingsContainer = document.getElementById('story');

//run metaGrab on load
metaGrab();

let publicStories = [];
/**
 * Asks /metaArr for required data and 
 * sends it to metaArr for later use
 */
function metaGrab() {
    fetch('/metaArr', { method: 'POST' })
        .then((object) => object.json())
        //filter the public items
        .then((object) => {
            if (object.success && object.filed) {
                let j = 0;
                
                //for every element in recieved data, get public items and add to publicStories
                for (i = 0; i < object.filed.length; i++) {
                    if (object.filed[i].Public) {
                        publicStories[j] = object.filed[i];
                        j++;
                    }
                }
                return publicStories
            }
        //then set up html
        }).then((object) => {
            metaData(object)
        })
        .catch((err) => console.error(err));
}
let wavesurfer = WaveSurfer.create({
    container: document.querySelector('#waveform2'),
    barWidth: 4,
    height: 82,
    waveColor: 'rgb(40, 43, 47)',
    progressColor: '#dee5f3',
    barRadius: 2,
    normalize: true,
    barHeight: 1,
    barGap: .3,
    backend: 'MediaElement',
    mode: 'no-cors'
});
// export { stories, wavesurfer};
/**
 * Used for setting up html for display on the listen page
 */
function metaData(publicStories) {
    const project = document.createElement('h4');
    project.classList.add('metaDataStyle', 'project');
    const projectNode = document.createTextNode("Project: " + publicStories[0].adminData.Project);
    project.appendChild(projectNode);
    recordingsContainer.append(project);
    /*-----------------------------------------------------------*/
    const prompt = document.createElement('h6');
    prompt.classList.add('metaDataStyle', 'prompt');
    const promptNode = document.createTextNode("Prompt: " + publicStories[0].adminData.Prompt);
    prompt.appendChild(promptNode);
    recordingsContainer.append(prompt);

    for (let m = 0; m < publicStories.length; m++) {
        const recordingElement = document.createElement('div');
        if (m === 0) {
            recordingElement.classList.add("slider-item", 'slide-indicator', 'active');
        } else {
            recordingElement.classList.add("slider-item", 'slide-indicator');
        }
        recordingElement.setAttribute('id', 'cont' + m)
            /*-----------------------------------------------------------*/
        const title = document.createElement('p');
        title.classList.add('metaDataStyle');
        const titleNode = document.createTextNode("* Title: " + publicStories[m].metaData.Title);
        title.appendChild(titleNode);
        recordingElement.append(title);
        /*-----------------------------------------------------------*/
        const comment = document.createElement('p');
        comment.classList.add('metaDataStyle');
        const commentNode = document.createTextNode("* Comments: " + publicStories[m].metaData.Comments);
        comment.appendChild(commentNode);
        recordingElement.append(comment);
        /*-----------------------------------------------------------*/
        const timeStamp = document.createElement('p');
        timeStamp.classList.add('metaDataStyle');
        const timeStampNode = document.createTextNode("* Timestamp: " + publicStories[m].adminData.TimeStamp);
        timeStamp.appendChild(timeStampNode);
        recordingElement.append(timeStamp);
        /*-----------------------------------------------------------*/
        if (publicStories[m].metaData.PostalCode !== null && publicStories[m].metaData.PostalCode !== "") {
            const postCode = document.createElement('p');
            postCode.classList.add('metaDataStyle');
            const postCodeNode = document.createTextNode("* Post Code: " + publicStories[m].metaData.PostalCode);
            postCode.appendChild(postCodeNode);
            recordingElement.append(postCode);
        }
        /*---------------------------------------------------------- */
        const audioTag = document.createElement('div');
        audioTag.classList.add("playStory");
        audioTag.innerHTML = '<audio id="audio-player" controls="controls" src= ' + publicStories[m].Audio.url + ' type="audio/mpeg">';
        recordingElement.append(audioTag);
        /*---------------------------------------------------------- */
        const prv = document.getElementById('prv');
        const nxt = document.getElementById('nxt');
        const pnum = document.getElementById('postNumber');
        recordingsContainer.append(recordingElement);
        recordingsContainer.appendChild(prv);
        recordingsContainer.appendChild(nxt);
    }
    
    // console.log(publicStories[0].Audio.url);
    wavesurfer.load(""+ publicStories[0].Audio.url);
    //Set up play button when ready
    wavesurfer.on('ready', function () {
        $("#playButton2").attr("style", "display:initial")
        $("#playButton2").on('click', function () {
            play();
        });
    });

    //If the audio reaches the end, switch button to pause.
    wavesurfer.on('finish', function () {
        pause();
    });


};

// setTimeout(() => metaData(), 200);

function play() {
    wavesurfer.play()
    document.getElementById("playButton2").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="24" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>';
    $("#playButton2").on('click', function () {
        pause()
    });
}

/**
 * Pause audio and switch click handler to play 
 */
function pause() {
    wavesurfer.pause()
    document.getElementById("playButton2").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="24" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"> <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/> </svg>';

    $("#playButton2").on('click', function () {
        play()
    });
}