
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
//changeButton.addEventListener("click", httpChange);

/* Helper Functions */
function ShowList() {
  let output = "<ul>";
  for (const itm of taskList) {
    output += `<li>${itm.name} - ${itm.completed}</li>`;
  }
  output += "</ul>";
  result.innerHTML = output;
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

/*async function WriteTasks(requestData) { 
  try {
    let response = await http.post('/tm/tasks/', requestData);
    await GetList();
    console.log(response);
    return;
  }
  catch(error) {
    console.log(error);
    return;
  }
}*/

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