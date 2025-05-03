// /home/romka/projects/todo_project/scripts/i18n.js

let translations = {}; // Об'єкт для зберігання завантажених перекладів
const supportedLangs = ["en", "de", "ru", "uk"];
let currentLang = navigator.language.slice(0, 2); // 'uk', 'en', 'de' etc.

if (!supportedLangs.includes(currentLang)) {
  currentLang = "en"; // Мова за замовчуванням, якщо мова браузера не підтримується
}

/**
 * Повертає перекладений рядок за ключем.
 * @param {string} key - Ключ рядка для перекладу.
 * @returns {string} - Перекладений рядок або сам ключ, якщо переклад не знайдено.
 */
export function t(key) {
  return translations[key] || key;
}

/**
 * Завантажує файл перекладів для поточної мови та ініціалізує модуль.
 * @returns {Promise<void>}
 */
export async function initI18n() {
  try {
    // Використовуємо відносний шлях від папки scripts
    const response = await fetch(`../locales/${currentLang}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    translations = await response.json();
    console.log(`i18n.js: Translations loaded for ${currentLang}`);
  } catch (error) {
    console.error(
      `i18n.js: Could not load translations for ${currentLang}. Falling back to 'en'.`,
      error
    );
    // Спроба завантажити англійську як запасний варіант
    if (currentLang !== "en") {
      currentLang = "en";
      await initI18n(); // Рекурсивний виклик для завантаження 'en'
    } else {
      translations = {}; // Якщо навіть 'en' не завантажилась, використовуємо порожній об'єкт
    }
  }
}
