
const http = new coreHTTP;

// Block Variables
let taskList = [];

// setup selectors
const result = document.querySelector(".result");
const input =  document.querySelector("#listitem");
const changeValue =  document.querySelector("#changename");
const addButton =  document.querySelector(".add-btn");
const delButton =  document.querySelector(".del-btn");
const changeButton =  document.querySelector(".change-btn");

// Listeners 
addButton.addEventListener("click", httpPost);
delButton.addEventListener("click", httpDelete);
changeButton.addEventListener("click", httpChange);

/* Helper Functions */
function ShowList() {
  let output = "<ul>";
  for (const itm of taskList) {
    output += `<li><input type="checkbox" id='${itm._id}' onclick="checkToggle('${itm._id}')">${itm.name}</li>`;
  }
  output += "</ul>";
  result.innerHTML = output;

  //set checked attributes
  for (const itm of taskList) {
    let checkBox = document.getElementById(itm._id);
    if (itm.completed) {
      checkBox.checked = true;
    }
  }
}

async function GetList() {
  try {
    const reqR = await http.get('/tm/tasks/');
    taskList = reqR.task;
    console.log(taskList);
    ShowList();

  } catch (error) {
    console.error('Network error:', error);
    result.innerHTML = 'Network error. Please check your connection and try again.';
  }
}

 async function checkToggle(taskId) {
  let checkBox = document.getElementById(taskId);
  console.log("check " + taskId + " " + checkBox.checked);
  try { 
    const index = taskList.findIndex(object => {
      return object._id == taskId;
    });
    // change completed value
    let requestData = {
      id: taskId,
      name: taskList[index].name, //don't change name
      completed: checkBox.checked
    };
    // update check
    let response = await http.put('/tm/tasks/', requestData);
    console.log(response);
  } catch(error) {
    console.log(error);
    return;
  }
}

// post new task
async function httpPost(e) {
  e.preventDefault();

  try {
    if (input.value) {
      // add request params and create new task
      let requestData = {
        name: input.value,
        completed: false
      };
      let response = await http.post('/tm/tasks/', requestData);
      console.log(response);
      // refresh list
      await GetList();
    } else {
      alert(`Item Name field is empty`);
    }
  } catch(error) {
    console.log(error);
    return;
  } 
}

// delete task
async function httpDelete(e) {
  e.preventDefault();

  try {
    const index = taskList.findIndex(object => {
      return object.name == input.value;
    });
    if (index !== -1) {
      // get id of inputted object
      let requestData = {
        id: taskList[index]._id
      };
      // delete task
      let response = await http.delete('/tm/tasks/', requestData);
      console.log(response);
      // refresh list
      await GetList();
    } else {
      alert(`${input.value} Not found in array`);
    }
  } catch(error) {
    console.log(error);
    return;
  }
}

async function httpChange(e) {
  // takes the value in the list and changes it
  // update the server 
  e.preventDefault();

  try {
    const index = taskList.findIndex(object => {
      return object.name == input.value;
    });
    if (index == -1) {
      alert(`${input.value} Not found in array`);
    } else if (!changeValue.value) {
      alert(`Change Name field is empty`);
    } else {
      // get id of inputted object
      let requestData = {
        id: taskList[index]._id,
        name: changeValue.value,
        completed: taskList[index].completed // don't change completed value
      };
      // change task
      let response = await http.put('/tm/tasks/', requestData);
      console.log(response);
      // refresh list
      await GetList();
    }
  } catch(error) {
    console.log(error);
    return;
  }
}

// Loading functions
function showLoading() {
  result.innerHTML = "Loading...";
}

async function main() {
  addButton.disabled = true;
  delButton.disabled = true;
  changeButton.disabled = true;
  showLoading();

  await GetList();

  addButton.disabled = false;
  delButton.disabled = false;
  changeButton.disabled = false;
}

main();