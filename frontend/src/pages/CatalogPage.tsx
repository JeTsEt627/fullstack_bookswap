import { Button, FormControlLabel, MenuItem, Switch, TextField } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard'
import { books } from '../data/demo'
import type { Reservation } from '../types'
import { getBookStatus } from '../utils/books'

const genres = [...new Set(books.map((book) => book.genre))]

function CatalogPage({ reservations }: { reservations: Reservation[] }) {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const genreParam = params.get('genre') ?? ''
  const genre = genres.includes(genreParam) ? genreParam : ''
  const onlyAvailable = params.get('available') === 'true'

  function updateFilter(key: string, value: string) {
    setParams((previous) => {
      const next = new URLSearchParams(previous)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
  }

  const visibleBooks = books.filter((book) => {
    const matchesQuery = `${book.title} ${book.author}`.toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru'))
    return matchesQuery && (!genre || book.genre === genre) && (!onlyAvailable || getBookStatus(book.id, reservations) === 'available')
  })

  return (
    <>
      <section aria-labelledby="catalog-title">
        <div className="section-heading">
          <h1 id="catalog-title">Каталог книг</h1>
          <span className="muted" aria-live="polite">Показано: {visibleBooks.length} из {books.length}</span>
        </div>
        <div className="filters panel">
          <TextField label="Название книги или автор" value={query} onChange={(event) => updateFilter('q', event.target.value)} size="small" className="search-field" />
          <TextField select label="Жанр" value={genre} onChange={(event) => updateFilter('genre', event.target.value)} size="small" className="genre-field">
            <MenuItem value="">Все жанры</MenuItem>
            {genres.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
          </TextField>
          <FormControlLabel control={<Switch checked={onlyAvailable} onChange={(_, checked) => updateFilter('available', checked ? 'true' : '')} />} label="Только доступные" />
        </div>
        {visibleBooks.length ? (
          <div className="book-grid">{visibleBooks.map((book) => <BookCard key={book.id} book={book} status={getBookStatus(book.id, reservations)} />)}</div>
        ) : (
          <div className="empty-state panel"><h3>Книги не найдены</h3><p className="muted">Попробуйте другое название или измените фильтры.</p><Button onClick={() => setParams({})} variant="outlined">Сбросить фильтры</Button></div>
        )}
      </section>
    </>
  )
}

export default CatalogPage
