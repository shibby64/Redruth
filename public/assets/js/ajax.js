
//not currently being used

$.ajax({
    url: '/saved',
    method: "POST",
    complete: function(data) {
        var object = data.responseJSON;
        for(i = 0; i < object.length; i++){
            let recordingData = object[i].adminData;
            let audioData = object[i].Audio;
            const pr = document.createElement('p');
            const prnode = document.createTextNode("Project: " + recordingData.Project);
            pr.appendChild(prnode);
            const prelement = document.getElementById("saved" + (i+1));
            prelement.appendChild(pr);
            const e = document.createElement('p');
            e.style.backgroundColor = "cyan";
            const node = document.createTextNode("Prompt: " + recordingData.Prompt);
            e.appendChild(node);
            const element = document.getElementById("saved" + (i+1));
            element.appendChild(e);
            const ts = document.createElement('p');
            const tsnode = document.createTextNode("Timestamp: " + recordingData.TimeStamp);
            ts.appendChild(tsnode);
            const tselement = document.getElementById("saved" + (i+1));
            tselement.appendChild(ts);
            const recordingsContainer = document.getElementById("saved" + (i+1));
            const recordingElement = createRecordingElement('..\\'+audioData.url);
            console.log(audioData.url, recordingElement);
            recordingsContainer.appendChild(recordingElement);
        }
    }
  });
  