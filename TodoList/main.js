// Load tasks from local storage when the page loads
window.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

// Generate random ID for tasks
function generateRandomId() {
  return Math.floor(Math.random() * 10000);
}

// Create a task with a random image and subtasks
// function createTask(taskId, taskName) {
//   const taskContainer = document.getElementById("taskContainer");
//   const taskDiv = document.createElement("div");
//   taskDiv.classList.add("task");

//   // Create a random image
//   const randomImage = document.createElement("img");
//   randomImage.src = "https://via.placeholder.com/50"; // Replace with your image URL
//   randomImage.addEventListener("click", function () {
//     navigateToNextPage(taskName);
//   });

//   // Create the task name element
//   const taskNameElement = document.createElement("span");
//   taskNameElement.textContent = taskName;

//   // Append the image and task name to the task div
//   taskDiv.appendChild(randomImage);
//   taskDiv.appendChild(taskNameElement);

//   // Create a subtask input field
//   //   const subtaskInput = document.createElement("input");
//   //   subtaskInput.type = "text";
//   //   subtaskInput.placeholder = "Enter a subtask";
//   //   subtaskInput.addEventListener("keydown", function (event) {
//   //     if (event.key === "Enter") {
//   //       addSubtask(taskId, subtaskInput.value);
//   //       subtaskInput.value = "";
//   //     }
//   //   });

//   // Create a subtask list
//   const subtaskList = document.createElement("ul");
//   subtaskList.classList.add("subtask-list");

//   // Append the subtask input and list to the task div
//     // taskDiv.appendChild(subtaskInput);
//   taskDiv.appendChild(subtaskList);

//   // Append the task div to the task container
//   taskContainer.appendChild(taskDiv);
// }

// Save the task list to local storage
// function saveTasksToLocalStorage() {
//   const tasks = Array.from(document.querySelectorAll(".task"));
//   const taskList = tasks.map((task) => ({
//     id: task.dataset.taskId,
//     name: task.querySelector("span").textContent,
//     subtasks: Array.from(task.querySelectorAll(".subtask-list li")).map(
//       (subtask) => subtask.textContent
//     ),
//   }));
//   localStorage.setItem("taskList", JSON.stringify(taskList));
// }
// Load the task list from local storage
// function loadTasksFromLocalStorage() {
//   const taskList = localStorage.getItem("taskList");
//   if (taskList) {
//     const parsedTaskList = JSON.parse(taskList);
//     parsedTaskList.forEach((task) => {
//       createTask(task.id, task.name)
//     });
//   }
// }
// Navigate to the next page with the task name as the parameter


function navigateToNextPage(event) {
  // Replace this with your own logic to navigate to the next page
  // For example:
//   window.location.href = `subtasks.html?task=${encodeURIComponent(taskName)}`;
  const taskItem = event.target.parentElement;
  const taskId = taskItem.dataset.taskId;
  const taskName = taskItem.querySelector('.task-title').textContent;
  console.log(taskName)

  // Save the task ID and task name to local storage
  localStorage.setItem('selectedTaskId', taskId);
  localStorage.setItem('selectedTaskName', taskName);

  // Navigate to the next page
  window.location.href = `subtasks.html?task=${encodeURIComponent(taskName)}`;
}

// Add a task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskName = taskInput.value;
    if (taskName.trim() !== '') {
      const taskId = generateRandomId();
      createTask(taskId, taskName);
      taskInput.value = '';
  
      // Save the updated task list to local storage
      saveTasksToLocalStorage();
    }
     
  }
  
  // Delete a task
  function deleteTask(event) {
    const taskItem = event.target.parentElement;
    const taskId = taskItem.dataset.taskId;
    taskItem.remove();
  
    // Remove the task from local storage
    removeTaskFromLocalStorage(taskId);
  }
  
  // Remove a task from local storage
  function removeTaskFromLocalStorage(taskId) {
    const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('taskList', JSON.stringify(updatedTasks));
  }
  
 
  
  // Create a task element
  function createTask(taskId, taskName) {
    const taskList = document.getElementById('taskList');
  
    const taskItem = document.createElement('div');
    taskItem.classList.add('task');
    taskItem.dataset.taskId = taskId;
  
    // Create a random image
  const randomImage = document.createElement("img");
  randomImage.src = "https://via.placeholder.com/50"; // Replace with your image URL
  randomImage.addEventListener("click", navigateToNextPage);
  
    const taskTitle = document.createElement('span');
    taskTitle.textContent = taskName;
    taskTitle.classList.add("task-title")
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', deleteTask);
  
    taskItem.appendChild(randomImage);
    taskItem.appendChild(taskTitle);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
  }
  
  // Load tasks from local storage
  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('taskList')) ;
    tasks.forEach(task => {
      createTask(task.id, task.name);
    });
  }
  
  // Save the task list to local storage
  function saveTasksToLocalStorage() {
    const tasks = Array.from(document.querySelectorAll('.task'));
    const taskList = tasks.map(task => ({
      id: task.dataset.taskId,
      name: task.querySelector('span').textContent
    }));
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }
  



