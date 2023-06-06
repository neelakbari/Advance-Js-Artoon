// Load subtasks from local storage when the page loads
window.addEventListener("DOMContentLoaded", renderSubTasks);

// // Load microtasks from local storage when the page loads
window.addEventListener("DOMContentLoaded", rerenderMicrotasks);
// window.addEventListener("DOMContentLoaded", reinitiate);

// window.addEventListener("DOMContentLoaded", ()=>{localStorage.clear()});

//rerender microtasks
function rerenderMicrotasks() {
  JSON.parse(localStorage.getItem(selectedTaskId)).map(({ id}) => {
    // console.log(inputsid);
    // addMicroTask(id);
    renderMicroTasks(id);
    // microTaskfunctionality(id);
  });
}

// setTimeout(() => {
//   reinitiate();
// }, 2000);
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

//variables
let subTasks = JSON.parse(localStorage.getItem(selectedTaskId)) || [];
let editSubTaskId = -1;
let microTasks = JSON.parse(localStorage.getItem("microTasks")) || [];
let editMicroTaskId = -1;

const subTaskSubmitButton = document.querySelector("#subTaskSubmitButton");
subTaskSubmitButton.addEventListener("click", () => {
  addsubtask();
  renderSubTasks();
  //save to the local storage
  localStorage.setItem(selectedTaskId, JSON.stringify(subTasks));
  subTasks.forEach((subtask) => {
    localStorage.setItem(subtask.id, JSON.stringify(subtask.value));
  });
  rerenderMicrotasks();
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
    //update the edited subtasks
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
    subTaskInput.value = "";
  }
}

//render subtasks
function renderSubTasks() {
  const subTaskList = document.getElementById("subtaskList");

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

//function to add event listeners
function addlisteners() {
  const microTaskContainer = document.querySelectorAll(".microTaskContainer");
  microTaskContainer.forEach((container) => {
    debugger
    if (microTasks.length > 0 ) {
      debugger
      console.log("LEDSFDS")
      reinitiate();
    }
    const microTaskId = container.dataset.subTaskId;
    const edit = container.querySelector('[data-action="edit"]');
    const deleted = container.querySelector('[data-action="delete"]');
    edit.addEventListener("click", () => {
      editSubTask(microTaskId);
    });
    deleted.addEventListener("click", () => {
      deleteSubtask(microTaskId);
    });
    const input = container.querySelector("input");
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        debugger
        // event.preventDefault();
        addMicroTask(microTaskId);
        renderMicroTasks(microTaskId);
        microTaskfunctionality(microTaskId);

        //save it to local storage

        localStorage.setItem("microTasks", JSON.stringify(microTasks));
      }
    });
    function reinitiate(){
      debugger
      JSON.parse(localStorage.getItem(selectedTaskId)).map(({ id}) => {
        // console.log(inputsid);
        // addMicroTask(id);
        // renderMicroTasks(id);
        microTaskfunctionality(id);
      })
    }
    function microTaskfunctionality(id) {
      debugger
      const UL = document.getElementById(id).nextElementSibling;
      if (!UL || UL.tagName !== "UL") {
        console.error("Invalid UL element");
        return;
      }
      UL.addEventListener("click", (event) => {
        const target = event.target;
        const parent = target.parentElement;

        // if (!(parent.classList.contains("microTaskItem"))) return;
        const microTaskId = parent.id;

        //actions
        const action = target.dataset.action;
        action === "delete" && deleteMicroTask(microTaskId);
        action === "edit" && editMicroTask(event, microTaskId);
        action === "check" && checkMicroTask(microTaskId);
      });
    }
    function deleteMicroTask(id) {
      microTasks = microTasks.filter((microtask) => microtask.id !== id);
      // renderMicroTasks(microTaskId);
      localStorage.setItem("microTasks", JSON.stringify(microTasks));
      rerenderMicrotasks();
    }
    function editMicroTask(event, id) {
      console.log(event);
      // Handle edit action
      const target = event.target;
      const liElement = target.closest("li");
      const h3Element = liElement.querySelector("h3");
      const currentText = h3Element.textContent;

      // Convert the <li> into an input field
      liElement.innerHTML = `
          <input type="text" value="${currentText}" class="microTaskEdit" />
          <button data-action="save">Save</button>
        `;

      const input = liElement.querySelector(".microTaskEdit");
      console.log(input)
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          saveupdated(id);
        }
      });
      const saveButton = liElement.querySelector('[data-action="save"]');
      saveButton.addEventListener("click", ()=>saveupdated(id));
      function saveupdated(id){
        const inputElement = liElement.querySelector("input");
          const updatedValue = inputElement.value;
          if (updatedValue === "") {
            alert("Cannot be Empty Task");
            inputElement.focus();
            return
          }
          // Convert the input field back to an <h3> element
          liElement.innerHTML = `<h3>${updatedValue}</h3>
        
          <i class="far fa-check-circle" data-action = "check"></i>
          <i class="fas fa-edit" data-action = "edit"></i>
          <i class="fas fa-trash" data-action = "delete"></i>
        `;
        microTasks = microTasks.map((microtask)=>{
          return{
            ...microtask,
            value:(id === microtask.id)? updatedValue : microtask.value
          }
        })
        console.log(microTasks)
        localStorage.setItem("microTasks", JSON.stringify(microTasks));
        rerenderMicrotasks();
      }
      // renderMicroTasks(id);
      
    }
    function checkMicroTask(id) {
      microTasks = microTasks.map((microtask) => {
        return {
          ...microtask,
          checked: id === microtask.id ? !microtask.checked : microtask.checked,
        };
      });
      console.log(microTasks)
      // renderMicroTasks(microTaskId);
      localStorage.setItem("microTasks", JSON.stringify(microTasks));
      rerenderMicrotasks();
    }
  });
}
const subTaskList = document.getElementById("subtaskList");

function deleteSubtask(id) {
  debugger
  subTasks = subTasks.filter((subtask) => subtask.id !== id);

  renderSubTasks();
  //save the updated array in local storage
  localStorage.setItem(selectedTaskId, JSON.stringify(subTasks));
  rerenderMicrotasks();
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

//addMicroTask
function addMicroTask(uniqueValue) {
  const microTaskInput = document.getElementById(`${uniqueValue}`);
  const microTaskName = microTaskInput.value;
  const microTaskList = microTaskInput.nextElementSibling;
  const microTaskId = microTaskList.getAttribute("id");
  const inputId = uniqueValue;

  //function to create microTasks
  if (microTaskName.trim() === "") {
    alert("microTasks Cannnot Be Empty");
  } else if (editMicroTaskId >= 0) {
    microTasks = microTasks.map((microtask, index) => {
      return {
        ...microtask,
        value: index === editMicroTaskId ? microTaskName : microtask.value,
      };
    });
    editMicroTaskId = -1;
    microTaskInput.value = "";
  } else {
    const microTask = {
      id: randomIdGenerator(),
      parent: microTaskId,
      value: microTaskName,
      checked: false,
      inputsid : inputId,
    };
    microTasks.push(microTask);
    microTaskInput.value = "";
  }
}

//render microTasks
function renderMicroTasks(id) {
  const microTaskInput = document.getElementById(`${id}`);
  const microTaskList = microTaskInput.nextElementSibling;
  const ulid = microTaskList.id;
  microTaskList.innerHTML = "";
  const filteredTasks = microTasks.filter(
    (microtask) => microtask.parent == ulid
  );
  filteredTasks.forEach((microtask) => {
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
