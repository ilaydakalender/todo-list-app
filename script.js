window.onload = function () {
    loadTasks();
    updateTitleVisibility();
};

const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskTitle = document.getElementById("taskTitle");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

addBtn.addEventListener("click", () => addTask());


taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

/* ================= TASK EKLE ================= */
function addTask(text = null, completed = false) {
    const taskText = text !== null ? text : taskInput.value.trim();
    if (taskText === "") {
        alert("Görev boş olamaz!");
        return;
    }

    const li = document.createElement("li");
    li.classList.add("task-item");
    if (completed) li.classList.add("completed");

    /* CHECKBOX */
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;

    checkbox.addEventListener("change", () => {
        li.classList.toggle("completed");
        saveTasks();
        applyFilter(currentFilter);
    });

    const span = document.createElement("span");
    span.textContent = taskText;

    const leftBox = document.createElement("div");
    leftBox.classList.add("left");
    leftBox.appendChild(checkbox);
    leftBox.appendChild(span);

    /* ACTIONS (EDIT + DELETE) */
    const actions = document.createElement("div");
    actions.classList.add("actions");

    /* ✏️ EDIT */
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.classList.add("icon-btn");

    editBtn.addEventListener("click", () => {
        startEdit(span);
    });

    /* ❌ DELETE */
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "❌";
    deleteBtn.classList.add("icon-btn");

    deleteBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();
        updateTitleVisibility();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(leftBox);
    li.appendChild(actions);
    taskList.appendChild(li);

    taskInput.value = "";
    saveTasks();
    updateTitleVisibility();
}


/* ================= EDIT LOGIC ================= */
function startEdit(span) {
    const oldText = span.textContent;

    const input = document.createElement("input");
    input.type = "text";
    input.value = oldText;
    input.style.width = "140px";

    span.replaceWith(input);
    input.focus();

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            finishEdit(input, oldText);
        }
        if (e.key === "Escape") {
            cancelEdit(input, oldText);
        }
    });

    input.addEventListener("blur", function () {
        finishEdit(input, oldText);
    });
}

function finishEdit(input, oldText) {
    const newText = input.value.trim() || oldText;

    const span = document.createElement("span");
    span.textContent = newText;

    span.addEventListener("dblclick", function () {
        startEdit(span);
    });

    input.replaceWith(span);
    saveTasks();
}

function cancelEdit(input, oldText) {
    const span = document.createElement("span");
    span.textContent = oldText;

    span.addEventListener("dblclick", function () {
        startEdit(span);
    });

    input.replaceWith(span);
}

/* ================= LOCAL STORAGE ================= */
function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-item").forEach(li => {
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        tasks.forEach(task => addTask(task.text, task.completed));
    }
}

/* ================= TITLE ================= */
function updateTitleVisibility() {
    taskTitle.style.display =
        taskList.children.length === 0 ? "none" : "block";
}

/* ================= FILTER ================= */
filterButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        filterButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        currentFilter = this.dataset.filter;
        applyFilter(currentFilter);
    });
});

function applyFilter(filter) {
    document.querySelectorAll(".task-item").forEach(task => {
        const completed = task.classList.contains("completed");

        if (filter === "all") task.style.display = "flex";
        else if (filter === "active") task.style.display = completed ? "none" : "flex";
        else if (filter === "completed") task.style.display = completed ? "flex" : "none";
    });
}
