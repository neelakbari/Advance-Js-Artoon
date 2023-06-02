// Load subtasks from local storage when the page loads
window.addEventListener("DOMContentLoaded", loadSubtasksFromLocalStorage);

//function to generate random id
function randomIdGenerator() {
  return new Date().getTime().toString();
}

// Add title to subtask
const selectedTaskId = localStorage.getItem("selectedTaskId");
const selectedTaskName = localStorage.getItem("selectedTaskName");

// Set the task name as the title on the next page
const taskTitleElement = document.getElementById("taskTitle");
taskTitleElement.textContent = selectedTaskName;

//add subTasks
function addSubtask() {
  const subTaskId = randomIdGenerator();
  const subTaskInput = document.querySelector("#subtaskInput");
  const subTaskName = subTaskInput.value;

  //function to create tasks
  if (subTaskName.trim() !== "") {
    createSubTask(subTaskId, subTaskName);
    subTaskInput.value = "";
  }

  //save Subtasks to local Storage
  saveSubTasksToLocalStorage();
}
function createSubTask(subTaskId, subTaskName) {
  const subTaskInput = document.querySelector(".inputSection");
  const subTaskList = document.getElementById("subtaskList");
  // subTaskList.insertAdjacentHTML("afterbegin",'<div class = "microTaskContainer"></div>')

  const microTaskDiv = document.createElement("div");
  microTaskDiv.classList.add("microTaskContainer");
  microTaskDiv.dataset.subTaskId = subTaskId;

  const microTaskTitle = document.createElement("h3");
  microTaskTitle.classList.add("microTaskTitle");
  microTaskTitle.textContent = subTaskName;

  const microTaskInput = document.createElement("input");
  microTaskInput.addEventListener("blur",()=>{addMicroTask(subTaskId)})
  // microTaskInput.setAttribute("value","asdas");
  // microTaskInput.setAttribute("id","microTaskInput");

  const microTaskList = document.createElement("ul");
  microTaskList.classList.add("microTaskList");

  const deleteButton = document.createElement("span");
  deleteButton.classList.add("deleteButton");
  deleteButton.innerHTML = "\u00d7";
  deleteButton.addEventListener("click", deleteTask);

  microTaskDiv.append(microTaskTitle);
  microTaskDiv.append(microTaskInput);
  microTaskDiv.append(microTaskList);
  microTaskDiv.append(deleteButton);

  subTaskList.insertBefore(microTaskDiv, subTaskInput);
  // microTaskDiv.before(subTaskInput);
  // console.log(subTaskInput);
}

//delete subTask
function deleteTask(event){
    const microTaskDiv = event.target.parentElement;
    const subTaskId = microTaskDiv.dataset.subTaskId
    console.log(subTaskId)
    microTaskDiv.remove();

    //remove it from local storage
    removeSubTaskFromLocalStorage(subTaskId)
}
//remove it from local Storage

function removeSubTaskFromLocalStorage(id){
  const subTasks = Array.from(JSON.parse(localStorage.getItem(selectedTaskId)));
let updatedSubTasks = subTasks.filter(res=>res.id !==id)
localStorage.setItem(selectedTaskId, JSON.stringify(updatedSubTasks));
}

// Save the subtask list to local storage
function saveSubTasksToLocalStorage() {
  const subTasks = Array.from(document.querySelectorAll(".microTaskContainer"));
  let subTaskList = subTasks.map((res) => {
    return {
      id: res.dataset.subTaskId,
      name: res.querySelector(".microTaskTitle").textContent,
    };
  });
  console.log(subTaskList);
  localStorage.setItem(selectedTaskId, JSON.stringify(subTaskList));
}

//load item from Local Storage
function loadSubtasksFromLocalStorage() {
  const subTasks = Array.from(JSON.parse(localStorage.getItem(selectedTaskId)));
  subTasks.forEach((element) => {
    createSubTask(element.id, element.name);
  });
}


//micro Tasks List 

//addMicroTask
function addMicroTask (uniqueValue){
 const microTaskInput = document.querySelector(`.microTaskContainer[data-sub-task-id="${uniqueValue}"] input`);
 const microTaskName = microTaskInput.value
 if (microTaskName.trim() !== "") {
  const microTaskList = microTaskInput.nextElementSibling;
  const microTaskItem = document.createElement('li');
  microTaskItem.classList.add('microTaskItem')
  microTaskItem.textContent = microTaskName;
  microTaskList.appendChild(microTaskItem)
  // console.log(microTaskList)

   microTaskInput.value = ""
 }
}
