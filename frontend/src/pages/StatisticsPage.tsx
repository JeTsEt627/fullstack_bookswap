import { books } from '../data/demo'
import type { Reservation } from '../types'
import { getBookStatus } from '../utils/books'

function StatisticsPage({ reservations }: { reservations: Reservation[] }) {
  const available = books.filter((book) => getBookStatus(book.id, reservations) === 'available').length
  const reserved = reservations.filter((item) => item.status === 'reserved').length
  const borrowed = reservations.filter((item) => item.status === 'borrowed').length
  const genres = [...new Set(books.map((book) => book.genre))]
  const bookStats = [
    { label: 'Всего книг', count: books.length },
    { label: 'Доступно', count: available },
    { label: 'Ждут выдачи', count: reserved },
    { label: 'На руках', count: borrowed },
    { label: 'Активных бронирований', count: reservations.length },
  ]

  return (
    <>
      <div className="page-heading">
        <h1>Статистика по книгам</h1>
      </div>
      <div className="statistics-details">
        <section className="panel statistics-panel">
          <h2>Книги</h2>
          <dl className="statistics-list">
            {bookStats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.count}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="panel statistics-panel">
          <h2>Жанры</h2>
          <dl className="statistics-list">
            {genres.map((genre) => (
              <div key={genre}>
                <dt>{genre}</dt>
                <dd>{books.filter((book) => book.genre === genre).length}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  )
}

export default StatisticsPage
