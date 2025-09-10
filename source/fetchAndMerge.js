'use strict';

/**
 * Функция загружает данные с нескольких URL и объединяет их в один объект
 * Если один ключ встречается в нескольких объектах, значения собираются в массив
 * содержащий все уникальные ключи из загруженных данных.
 * 
 * @param {string[]} urls - Массив URL для загрузки данных
 * 
 * @example
 * // Возвращает { name: ['Олег', 'Мария'], age: [25, 22] }
 * 
 * fetchAndMerge([
 *   'https://api.com/user1',
 *   'https://api.com/user2'
 * ]);
 * 
 * @returns {Object} Объединенный объект со всеми уникальными ключами и значениями
 */
const fetchAndMerge = async (urls) => {
  if (!Array.isArray(urls)) {
    throw new TypeError('Параметр urls должен быть массивом');
  }

  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (typeof data !== 'object' || data === null) {
          throw new TypeError('Данные не являются объектом');
        }
        return data;
      } catch (error) {
        throw new Error(`Ошибка при обработке URL ${url}: ${error.message}`);
      }
    })
  );

  const merged = results.reduce((acc, data) => {
    for (const key in data) {
      const value = data[key];
      if (acc[key] === undefined) {
        acc[key] = [value];
      } else {
        acc[key].push(value);
      }
    }
    return acc;
  }, {});

  for (const key in merged) {
    merged[key] = [...new Set(merged[key])];
  }

  return merged;
};
