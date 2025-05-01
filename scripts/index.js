// todo_project/scripts/index.js
import {
  updateDateTime,
  handleFilterClick,
  toggleAriaChecked,
  showAddTaskForm, // Імпортуємо нову функцію
  hideAddTaskForm, // Імпортуємо нову функцію
  renderTasks, // Імпортуємо функцію рендерингу
  initializeDateTimePicker, // Імпортуємо ініціалізатор flatpickr
  toggleTaskStatus, // Імпортуємо функцію зміни статусу
  prepareEditForm, // Імпортуємо функцію підготовки форми редагування
} from "./uiFunctions.js"; // Імпортуємо функції UI
import { t, initI18n } from "./i18n.js"; // Імпортуємо функції локалізації

// Важливо: шлях має бути відносним і починатися з ./ або ../
console.log("index.js: Script started"); // Перевірка запуску скрипта

// Додаємо ОДИН слухач події, який викличе функцію ПІСЛЯ завантаження DOM
document.addEventListener("DOMContentLoaded", async () => {
  // Робимо обробник асинхронним
  console.log("index.js: DOMContentLoaded event fired");
  // --- Функціонал для фільтрів ---
  const filterButtons = document.querySelectorAll(".filter-button");
  console.log("index.js: Filter buttons found:", filterButtons);
  // --- Функціонал для FAB та форми додавання ---
  const fabButton = document.querySelector(".fab-button");
  const addTaskForm = document.getElementById("add-task-form");
  const formOverlay = document.getElementById("form-overlay"); // Знаходимо overlay
  const cancelButton = document.querySelector(".cancel-button"); // Знаходимо кнопку "Отмена"
  const saveTaskButton = document.querySelector(".save-task-button"); // Знаходимо кнопку "Добавить"
  // Оновлюємо селектор для інпута опису
  const taskDescriptionInput = addTaskForm.querySelector(
    ".task-description-input"
  );
  // Знаходимо поле за новим ID
  const taskDateTimePicker = document.getElementById("task-datetime-picker");

  // --- Поле пошуку ---
  const searchInput = document.querySelector(".search-input");

  // --- Контейнер завдань ---
  const taskContainer = document.querySelector(".task-container");

  // --- Елементи хедера ---
  const filterContainer = document.querySelector(".filter-container"); // ВИПРАВЛЕНО: Шукаємо .filter-container
  const titleContainer = document.querySelector(".header-title-container");

  // --- Завантажуємо переклади ПЕРЕД ініціалізацією UI ---
  await initI18n(); // Викликаємо ініціалізацію з нового модуля

  if (
    fabButton &&
    addTaskForm &&
    cancelButton &&
    formOverlay &&
    saveTaskButton &&
    taskDescriptionInput &&
    taskDateTimePicker && // ВИПРАВЛЕНО: Використовуємо нову змінну
    taskContainer && // Додаємо перевірку для taskContainer
    searchInput && // Додаємо перевірку для searchInput
    filterContainer && // Додаємо перевірку
    titleContainer // Додаємо перевірку
  ) {
    // --- Оновлюємо статичний текст на сторінці ---
    document.title = t("appTitle");
    if (searchInput) searchInput.placeholder = t("searchPlaceholder");
    if (titleContainer)
      titleContainer.querySelector("h2").textContent = t("headerTitle");
    filterButtons.forEach((button) => {
      if (button.classList.contains("alltasks"))
        button.childNodes[button.childNodes.length - 1].nodeValue = ` ${t(
          "filterAll"
        )}`;
      // Оновлюємо текстовий вузол
      else if (button.classList.contains("activetasks"))
        button.childNodes[button.childNodes.length - 1].nodeValue = ` ${t(
          "filterActive"
        )}`;
      else if (button.classList.contains("completedtasks"))
        button.childNodes[button.childNodes.length - 1].nodeValue = ` ${t(
          "filterCompleted"
        )}`;
    });
    if (taskDescriptionInput)
      taskDescriptionInput.placeholder = t("taskDescPlaceholder");
    if (taskDateTimePicker)
      taskDateTimePicker.placeholder = t("taskDateTimePlaceholder"); // Placeholder для видимого поля flatpickr
    if (saveTaskButton) saveTaskButton.textContent = t("addButton"); // Початковий текст кнопки
    if (cancelButton) cancelButton.textContent = t("cancelButton");
    // Оновлюємо мітку "Напомнить мне"
    const remindLabel = addTaskForm.querySelector(".remind-label");
    if (remindLabel) remindLabel.textContent = t("remindMeLabel");
    // --- Кінець оновлення статичного тексту ---

    // Додано cancelButton та formOverlay до умови
    console.log(
      "index.js: Attaching listeners for FAB, Cancel button and Overlay"
    );

    initializeDateTimePicker(taskDateTimePicker); // Викликаємо імпортовану функцію
    fabButton.addEventListener("click", () => {
      showAddTaskForm(
        // Залишаємо один правильний виклик
        fabButton,
        addTaskForm,
        formOverlay,
        filterContainer,
        titleContainer
      ); // Передаємо нові елементи
    });
    // Додаємо обробник для кнопки "Отмена"
    cancelButton.addEventListener("click", () => {
      // Використовуємо ?. на випадок, якщо кнопка не знайдена
      console.log("index.js: Cancel button clicked");
      hideAddTaskForm(
        fabButton,
        addTaskForm,
        formOverlay,
        filterContainer,
        titleContainer
      ); // Передаємо нові елементи
      // Скидаємо режим редагування, якщо він був активний
      if (addTaskForm.dataset.editingTaskId) {
        delete addTaskForm.dataset.editingTaskId;
        delete addTaskForm.dataset.originalDescription;
        delete addTaskForm.dataset.originalDateTime;
        saveTaskButton.textContent = t("addButton"); // Повертаємо текст кнопки
        taskDescriptionInput.value = ""; // Очищаємо поля
        taskDateTimePicker._flatpickr.clear();
      }
    });
    // Додаємо обробник для кнопки "Добавить"
    saveTaskButton.addEventListener("click", () => {
      console.log("index.js: Save button clicked");

      const description = taskDescriptionInput.value.trim(); // Отримуємо опис і видаляємо зайві пробіли
      const dateTime = taskDateTimePicker.value; // Отримуємо дату і час з поля flatpickr

      // Проста валідація: перевіряємо, чи не порожній опис
      if (!description) {
        alert(t("alertDescRequired")); // Використовуємо переклад
        return; // Не додаємо завдання, якщо опис порожній
      }
      // Перевіряємо, чи вибрана дата та час
      if (!dateTime) {
        alert(t("alertDateTimeRequired")); // Використовуємо переклад
        return; // Не додаємо завдання, якщо дата/час не вибрані
      }

      // Отримуємо існуючі завдання з LocalStorage
      let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      const editingTaskId = addTaskForm.dataset.editingTaskId; // Отримуємо ID редагованого завдання
      if (editingTaskId) {
        // --- Режим редагування ---
        const originalDescription = addTaskForm.dataset.originalDescription;
        const originalDateTime = addTaskForm.dataset.originalDateTime;

        // Перевіряємо, чи були зміни
        if (
          description === originalDescription &&
          dateTime === originalDateTime
        ) {
          console.log("index.js: No changes detected. Closing form.");
          // Зміни не було, просто закриваємо форму
          hideAddTaskForm(fabButton, addTaskForm, formOverlay);
          // Скидаємо режим редагування
          delete addTaskForm.dataset.editingTaskId;
          delete addTaskForm.dataset.originalDescription;
          delete addTaskForm.dataset.originalDateTime;
          saveTaskButton.textContent = t("addButton");
          taskDescriptionInput.value = "";
          taskDateTimePicker._flatpickr.clear();
          return; // Виходимо, нічого не зберігаємо
        }

        // Зміни були, оновлюємо завдання
        const taskIndex = tasks.findIndex((task) => task.id == editingTaskId);
        if (taskIndex !== -1) {
          tasks[taskIndex].description = description;
          tasks[taskIndex].dateTime = dateTime;
          // --- Додано: Реактивація завдання, якщо нова дата в майбутньому ---
          const newDateTime = new Date(dateTime).getTime();
          const now = Date.now();
          if (!isNaN(newDateTime) && newDateTime > now) {
            tasks[taskIndex].completed = false; // Робимо завдання знову активним
            console.log(
              `index.js: Reactivated task ID: ${editingTaskId} due to future date.`
            );
          }
          // --- Кінець доданого коду ---
          console.log(`index.js: Updated task ID: ${editingTaskId}`);
        } else {
          console.error(
            `index.js: Task with ID ${editingTaskId} not found for update!`
          );
          // Можливо, варто показати помилку користувачу
        }
        // Скидаємо режим редагування після оновлення
        delete addTaskForm.dataset.editingTaskId;
        delete addTaskForm.dataset.originalDescription;
        delete addTaskForm.dataset.originalDateTime;
        saveTaskButton.textContent = t("addButton");
      } else {
        // --- Режим додавання нового завдання ---
        console.log("TODO: Add new task");
        const newTask = {
          id: Date.now(), // Унікальний ID на основі часу
          description: description,
          dateTime: dateTime,
          completed: false,
        };
        tasks.push(newTask);
        console.log(`index.js: Added new task with ID: ${newTask.id}`);
      }

      // Зберігаємо оновлений список у LocalStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // Очищаємо поля форми
      taskDescriptionInput.value = "";
      taskDateTimePicker._flatpickr.clear(); // Використовуємо метод flatpickr для очищення

      // Ховаємо форму
      hideAddTaskForm(
        fabButton,
        addTaskForm,
        formOverlay,
        filterContainer,
        titleContainer
      ); // Передаємо нові елементи

      // TODO: Додати виклик функції для оновлення списку завдань на сторінці
      // Оновлюємо список після додавання/редагування
      renderTasks({
        searchTerm: currentSearchTerm,
        status: currentFilterStatus,
      });
      attachTaskListeners(); // Додаємо слухачі після оновлення
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
      ); // Знаходимо батьківський елемент завдання
      const taskItem = event.target.closest(".task-item");

      if (checkboxContainer) {
        // --- Пріоритет: Логіка для чекбокса (зміна статусу completed) ---
        const taskId = checkboxContainer.dataset.taskId;
        console.log(`index.js: Checkbox clicked for task ID: ${taskId}`);
        let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        const updatedTasks = toggleTaskStatus(taskId, tasks); // Викликаємо функцію з uiFunctions
        if (updatedTasks) {
          localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Зберігаємо результат
          renderTasks({
            searchTerm: currentSearchTerm,
            status: currentFilterStatus,
          });
          attachTaskListeners();
        }
      } else if (taskItem) {
        // --- Якщо клік був не по чекбоксу, а по самому завданню - відкриваємо редагування ---
        const taskId = taskItem.dataset.taskId; // Беремо ID з .task-item
        console.log(`index.js: Task item clicked for edit, ID: ${taskId}`);
        let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        // Викликаємо функцію підготовки форми з uiFunctions
        const taskToEdit = prepareEditForm(
          taskId,
          tasks,
          addTaskForm,
          taskDescriptionInput,
          taskDateTimePicker,
          saveTaskButton
        );
        if (taskToEdit) saveTaskButton.textContent = t("saveButton"); // Змінюємо текст кнопки при редагуванні
        if (taskToEdit) {
          // Якщо підготовка успішна, показуємо форму
          showAddTaskForm(
            // Додаємо відсутні аргументи
            fabButton,
            addTaskForm,
            formOverlay,
            filterContainer,
            titleContainer
          );
        }
      } // Кінець else if (taskItem)
    }
    // --- Ініціалізація після завантаження перекладів ---
    updateDateTime(); // Оновлюємо дату/час (можливо, теж потребує локалізації формату?)

    // --- Автоматичне завершення прострочених завдань ---
    try {
      let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      const now = Date.now(); // Поточний час у мілісекундах
      let tasksUpdated = false;

      tasks = tasks.map((task) => {
        if (!task.completed && task.dateTime) {
          // Перевіряємо тільки невиконані завдання з датою
          const taskTime = new Date(task.dateTime).getTime();
          if (!isNaN(taskTime) && taskTime < now) {
            console.log(
              `index.js: Automatically completing past task ID: ${task.id}`
            );
            task.completed = true;
            tasksUpdated = true;
          }
        }
        return task;
      });

      if (tasksUpdated) {
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Зберігаємо зміни, якщо вони були
      }
    } catch (error) {
      console.error("index.js: Error during auto-completion check:", error);
    }

    // --- Автоматичне видалення завдань, старших за тиждень ---
    try {
      let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      const originalTaskCount = tasks.length;
      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000; // Мілісекунди за 7 днів

      // Фільтруємо, залишаючи тільки ті завдання, ID (час створення) яких не старший за тиждень
      const recentTasks = tasks.filter((task) => task.id >= oneWeekAgo);

      if (recentTasks.length < originalTaskCount) {
        const removedCount = originalTaskCount - recentTasks.length;
        console.log(
          `index.js: Automatically removing ${removedCount} task(s) older than one week.`
        );
        localStorage.setItem("tasks", JSON.stringify(recentTasks)); // Зберігаємо відфільтрований список
      }
    } catch (error) {
      console.error("index.js: Error during old task cleanup:", error);
    }
    // --- Кінець автоматичного видалення ---

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
    if (!filterContainer)
      console.error(
        "Не вдалося знайти контейнер фільтрів (.filter-container)!"
      ); // ВИПРАВЛЕНО: Повідомлення про помилку
    if (!titleContainer)
      console.error(
        "Не вдалося знайти контейнер заголовка (.header-title-container)!"
      ); // Додано перевірку
  }
  // Викликаємо рендеринг навіть якщо якісь елементи не знайдено,
  // щоб показати завдання або повідомлення "Немає завдань"
  renderTasks(); // Початковий рендеринг
}); // Кінець єдиного обробника DOMContentLoaded
