const recordButton = document.getElementById('story');
let metaArr = [];


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

metaGrab();
console.log(metaArr);
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
        const ts = document.createElement('p');
        ts.classList.add('metaDataStyle');
        const tsnode = document.createTextNode("Timestamp: " + metaArr[i].adminData.TimeStamp);
        ts.appendChild(tsnode);
        document.getElementById("story").append(ts);
        /*-----------------------------------------------------------*/

        const audioTag = document.createElement('div');
        audioTag.classList.add("playStory");
        audioTag.innerHTML = '<audio id="audio-player" controls="controls" src= ' + metaArr[i].Audio.url + ' type="audio/mpeg">';
        document.getElementById("story").append(audioTag);
    }
};

    setTimeout(() => metaData(), 200);