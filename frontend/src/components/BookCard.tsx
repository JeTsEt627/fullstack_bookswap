import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import type { Book, BookStatus } from '../types'
import BookCover from './BookCover'
import StatusChip from './StatusChip'

function BookCard({ book, status }: { book: Book; status: BookStatus }) {
  return (
    <article className="book-card">
      <Link to={`/books/${book.id}`} className="cover-link" aria-label={`О книге «${book.title}»`}>
        <BookCover book={book} />
      </Link>
      <div className="book-card-content">
        <div className="card-meta"><span>{book.genre}</span><StatusChip status={status} /></div>
        <h2><Link to={`/books/${book.id}`}>{book.title}</Link></h2>
        <p className="muted">{book.author}</p>
        <Button component={Link} to={`/books/${book.id}`} variant="outlined" fullWidth>Подробнее о книге <span aria-hidden="true">↗</span></Button>
      </div>
    </article>
  )
}

export default BookCard
