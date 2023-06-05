// Load subtasks from local storage when the page loads
window.addEventListener("DOMContentLoaded", renderSubTasks);

// // Load subtasks from local storage when the page loads
// window.addEventListener("DOMContentLoaded", renderSubTasks);
// window.addEventListener("DOMContentLoaded", ()=>{

//   localStorage.clear()
// });

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

//var
var subTasks = JSON.parse(localStorage.getItem(selectedTaskId)) || [];
let editSubTaskId = -1;
// renderSubTasks();
// addlistener();

const subTaskSubmitButton = document.querySelector("#subTaskSubmitButton");
subTaskSubmitButton.addEventListener("click", () => {
  addsubtask();
  renderSubTasks();

  //save to the local storage
  localStorage.setItem(selectedTaskId, JSON.stringify(subTasks));
  // subTasks.forEach(subtask => {
    
  //   localStorage.setItem(subtask.id, JSON.stringify(subtask.value));
  // });
});

//subtask
function addsubtask() {
  const subTaskInput = document.querySelector("#subtaskInput");
  const subTaskName = subTaskInput.value;
  const subTaskId = randomIdGenerator();
  const isDuplicate = subTasks.some(
    (todo) => todo.value.toUpperCase() === subTaskName.toUpperCase()
  );
  if (subTaskName.trim() === "") {
    alert("task cannot be empty");
  } else if (isDuplicate) {
    alert("Duplicate Task Not allowed");
  } else if (editSubTaskId >= 0) {
    //update the edited todo
    subTasks = subTasks.map((subtask, index) => {
      return {
        ...subtask,
        value: index === editSubTaskId ? subTaskName : subtask.value,
      };
    });
    editSubTaskId = -1;
    subTaskInput.value = "";
  } else {
    const subtask = {
      id: subTaskId,
      value: subTaskName,
    };
    subTasks.push(subtask);
    // console.log(subTasks);
    subTaskInput.value = "";
  }
}

//render subtasks
function renderSubTasks() {
  // const subTaskInput = document.querySelector(".inputSection");
  const subTaskList = document.getElementById("subtaskList");

  // console.log(subTasks)
  subTaskList.innerHTML = ``;
  subTasks.forEach((subtask) => {
    subTaskList.innerHTML += `
    <div
    class="microTaskContainer"
    ondrop="drop(event)"
    ondragover="allowDrop(event)"
    data-sub-task-id="${subtask.id}"
    >
    <h3 class="microTaskTitle" data-action = "edit">${subtask.value}</h3>
    <input type="text" id="${subtask.id}"/>
    
    <ul class="microTaskList" id="${subtask.value}"></ul>
    <span class="deleteButton" data-action = "delete">×</span>
    </div>
    `;
  });
  addlisteners();
}
//to add event listener
// function addlistener(){
//   console.log("called")
//   subTasks.forEach((subtask) => {
//     const inputs = document.querySelector(".microTaskContainer input");
//       inputs.addEventListener("keydown", (event) => {
//         if (event.key == "Enter") {
//           event.preventDefault();
//           addMicroTask(subtask.id);
//           renderMicroTasks(subtask.id);
//           console.log(subtask.id)
//         }
//         console.log(inputs);
//       });
//     });
// }

