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
  // --- Функціонал для фільтрів ---
  const filterButtons = document.querySelectorAll(".filter-button");
  console.log("index.js: Filter buttons found:", filterButtons);
  filterButtons.forEach((button) => {
    button.addEventListener("click", handleFilterClick);
  });
  // --- Функціонал для перемикачів ---
  // !!! Переконайтеся, що цей рядок є тут, ПЕРЕД циклом forEach !!!
  const switchContainerCh = document.querySelectorAll(".switch-container");
  console.log("index.js: Switch containers found:", switchContainerCh);
  // Додаємо обробник кліку до кожного перемикача
  switchContainerCh.forEach((switchElement) => {
    // Цей рядок, ймовірно, є рядком 26 або близько того
    switchElement.addEventListener("click", function () {
      this.classList.toggle("is-off");
      toggleAriaChecked(this);
    });
  });
  // --- Функціонал для FAB та форми додавання ---
  const fabButton = document.querySelector(".fab-button");
  const addTaskForm = document.getElementById("add-task-form");
  const closeFormButton = document.getElementById("close-form-button");
  console.log("index.js: FAB button found:", fabButton);
  console.log("index.js: Add task form found:", addTaskForm);
  console.log("index.js: Close form button found:", closeFormButton);

  if (fabButton && addTaskForm && closeFormButton) {
    console.log("index.js: Attaching listeners for FAB and Close button");
    fabButton.addEventListener("click", () => {
      addTaskForm.classList.remove("hidden");
    });
    closeFormButton.addEventListener("click", () => {
      addTaskForm.classList.add("hidden");
    });
  } else {
    console.error(
      "index.js: Failed to find one or more elements for form interaction!"
    );
    if (!fabButton)
      console.error("Не вдалося знайти FAB кнопку (.fab-button)!");
    if (!addTaskForm)
      console.error(
        "Не вдалося знайти форму додавання завдання (#add-task-form)!"
      );
    if (!closeFormButton)
      console.error("Не вдалося знайти кнопку закриття (#close-form-button)!");
  }
}); // Кінець єдиного обробника DOMContentLoaded

// Знаходимо всі кнопки фільтрів і додаємо обробник кліку
const filterButtons = document.querySelectorAll(".filter-button");
document.addEventListener("DOMContentLoaded", () => {
  console.log("index.js: Filter buttons found:", filterButtons); // Перевірка знаходження кнопок
  filterButtons.forEach((button) => {
    button.addEventListener("click", handleFilterClick); // Використовуємо імпортовану функцію
  });
});

// --- Функціонал для FAB та форми додавання ---

const fabButton = document.querySelector(".fab-button");
const addTaskForm = document.getElementById("add-task-form");
const closeFormButton = document.getElementById("close-form-button"); // Знаходимо кнопку закриття (хрестик)

if (fabButton && addTaskForm && closeFormButton) {
  // Обробник для FAB-кнопки: показуємо форму
  fabButton.addEventListener("click", () => {
    addTaskForm.classList.remove("hidden"); // Видаляємо клас hidden
  });
  // Обробник для кнопки "Отмена": приховуємо форму
  closeFormButton.addEventListener("click", () => {
    addTaskForm.classList.add("hidden"); // Додаємо клас hidden для закриття форми
  });
} else {
  if (!fabButton) console.error("Не вдалося знайти FAB кнопку (.fab-button)!");
  if (!closeFormButton)
    console.error("Не вдалося знайти кнопку закриття (#close-form-button)!");
}
