// Load subtasks from local storage when the page loads
window.addEventListener("DOMContentLoaded", loadSubtasksFromLocalStorage);

// // Load subtasks from local storage when the page loads
window.addEventListener("DOMContentLoaded", loadMicroTasksFromLocalStorage);
// localStorage.clear();
//function to generate random id
function randomIdGenerator(num) {
  return new Date().getTime().toString() + num;
}

// Add title to subtask
const selectedTaskId = localStorage.getItem("selectedTaskId");
// console.log(selectedTaskId)
const selectedTaskName = localStorage.getItem("selectedTaskName");

// Set the task name as the title on the next page
const taskTitleElement = document.getElementById("taskTitle");
taskTitleElement.textContent = selectedTaskName;

//add subTasks
function addSubtask() {
  const subTaskId = randomIdGenerator(1);
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
  microTaskDiv.setAttribute("ondrop","drop(event)");
  microTaskDiv.setAttribute("ondragover","allowDrop(event)");
  microTaskDiv.dataset.subTaskId = subTaskId;

  const microTaskTitle = document.createElement("h3");
  microTaskTitle.classList.add("microTaskTitle");
  microTaskTitle.textContent = subTaskName;

  const microTaskInput = document.createElement("input");
  microTaskInput.addEventListener("blur", () => {
    addMicroTask(subTaskId);
  });
  const microTaskList = document.createElement("ul");
  microTaskList.classList.add("microTaskList");
  microTaskList.dataset.microTaskId = subTaskName;

  // microTaskInput.setAttribute("value","asdas");
  // microTaskInput.setAttribute("id","microTaskInput");

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
function deleteTask(event) {
  const microTaskDiv = event.target.parentElement;
  const subTaskId = microTaskDiv.dataset.subTaskId;
  console.log(subTaskId);
  microTaskDiv.remove();

  //remove it from local storage
  removeSubTaskFromLocalStorage(subTaskId);
}
//remove it from local Storage

function removeSubTaskFromLocalStorage(id) {
  const subTasks = Array.from(JSON.parse(localStorage.getItem(selectedTaskId)));
  let updatedSubTasks = subTasks.filter((res) => res.id !== id);
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
function addMicroTask(uniqueValue) {
  const microTaskInput = document.querySelector(
    `.microTaskContainer[data-sub-task-id="${uniqueValue}"] input`
  );
  const microTaskName = microTaskInput.value;
  const microTaskList = microTaskInput.nextElementSibling;

  const microTaskId = microTaskList.getAttribute("data-micro-task-id");

  //function to create microTasks
  if (microTaskName.trim() !== "") {
    createMicroTask(microTaskName, microTaskId);
    microTaskInput.value = "";
  }
  // save data into local storage
  // addMicroTaskToLocalStorage(uniqueValue, microTaskList);
}
//create microTasks
function createMicroTask(microTaskName, microTaskId) {
  const microTaskList = document.querySelector(
    `[data-micro-task-id="${microTaskId}"]`
  );
  // console.log(microTaskList)
  const microTaskItem = document.createElement("li");
  microTaskItem.classList.add("microTaskItem");
  microTaskItem.setAttribute('draggabble',"true")
  microTaskItem.setAttribute('ondragstart',"drag(event)")
  microTaskItem.textContent = microTaskName;
  iconHTML(microTaskItem);
  microTaskList.appendChild(microTaskItem);
  // microTaskDiv.append(microTaskList)
  // console.log(microTaskList)
  //select the icon and add event listner to that
  const completed = Array.from(document.querySelectorAll("span.tickIcon"));
  completed.forEach((task) => {
    task.addEventListener("click", done);
  });

  const deleteMicro = Array.from(document.querySelectorAll("span.crossIcon"));
  deleteMicro.forEach((task) => {
    task.addEventListener("click", deleteMicroTask);
  });
  // save data into local storage
  addMicroTaskToLocalStorage(microTaskId);
}
//add Icon HTML
function iconHTML(parent) {
  const iconWrapper = document.createElement("div");
  iconWrapper.classList.add("iconWrapper");
  const tick = document.createElement("span");
  tick.classList.add("tickIcon");
  tick.innerHTML = "&#x2713";
  iconWrapper.append(tick);

  const cross = document.createElement("span");
  cross.classList.add("crossIcon");
  cross.innerHTML = "&#x2715";
  iconWrapper.append(cross);
  parent.append(iconWrapper);
}

//Completed micro task
function done(event) {
  console.log(event);
  let li = event.target.parentElement.parentElement;
  li.classList.contains("done")
    ? li.classList.remove("done")
    : li.classList.add("done");
}

//delete deleteMicroTask
function deleteMicroTask(event) {
  let li = event.target.parentElement.parentElement;
  li.remove();


}
//remove it from local Storage

// function removeSubTaskFromLocalStorage(id) {
//   const subTasks = Array.from(JSON.parse(localStorage.getItem(selectedTaskId)));
//   let updatedSubTasks = subTasks.filter((res) => res.id !== id);
//   localStorage.setItem(selectedTaskId, JSON.stringify(updatedSubTasks));
// }
// function to save data to local storage
function addMicroTaskToLocalStorage(microTaskId) {
  const ul = document.querySelector(`[data-micro-task-id="${microTaskId}"]`);
  console.log(ul);
  const microTasks = Array.from(ul.querySelectorAll("li")).map((microTask) => {
    const textNode = microTask.firstChild;
    return textNode.textContent.trim();
  });
  const obj = { id: microTaskId, data: microTasks };
  console.log(obj);
  localStorage.setItem(microTaskId, JSON.stringify(obj));
  console.log(microTaskId);
  // localStorage.setItem(microTaskId, JSON.stringify(obj));

  // const microTasks = Array.from(document.getElementsByTagName("li")).map(
  //   (microTask) => {
  //     const textNode = microTask.firstChild;
  //     return textNode.textContent.trim();
  //   }
  // );
  // const obj = { id: uniqueValue, data: microTasks };
  // console.log(obj);
  // localStorage.setItem(uniqueValue, JSON.stringify(obj));
  // console.log(uniqueValue);
  // loadmicroTasksFromLocalStorage()
}
//load item from Local Storage
function loadMicroTasksFromLocalStorage() {
  const microTaskContainer = Array.from(
    document.querySelectorAll(".microTaskList")
  );

  const collection = microTaskContainer.map((res) => {
    const id = res.getAttribute("data-micro-task-id");
    return id;
  });
  console.log(collection);
  collection.forEach((res) => {
    const local = JSON.parse(localStorage.getItem(res));
    // console.log(local.data)
    local.data.forEach((res)=>{
      console.log(res)
      createMicroTask(res,local.id)
    })
  });

  // const subTasks = Array.from(JSON.parse(localStorage.getItem(selectedTaskId)));
  // subTasks.forEach((element) => {
  //   createSubTask(element.id, element.name);
  // });
}


function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text/plain');
  const draggableElement = document.getElementById(data);
  console.log(data)
  const dropzone = event.target;
  const parentList = dropzone.closest('ul');
  console.log(parentList)

  // Reorder the list items
  if (draggableElement.parentNode === parentList) {
    const items = Array.from(parentList.children);
    const currentIndex = items.indexOf(draggableElement);
    const dropIndex = Array.from(dropzone.parentNode.children).indexOf(dropzone);
    if (currentIndex < dropIndex) {
      parentList.insertBefore(draggableElement, dropzone.nextSibling);
    } else {
      parentList.insertBefore(draggableElement, dropzone);
    }
  }
}