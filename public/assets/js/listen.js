/**
 * Summary.     Handles the display of public files on the /listen.html route
 *               
 * Description. MetaGrab gets all required data, then metaData formats 
 *              and sends it to the page. 
 *              
 */
 const recordingsContainer = document.getElementById('story');
let metaArr = [];

/**
 * Asks /metaArr for required data and 
 * sends it to metaArr for later use
 */
function metaGrab() {
    fetch('/metaArr', { method: 'POST' })
        .then((object) => object.json())
        .then((object) => {
            if (object.success && object.filed) {
                let j = 0;
                for (i = 0; i < object.filed.length; i++) {
                    if (object.filed[i].Public) {
                        metaArr[j] = object.filed[i];
                        j++;
                    }
                }
            }
        })
        .catch((err) => console.error(err));
}

metaGrab();
console.log(metaArr);

/**
 * Used for setting up html for display on the page
 */
function metaData() {
    const project = document.createElement('h4');
        project.classList.add('metaDataStyle', 'project');
        const projectNode = document.createTextNode("Project: " + metaArr[0].adminData.Project);
        project.appendChild(projectNode);
        recordingsContainer.append(project);
        /*-----------------------------------------------------------*/
        const prompt = document.createElement('h6');
        prompt.classList.add('metaDataStyle', 'prompt');
        const promptNode = document.createTextNode("Prompt: " + metaArr[0].adminData.Prompt);
        prompt.appendChild(promptNode);
        recordingsContainer.append(prompt);
    for (let m = 0; m < metaArr.length; m++) {
        const recordingElement = document.createElement('div');
        if(m === 0){
            recordingElement.classList.add("slider-item", 'active');
        } else {
            recordingElement.classList.add("slider-item");
        }
        recordingElement.setAttribute('id', 'cont' + m)
        /*-----------------------------------------------------------*/
        const title = document.createElement('p');
        title.classList.add('metaDataStyle');
        const titleNode = document.createTextNode("* Title: " + metaArr[m].metaData.Title);
        title.appendChild(titleNode);
        recordingElement.append(title);
        /*-----------------------------------------------------------*/
        const comment = document.createElement('p');
        comment.classList.add('metaDataStyle');
        const commentNode = document.createTextNode("* Comments: " + metaArr[m].metaData.Comments);
        comment.appendChild(commentNode);
        recordingElement.append(comment);
        /*-----------------------------------------------------------*/
        const timeStamp = document.createElement('p');
        timeStamp.classList.add('metaDataStyle');
        const timeStampNode = document.createTextNode("* Timestamp: " + metaArr[m].adminData.TimeStamp);
        timeStamp.appendChild(timeStampNode);
        recordingElement.append(timeStamp);
        /*-----------------------------------------------------------*/
        const audioTag = document.createElement('div');
        audioTag.classList.add("playStory");
        audioTag.innerHTML = '<audio id="audio-player" controls="controls" src= ' + metaArr[m].Audio.url + ' type="audio/mpeg">';
        recordingElement.append(audioTag);
        recordingsContainer.append(recordingElement);
    }
};

setTimeout(() => metaData(), 200);