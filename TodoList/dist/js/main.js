//load tasks from LocalStorage on page load
window.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

//function to generate random id
function randomIdGenerator() {
  return Math.floor(Math.random() * 10000);
}
const mainBtn = document.querySelector('#TaskBtn')
mainBtn.addEventListener('click',addTask)

// Add an event listener to the input field for the Enter key
const taskInput = document.querySelector("#taskInput");
taskInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission
    mainBtn.click(); // Trigger the button click event
  }
});

//Add task
function addTask(e) {
  console.log(e.key)

  const taskInput = document.querySelector("#taskInput");
  const taskName = taskInput.value;
  if (e.keyCode === 13 || taskName.trim() !== "") {
    const taskId = randomIdGenerator();
    createTask(taskId, taskName);
    taskInput.value = "";
  }
  //save in local storage
  setTimeout(() => {
    saveTasksToLocalStorage();
  }, 2000);
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
  // onclick event listener to navigate
  randomImage.addEventListener('click',navigateToNextPage)

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
  // onclick event listener to navigate
  randomImage.addEventListener('click',navigateToNextPage)
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

//Navigate to next page

function navigateToNextPage(event) {
  const taskItem = event.target.parentElement;
  const taskId = taskItem.dataset.taskId;
  const taskName = taskItem.querySelector('.taskTitle').textContent;

  // Save the task ID and task name to local storage
  localStorage.setItem('selectedTaskId', taskId);
  localStorage.setItem('selectedTaskName', taskName);

  // Navigate to the next page
  window.location.href = `subtasks.html?task=${encodeURIComponent(taskName)}`;
}