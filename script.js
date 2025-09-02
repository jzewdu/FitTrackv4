// --- Keep your existing task + meals logic ---
// Only replacing the renderMeals() part and adding drawRing()

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

// Replace inside renderMeals
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

  // draw rings
  drawRing("calorieRing", Math.min(totalCalories / calorieGoal, 1), "#4facfe");
  drawRing("proteinRing", Math.min(totalProtein / proteinGoal, 1), "#43e97b");
}
