// todo_project/scripts/index.js
import {
  updateDateTime,
  handleFilterClick,
  toggleAriaChecked,
  showAddTaskForm, // Імпортуємо нову функцію
  hideAddTaskForm, // Імпортуємо нову функцію
  renderTasks, // Імпортуємо функцію рендерингу
} from "./uiFunctions.js";
// Імпортуємо функції з іншого файлу
// Важливо: шлях має бути відносним і починатися з ./ або ../
console.log("index.js: Script started"); // Перевірка запуску скрипта

// Додаємо ОДИН слухач події, який викличе функцію ПІСЛЯ завантаження DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log("index.js: DOMContentLoaded event fired");
  renderTasks(); // Відображаємо завдання при завантаженні сторінки
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
  const formOverlay = document.getElementById("form-overlay"); // Знаходимо overlay
  const cancelButton = document.querySelector(".cancel-button"); // Знаходимо кнопку "Отмена"
  const saveTaskButton = document.querySelector(".save-task-button"); // Знаходимо кнопку "Добавить"
  const taskDescriptionInput = addTaskForm.querySelector(
    '.task-input[type="text"]'
  ); // Поле опису
  const taskDateTimeInput = addTaskForm.querySelector(
    '.task-input[type="datetime-local"]'
  ); // Поле дати/часу

  if (
    fabButton &&
    addTaskForm &&
    cancelButton &&
    formOverlay &&
    saveTaskButton &&
    taskDescriptionInput &&
    taskDateTimeInput
  ) {
    // Додано cancelButton та formOverlay до умови
    console.log(
      "index.js: Attaching listeners for FAB, Cancel button and Overlay"
    );
    fabButton.addEventListener("click", () => {
      showAddTaskForm(fabButton, addTaskForm, formOverlay); // Передаємо overlay
    });
    // Додаємо обробник для кнопки "Отмена"
    cancelButton.addEventListener("click", () => {
      // Використовуємо ?. на випадок, якщо кнопка не знайдена
      console.log("index.js: Cancel button clicked");
      hideAddTaskForm(fabButton, addTaskForm, formOverlay); // Передаємо overlay
    });
    // Додаємо обробник для кнопки "Добавить"
    saveTaskButton.addEventListener("click", () => {
      console.log("index.js: Save button clicked");

      const description = taskDescriptionInput.value.trim(); // Отримуємо опис і видаляємо зайві пробіли
      const dateTime = taskDateTimeInput.value; // Отримуємо дату і час

      // Проста валідація: перевіряємо, чи не порожній опис
      if (!description) {
        alert("Пожалуйста, введите описание задачи."); // Або краще показати повідомлення у формі
        return; // Не додаємо завдання, якщо опис порожній
      }
      // Перевіряємо, чи вибрана дата та час
      if (!dateTime) {
        alert("Пожалуйста, выберите дату и время задачи.");
        return; // Не додаємо завдання, якщо дата/час не вибрані
      }
      // Створюємо об'єкт завдання
      const newTask = {
        id: Date.now(), // Унікальний ID на основі часу
        description: description,
        dateTime: dateTime, // Зберігаємо як рядок з input type="datetime-local"
        completed: false, // За замовчуванням не виконано
      };

      // Отримуємо існуючі завдання з LocalStorage
      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

      // Додаємо нове завдання
      tasks.push(newTask);

      // Зберігаємо оновлений список у LocalStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // Очищаємо поля форми
      taskDescriptionInput.value = "";
      taskDateTimeInput.value = "";

      // Ховаємо форму
      hideAddTaskForm(fabButton, addTaskForm, formOverlay);

      // TODO: Додати виклик функції для оновлення списку завдань на сторінці
      // renderTasks();
      renderTasks(); // Оновлюємо список після додавання нового завдання
    });
  } else {
    console.error(
      "index.js: Failed to find one or more elements for form interaction (FAB, Form, Overlay, Buttons, Inputs)!"
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
