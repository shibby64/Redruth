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
                let publicStories = [];
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
        if (publicStories[m].metaData.PostalCode !== "") {
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
};

// setTimeout(() => metaData(), 200);