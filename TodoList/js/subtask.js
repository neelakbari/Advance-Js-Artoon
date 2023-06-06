// Load subtasks from local storage when the page loads
window.addEventListener("DOMContentLoaded", renderSubTasks);

// window.addEventListener("DOMContentLoaded", ()=>{localStorage.clear()});

//rerender microtasks
function rerenderMicrotasks() {
  JSON.parse(localStorage.getItem(selectedTaskId)).map(({ id }) => {
    renderMicroTasks(id);
  });
}

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
    <h3 class="microTaskTitle" data-action = "edit" onclick="editSubTask(${subtask.id})">${subtask.value}</h3>
    <input type="text" id="${subtask.id}" onblur = "inputBlurHandler(${subtask.id})"/>
    
    <ul class="microTaskList" id="${subtask.value}"></ul>
    <span class="deleteButton" data-action = "delete" onclick="deleteSubtask(${subtask.id})">×</span>
    </div>
    `;
    renderMicroTasks(subtask.id);
  });
}
function inputHandler(event) {
  event.preventDefault();
  event.stopPropagation();
}

function inputBlurHandler(microTaskId) {
  addMicroTask(microTaskId);
  renderMicroTasks(microTaskId);
  localStorage.setItem("microTasks", JSON.stringify(microTasks));
}

function deleteMicroTask(id) {
  microTasks = microTasks.filter((microtask) => Number(microtask.id) !== id);
  localStorage.setItem("microTasks", JSON.stringify(microTasks));
  rerenderMicrotasks();
}
function editMicroTask(event, id) {
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
  input.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      saveupdated(id);
    }
  });
  const saveButton = liElement.querySelector('[data-action="save"]');
  saveButton.addEventListener("click", (event) => {
    saveupdated(id)})

    function saveupdated(id){
    const inputElement = liElement.querySelector("input");
    const updatedValue = inputElement.value;
    if (updatedValue === "") {
      alert("Cannot be Empty Task");
      inputElement.focus();
      return;
    }
    // Convert the input field back to an <h3> element
    liElement.innerHTML = `<h3>${updatedValue}</h3>
    
    <i class="far fa-check-circle" data-action = "check"></i>
    <i class="fas fa-edit" data-action = "edit"></i>
    <i class="fas fa-trash" data-action = "delete"></i>
    `;
    event.stopPropagation();
    microTasks = microTasks.map((microtask) => {
      return {
        ...microtask,
        value: id === Number(microtask.id) ? updatedValue : microtask.value,
      };
    });
    localStorage.setItem("microTasks", JSON.stringify(microTasks));
    rerenderMicrotasks();
  };
}
function checkMicroTask(id) {
  microTasks = microTasks.map((microtask) => {
    return {
      ...microtask,
      checked:
        id === Number(microtask.id) ? !microtask.checked : microtask.checked,
    };
  });
  // renderMicroTasks(microTaskId);
  localStorage.setItem("microTasks", JSON.stringify(microTasks));
  rerenderMicrotasks();
}
//function to add event listeners
// function addlisteners() {
//   //
//   const microTaskContainer = document.querySelectorAll(".microTaskContainer");
//   microTaskContainer.forEach((container) => {
//     const microTaskId = container.dataset.subTaskId;
//     const edit = container.querySelector('[data-action="edit"]');
//     const deleted = container.querySelector('[data-action="delete"]');
//     const input = container.querySelector("input");
//     // edit.removeEventListener("click", editSubTask);
//     // deleted.removeEventListener("click", deleteSubtask);
//     // input.removeEventListener("click", inputClickHandler);

//     // edit.addEventListener("click", () => {
//     //   editSubTask(microTaskId);
//     // });
//     // deleted.addEventListener("click", () => {
//     //   deleteSubtask(microTaskId);
//     // });
//     // input.addEventListener("click", (event) => inputClickHandler(event));
//     input.addEventListener("blur", (event) => {
//       addMicroTask(microTaskId);
//       renderMicroTasks(microTaskId);
//       microTaskfunctionality(microTaskId);

//       //save it to local storage

//       localStorage.setItem("microTasks", JSON.stringify(microTasks));
//     });
//     function microTaskfunctionality(id) {
//       //
//       const UL = document.getElementById(id).nextElementSibling;
//       if (!UL || UL.tagName !== "UL") {
//         console.error("Invalid UL element");
//         return;
//       }
//       UL.addEventListener("click", (event) => {
//         event.stopPropagation();

//         const target = event.target;
//         const parent = target.parentElement;

//         if (!parent.classList.contains("microTaskItem")) return;
//         const microTaskId = parent.id;

//         //actions
//         const action = target.dataset.action;
//         action === "delete" && deleteMicroTask(microTaskId);
//         action === "check" && checkMicroTask(microTaskId);
//         action === "edit" && editMicroTask(event, microTaskId);
//       });
//     }
//     function deleteMicroTask(id) {
//       microTasks = microTasks.filter((microtask) => microtask.id !== id);
//       localStorage.setItem("microTasks", JSON.stringify(microTasks));
//       rerenderMicrotasks();
//     }
//     function editMicroTask(event, id) {
//       const target = event.target;
//       const liElement = target.closest("li");
//       const h3Element = liElement.querySelector("h3");
//       const currentText = h3Element.textContent;

//       // Convert the <li> into an input field
//       liElement.innerHTML = `
//           <input type="text" value="${currentText}" class="microTaskEdit" />
//           <button data-action="save">Save</button>
//         `;

