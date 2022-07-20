/**
 * Summary.     Handles the display of public files on the /listen.html route
 *               
 * Description. MetaGrab gets all required data, then metaData formats 
 *              and sends it to the page. 
 *              
 */

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
                for (i = 0; i < object.filed.length; i++) {
                    if (object.filed[i].Public) {
                        metaArr[i] = object.filed[i];
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

    for (let i = 0; i < metaArr.length; i++) {
        const project = document.createElement('p');
        project.classList.add('metaDataStyle');
        const projectNode = document.createTextNode("Project: " + metaArr[i].adminData.Project);
        project.appendChild(projectNode);
        document.getElementById("story").append(project);
        /*-----------------------------------------------------------*/
        const prompt = document.createElement('p');
        prompt.classList.add('metaDataStyle');
        const promptNode = document.createTextNode("Prompt: " + metaArr[i].adminData.Prompt);
        prompt.appendChild(promptNode);
        document.getElementById("story").append(prompt);
        /*-----------------------------------------------------------*/
        const timeStamp = document.createElement('p');
        timeStamp.classList.add('metaDataStyle');
        const timeStampNode = document.createTextNode("Timestamp: " + metaArr[i].adminData.TimeStamp);
        timeStamp.appendChild(timeStampNode);
        document.getElementById("story").append(timeStamp);
        /*-----------------------------------------------------------*/
        const title = document.createElement('p');
        title.classList.add('metaDataStyle');
        const titleNode = document.createTextNode("Title: " + metaArr[i].metaData.Title);
        title.appendChild(titleNode);
        document.getElementById("story").append(title);
        /*-----------------------------------------------------------*/
        const comment = document.createElement('p');
        comment.classList.add('metaDataStyle');
        const commentNode = document.createTextNode("Timestamp: " + metaArr[i].metaData.Comments);
        comment.appendChild(commentNode);
        document.getElementById("story").append(comment);
        /*-----------------------------------------------------------*/
        const audioTag = document.createElement('div');
        audioTag.classList.add("playStory");
        audioTag.innerHTML = '<audio id="audio-player" controls="controls" src= ' + metaArr[i].Audio.url + ' type="audio/mpeg">';
        document.getElementById("story").append(audioTag);
    }
};

setTimeout(() => metaData(), 200);