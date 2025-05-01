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
  updateDateTime(); // Викликаємо імпортовану функцію
  // --- Функціонал для фільтрів ---
  const filterButtons = document.querySelectorAll(".filter-button");
  console.log("index.js: Filter buttons found:", filterButtons);
  // --- Функціонал для FAB та форми додавання ---
  const fabButton = document.querySelector(".fab-button");
  const addTaskForm = document.getElementById("add-task-form");
  const formOverlay = document.getElementById("form-overlay"); // Знаходимо overlay
  const cancelButton = document.querySelector(".cancel-button"); // Знаходимо кнопку "Отмена"
  const saveTaskButton = document.querySelector(".save-task-button"); // Знаходимо кнопку "Добавить"
  const taskDescriptionInput = addTaskForm.querySelector(
    '.task-input[type="text"]'
  ); // Поле опису
  // Знаходимо поле за новим ID
  const taskDateTimePicker = document.getElementById("task-datetime-picker");

  // --- Поле пошуку ---
  const searchInput = document.querySelector(".search-input");

  // --- Контейнер завдань ---
  const taskContainer = document.querySelector(".task-container");

  if (
    fabButton &&
    addTaskForm &&
    cancelButton &&
    formOverlay &&
    saveTaskButton &&
    taskDescriptionInput &&
    taskDateTimePicker && // ВИПРАВЛЕНО: Використовуємо нову змінну
    taskContainer && // Додаємо перевірку для taskContainer
    searchInput // Додаємо перевірку для searchInput
  ) {
    // Додано cancelButton та formOverlay до умови
    console.log(
      "index.js: Attaching listeners for FAB, Cancel button and Overlay"
    );
    // Ініціалізація flatpickr
    flatpickr(taskDateTimePicker, {
      enableTime: true, // Увімкнути вибір часу
      dateFormat: "Y-m-d H:i", // Формат дати, який буде зберігатися у value поля
      altInput: true, // Створити додаткове, видиме користувачу поле
      altFormat: "j F Y, H:i", // Формат дати, який бачить користувач (напр., 14 Серпня 2024, 15:30)
      time_24hr: true, // Використовувати 24-годинний формат часу
    });
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
      const dateTime = taskDateTimePicker.value; // Отримуємо дату і час з поля flatpickr

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
      taskDateTimePicker._flatpickr.clear(); // Використовуємо метод flatpickr для очищення

      // Ховаємо форму
      hideAddTaskForm(fabButton, addTaskForm, formOverlay);

      // TODO: Додати виклик функції для оновлення списку завдань на сторінці
      // renderTasks();
      renderTasks(); // Оновлюємо список після додавання нового завдання
      attachTaskListeners(); // Переприв'язуємо слухачі після рендерингу
    });
    // --- Змінні для зберігання поточних фільтрів ---
    let currentSearchTerm = "";
    let currentFilterStatus = "all"; // 'all', 'active', 'completed'

    // --- Функція для додавання слухачів до завдань (використовуємо делегування) ---
    function attachTaskListeners() {
      console.log("index.js: Attaching listeners to task container");
      // Видаляємо попередній слухач, щоб уникнути дублювання, якщо функція викликається кілька разів
      taskContainer.removeEventListener("click", handleTaskClick);
      // Додаємо нового слухача
      taskContainer.addEventListener("click", handleTaskClick);
    }

    // --- Обробник кліків всередині контейнера завдань ---
    function handleTaskClick(event) {
      const checkboxContainer = event.target.closest(
        ".task-checkbox-container"
      );
      if (checkboxContainer) {
        const taskId = checkboxContainer.dataset.taskId;
        console.log(`index.js: Checkbox clicked for task ID: ${taskId}`);
        if (taskId) {
          // 1. Отримуємо завдання з LocalStorage
          let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
          // 2. Знаходимо індекс завдання
          const taskIndex = tasks.findIndex((task) => task.id == taskId); // Використовуємо ==, бо ID з dataset - рядок
          if (taskIndex !== -1) {
            // 3. Змінюємо статус completed
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            // 4. Зберігаємо оновлений список
            localStorage.setItem("tasks", JSON.stringify(tasks));
            // 5. Перерендеримо список, щоб показати зміни
            renderTasks({
              searchTerm: currentSearchTerm,
              status: currentFilterStatus,
            }); // Передаємо поточні фільтри
            attachTaskListeners(); // Важливо переприв'язати слухачі після рендерингу!
          }
        }
      }
    }

    // --- Ініціалізація ---
    renderTasks({ searchTerm: currentSearchTerm, status: currentFilterStatus }); // Відображаємо завдання при завантаженні сторінки
    attachTaskListeners(); // Додаємо слухачі до завдань після першого рендерингу

    // --- Обробник для поля пошуку ---
    searchInput.addEventListener("input", (event) => {
      currentSearchTerm = event.target.value; // Оновлюємо поточний пошуковий запит
      console.log(`index.js: Search input changed: ${currentSearchTerm}`);
      // Перерендеримо список з новим пошуковим запитом та поточним фільтром статусу
      renderTasks({
        searchTerm: currentSearchTerm,
        status: currentFilterStatus,
      });
      attachTaskListeners(); // Переприв'язуємо слухачі
    });
    // Додаємо слухачі до кнопок фільтрів
    filterButtons.forEach((button) => {
      // Замінюємо простий виклик handleFilterClick на повну логіку
      button.addEventListener("click", (event) => {
        // Використовуємо div як "button"
        // 1. Оновлюємо візуальний стан кнопки (викликаємо імпортовану функцію)
        handleFilterClick(event);

        // 2. Визначаємо тип фільтра за класом елемента
        const clickedElement = event.currentTarget;
        if (clickedElement.classList.contains("alltasks")) {
          currentFilterStatus = "all";
        } else if (clickedElement.classList.contains("activetasks")) {
          currentFilterStatus = "active";
        } else if (clickedElement.classList.contains("completedtasks")) {
          currentFilterStatus = "completed";
        }
        console.log(`index.js: Filter changed to: ${currentFilterStatus}`);
        // 3. Перерендеримо список з новим фільтром статусу та поточним пошуковим запитом
        renderTasks({
          searchTerm: currentSearchTerm,
          status: currentFilterStatus,
        });
        attachTaskListeners(); // Переприв'язуємо слухачі
      });
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
    if (!taskDateTimePicker)
      console.error(
        "Не вдалося знайти поле вибору дати/часу (#task-datetime-picker)!"
      );
    if (!cancelButton)
      console.error("Не вдалося знайти кнопку скасування (.cancel-button)!"); // Додано перевірку
    if (!searchInput)
      console.error("Не вдалося знайти поле пошуку (.search-input)!"); // Додано перевірку
    if (!taskContainer)
      console.error("Не вдалося знайти контейнер завдань (.task-container)!"); // Додано перевірку
  }
}); // Кінець єдиного обробника DOMContentLoaded
