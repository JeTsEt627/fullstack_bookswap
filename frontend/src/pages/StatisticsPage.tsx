import { LinearProgress } from '@mui/material'
import PageHeading from '../components/PageHeading'
import { books, locations } from '../data/demo'
import type { Reservation } from '../types'
import { getBookStatus } from '../utils/books'

function StatisticsPage({ reservations }: { reservations: Reservation[] }) {
  const available = books.filter((book) => getBookStatus(book.id, reservations) === 'available').length
  const reserved = reservations.filter((item) => item.status === 'reserved').length
  const borrowed = reservations.filter((item) => item.status === 'borrowed').length
  const genres = [...new Set(books.map((book) => book.genre))].map((genre) => ({ name: genre, count: books.filter((book) => book.genre === genre).length }))
  const statuses = [{ label: 'Доступны для обмена', count: available, color: 'success' }, { label: 'Ждут выдачи', count: reserved, color: 'warning' }, { label: 'Читают прямо сейчас', count: borrowed, color: 'primary' }] as const

  return (
    <>
      <PageHeading eyebrow="BOOKSWAP В ЦИФРАХ" title="Маленькая библиотека. Большие истории." description="Смотрите, сколько книг на полках и сколько уже нашли своего читателя." />
      <div className="stats-grid">{[{ value: books.length, label: 'Книг в каталоге', note: 'Каждая — новая история' }, { value: available, label: 'Доступно сейчас', note: 'Можно забронировать' }, { value: reservations.length, label: 'Активных бронирований', note: 'Включая книги на руках' }, { value: locations.length, label: 'Места выдачи', note: 'Для встреч с книгами' }].map((stat) => <article className="stat-card panel" key={stat.label}><p className="muted">{stat.label}</p><strong>{stat.value.toString().padStart(2, '0')}</strong><span>{stat.note}</span></article>)}</div>
      <div className="statistics-details">
        <section className="panel chart-panel"><p className="eyebrow">НАШ КНИЖНЫЙ ФОНД</p><h2>Что происходит с книгами</h2><div className="bar-list">{statuses.map((status) => <div key={status.label}><div className="bar-label"><span>{status.label}</span><strong>{status.count} из {books.length}</strong></div><LinearProgress variant="determinate" value={status.count / books.length * 100} color={status.color} aria-label={status.label} /></div>)}</div><p className="helper-text">Одна книга — один экземпляр. Статусы обновляются при бронировании и отмене.</p></section>
        <section className="panel chart-panel"><p className="eyebrow">НА ЛЮБОЙ ВКУС</p><h2>Жанры на полке</h2><div className="genre-list">{genres.map((genre, index) => <div key={genre.name}><span className={`genre-marker marker-${index}`} /><span>{genre.name}</span><strong>{genre.count}</strong></div>)}</div><p className="helper-text">В каталоге представлены {genres.length} жанра.</p></section>
      </div>
    </>
  )
}

export default StatisticsPage
