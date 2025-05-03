import { t } from "./i18n.js"; // Імпортуємо функцію перекладу з нового модуля

/**
 * Оновлює елементи DOM для відображення поточного дня тижня та дати/місяця.
 */
export function updateDateTime() {
  const dayOfWeekElement = document.querySelector(".day-of-week");
  const dateMonthElement = document.querySelector(".date-month");
  const currentLang = navigator.language; // Використовуємо повну локаль для форматування
  if (!dayOfWeekElement || !dateMonthElement) {
    console.error("Не вдалося знайти елементи .day-of-week або .date-month!");
    return;
  }

  const now = new Date();
  const dayOptions = { weekday: "long" };
  const dateOptions = { day: "numeric", month: "long" };

  let dayOfWeek = now.toLocaleString(currentLang, dayOptions); // Використовуємо мову браузера
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const dateMonth = now.toLocaleString(currentLang, dateOptions); // Використовуємо мову браузера

  dayOfWeekElement.textContent = dayOfWeek;
  dateMonthElement.textContent = dateMonth;
}

/**
 * Обробляє клік по кнопці фільтра, оновлюючи активний стан.
 * @param {Event} event - Подія кліку.
 */
export function handleFilterClick(event) {
  const currentActiveFilter = document.querySelector(
    ".filter-button.active-filter"
  );
  if (currentActiveFilter) {
    currentActiveFilter.classList.remove("active-filter");
  }
  event.currentTarget.classList.add("active-filter");
}

/**
 * Перемикає значення атрибута aria-checked між "true" та "false".
 * @param {Element} element - Елемент, для якого потрібно перемкнути атрибут.
 */
export function toggleAriaChecked(element) {
  const currentValue = element.getAttribute("aria-checked");
  const newValue = currentValue === "false" ? "true" : "false";
  element.setAttribute("aria-checked", newValue);
}
/* Показує форму додавання завдання та приховує FAB кнопку.
 * @param {Element} fabButton - Елемент FAB кнопки.
 * @param {Element} addTaskForm - Елемент форми додавання завдання.
 * @param {Element} overlay - Елемент overlay.
 * @param {Element} filterContainer - Контейнер з кнопками фільтрів.
 * @param {Element} titleContainer - Контейнер з заголовком "Список дел".
 */
export function showAddTaskForm(
  fabButton,
  addTaskForm,
  overlay,
  filterContainer,
  titleContainer
) {
  // Додано аргументи
  if (fabButton) fabButton.classList.add("hidden"); // Приховуємо FAB
  if (addTaskForm) addTaskForm.classList.remove("hidden"); // Показуємо форму
  if (overlay) overlay.classList.remove("hidden"); // Показуємо overlay
  if (filterContainer) filterContainer.classList.add("hidden"); // Приховуємо фільтри
  if (titleContainer) titleContainer.classList.remove("hidden"); // Показуємо заголовок
}
/**
 * Відображає список завдань на сторінці.
 */
