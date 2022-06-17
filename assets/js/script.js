var taskIdCounter = 0;

var formEl = document.querySelector("#task-form"); 
var tasksToDoEl = document.querySelector("#tasks-to-do"); 
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var tasks = [];

var taskFormHandler = function(event) { 
  event.preventDefault(); 

  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  //check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
      alert("You need to fill out the form!");
      return false;
  }
  formEl.reset();
  
  var isEdit = formEl.hasAttribute("data-task-id");

  //has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
      var taskId = formEl.getAttribute("data-task-id");
      completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  else {
      //package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    };

    createTaskEl(taskDataObj);
  }
  };

  var completeEditTask = function(taskName, taskType, taskId) {
      //find the matching task list item
      var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
      //set new values
      taskSelected.querySelector("h3.task-name").textContent = taskName;
      taskSelected.querySelector("span.task-type").textContent = taskType;

      alert("Task Updated!");

      //loop through task array and task object with new content
      for (var i = 0; i < tasks.length; i++) {
          if (tasks[i].id === parseInt(taskId)) {
              tasks[i].name = taskName;
              tasks[i].type = taskType;
          }
      };

      //remove task id and change button back to Save Task
      formEl.removeAttribute("data-task-id");
      formEl.querySelector("#save-task").textContent = "Add Task";

      //save to local storage call
    saveTasks();
  };

  var createTaskEl = function(taskDataObj) {
       //create list item
  var listItemEl = document.createElement("li"); 
  listItemEl.className = "task-item"; 
    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    //add entire list item to list
  tasksToDoEl.appendChild(listItemEl); 
  
  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);
  
  //increase task counter for next unique id
    taskIdCounter++;

    //save to local storage call
    saveTasks();
  };

  var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //create dropdown menu
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    //create options elements with for loop
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        //append to select (dropdown menu)
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
  };

  var taskButtonHandler = function(event) {
    //console.log(event.target);
    var targetEl = event.target; 
    if (targetEl.matches(".edit-btn")) {
        console.log("edit", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }  else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
    

    // if (event.target.matches(".edit-btn")) {
    //       var taskId = event.target.getAttribute("data-task-id");
    //       editTask(taskId);
    //   }
    //   else if(event.target.matches(".delete-btn")) {
    //     //get the element's task id
    //     var taskId = event.target.getAttribute("data-task-id");
    //     deleteTask(taskId);
    // }
  };

  var taskStatusChangeHandler = function(event) {
    //get the task item's id
    var taskId = event.target.getAttribute("data-task-id");
    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if ( statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
      }
    
    //update task's in task array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    console.log(tasks);

    //save to local storage call
    saveTasks();
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];
    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i].id doesn't match the value of taskId, let's keep that taks and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    //save to local storage call
    saveTasks();
};

var editTask = function(taskId) {
    console.log("editing task #" + taskId);
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    //task name and type appear in the form inputs
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    //update button to say Save Task instead of Add Task
    formEl.querySelector("#save-task").textContent = "Save Task";
    //include task id to eventually be able to save the task
    formEl.setAttribute("data-task-id", taskId);
};

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {
    //get tasks from local storage
    var tasks = localStorage.getItem("tasks", tasks);
    if (tasks === null) {
        tasks = [];
        return false;
    }
    //convert tasks from the string back into an array of objects
    tasks = JSON.parse(tasks);
    console.log(tasks);
    //iterate through a tasks array and create task elements on the page from it
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].id = taskIdCounter;

        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        console.log(listItemEl);

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);
        taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);
        console.log(listItemEl);

        //broken code somewhere below
        if (tasks[i].status == "To Do") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            listItemEl.appendChild(tasksToDoEl);

        }
        else if (tasks[i].status == "In Progress") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            listItemEl.appendChild(tasksInProgressEl);
        }
        else if (tasks[i].status == "Complete") {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            listItemEl.appendChild(tasksCompletedEl);
        }
        taskIdCounter++;
        console.log(listItemEl);
    }
}

formEl.addEventListener("submit", taskFormHandler);
  pageContentEl.addEventListener("click", taskButtonHandler);
  pageContentEl.addEventListener("change", taskStatusChangeHandler);

  loadTasks();