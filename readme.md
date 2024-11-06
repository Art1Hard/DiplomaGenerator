# Как развернуть проект?

1. Необходимо **установить Node.js** 
на свой компьютер. Скачать его можно на [официальном сайте](https://nodejs.org).
2. Необходимо **установить Gulp глобально**, для этого прописываем команду `npm i gulp-cli -g` в терминал.
3. Открываем проект в среде разработки, прописываем в терминале путь к директории проекта с помощью команды `cd "путь к директории проекта"` и выполняем команду.
4. Прописываем в терминал команду `npm i`

---

### Запустить проект в режиме разработчика
Вводим команду `npm run dev` в терминал. Проект соберётся **без оптимизации**. Подходит для того, чтобы **быстро глянуть** проект почти без всех оптимизаций `gulp` сборщика.

### Собрать проект
Вводим команду `npm run build` в терминал. Всё что соберётся в **папке dist** - готово к загрузки **на хостинг** (локальный или публичный). Можно использовать **Open Server** для развёртывания проекта.