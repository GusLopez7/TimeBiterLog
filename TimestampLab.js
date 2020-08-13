let devMode = true; //For Testing.
let inputTxt = document.getElementById("inputTxt");
let btn = document.getElementById("btn");
let index = document.getElementsByClassName("index");
let resetBtn = document.getElementById("resetBtn");
let eventArray = [];
let storageName = Boolean(devMode) ? "events33" : "events";
let dateOptions = {
  weekday: "short", year: "numeric", month: "short",
  day: "numeric", hour: "2-digit", minute: "2-digit"
};

let logScreen = document.getElementById("logScreen");
const mainContainer = document.querySelector('.container'); //Finds by class

// Main method for entering a line.
btn.addEventListener("click", function () {
  let logTime = new Date().toLocaleTimeString("en-us", dateOptions);
  if (inputTxt.value != "") {
    eventArray.unshift({ time: logTime, event: inputTxt.value });
    //drawLog uses the newly modified eventArray to re-draw (and re-enumerate) the output list
    drawLog();
  }
  inputTxt.value = "";
  saveToLocal();
}
);

function saveToLocal() {
  localStorage[storageName] = JSON.stringify(eventArray);
}

// This is used to redraw the screen if nothing has been entered.
function fetchLocal() {
  if (storageName in localStorage) {
    var retrievedEvents = localStorage.getItem(storageName);
    eventArray = JSON.parse(retrievedEvents);
    drawLog();
  }
};

function drawLog() {
  let logContainer = document.createElement('div');
  logContainer.className = 'logContainer';
  let logList = document.createElement('table');
  let counter = 0;
  eventArray.forEach(function (i) {
    let listItem = document.createElement('tr');
    let itemTime = document.createElement('td');
    let itemEvent = document.createElement('td');

    itemTime.setAttribute('contenteditable', true);
    itemTime.textContent = i.time + '\t';
    itemTime.setAttribute('id', 'time_' + counter);
    itemEvent.setAttribute('contenteditable', true);
    itemEvent.textContent = i.event;

    listItem.setAttribute('id', counter);
    listItem.appendChild(itemTime);
    listItem.appendChild(itemEvent);
    listItem.className = 'index';
    logList.appendChild(listItem);
    // add listener to each time . Function is called only on Blur.
    itemTime.addEventListener("blur", function (event) {
      updateTime(i, event.target); // Changed from this to event.target
    });
    itemEvent.addEventListener("blur", function (event) {
      updateEvent(i, event.target); // Changed from this to event.target
    });
    counter++;
  });
  logContainer.appendChild(logList);
  if (document.querySelector('.logContainer')) {
    mainContainer.replaceChild(logContainer, document.querySelector('.logContainer'));
  } else {
    mainContainer.appendChild(logContainer);
  }
}

//This is like an update Row.
function updateTime(i, rowElement) {
  let isChange = false;
  eventArray.forEach(function (y) {
    if (y.time == i.time && y.time != rowElement.textContent) {
      isChange = true;
      y.time = rowElement.textContent; //replaces Array entry with changes made.
    }
  });
  if (isChange == true) {
    saveToLocal();
    fetchLocal();
  };
}

//This is like an update Row.
function updateEvent(i, rowElement) {
  let isChange = false;
  eventArray.forEach(function (y) {
    if (y.event == i.event && y.event != rowElement.textContent) {
      isChange = true;
      y.event = rowElement.textContent; //replaces Array entry with changes made.
    }
  });
  if (isChange == true) {
    saveToLocal();
    fetchLocal();
  };
}

// This is in case there's a return, which acts the same as a click.
inputTxt.addEventListener("keydown", function () {
  if (event.keyCode === 13) {
    btn.click();
  }
});


resetBtn.addEventListener("click", function () {
  if (storageName in localStorage) {
    localStorage.removeItem(storageName);
    location.reload(true);
  }
});
window.onload = fetchLocal();