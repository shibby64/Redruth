/**
 * Summary.     Handles the listing of audio files and metadata on the admin side, 
 *              the admin is able to publicise audio and delete audio. 
 *              The page currently lists only private files. 
 * 
 * Description. Calls getRecordings() to list all audio files from /saved route 
 *              then sets up html to display files neatly.
 *
 */


const prompts = new Set();
let recordings = [];
let filteredRecordings = [];
let collections = [];

getRecordings();
getCollections();
getCurrentCollection();


/**
 * Grab recording records in the database 
 *  
 */
async function getRecordings() {
  fetch('/saved', { method: 'POST' })
    .then((object) => object.json())
    .then((object) => {
      if (object.success && object.results) {
        // for all objects set up cards and add to various arrays
        for (i = 0; i < object.results.length; i++) {
          recordings.push(object.results[i]);
          createCard(object.results[i]);
          prompts.add(object.results[i].prompt)
        }
      }
    })
    .then((object) => {prompts.forEach(createListElement)})
    .catch((err) => console.error(err));
};

/**
 * Grab collection names 
 *  
 */
async function getCollections() {
  //console.log("here");
  //const curColID = await fetch('/currentCollection', {method: 'GET'})
  //  .then(response => response.json())
  //  .then(response => response[0].collection_id);
  //console.log(curColID);
  fetch('/collections', { method: 'GET' })
    .then((object) => object.json())
    .then((object) => {
      if (object.success && object.results) {
        object.results.forEach(collection => {
          //if (collection) {//.collection_id === curColID) { // TODO currently uses the last created prompt as the default. will eventually need to query t_admin_cache with the user_id 
          //  document.getElementById("current").innerHTML = "Current Collection: <i>" +  collection.title + "</i>";
          //}
          collections.push(collection.title)
        });
      }
    })
    .then((object) => {collections.forEach(createCollectionDropdownItem)})
    .catch((err) => console.error(err));
};

async function getCurrentCollection() {
  fetch('/currentCollection', { method: 'GET' })
    .then((object) => object.json())
    .then((collection) => {
      if (collection.success && collection.results) {
        document.getElementById("current").innerHTML = collection.results[0].title;
      }
    });
    //.then(updatePageView());
}


/**
 * Updates the input#collectionsUpdate's value to whatever the user clicked on in the dropdown
 * @param htmlElement the onclick passes the html element clicked
 */
function currentCollectionUpdate(htmlElement){
  //document.getElementById("current").value = htmlElement.innerText
  fetch('/swapCurrentCollection', { method: 'GET' })
    .then((object) => object.json())
    .then((collection) => {
      if (collection.success && collection.results) {
        document.getElementById("current").innerHTML = collection.results[0].title;
      }
    });
  updatePageView();
}

/**
 * Updates the input#promptUpdate's value to whatever the user clicked on in the dropdown
 * @param htmlElement the onclick passes the html element clicked
 */
function currentPromptUpdate(htmlElement){
  document.getElementById("promptUpdate").value = htmlElement.innerText
}


/**
 * Handles the creation of both the dropdown on the update prompt box and the option list in the filter box
 * called multiple times for each item in the lists
 * @param {String} collectionPrompt 
 */
function createListElement(collectionPrompt){
  //update prompt dropdown
  const dropdownhtmlList = document.createElement("li");
  const dropdownhtmlA = document.createElement("a");
  dropdownhtmlA.setAttribute("class", "dropdown-item")
  dropdownhtmlA.setAttribute("onclick", "currentPromptUpdate(this)")
  dropdownhtmlA.innerText = collectionPrompt
  dropdownhtmlList.append(dropdownhtmlA)
  document.getElementById("dropdown-menu").append(dropdownhtmlList)

  //update filter dropdown
  const htmlNode = document.createElement("option");
  htmlNode.setAttribute('value', collectionPrompt)
  htmlNode.innerText = collectionPrompt
  document.getElementById("selectPrompt").append(htmlNode)
}

/**
 * Handles the creation of the dropdown on the collection prompt box
 * called multiple times for each item in the lists
 * @param {String} collectionName 
 */
function createCollectionDropdownItem(collectionName){
  //update collection dropdown
  const dropdownhtmlList = document.createElement("li");
  const dropdownhtmlB = document.createElement("button");
  dropdownhtmlB.setAttribute("class", "dropdown-item")
  dropdownhtmlB.setAttribute("name", "newCollection")
  dropdownhtmlB.setAttribute("value", collectionName)
  dropdownhtmlB.innerText = collectionName
  dropdownhtmlList.append(dropdownhtmlB)
  document.getElementById("collections-dropdown-menu").append(dropdownhtmlList)
}

/*function createPromptItem(object) {
  const htmlListItem = document.createElement("li");
  const htmlNode = document.createElement("div");
  htmlNode.setAttribute('id', object.prompt_id)
  htmlNode.setAttribute('class', "col item")
  var newPromptItem = $('#promptTemplate').clone().attr("id", object.prompt_id);

}*/

/**
 * Takes the selected value and filters the list of recordings.
 * Called when filter by collection select onchange.
 * 
 * @param selected item  
 */
