import { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Link } from 'react-router-dom'
import BookCover from '../components/BookCover'
import PageHeading from '../components/PageHeading'
import StatusChip from '../components/StatusChip'
import { books, currentUser, locations } from '../data/demo'
import type { Reservation } from '../types'
import { dateAfterDays, formatDate } from '../utils/books'

function ReservationsPage({ reservations, onCancel }: { reservations: Reservation[]; onCancel: (id: string) => void }) {
  const [cancelId, setCancelId] = useState<string | null>(null)
  const mine = reservations.filter((item) => item.userId === currentUser.id)
  const readyCount = mine.filter((item) => item.status === 'reserved').length
  const today = dateAfterDays(0)

  return (
    <>
      <PageHeading eyebrow="ЛИЧНАЯ ПОЛКА" title="Мои бронирования" description="Здесь книги, которые ждут встречи с вами, и те, что вы уже читаете." />
      <div className="reservation-summary"><span>Всего: <strong>{mine.length}</strong></span><span>Ждут выдачи: <strong>{readyCount}</strong></span><span>На руках: <strong>{mine.length - readyCount}</strong></span></div>
      <div className="reservation-list">
        {mine.map((reservation) => {
          const book = books.find((item) => item.id === reservation.bookId)!
          const location = locations.find((item) => item.id === book.locationId)!
          return (
            <article key={reservation.id} className="reservation-card panel">
              <Link to={`/books/${book.id}`} className="reservation-cover" aria-label={`О книге «${book.title}»`}><BookCover book={book} /></Link>
              <div className="reservation-info"><StatusChip status={reservation.status} /><h2><Link to={`/books/${book.id}`}>{book.title}</Link></h2><p className="muted">{book.author}</p><Link className="location-link" to={`/locations#location-${location.id}`}>{location.name} →</Link></div>
              <div className="reservation-dates"><span className="muted">Дата бронирования</span><time dateTime={reservation.reservedAt}>{formatDate(reservation.reservedAt)}</time><span className="muted">Вернуть до</span><time className={reservation.dueAt < today ? 'overdue' : 'due-date'} dateTime={reservation.dueAt}>{formatDate(reservation.dueAt)}</time>{reservation.dueAt < today && <span className="overdue">Срок возврата истёк</span>}</div>
              <div className="reservation-action">{reservation.status === 'reserved' ? <Button variant="outlined" onClick={() => setCancelId(reservation.id)}>Отменить бронь</Button> : <p className="helper-text">Верните книгу в пункт,<br />где вы её получили.</p>}</div>
            </article>
          )
        })}
      </div>
      {!mine.length && <div className="empty-state panel"><h2>Ваша полка пока пуста</h2><p className="muted">Выберите книгу в каталоге — и она появится здесь.</p><Button component={Link} to="/" variant="contained">Найти книгу</Button></div>}
      <aside className="reading-note"><span aria-hidden="true">↳</span><div><h3>Хорошая история не должна ждать</h3><p>Если планы изменились, отмените бронь, чтобы книгу смог забрать другой читатель.</p></div></aside>
      <Dialog open={cancelId !== null} onClose={() => setCancelId(null)} aria-labelledby="cancel-title" aria-describedby="cancel-description">
        <DialogTitle id="cancel-title">Отменить бронирование?</DialogTitle><DialogContent><DialogContentText id="cancel-description">Книга снова станет доступна другим читателям.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setCancelId(null)}>Оставить бронь</Button><Button color="error" onClick={() => { if (cancelId) onCancel(cancelId); setCancelId(null) }}>Отменить бронь</Button></DialogActions>
      </Dialog>
    </>
  )
}

export default ReservationsPage