//function to add event listeners
function addlisteners() {
  
  const microTaskContainer = document.querySelectorAll(".microTaskContainer");
  microTaskContainer.forEach((container) => {
    const microTaskId = container.dataset.subTaskId;
    // renderMicroTasks(JSON.parse(localStorage.getItem(microTaskId)));
    const edit = container.querySelector('[data-action="edit"]');
    const deleted = container.querySelector('[data-action="delete"]');
    edit.addEventListener("click", () => {
      editSubTask(microTaskId);
    });
    deleted.addEventListener("click", () => {
      deleteSubtask(microTaskId);
    });
    const input = container.querySelector("input");
    console.log(input);
    console.log(JSON.parse(localStorage.getItem(selectedTaskId)))
    JSON.parse(localStorage.getItem(selectedTaskId)).map(({id})=>{
      renderMicroTasks(id);
      console.log("Called")
    })
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addMicroTask(microTaskId);
        renderMicroTasks(microTaskId);
        microTaskfunctionality(microTaskId);

        //save it to local storage 
        console.log(microTasks)
  localStorage.setItem(microTaskId, JSON.stringify(microTasks));

        // localStorage.setItem(microTaskId,JSON.stringify(microTaskId));
        // localStorage.setItem("microTasks",JSON.stringify(microTasks));
      }
    });
    function microTaskfunctionality(id) {
      const UL = document.getElementById(id).nextElementSibling;
      UL.addEventListener("click", (event) => {
        const target = event.target;
        const parent = target.parentElement;
        if (!parent.classList.contains("microTaskItem")) return;
        const microTaskId = parent.id;

        //actions
        const action = target.dataset.action;
        action === "delete" && deleteMicroTask(microTaskId);
        action === "edit" && editMicroTask(microTaskId)
        action === "check" && checkMicroTask(microTaskId);
        // console.log(microTaskId)
      });
    }
    function deleteMicroTask(id) {
      microTasks = microTasks.filter((microtask, index) => microtask.id !== id);
      renderMicroTasks(microTaskId);
      console.log(microTasks)
  // localStorage.setItem(selectedTaskId, JSON.stringify(subTasks));
  localStorage.setItem(microTaskId, JSON.stringify(microTasks));


      // localStorage.setItem("MicroTasks",JSON.stringify(microTasks));
    }
    function editMicroTask(id){
      let value = microTasks.map((res,index)=>{
        if(res.id ===id){
          return Number(index);
        }
      });
      let filtered = value.filter((res)=>typeof res === "number")
      input.value = microTasks[filtered].value
      editMicroTaskId = Number(filtered);
    }
    function checkMicroTask(id) {
      microTasks = microTasks.map((microtask) => {
        return {
          ...microtask,
          checked: id === microtask.id ? !microtask.checked : microtask.checked,
        };
      });
      renderMicroTasks(microTaskId);
  // localStorage.setItem(selectedTaskId, JSON.stringify(subTasks));
  localStorage.setItem(microTaskId, JSON.stringify(microTasks));

      // localStorage.setItem("MicroTasks",JSON.stringify(microTasks));
    }
  });
  console.log(microTaskContainer);
}
const subTaskList = document.getElementById("subtaskList");

function deleteSubtask(id) {
  // console.log(subTasks)
  subTasks = subTasks.filter((subtask) => subtask.id !== id);
  console.log(subTasks);

  renderSubTasks();
  //save the updated array in local storage
  localStorage.setItem(selectedTaskId, JSON.stringify(subTasks));
}

function editSubTask(id) {
  const subTaskInput = document.querySelector("#subtaskInput");
  let value = subTasks.map((subtask, index) => {
    if (subtask.id === id) {
      return Number(index);
    }
  });
  let filtered = value.filter((res) => typeof res === "number");
  subTaskInput.value = subTasks[filtered].value;
  editSubTaskId = Number(filtered);
}

//micro Tasks List

//var
// var microTasks = JSON.parse(localStorage.getItem("MicroTasks")) || [];
var microTasks = [];
console.log(microTasks)
let editMicroTaskId = -1;

//addMicroTask
function addMicroTask(uniqueValue) {
  const microTaskInput = document.getElementById(`${uniqueValue}`);
  const microTaskName = microTaskInput.value;
  const microTaskList = microTaskInput.nextElementSibling;
  const microTaskId = microTaskList.getAttribute("id");

  //function to create microTasks
  if (microTaskName.trim() === "") {
    alert("microTasks Cannnot Be Empty");
  }else if (editMicroTaskId>=0) {
    microTasks = microTasks.map((microtask,index)=>{
      return{
        ...microtask,
        value:index === editMicroTaskId ? microTaskName :microtask.value,
      }
    })
    editMicroTaskId = -1;
    microTaskInput.value = ""; 
  } 
  else {
    const microTask = {
      id: randomIdGenerator(),
      parent: microTaskId,
      value: microTaskName,
      checked: false,
    };
    microTasks.push(microTask);
    microTaskInput.value = "";
  }
  // console.log(microTasks);
}

