import type { Book } from '../types'

const genreColors: Record<string, string> = {
  'Сказка': '#a16b25',
  'Классика': '#547c55',
  'Фантастика': '#4d739e',
  'Проза': '#89639e',
}

function BookCover({ book }: { book: Book }) {
  return (
    <div className="book-placeholder" style={{ color: genreColors[book.genre] ?? '#69736b' }} aria-hidden="true">
      <svg viewBox="0 0 80 100" fill="none">
        <path d="M16 8h52v72H16a8 8 0 0 0 0 16h52V8" fill="currentColor" opacity="0.18" />
        <path d="M16 8h52v72H16a8 8 0 0 0 0 16h52M16 8a8 8 0 0 0-8 8v72M20 8v72M28 30h28M28 42h20" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default BookCover