// Get the task name and ID from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams)
const taskId = urlParams.get('taskId');
const taskName = urlParams.get('taskName');
console.log(taskId)
// const taskTitleElement = document.getElementById('taskTitle');
// taskTitleElement.textContent = taskName;

// Load subtasks from local storage when the page loads
window.addEventListener('DOMContentLoaded', loadSubtasksFromLocalStorage);

// Add a subtask to the list
// function addSubtask() {
//   const subtaskInput = document.getElementById('subtaskInput');
//   const subtaskName = subtaskInput.value;
//   if (subtaskName.trim() !== '') {
//     const subtaskList = document.getElementById('subtaskList');
//     const subtaskItem = document.createElement('li');
//     subtaskItem.textContent = subtaskName;
//     subtaskList.appendChild(subtaskItem);
//     subtaskInput.value = '';

//     // Save the updated subtask list to local storage
//     saveSubtasksToLocalStorage(subtaskList);
//   }
// }

// Delete a subtask from the list
function deleteSubtask(event) {
  const subtaskItem = event.target.parentElement;
  const subtaskList = document.getElementById('subtaskList');
  subtaskList.removeChild(subtaskItem);

  // Save the updated subtask list to local storage
  saveSubtasksToLocalStorage(subtaskList);
}

// Save the subtask list to local storage
// function saveSubtasksToLocalStorage(subtaskList) {
//   const subtasks = Array.from(subtaskList.getElementsByTagName('li')).map(subtask => subtask.textContent);
//   localStorage.setItem(taskId, JSON.stringify(subtasks));
// }

// Load subtasks from local storage
// function loadSubtasksFromLocalStorage() {
//   const subtaskList = document.getElementById('subtaskList');
//   const subtasks = JSON.parse(localStorage.getItem(taskId));
//   if (subtasks) {
//     subtasks.forEach(subtask => {
//       const subtaskItem = createSubtaskItem(subtask);
//       subtaskList.appendChild(subtaskItem);
//     });
//   }
// }

// Create a subtask item with delete button
// function createSubtaskItem(subtask) {
//   const subtaskItem = document.createElement('li');
//   subtaskItem.textContent = subtask;

//   const deleteButton = document.createElement('button');
//   deleteButton.textContent = 'Delete';
//   deleteButton.addEventListener('click', deleteSubtask);

//   subtaskItem.appendChild(deleteButton);
//   return subtaskItem;
// }








// Get the selected task ID and task name from local storage
const selectedTaskId = localStorage.getItem('selectedTaskId');
const selectedTaskName = localStorage.getItem('selectedTaskName');

// Set the task name as the title on the next page
const taskTitleElement = document.getElementById('taskTitle');
taskTitleElement.textContent = selectedTaskName;

// Load subtasks from local storage when the page loads
window.addEventListener('DOMContentLoaded', loadSubtasksFromLocalStorage);

// Add a subtask to the list
function addSubtask() {
  const subtaskInput = document.getElementById('subtaskInput');
  const subtaskName = subtaskInput.value;
  if (subtaskName.trim() !== '') {
    const subtaskList = document.getElementById('subtaskList');
    const subtaskItem = document.createElement('li');
    subtaskItem.textContent = subtaskName;
    subtaskList.appendChild(subtaskItem);
    subtaskInput.value = '';

    // Save the updated subtask list to local storage
    saveSubtasksToLocalStorage(subtaskList);
  }
}

// Save the subtask list to local storage
function saveSubtasksToLocalStorage(subtaskList) {
  const subtasks = Array.from(subtaskList.getElementsByTagName('li')).map(subtask => subtask.textContent);
  localStorage.setItem(selectedTaskId, JSON.stringify(subtasks));
}

// Load subtasks from local storage
function loadSubtasksFromLocalStorage() {
  const subtaskList = document.getElementById('subtaskList');
  const subtasks = JSON.parse(localStorage.getItem(selectedTaskId));
  if (subtasks) {
    subtasks.forEach(subtask => {
      const subtaskItem = createSubtaskItem(subtask);
      subtaskList.appendChild(subtaskItem);
    });
  }
}

// Create a subtask item with delete button
function createSubtaskItem(subtask) {
  const subtaskItem = document.createElement('li');
  subtaskItem.textContent = subtask;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', deleteSubtask);

  subtaskItem.appendChild(deleteButton);
  return subtaskItem;
}