export function renderTasks(filters = { searchTerm: "", status: "all" }) {
  const taskContainer = document.querySelector(".task-container"); // ВИПРАВЛЕНО: Знаходимо .task-container

  if (!taskContainer) {
    console.error("renderTasks: Не вдалося знайти контейнер .task-container!");
    return;
  }

  // 1. Отримуємо завдання з LocalStorage
  let tasks = [];
  try {
    tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  } catch (error) {
    console.error(
      "renderTasks: Помилка парсингу завдань з LocalStorage:",
      error
    );
    // Можливо, варто очистити localStorage, якщо дані пошкоджені
    // localStorage.removeItem('tasks');
  }
  // 1.5 Сортуємо завдання за датою/часом (найближчі спочатку)
  // Ми можемо порівнювати рядки 'YYYY-MM-DD HH:MM' напряму
  tasks.sort((a, b) => {
    const timeA = a.dateTime ? new Date(a.dateTime).getTime() : Infinity;
    const timeB = b.dateTime ? new Date(b.dateTime).getTime() : Infinity;

    // Обробка недійсних дат (NaN) - відправляємо їх у кінець
    const validTimeA = isNaN(timeA) ? Infinity : timeA;
    const validTimeB = isNaN(timeB) ? Infinity : timeB;

    return validTimeA - validTimeB; // Порівнюємо числові мітки часу
  });
  // Застосовуємо фільтри
  const searchTerm = filters.searchTerm?.toLowerCase() || "";
  const filterStatus = filters.status || "all";

  const filteredTasks = tasks.filter((task) => {
    // Фільтр за пошуковим запитом
    const matchesSearch = task.description.toLowerCase().includes(searchTerm);

    // Фільтр за статусом
    let matchesStatus = true;
    if (filterStatus === "active") {
      matchesStatus = !task.completed;
    } else if (filterStatus === "completed") {
      matchesStatus = task.completed;
    } // 'all' не потребує перевірки статусу

    return matchesSearch && matchesStatus;
  });

  console.log(
    `renderTasks: Відображається ${filteredTasks.length} з ${tasks.length} завдань (Фільтри: пошук='${searchTerm}', статус='${filterStatus}')`
  );

  // 2. Очищаємо поточний вміст контейнера (щоб уникнути дублікатів при оновленні)
  taskContainer.innerHTML = ""; // ВИПРАВЛЕНО: Очищаємо .task-container

  // 3. TODO: Перебираємо завдання і створюємо HTML для кожного
  if (filteredTasks.length === 0) {
    taskContainer.innerHTML = `<p>${t("noTasks")}</p>`; // Використовуємо переклад
  } else {
    // ВИПРАВЛЕНО: Перебираємо відфільтровані завдання, а не всі
    filteredTasks.forEach((task) => {
      // Створюємо головний контейнер для завдання
      const taskElement = document.createElement("div");
      taskElement.classList.add("task-item");
      taskElement.dataset.taskId = task.id; // Додаємо data-attribute з ID

      // Додаємо клас, якщо завдання виконано (для можливих стилів)
      if (task.completed) {
        taskElement.classList.add("completed");
      }

      // Форматуємо дату та час для кращого відображення (приклад)
      let formattedDateTime = "Не вказано";
      if (task.dateTime) {
        try {
          const date = new Date(task.dateTime);
          // Використовуємо локаль браузера для форматування
          formattedDateTime = date.toLocaleString(navigator.language, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch (e) {
          console.warn(`Не вдалося відформатувати дату: ${task.dateTime}`);
          formattedDateTime = task.dateTime; // Показуємо як є, якщо помилка
        }
      }

      // Створюємо HTML-розмітку для завдання
      // Зверни увагу на додавання data-task-id до перемикача
      taskElement.innerHTML = `
        <div class="task-checkbox-container" data-task-id="${task.id}"> <!-- Додаємо ID сюди для кліку -->
          <div class="task-checkbox"></div> <!-- Візуальний чекбокс -->
        </div>
        <div class="task-details">
          <p class="task-datetime">${formattedDateTime}</p>
          <p class="task-description">${task.description}</p>
        </div>
      `;

      // Додаємо створений елемент завдання до контейнера
      taskContainer.appendChild(taskElement); // ВИПРАВЛЕНО: Додаємо до .task-container
    });

    // !!! ВАЖЛИВО: Після додавання нових перемикачів до DOM, потрібно заново навісити на них обробники подій !!!
    // Ми зробимо це в index.js після виклику renderTasks
  }
}

// Переконайся, що твій CSS має клас .hidden:
// .hidden { display: none !important; }
// Також переконайся, що форма #add-task-form має клас 'hidden' в HTML спочатку.

/**
 * Приховує форму додавання завдання та показує FAB кнопку.
 * @param {Element} fabButton - Елемент FAB кнопки.
 * @param {Element} addTaskForm - Елемент форми додавання завдання.
 * @param {Element} overlay - Елемент overlay.
 * @param {Element} filterContainer - Контейнер з кнопками фільтрів.
 * @param {Element} titleContainer - Контейнер з заголовком "Список дел".
 */
export function hideAddTaskForm(
  fabButton,
  addTaskForm,
  overlay,
  filterContainer,
  titleContainer
) {
  // Додано аргументи
  if (addTaskForm) addTaskForm.classList.add("hidden"); // Приховуємо форму
  if (fabButton) fabButton.classList.remove("hidden"); // Показуємо FAB
  if (overlay) overlay.classList.add("hidden"); // Приховуємо overlay
  if (filterContainer) filterContainer.classList.remove("hidden"); // Показуємо фільтри
  if (titleContainer) titleContainer.classList.add("hidden"); // Приховуємо заголовок
}
// Переконайся, що твій CSS має клас .hidden:
// .hidden { display: none !important; }
// Також переконайся, що форма #add-task-form має клас 'hidden' в HTML спочатку.
/**
 * Ініціалізує flatpickr для елемента вибору дати/часу з динамічною локалізацією.
 * @param {Element} dateTimePickerElement - Елемент input, для якого ініціалізується flatpickr.
 */
export function initializeDateTimePicker(dateTimePickerElement) {
  if (!dateTimePickerElement) {
    console.error(
      "initializeDateTimePicker: Не передано елемент для ініціалізації!"
    );
    return;
  }

  function _initFlatpickr(locale = "default") {
    console.log(`uiFunctions: Initializing flatpickr with locale: ${locale}`);
    flatpickr(dateTimePickerElement, {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      altInput: true,
      altFormat: "j F Y, H:i",
      time_24hr: true,
      minDate: "today", // Забороняємо вибирати минулі дати
      locale: locale,
    });
  }
  const browserLang = navigator.language.slice(0, 2);
  // Список мов, для яких ми будемо намагатися завантажити локалізацію
  const supportedLocalesToLoad = ["de", "ru", "uk"];
  if (supportedLocalesToLoad.includes(browserLang)) {
    // Якщо мова браузера є в нашому списку для завантаження
    if (flatpickr.l10ns && flatpickr.l10ns[browserLang]) {
      // Якщо локаль вже завантажена (наприклад, при повторному виклику)
      console.log(`uiFunctions: Locale ${browserLang} already loaded.`);
      _initFlatpickr(browserLang);
    } else {
      // Спробуємо завантажити локалізацію
      const localeUrl = `https://npmcdn.com/flatpickr/dist/l10n/${browserLang}.js`;
      const script = document.createElement("script");
      script.src = localeUrl;
      script.onload = () => {
        console.log(`uiFunctions: Successfully loaded locale: ${browserLang}`);
        _initFlatpickr(browserLang); // Ініціалізуємо з завантаженою локаллю
      };
      script.onerror = () => {
        console.warn(
          `uiFunctions: Failed to load locale ${browserLang}. Using default (en).`
        );
        _initFlatpickr("default"); // Якщо завантаження не вдалося, ініціалізуємо з 'default'
      };
      document.body.appendChild(script);
    }
  } else {
    // Якщо мова браузера не в списку (включаючи 'en') або щось пішло не так, використовуємо 'default'

    _initFlatpickr("default");
  }
}
/**
 * Знаходить завдання за ID та змінює його статус completed.
 * @param {number|string} taskId - ID завдання, статус якого потрібно змінити.
 * @param {Array<object>} tasks - Масив усіх завдань.
 * @returns {Array<object>|null} - Оновлений масив завдань або null, якщо завдання не знайдено.
 */
export function toggleTaskStatus(taskId, tasks) {
  const taskIndex = tasks.findIndex((task) => task.id == taskId); // Порівнюємо як рядки або числа
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    console.log(
      `uiFunctions: Toggled status for task ID: ${taskId} to ${tasks[taskIndex].completed}`
    );
    return tasks;
  }
  console.warn(
    `uiFunctions: Task with ID ${taskId} not found for toggling status.`
  );
  return null;
}

/**
 * Готує форму для редагування завдання, заповнюючи поля та встановлюючи режим редагування.
 * @param {number|string} taskId - ID завдання для редагування.
 * @param {Array<object>} tasks - Масив усіх завдань.
 * @param {HTMLFormElement} addTaskForm - Елемент форми.
 * @param {HTMLInputElement} taskDescriptionInput - Поле вводу опису.
 * @param {HTMLInputElement} taskDateTimePicker - Поле вводу дати/часу (з flatpickr).
 * @param {HTMLButtonElement} saveTaskButton - Кнопка збереження.
 * @returns {object|null} - Об'єкт завдання, що редагується, або null, якщо не знайдено.
 */
export function prepareEditForm(
  taskId,
  tasks,
  addTaskForm,
  taskDescriptionInput,
  taskDateTimePicker,
  saveTaskButton
) {
  const taskToEdit = tasks.find((task) => task.id == taskId);
  if (taskToEdit) {
    taskDescriptionInput.value = taskToEdit.description;
    taskDateTimePicker._flatpickr.setDate(taskToEdit.dateTime, true);
    addTaskForm.dataset.editingTaskId = taskId; // Зберігаємо ID
    // Зберігаємо початкові значення для порівняння (текст кнопки змінюється в index.js)
    addTaskForm.dataset.originalDescription = taskToEdit.description;
    addTaskForm.dataset.originalDateTime = taskToEdit.dateTime;
    saveTaskButton.textContent = "Сохранить"; // Змінюємо текст кнопки
    return taskToEdit;
  }
  console.warn(`uiFunctions: Task with ID ${taskId} not found for editing.`);
  return null;
}