//render microTasks
function renderMicroTasks(id) {
  const microTaskInput = document.getElementById(`${id}`);
  const microTaskList = microTaskInput.nextElementSibling;
  const ulid = microTaskList.id;
  // console.log(microTaskList);
  // const liid = randomIdGenerator();
  microTaskList.innerHTML = "";
  const filteredTasks = microTasks.filter(
    (microtask) => microtask.parent == ulid
  );
  filteredTasks.forEach((microtask, index) => {
    microTaskList.innerHTML += `
    <li draggable="true" class="microTaskItem ${
      microtask.checked ? "done" : ""
    }" ondragstart="drag(event)" id = ${microtask.id}>
    <h3>${microtask.value}</h3>
  <i class="far fa-check-circle" data-action = "check"></i>
  <i class="fas fa-edit" data-action = "edit"></i>
  <i class="fas fa-trash" data-action = "delete"></i>
</li>
    `;
  });
}

// function createli(){
//     const li = document.createElement('li');
//     li.classList.add('microTaskitem')
// }

// //create microTasks
// function createMicroTask(microTaskName, microTaskId) {
//   // console.log(microTaskId)
//   const microTaskList = document.querySelector(`#${microTaskId}`);
//   const microTaskItem = document.createElement("li");
//   microTaskItem.classList.add("microTaskItem");
//   microTaskItem.setAttribute("draggabble", "true");
//   microTaskItem.setAttribute("ondragstart", "drag(event)");
//   microTaskItem.textContent = microTaskName;
//   iconHTML(microTaskItem);
//   microTaskList.appendChild(microTaskItem);

//   //select the icon and add event listner to that
//   const completed = Array.from(document.querySelectorAll("span.tickIcon"));
//   completed.forEach((task) => {
//     task.addEventListener("click", done);
//   });

//   const deleteMicro = Array.from(document.querySelectorAll("span.crossIcon"));
//   deleteMicro.forEach((task) => {
//     task.addEventListener("click", deleteMicroTask);
//   });

//   // save data into local storage
//   addMicroTaskToLocalStorage(microTaskId);
// }

// //add Icon HTML
// function iconHTML(parent) {
//   const iconWrapper = document.createElement("div");
//   iconWrapper.classList.add("iconWrapper");
//   const tick = document.createElement("span");
//   tick.classList.add("tickIcon");
//   tick.innerHTML = "&#x2713";
//   iconWrapper.append(tick);

//   const cross = document.createElement("span");
//   cross.classList.add("crossIcon");
//   cross.innerHTML = "&#x2715";
//   iconWrapper.append(cross);
//   parent.append(iconWrapper);
// }

// //Completed micro task
// function done(event) {
//   let li = event.target.parentElement.parentElement;
//   li.classList.contains("done")
//     ? li.classList.remove("done")
//     : li.classList.add("done");
// }

// //delete deleteMicroTask
// function deleteMicroTask(event) {
//   let li = event.target.parentElement.parentElement;
//   ulId = li.parentElement.dataset.microTaskId;
//   li.remove();
//   //remove it from local storage
//   removeMicroTaskFromLocalStorage(ulId);
// }

// // function to save data to local storage
// function addMicroTaskToLocalStorage(microTaskId) {
//   const ul = document.querySelector(`#${microTaskId}`);
//   const microTasks = Array.from(ul.querySelectorAll("li")).map((microTask) => {
//     const textNode = microTask.firstChild;
//     return textNode.textContent.trim();
//   });
//   const obj = { id: microTaskId, data: microTasks };
//   localStorage.setItem(microTaskId, JSON.stringify(obj));
// }

// //load item from Local Storage
// function loadMicroTasksFromLocalStorage() {
//   const microTaskContainer = Array.from(
//     document.querySelectorAll(".microTaskList")
//   );

//   const collection = microTaskContainer.map((res) => {
//     const id = res.getAttribute("data-micro-task-id");
//     return id;
//   });
//   collection.forEach((res) => {
//     const local = JSON.parse(localStorage.getItem(res));
//     local.data.forEach((res) => {
//       createMicroTask(res, local.id);
//     });
//   });
// }

// // remove it from local Storage
// function removeMicroTaskFromLocalStorage(ulId) {
//   addMicroTaskToLocalStorage(ulId);
// }
