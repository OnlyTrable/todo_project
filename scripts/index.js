// todo_project/scripts/index.js
import {
  updateDateTime,
  handleFilterClick,
  toggleAriaChecked,
} from "./uiFunctions.js";
// Імпортуємо функції з іншого файлу
// Важливо: шлях має бути відносним і починатися з ./ або ../
console.log("index.js: Script started"); // Перевірка запуску скрипта

// Додаємо ОДИН слухач події, який викличе функцію ПІСЛЯ завантаження DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log("index.js: DOMContentLoaded event fired");
  updateDateTime(); // Викликаємо імпортовану функцію
});
// Знаходимо всі кнопки фільтрів і додаємо обробник кліку
const filterButtons = document.querySelectorAll(".filter-button");
document.addEventListener("DOMContentLoaded", () => {
  console.log("index.js: Filter buttons found:", filterButtons); // Перевірка знаходження кнопок
  filterButtons.forEach((button) => {
    button.addEventListener("click", handleFilterClick); // Використовуємо імпортовану функцію
  });
});

const switchContainerCh = document.querySelectorAll(".switch-container");
console.log("index.js: Switch containers found:", switchContainerCh); // Перевірка знаходження контейнерів

const fabButton = document.querySelector(".fab-button");
const addTaskForm = document.getElementById("add-task-form");
const closeFormButton = document.getElementById("close-form-button"); // Знаходимо кнопку закриття (хрестик)
console.log("index.js: FAB button found:", fabButton); // Перевірка знаходження FAB
console.log("index.js: Add task form found:", addTaskForm); // Перевірка знаходження форми
console.log("index.js: Close form button found:", closeFormButton); // Перевірка знаходження кнопки закриття
