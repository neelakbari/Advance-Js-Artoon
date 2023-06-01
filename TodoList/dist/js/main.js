//load tasks from LocalStorage on page load
window.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

//function to generate random id
function randomIdGenerator() {
  return Math.floor(Math.random() * 10000);
}

//Add task
function addTask() {
  const taskInput = document.querySelector("#taskInput");
  const taskName = taskInput.value;
  if (taskName.trim() !== "") {
    const taskId = randomIdGenerator();
    createTask(taskId, taskName);
    taskInput.value = "";
  }
  //save in local storage
  setTimeout(() => {
    saveTasksToLocalStorage();
  }, 5000);
}

// create Task
function createTask(taskId, taskName) {
  const taskList = document.querySelector("#taskList");

  const taskDiv = document.createElement("div");
  taskDiv.classList.add("tasks");
  taskDiv.dataset.taskId = taskId;

  //create random image
  const randomImage = document.createElement("img");
  randomImage.setAttribute("id", taskId);
  fetchRandomImage(taskId);

  const taskTitle = document.createElement("span");
  taskTitle.classList.add("taskTitle");
  taskTitle.textContent = taskName;

  const deleteButton = document.createElement("span");
  deleteButton.classList.add("deleteButton");
  deleteButton.innerHTML = "\u00d7";
  deleteButton.addEventListener("click", deleteTask);
  taskDiv.append(randomImage);
  taskDiv.append(taskTitle);
  taskDiv.append(deleteButton);
  taskList.append(taskDiv);
}
//API call for random image
function fetchRandomImage(id) {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then((response) => response.json())
    .then((data) => {
      const imageUrl = data.message;
      const image = document.getElementById(id);
      image.src = imageUrl;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//delete Task
function deleteTask(event) {
  let taskItem = event.target.parentElement;
  let taskId = taskItem.dataset.taskId;
  taskItem.remove();

  //remove it from local storage
  removeTaskFromLocalStorage(taskId);
}

//remove task from local Storage

function removeTaskFromLocalStorage(id){
    const tasks = Array.from(JSON.parse(localStorage.getItem("taskList")));
    const updatedTasks = tasks.filter((task)=>task.id !== id)
    localStorage.setItem('taskList',JSON.stringify(updatedTasks))
}

//save Task to Local Storage
function saveTasksToLocalStorage() {
  const tasks = Array.from(document.querySelectorAll(".tasks"));
  let taskList = tasks.map((res) => {
    return {
      id: res.dataset.taskId,
      name: res.querySelector("span").textContent,
      src: res.querySelector("img").src,
    };
  });
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

//load item from Local Storage
function loadTasksFromLocalStorage() {
  const tasks = Array.from(JSON.parse(localStorage.getItem("taskList")));
  tasks.forEach((element) => {
    loadTask(element.id, element.name, element.src);
  });
}

// load Task

function loadTask(taskId, taskName, src) {
  const taskList = document.querySelector("#taskList");

  const taskDiv = document.createElement("div");
  taskDiv.classList.add("tasks");
  taskDiv.dataset.taskId = taskId;

  const randomImage = document.createElement("img");
  randomImage.setAttribute("id", taskId);
  randomImage.src = src;

  const taskTitle = document.createElement("span");
  taskTitle.classList.add("taskTitle");
  taskTitle.textContent = taskName;

  const deleteButton = document.createElement("span");
  deleteButton.classList.add("deleteButton");
  deleteButton.innerHTML = "\u00d7";
  deleteButton.addEventListener("click", deleteTask);
  taskDiv.append(randomImage);
  taskDiv.append(taskTitle);
  taskDiv.append(deleteButton);
  taskList.append(taskDiv);
}
