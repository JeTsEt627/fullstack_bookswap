import { Alert, Button } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import BookCover from '../components/BookCover'
import StatusChip from '../components/StatusChip'
import { books, currentUser, locations } from '../data/demo'
import type { Reservation } from '../types'
import { getBookStatus } from '../utils/books'
import NotFoundPage from './NotFoundPage'

interface BookPageProps {
  reservations: Reservation[]
  onReserve: (bookId: number) => void
}

function BookPage({ reservations, onReserve }: BookPageProps) {
  const { id } = useParams()
  const book = books.find((item) => String(item.id) === id)
  if (!book) return <NotFoundPage book />

  const location = locations.find((item) => item.id === book.locationId)!
  const status = getBookStatus(book.id, reservations)
  const myReservation = reservations.find((item) => item.bookId === book.id && item.userId === currentUser.id)

  return (
    <>
      <Link className="back-link" to="/">← Вернуться в каталог</Link>
      <section className="book-detail panel">
        <div className="detail-cover"><BookCover book={book} /></div>
        <div className="detail-content">
          <div className="card-meta"><span className="eyebrow">{book.genre}</span><StatusChip status={status} /></div>
          <h1>{book.title}</h1>
          <p className="detail-author">{book.author}</p>
          <dl className="book-facts"><div><dt>Год первой публикации</dt><dd>{book.year}</dd></div><div><dt>Страниц в экземпляре</dt><dd>{book.pages}</dd></div><div><dt>Срок чтения</dt><dd>14 дней</dd></div></dl>
          <h2>О книге</h2><p className="description">{book.description}</p>
          <div className="pickup-summary"><span className="eyebrow">МЕСТО ВЫДАЧИ</span><h3>{location.name}</h3><p>{location.address} · {location.hours}</p><Link to={`/locations#location-${location.id}`}>Подробнее о пункте →</Link></div>
          {status === 'available' ? (
            <><Button variant="contained" size="large" onClick={() => onReserve(book.id)}>Забронировать книгу</Button><p className="helper-text">Получите книгу в указанном пункте и верните в течение 14 дней с даты бронирования.</p></>
          ) : myReservation ? (
            <div className="action-stack"><Alert severity="success">{status === 'reserved' ? 'Книга забронирована вами и ждёт выдачи.' : 'Эта книга сейчас у вас. Срок возврата указан в бронированиях.'}</Alert><Button component={Link} to="/reservations" variant="contained">Мои бронирования</Button></div>
          ) : (
            <Alert severity="info">Книгу уже читает другой участник. Пока можно выбрать другую в каталоге.</Alert>
          )}
        </div>
      </section>
    </>
  )
}

export default BookPage
