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
      // Display number of audio files
      document.getElementById("fileCount").innerHTML = "Number of files: " + object.results.length;
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
  // const dropdownhtmlList = document.createElement("li");
  // const dropdownhtmlA = document.createElement("a");
  // dropdownhtmlA.setAttribute("class", "dropdown-item")
  // dropdownhtmlA.setAttribute("onclick", "currentPromptUpdate(this)")
  // dropdownhtmlA.innerText = collectionPrompt
  // dropdownhtmlList.append(dropdownhtmlA)
  // document.getElementById("dropdown-menu").append(dropdownhtmlList)

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
 * Default sort recordings in order of timestamp
 * Set prompt filter global variable
 * 
 * @param selected item  
 */

var promptFilt;

function filterPrompt(selected){
  var name = selected.value;
  promptFilt = name;
  filter(name); 
}

/**
 * Sets global variable for chosen metadata filter
 * If metadata filter chosen before prompt filter, make prompt filter all prompts
 * 
 * @param selected -- selected metadata filter  
 */

var metaFilt;

function metaFilter(selected) {
  // If prompt filter hasn't been selected, make it all prompts
  if (typeof promptFilt === "undefined") {
    promptFilt = "";
  }
  // Set global variable and run filter
  metaFilt = selected.value;
  filter(promptFilt)
}

/**
 * Uses metadata filter selected to create sorted array
 * 
 *   
 */

function dataFilter() {
  const array1 = new Array();
  const array2 = new Array();
  // If title metadata filter selected
  if (metaFilt == "title") {
    // Create array of db objects and array of titles
    for(var i = 0; i < recordings.length; i++) {
      array1.push(recordings[i]); 
      array2.push(recordings[i].title); 
    }
    // Sort titles array
    array2.sort((a, b) => a.localeCompare(b));
    // Return db objects in sorted order
    return compare("title", array1, array2);
  } else if (metaFilt == "time_recent") {
    // sort by timestamp, displaying oldest first
    for(var i = 0; i < recordings.length; i++) {
      array1.push(recordings[i]); 
      array2.push(recordings[i].timestamp); 
    }
    // Sort the timestamps
    array2.sort();
    array2.sort(function(a, b){
        const date1 = new Date(a);
        const date2 = new Date(b);
        
        return date1 - date2;
    });
    array2.reverse();
    // Return db objects in sorted order
    return compare("time_recent", array1, array2);
  } else {
    // Default sort by timestamp
    for(var i = 0; i < recordings.length; i++) {
      array1.push(recordings[i]); 
      array2.push(recordings[i].timestamp); 
    }
    // Sort the timestamps
    array2.sort();
    array2.sort(function(a, b){
        const date1 = new Date(a);
        const date2 = new Date(b);
        
        return date1 - date2;
    });
    // Return db objects in sorted order
    return compare("", array1, array2);
  }
}

/**
 * Actually does the prompt filtering
 * Allows for use by filterPrompt and search
 *  
 * @param name -- name of desired prompt filter
 */

function filter(name) {
  // Get array of db objects in desired sorted order
  const sorted = dataFilter();
  var count = 0;
 
   // if no filter show all, sort by metadata filter
   if (name == "") {
     $(".item").remove();
     sorted.forEach(object => {
       recordings.forEach(recording => {
         if (object.timestamp == recording.timestamp && object.file_id == recording.file_id) {
           count++;
           createCard(recording);
         }
       });
     });
     // Display number of audio files
     document.getElementById("fileCount").innerHTML = "Number of files: " + count;
     return;
   }
 
   // else sort items by prompt and metadata filter
   filteredRecordings = [];
   recordings.forEach(recording => {
     if (recording.prompt == name) {
       filteredRecordings.push(recording)
     }
   });
   $(".item").remove();
 
   // Track number of audio files in prompt and display
   sorted.forEach(object => {
    filteredRecordings.forEach(recording => {
      if (object.file_id == recording.file_id) {
        count++;
        createCard(recording);
      }
    });
  });

  // Display number of audio files
  document.getElementById("fileCount").innerHTML = "Number of files: " + count;
}

/**
 * Helper function for filter
 * Compares array of sorted items to db objects
 *  
 * @param type -- metadata filter
 * @param stuff -- array of db objects
 * @param times -- array of sorted timestamps
 */

function compare(type, array1, array2) {
  const sorted = new Array();
  if (!array1 || !array2) return 
  // If title filter selected
  if (type == "title") {
    var count = 0;
    // Check for matching titles to create sorted order
    for (var i = 0; i < array1.length; i++) {
      array1.forEach(item => {
        if (item.title == array2[count]) {
          sorted.push(item);
          count++;
        }
      });
    }
  } else if (type == "time_recent") {
    var count = 0;
    // Check for matching timestamps to create sorted order
    for (var i = 0; i < array1.length; i++) {
      array1.forEach(item => {
        if (item.timestamp == array2[count]) {
          sorted.push(item);
          count++;
        }
      });
    }
  } else {
    var count = 0;
    // Check for matching timestamps to create sorted order
    for (var i = 0; i < array1.length; i++) {
      array1.forEach(item => {
        if (item.timestamp == array2[count]) {
          sorted.push(item);
          count++;
        }
      });
    }
  }
  // Remove item duplicates
  return sorted.filter((item,
    index) => sorted.indexOf(item) === index);
}


/**
 * Receives the title search value and filters the list of recordings.
 * Called when event listener submit button pressed
 * 
 */ 

var submit = document.getElementById("searchSubmit");
submit.addEventListener('click', search);

function search() {
  // If prompt filter hasn't been selected, make it all prompts
  if (typeof promptFilt === "undefined") {
    promptFilt = "";
  }

  document.getElementById("noResult").innerHTML = "";
  let count = 0;
  // get search input
  var input = document.getElementById("searchInput").value;
  // if blank input, display all by prompt input value
  if (input == "") {
    var name = document.getElementById("selectPrompt").value;
    filter(name);
    return;
  }

  promptRecordings = [];
  // If there is one, keep prompt filter for search
  if (promptFilt != "") {
    recordings.forEach(recording => {
      if (recording.prompt == promptFilt) {
        promptRecordings.push(recording)
      }
    });
  } else {
    recordings.forEach(recording => {
      promptRecordings.push(recording)
    });
  }

  filteredRecordings = [];
  // filter recordings with matching title to search input
  // track total incase of no match
  promptRecordings.forEach(recording => {
    if (recording.title.toLowerCase() == input.toLowerCase()) {
      filteredRecordings.push(recording);
      count++;
    }
  });
  $(".item").remove();
  // create a card for each recording
  filteredRecordings.forEach(recording => {
    createCard(recording)
  });
  // Display number of audio files
  document.getElementById("fileCount").innerHTML = "Number of files: " + count;
  // if no recordings match title value, inform user
  if (count == 0) {
    document.getElementById("noResult").innerHTML = "No file named '" + input + "' found.";
  }
}

/**
 * takes a database item and creates necessary html in order to display a card 
 * @param object -- single db object from getCollection
 */
function createCard(object) {
  //setup some initial card details
  const htmlNode = document.createElement("div");
  htmlNode.setAttribute('id', object.file_id)
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
  if (object.public_flg == 1) {
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
      document.location.reload();
    }
  }).catch(function (err) {
    throw err;
  });
}