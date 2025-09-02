// Tabs
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// Load settings
let calorieGoal = parseInt(localStorage.getItem("calorieGoal")) || 3000;
let proteinGoal = parseInt(localStorage.getItem("proteinGoal")) || 150;
let defaultTasks = JSON.parse(localStorage.getItem("defaultTasks")) || [
  "Drink Water",
  "Workout"
];

// Tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || defaultTasks.map(t => ({ text: t, done: false }));

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = (task.done ? "✅ " : "⬜ ") + task.text;
    li.onclick = () => toggleTask(index);
    taskList.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("newTaskInput");
  if (input.value.trim() !== "") {
    tasks.push({ text: input.value, done: false });
    input.value = "";
    saveTasks();
  }
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Reset tasks daily
function resetTasksAtMidnight() {
  const now = new Date();
  const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
  setTimeout(() => {
    tasks = defaultTasks.map(t => ({ text: t, done: false }));
    saveTasks();
    resetTasksAtMidnight();
  }, msUntilMidnight);
}
resetTasksAtMidnight();

// Calories & Protein
let meals = JSON.parse(localStorage.getItem("meals")) || [];

function renderMeals() {
  const mealList = document.getElementById("mealList");
  mealList.innerHTML = "";
  let totalCalories = 0;
  let totalProtein = 0;

  meals.forEach((meal) => {
    totalCalories += meal.calories;
    totalProtein += meal.protein;
    const li = document.createElement("li");
    li.textContent = `🍴 ${meal.calories} cal, ${meal.protein}g protein`;
    mealList.appendChild(li);
  });

  document.getElementById("calorieCircle").textContent = `Calories: ${totalCalories}/${calorieGoal}`;
  document.getElementById("proteinCircle").textContent = `Protein: ${totalProtein}g/${proteinGoal}`;
}

function addMeal() {
  const calInput = document.getElementById("mealCalories");
  const protInput = document.getElementById("mealProtein");

  if (calInput.value && protInput.value) {
    meals.push({
      calories: parseInt(calInput.value),
      protein: parseInt(protInput.value),
    });
    calInput.value = "";
    protInput.value = "";
    saveMeals();
  }
}

function saveMeals() {
  localStorage.setItem("meals", JSON.stringify(meals));
  renderMeals();
}

// --- Settings ---
function renderSettings() {
  document.getElementById("calorieGoalInput").value = calorieGoal;
  document.getElementById("proteinGoalInput").value = proteinGoal;

  const settingsTaskList = document.getElementById("settingsTaskList");
  settingsTaskList.innerHTML = "";
  defaultTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task + " ";
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => {
      defaultTasks.splice(index, 1);
      renderSettings();
    };
    li.appendChild(delBtn);
    settingsTaskList.appendChild(li);
  });
}

function addDefaultTask() {
  const input = document.getElementById("newDefaultTaskInput");
  if (input.value.trim() !== "") {
    defaultTasks.push(input.value);
    input.value = "";
    renderSettings();
  }
}

function saveSettings() {
  calorieGoal = parseInt(document.getElementById("calorieGoalInput").value) || calorieGoal;
  proteinGoal = parseInt(document.getElementById("proteinGoalInput").value) || proteinGoal;
  localStorage.setItem("calorieGoal", calorieGoal);
  localStorage.setItem("proteinGoal", proteinGoal);
  localStorage.setItem("defaultTasks", JSON.stringify(defaultTasks));
  renderMeals();
  tasks = defaultTasks.map(t => ({ text: t, done: false }));
  saveTasks();
  alert("Settings saved!");
}

// Init
renderTasks();
renderMeals();
renderSettings();