//       // const input = liElement.querySelector(".microTaskEdit");
//       // input.addEventListener("keyup", (event) => {
//       //   if (event.key === "Enter") {
//       //     saveupdated(id);
//       //   }
//       // });
//       const saveButton = liElement.querySelector('[data-action="save"]');
//       saveButton.addEventListener("click", (event) => {
//         const inputElement = liElement.querySelector("input");
//         const updatedValue = inputElement.value;
//         if (updatedValue === "") {
//           alert("Cannot be Empty Task");
//           inputElement.focus();
//           return;
//         }
//         // Convert the input field back to an <h3> element
//         liElement.innerHTML = `<h3>${updatedValue}</h3>

//         <i class="far fa-check-circle" data-action = "check"></i>
//         <i class="fas fa-edit" data-action = "edit"></i>
//         <i class="fas fa-trash" data-action = "delete"></i>
//         `;
//         event.stopPropagation();
//         microTasks = microTasks.map((microtask) => {
//           return {
//             ...microtask,
//             value: id === microtask.id ? updatedValue : microtask.value,
//           };
//         });
//         localStorage.setItem("microTasks", JSON.stringify(microTasks));
//         rerenderMicrotasks();
//       });
//     }
//     function checkMicroTask(id) {
//       microTasks = microTasks.map((microtask) => {
//         return {
//           ...microtask,
//           checked: id === microtask.id ? !microtask.checked : microtask.checked,
//         };
//       });
//       // renderMicroTasks(microTaskId);
//       localStorage.setItem("microTasks", JSON.stringify(microTasks));
//       rerenderMicrotasks();
//     }
//   });
// }
const subTaskList = document.getElementById("subtaskList");

function deleteSubtask(id) {
  subTasks = subTasks.filter((subtask) => Number(subtask.id) !== id);

  renderSubTasks();
  //save the updated array in local storage
  localStorage.setItem(selectedTaskId, JSON.stringify(subTasks));
  // rerenderMicrotasks();
  // renderMicroTasks(id)
}

function editSubTask(id) {
  const subTaskInput = document.querySelector("#subtaskInput");
  let value = subTasks.map((subtask, index) => {
    if (Number(subtask.id) === id) {
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
      inputsid: inputId,
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
    //
    microTaskList.innerHTML += `
    <li draggable="true" class="microTaskItem ${
      microtask.checked ? "done" : ""
    }" ondragstart="drag(event)" id = ${microtask.id}>
    <h3>${microtask.value}</h3>
  <i class="far fa-check-circle" data-action = "check" onclick="checkMicroTask(${
    microtask.id
  })"></i>
  <i class="fas fa-edit" data-action = "edit" onclick="editMicroTask(event,${
    microtask.id
  })"></i>
  <i class="fas fa-trash" data-action = "delete" onclick="deleteMicroTask(${
    microtask.id
  })"></i>
</li>
    `;
  });
}
// function microTaskfunctionality(id) {
//   //
//   const UL = document.getElementById(id).nextElementSibling;
//   if (!UL || UL.tagName !== "UL") {
//     console.error("Invalid UL element");
//     return;
//   }
//   UL.addEventListener("click", (event) => {
//     event.stopPropagation();

//     const target = event.target;
//     const parent = target.parentElement;

//     if (!parent.classList.contains("microTaskItem")) return;
//     const microTaskId = parent.id;

//     //actions
//     const action = target.dataset.action;
//     action === "delete" && deleteMicroTask(microTaskId);
//     action === "check" && checkMicroTask(microTaskId);
//     action === "edit" && editMicroTask(event, microTaskId);
//   });
// }
