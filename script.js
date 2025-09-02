// --- Data ---
let tasks = [];
let defaultTasks = [];
let meals = [];
let calorieGoal = 3000;
let proteinGoal = 150;

// --- Tab Switching ---
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });
  document.getElementById(tabId).classList.add("active");
}

// --- Tasks ---
function addTask() {
  const input = document.getElementById("newTaskInput");
  const text = input.value.trim();
  if (text) {
    tasks.push({ text, done: false });
    input.value = "";
    renderTasks();
    saveData();
  }
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
  saveData();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    li.style.textDecoration = task.done ? "line-through" : "none";
    li.onclick = () => toggleTask(i);
    list.appendChild(li);
  });
}

// --- Meals ---
function addMeal() {
  const calInput = document.getElementById("mealCalories");
  const protInput = document.getElementById("mealProtein");
  const calories = parseInt(calInput.value);
  const protein = parseInt(protInput.value);

  if (calories && protein) {
    meals.push({ calories, protein });
    calInput.value = "";
    protInput.value = "";
    renderMeals();
    saveData();
  }
}

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

  // draw progress rings
  drawRing("calorieRing", Math.min(totalCalories / calorieGoal, 1), "#4facfe");
  drawRing("proteinRing", Math.min(totalProtein / proteinGoal, 1), "#43e97b");
}

// --- Progress Rings ---
function drawRing(canvasId, progress, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const center = size / 2;
  const radius = size / 2 - 10;
  ctx.clearRect(0, 0, size, size);

  // background circle
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#eee";
  ctx.lineWidth = 12;
  ctx.stroke();

  // progress arc
  ctx.beginPath();
  ctx.arc(center, center, radius, -Math.PI/2, (2*Math.PI*progress) - Math.PI/2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.stroke();
}

// --- Settings ---
function saveSettings() {
  const calInput = document.getElementById("calorieGoalInput");
  const protInput = document.getElementById("proteinGoalInput");

  if (calInput.value) calorieGoal = parseInt(calInput.value);
  if (protInput.value) proteinGoal = parseInt(protInput.value);

  saveData();
  renderMeals();
  alert("Settings saved!");
}

// --- Persistence ---
function saveData() {
  localStorage.setItem("fittrackData", JSON.stringify({
    tasks, defaultTasks, meals, calorieGoal, proteinGoal
  }));
}

function loadData() {
  const saved = JSON.parse(localStorage.getItem("fittrackData"));
  if (saved) {
    tasks = saved.tasks || [];
    defaultTasks = saved.defaultTasks || [];
    meals = saved.meals || [];
    calorieGoal = saved.calorieGoal || 3000;
    proteinGoal = saved.proteinGoal || 150;
  }
  renderTasks();
  renderMeals();
}

// --- Init ---
window.onload = loadData;