function filterPrompt(selected){
  // if no filter show all
  if (selected.value == "") {
    $(".item").remove();
    recordings.forEach(recording => {
      createCard(recording)
    });
    return;
  }

  filteredRecordings = [];
  recordings.forEach(recording => {
    if (recording.prompt == selected.value) {
      filteredRecordings.push(recording)
    }
  });
  $(".item").remove();

  filteredRecordings.forEach(recording => {
    createCard(recording)
  });

}

/**
 * takes a database item and creates necessary html in order to display a card 
 * @param object -- single db object from getCollection
 */
function createCard(object) {
  //setup some initial card details
  const htmlNode = document.createElement("div");
  htmlNode.setAttribute('id', object._id)
  htmlNode.setAttribute('class', "col item")
  //Clone the hidden template from the html
  var newCard = $('#cardTemplate').clone().attr("id", object.file_id);

  //append new info from object
  newCard.find(".card-title").text(object.title)
  newCard.find(".timestamp").text(object.timestamp)
  newCard.find(".card-text").text(object.remarks)
  newCard.find(".cardID").text("file_id: " + object.file_id)

  let num = 6;
  newCard.find("#prompt").text("Prompt: " + object.prompt)
  if (object.postal_code) {
    newCard.find("#postal").text("Postal Code: " + object.postal_code)
  } else {
    newCard.find("#postal").remove();
    num--;
  }

  if (object.name) {
    newCard.find("#name").text("Name: " + object.name)
  } else {
    newCard.find("#name").remove();
    num--;
  }

  if (object.email) {
    newCard.find("#email").text("Email: " + object.email)
  } else {
    newCard.find("#email").remove();
    num--;
  }

  if (object.phone_num) {
    newCard.find("#phone").text("Phone: " + object.phone_num)
  } else {
    newCard.find("#phone").remove();
    num--;
  }
  newCard.find(".badge").text("" + num)

  newCard.find("#url").attr("href", object.filepath)
  newCard.find("#audio-player").attr("src", object.filepath);



  newCard.find("#collapseButton").attr("href", "#collapse" + object.file_id);
  newCard.find("#collapseButton").attr("aria-controls", "collapse" + object.file_id);
  newCard.find("#collapse").attr("id", "collapse" + object.file_id);

  //wire up buttons, delete and public/unpublic
  //if object is public, then button says unpublic
  var publicButton = newCard.find("#publicButton")
  if (object.public_flg) {
    publicButton.attr("class", "btn btn-danger public")
    publicButton.text("Make Private")
    publicButton.attr("onclick", "makePrivate('" + object.file_id + "')")
  } else {
    publicButton.attr("class", "btn btn-success public")
    publicButton.text("Make Public")
    publicButton.attr("onclick", "makePublic('" + object.file_id + "')")
  }

  newCard.find("#trashButton").attr("onclick", "deleteRecording('" + object.file_id + "')")
  //append the new html to the container
  htmlNode.innerHTML = newCard[0].innerHTML;
  document.getElementById("collectionContainer").appendChild(htmlNode);
}

/* update the pull from the db after a admin updates or deletes from the db */
function updatePageView() {
  window.location.reload(true);
}

/**
 * sets the recording to public using its id
 * get request to /updatePublic with name updatePublic and a value of the id
 * if we dont get 200 back, then we have a problem and should not switch the button to public 
 * @param  id  
 */
function makePublic(id) {
  console.log(id);
  let promise = fetch("/updatePublic?updatePublic=" + id);
  promise.then(response => {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      err = new Error("Not 200")
      throw err;
    } else {
      var publicButton = $('#' + id + " #publicButton")
      publicButton.attr("class", "btn btn-danger public")
      publicButton.text("Make Private")
      //set the onclick
      publicButton.attr("onclick", "makePrivate('" + id + "')")
    }
  }).catch(function (err) {
    throw err;
  });
}

/**
 * sets the recording to private using its id
 * get request to /removePublic with name takeOffSite and value of the id
 * if we dont get 200 back, then we have a problem and should not switch the button to public 
 * @param  id  
 */
function makePrivate(id) {
  console.log(id);
  let promise = fetch("/removePublic?takeOffSite=" + id);

  promise.then(response => {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      err = new Error("Not 200")
      throw err;
    } else {
      console.log("Button says public");
      var publicButton = $('#' + id + " #publicButton")
      publicButton.attr("class", "btn btn-success public")
      publicButton.text("Make Public")
      //set the onclick
      publicButton.attr("onclick", "makePublic('" + id + "')")
    }
  }).catch(function (err) {
    throw err;
  });
}

/**
 * Deletes recording from the database
 * TODO: add a confirmation screen?
 * @param  id 
 */
function deleteRecording(id) {
  console.log(id);
  let promise = fetch("/deleteRecord?deletePublic=" + id);

  promise.then(response => {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      err = new Error("Not 200")
      throw err;
    } else {
      console.log("Recording Deleted");
      var card = $('#' + id)
      card.fadeOut(300, function () { $(this).remove(); });
    }
  }).catch(function (err) {
    throw err;
  });
}