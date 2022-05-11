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

/*
old ajax code, didn't want to delete incase you want to keep it around. Feel free to delete. 
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
   */