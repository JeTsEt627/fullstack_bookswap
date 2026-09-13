import type { Book, PickupLocation, Reservation } from '../types'
import { dateAfterDays } from '../utils/books'

export const currentUser = { id: 1, name: 'Алексей' }

// Все адреса и пункты выдачи вымышлены и используются только для демонстрации.
export const locations: PickupLocation[] = [
  { id: 1, name: 'Библиотека «Переплёт»', address: 'ул. Книжная, 12', hours: 'Пн–сб · 10:00–20:00', description: 'Тихое место в центре города. Стойка BookSwap находится у входа в читальный зал.' },
  { id: 2, name: 'Кофейня «Читай»', address: 'ул. Садовая, 7', hours: 'Ежедневно · 09:00–21:00', description: 'Заберите новую историю вместе с чашкой кофе. За книгой обратитесь к бариста.' },
  { id: 3, name: 'Кампус · корпус А', address: 'Студенческий проспект, 25', hours: 'Пн–пт · 09:00–18:00', description: 'Книжная полка на первом этаже, рядом со студенческим центром. Выдача у администратора.' },
]

export const books: Book[] = [
  { id: 1, title: 'Маленький принц', author: 'Антуан де Сент-Экзюпери', genre: 'Сказка', year: 1943, pages: 96, locationId: 1, coverColor: '#eee5c9', coverInk: '#4d5947', description: 'История о маленьком путешественнике, который открывает для себя разные планеты и их обитателей. Книга о дружбе, ответственности и умении замечать главное в самых простых вещах.' },
  { id: 2, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', genre: 'Классика', year: 1967, pages: 480, locationId: 2, coverColor: '#263f38', coverInk: '#f4e7c9', description: 'В Москве появляется загадочный иностранец со своей свитой, а судьбы писателя и его возлюбленной переплетаются с фантастическими событиями. Роман о любви, творчестве и свободе выбора.' },
  { id: 3, title: '451 градус по Фаренгейту', author: 'Рэй Брэдбери', genre: 'Фантастика', year: 1953, pages: 256, locationId: 3, coverColor: '#b95137', coverInk: '#fff0d7', description: 'В мире, где книги запрещены, пожарный Гай Монтэг начинает сомневаться в привычном порядке. Антиутопия о ценности памяти, самостоятельного мышления и человеческого общения.' },
  { id: 4, title: 'Гордость и предубеждение', author: 'Джейн Остин', genre: 'Классика', year: 1813, pages: 416, locationId: 1, coverColor: '#dacfcf', coverInk: '#574252', description: 'Элизабет Беннет и мистер Дарси учатся видеть друг друга за первым впечатлением. Ироничный роман о семье, общественных условностях и чувствах, которые меняют человека.' },
  { id: 5, title: 'Три товарища', author: 'Эрих Мария Ремарк', genre: 'Проза', year: 1936, pages: 480, locationId: 2, coverColor: '#526b7b', coverInk: '#f1ecdc', description: 'Трое друзей пытаются найти своё место в непростое время. История о верности, надежде и любви, которая помогает сохранить человечность перед лицом потерь.' },
  { id: 6, title: 'Понедельник начинается в субботу', author: 'Аркадий и Борис Стругацкие', genre: 'Фантастика', year: 1965, pages: 320, locationId: 3, coverColor: '#d5b771', coverInk: '#3c463c', description: 'Программист Александр Привалов попадает в институт, где магия становится предметом научного исследования. Добрая и остроумная повесть о любознательности и увлечённых своим делом людях.' },
  { id: 7, title: 'Вино из одуванчиков', author: 'Рэй Брэдбери', genre: 'Проза', year: 1957, pages: 320, locationId: 1, coverColor: '#778263', coverInk: '#fff4d4', description: 'Одно лето из жизни двенадцатилетнего Дугласа становится коллекцией маленьких открытий. Тёплая книга о взрослении, памяти и удивительных событиях обычного дня.' },
  { id: 8, title: 'Алиса в Стране чудес', author: 'Льюис Кэрролл', genre: 'Сказка', year: 1865, pages: 160, locationId: 2, coverColor: '#c4d6d3', coverInk: '#354e58', description: 'Следуя за Белым Кроликом, Алиса оказывается в мире необычных встреч и неожиданных правил. Приключение, в котором любопытство и воображение оказываются лучшими проводниками.' },
]

export function createDemoReservations(): Reservation[] {
  return [
    { id: 'demo-1', bookId: 2, userId: 1, status: 'reserved', reservedAt: dateAfterDays(-1), dueAt: dateAfterDays(13) },
    { id: 'demo-2', bookId: 5, userId: 1, status: 'borrowed', reservedAt: dateAfterDays(-7), dueAt: dateAfterDays(7) },
    { id: 'demo-3', bookId: 7, userId: 2, status: 'borrowed', reservedAt: dateAfterDays(-4), dueAt: dateAfterDays(10) },
  ]
}
