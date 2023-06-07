// Load subtasks from local storage when the page loads
window.addEventListener("DOMContentLoaded", renderSubTasks);

//rerender microtasks
function rerenderMicrotasks() {
  JSON.parse(localStorage.getItem(selectedTaskId)).map(({ id }) => {
    renderMicroTasks(id);
  });
}
// window.addEventListener("DOMContentLoaded", ()=>{localStorage.clear()});

//function to generate random id
function randomIdGenerator() {
  return new Date().getTime().toString();
}

// Add title from local Storage
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
  subTasks.length > 0 &&
    subTasks.forEach((subtask) => {
      localStorage.setItem(subtask.id, JSON.stringify(subtask.value));
    });
});

//Adding Subtask
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
    data-sub-task-id="${subtask.id}"
    >
    <h3 class="microTaskTitle" data-action = "edit" onclick="editSubTask(${subtask.id})">${subtask.value}</h3>
    <input type="text" id="${subtask.id}" onkeydown = "inputBlurHandler(${subtask.id})"/>
    
    <ul class="microTaskList" id="${subtask.value}"></ul>
    <span class="deleteButton" data-action = "delete" onclick="deleteSubtask(${subtask.id})">×</span>
    </div>
    `;
    renderMicroTasks(subtask.id);
  });
  dragfunction();
}

//Event Handlers of Subtasks
const subTaskList = document.getElementById("subtaskList");
//delete
function deleteSubtask(id) {
  subTasks = subTasks.filter((subtask) => Number(subtask.id) !== id);

  renderSubTasks();
  //save the updated array in local storage
  localStorage.setItem(selectedTaskId, JSON.stringify(subTasks));
}
//edit
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
    }" id = ${microtask.id}>
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
  // dragfunction();
}

//Handlers of microTasks
function deleteMicroTask(id) {
  microTasks = microTasks.filter((microtask) => Number(microtask.id) !== id);
  localStorage.setItem("microTasks", JSON.stringify(microTasks));
  rerenderMicrotasks();
}
// /input
function inputBlurHandler(microTaskId) {
  if (event.key == "Enter") {
    addMicroTask(microTaskId);
    renderMicroTasks(microTaskId);
    localStorage.setItem("microTasks", JSON.stringify(microTasks));
  }
}

//edit
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
  focusOnLastCharacter(input);
  function focusOnLastCharacter(inputElement) {
    inputElement.focus();

    const { value } = inputElement;
    const inputLength = value.length;

    // Set the selection range to the last character
    inputElement.setSelectionRange(inputLength, inputLength);
  }
  input.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      saveupdated(id);
    }
  });
  const saveButton = liElement.querySelector('[data-action="save"]');
  saveButton.addEventListener("click", (event) => {
    saveupdated(id);
  });

  function saveupdated(id) {
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
  }
}
//check
function checkMicroTask(id) {
  microTasks = microTasks.map((microtask) => {
    return {
      ...microtask,
      checked:
        id === Number(microtask.id) ? !microtask.checked : microtask.checked,
    };
  });
  localStorage.setItem("microTasks", JSON.stringify(microTasks));
  rerenderMicrotasks();
}

// const sortableLists = document.querySelectorAll(".microTaskList");
// sortableLists.forEach((ul)=>{
//   let li = Array.from(ul.children)
//   li.forEach((res,index)=>{

//     res.setAttribute('data-index',index)
//     console.log(res)
//   })
// })
// const listItems = [];
// let dragstartIndex;
// sortableLists.forEach((ul,index)=>{
  
// })
  function dragfunction() {
    const listitems = [];
    let dragstartIndex;
    createList();

    //insert items into DOM
    function createList(){
      const sortableLists = document.querySelector('.microTaskList');
      console.log(sortableLists)
      Array.from(sortableLists.children).forEach((li,index)=>{
        console.log(li)
        li.classList.add("draggable");
        li.setAttribute('data-index', index)
        listitems.push(li)
      })
      addEventListeners();
    }

  function dragStart(){
    dragstartIndex = +this.closest('li').getAttribute('data-index')
    // console.log(dragstartIndex)
  }
  function dragOver(e){
    e.preventDefault();
    // console.log("dragover")
  }
  function dragDrop(){
    // console.log("dragdrop")
    const dragEndIndex = +this.getAttribute('data-index')
    swapItems(dragstartIndex,dragEndIndex);
    this.classList.remove("dragging")
  }
  function dragEnter(){
    // console.log("dragenter")
    this.classList.add("dragging")
  }
  function dragLeave(){
    // console.log("dragleave")
    this.classList.remove("dragging")
  }
  function swapItems(fromIndex,toIndex){
    const itemOne = listitems[fromIndex]  
    const itemTwo = listitems[toIndex]
    console.log(itemOne,itemTwo)
    listitems[fromIndex].appendChild(itemTwo);
    listitems[toIndex].appendChild(itemOne);
  }

    function addEventListeners(){
      const draggables = document.querySelectorAll('.draggable')
      const dragListItems = document.querySelectorAll('.microTaskList li')
      draggables.forEach((dragabble)=>{
        dragabble.addEventListener('dragstart',dragStart);
      })
      dragListItems.forEach((item)=>{
        item.addEventListener('dragover',dragOver);
      })
      dragListItems.forEach((item)=>{
        item.addEventListener('drop',dragDrop);
      })
      dragListItems.forEach((item)=>{
        item.addEventListener('dragenter',dragEnter);
      })
      dragListItems.forEach((item)=>{
        item.addEventListener('dragleave',dragLeave);
      })
      console.log(draggables,dragListItems)
    }
  }