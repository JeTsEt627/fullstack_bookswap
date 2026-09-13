import type { CSSProperties } from 'react'
import type { Book } from '../types'

function BookCover({ book }: { book: Book }) {
  const style = { '--cover-color': book.coverColor, '--cover-ink': book.coverInk } as CSSProperties

  return (
    <div className="book-cover" style={style} aria-hidden="true">
      <span className="cover-author">{book.author}</span>
      <span className="cover-title">{book.title}</span>
      <span className="cover-art"><span /><span /><span /></span>
      <span className="cover-series">БИБЛИОТЕКА BOOKSWAP</span>
    </div>
  )
}

export default BookCover
