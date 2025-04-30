// /home/romka/projects/todo_project/scripts/index.js

function updateDateTime() {
  const dayOfWeekElement = document.querySelector(".day-of-week");
  const dateMonthElement = document.querySelector(".date-month");

  // Перевіряємо, чи знайдені елементи
  if (!dayOfWeekElement || !dateMonthElement) {
    console.error("Не вдалося знайти елементи .day-of-week або .date-month!");
    return; // Виходимо, якщо елементи не знайдені
  }

  const now = new Date();

  // Опції для форматування дати
  const dayOptions = { weekday: "long" };
  const dateOptions = { day: "numeric", month: "long" };

  // Форматуємо, використовуючи локаль браузера
  let dayOfWeek = now.toLocaleString(undefined, dayOptions);
  // Робимо першу літеру великою
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  const dateMonth = now.toLocaleString(undefined, dateOptions);

  // Оновлюємо текст елементів
  dayOfWeekElement.textContent = dayOfWeek;
  dateMonthElement.textContent = dateMonth;
}
// Додаємо ОДИН слухач події, який викличе функцію ПІСЛЯ завантаження DOM
document.addEventListener("DOMContentLoaded", updateDateTime);
// --- Функціонал для фільтрів ---

function handleFilterClick(event) {
  // Знаходимо поточний активний фільтр
  const currentActiveFilter = document.querySelector(
    ".filter-button.active-filter"
  );
  if (currentActiveFilter) {
    currentActiveFilter.classList.remove("active-filter");
  }

  // Додаємо клас до натиснутої кнопки
  event.currentTarget.classList.add("active-filter");

  // Тут пізніше можна буде додати логіку для фільтрації завдань
  // console.log("Вибрано фільтр:", event.currentTarget.textContent.trim());
}

// Знаходимо всі кнопки фільтрів і додаємо обробник кліку
const filterButtons = document.querySelectorAll(".filter-button");
filterButtons.forEach((button) =>
  button.addEventListener("click", handleFilterClick)
);

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

// --- Функціонал для перемикача (switch) ---

/**
 * Перемикає значення атрибута aria-checked між "true" та "false".
 * @param {Element} element - Елемент, для якого потрібно перемкнути атрибут.
 */
function toggleAriaChecked(element) {
  const currentValue = element.getAttribute("aria-checked");
  const newValue = currentValue === "false" ? "true" : "false";
  element.setAttribute("aria-checked", newValue);
}

const switchContainerCh = document.querySelectorAll(".switch-container");

// Додаємо обробник кліку до кожного перемикача
switchContainerCh.forEach((switchElement) => {
  switchElement.addEventListener("click", function () {
    // Перемикаємо візуальний стан (клас is-off)
    this.classList.toggle("is-off");
    // Перемикаємо атрибут aria-checked для доступності
    toggleAriaChecked(this);
  });
});
