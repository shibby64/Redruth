
//updatePrompt();
recordingPrompts();
getCurrentCollection()

// function updatePrompt() {
//     var queryStr = window.location.search;
//     const showP = document.getElementsByClassName('showPrompt');
//     const promptInput = document.getElementById('prompt');
//     fetch('/prompt' + queryStr, {  method: 'GET' })
//         .then(res => res.json())
//         .then(res => {
//             try {
//                 Array.from(showP).forEach(element => {
//                     element.innerText = res.prompt;
//                 });
//             } catch (error) {
//                 console.error(error);
//             }
//             promptInput.value = res.prompt_id;
//         });
// }
const promptList = [];

function recordingPrompts() {
    var selection = document.getElementById('recordPrompts');
    fetch('/prompts' , { method: 'POST' })
        .then((object) => object.json())
        .then((prompts) => {
            for (i = 0; i < prompts.results.length; i++) {
                const dropdownhtmlList = document.createElement("li");
                const dropdownhtmlB = document.createElement("button");
                //const dropdownhtmlBA = document.createElement("a");
                dropdownhtmlB.setAttribute("class", "dropdown-item")
                dropdownhtmlB.setAttribute("id", "dropdown-styling")
                //dropdownhtmlBA.setAttribute("href", 'localhost:3000/?promptid=' + prompts.results[i].prompt_id)
                // dropdownhtmlBA.innerHTML = prompts.results[i].prompt;
                dropdownhtmlB.setAttribute('value', prompts.results[i].prompt_id);
                if (prompts.results[i].prompt.length >= 52) {
                    dropdownhtmlB.innerHTML = prompts.results[i].prompt.substring(0, 53) + '...';
                } else {
                    dropdownhtmlB.innerHTML = prompts.results[i].prompt;
                }
                dropdownhtmlList.append(dropdownhtmlB);
                if (prompts.results[i].prompt_id !== 1 &&  prompts.results[i].prompt != 'Placeholder prompt') {
                    if (!prompts.results[i].deleted_flg) {
                        if (prompts.results[i].prompt !== sessionStorage.getItem('currentPrompt')) {
                            selection.append(dropdownhtmlList);
                        }
                    }
                }
                promptList.push(prompts.results[i]);
                var current = document.getElementById('currentPromptList').innerHTML;
                if (getURLParam() === '') {
                    sessionStorage.setItem('currentPrompt', '' + 'Choose a prompt!');
                    // if (prompts.results[i].public_flg) {
                    //     //alert(prompts.results[i].prompt_id);
                    //     //getURLParam();
                    //     //document.getElementById('prompt_id_val').innerHTML = prompts.results[i].prompt_id;
                    //     //window.location.href = "https://readingroom.herokuapp.com/?promptid=" + prompts.results[i].prompt_id;
                    //     //sessionStorage.setItem('currentPrompt', '' + prompts.results[i].prompt);
                    //     sessionStorage.setItem('currentPrompt', '' + 'Choose a prompt!');
                    //     //document.getElementById('prompt').value =  sessionStorage.getItem('currentID');
                    //     //document.getElementById('prompt').setAttribute("value", sessionStorage.getItem('currentID'));
                    // }
                }
                dropdownhtmlB.addEventListener('click', function(event) {
                    //alert(dropdownhtmlB.getAttribute('value'));
                    for (var i = 0; i < promptList.length; i++) {
                        if (promptList[i].prompt_id == dropdownhtmlB.getAttribute('value')) {
                            //alert(prompts.results[i].prompt_id);
                            document.getElementById('prompt_id_val').innerHTML = promptList[i].prompt_id;
                            sessionStorage.setItem('currentPrompt', '' + promptList[i].prompt);
                            window.location.href = "https://readingroom.herokuapp.com/?promptid=" + promptList[i].prompt_id;
                            getURLParam();
                        }
                    }
                  })
                document.getElementById('currentPromptList').innerHTML = sessionStorage.getItem('currentPrompt');
            }
        })
}

function getCurrentCollection() {
    var project = document.getElementById('project');
    fetch('/currentCollectionPrompt', { method: 'GET' })
        .then((object) => object.json())
        .then((collection) => {
            // alert(collection.results[0].title)
            project.innerHTML = collection.results[0].title;
        })
}

function getURLParam() {
    var sPageURL = window.location.search.substring(10);
    sessionStorage.setItem("currentID", sPageURL);
    document.getElementById('prompt').value =  sessionStorage.getItem('currentID');
    document.getElementById('prompt').setAttribute("value", sessionStorage.getItem('currentID'));
    //alert("sub " + document.getElementById('prompt').value);
    return sPageURL;
  }