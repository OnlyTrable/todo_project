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
  const cancelButton = document.querySelector(".cancel-button"); // Знаходимо кнопку "Отмена"

  if (fabButton && addTaskForm && cancelButton) {
    // Додано cancelButton до умови
    console.log("index.js: Attaching listeners for FAB and Close button");
    fabButton.addEventListener("click", () => {
      addTaskForm.classList.remove("hidden");
    });
    // Додаємо обробник для кнопки "Отмена"
    cancelButton.addEventListener("click", () => {
      // Використовуємо ?. на випадок, якщо кнопка не знайдена
      console.log("index.js: Cancel button clicked");
      addTaskForm.classList.add("hidden"); // Також приховуємо форму
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
    if (!cancelButton)
      console.error("Не вдалося знайти кнопку скасування (.cancel-button)!"); // Додано перевірку
  }
}); // Кінець єдиного обробника DOMContentLoaded
