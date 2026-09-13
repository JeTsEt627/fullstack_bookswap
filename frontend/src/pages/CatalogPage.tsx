import { Button, FormControlLabel, MenuItem, Switch, TextField } from '@mui/material'
import { Link, useSearchParams } from 'react-router-dom'
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
      <section className="catalog-hero">
        <div className="hero-copy">
          <p className="eyebrow">КНИГИ С ПРОДОЛЖЕНИЕМ</p>
          <h1>Хорошие истории<br />стоит <em>передавать дальше.</em></h1>
          <p>Находите книги, берите почитать и делитесь открытиями.<br className="desktop-break" /> Ваша следующая история уже на нашей полке.</p>
          <Button component={Link} to="/locations" variant="outlined">Где забрать книгу <span aria-hidden="true">↗</span></Button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-orbit" />
          <div className="hero-book hero-book-back"><span>ЕЩЁ ОДНА<br />ИСТОРИЯ</span></div>
          <div className="hero-book hero-book-front"><span className="hero-book-small">ОТ ЧИТАТЕЛЯ К ЧИТАТЕЛЮ</span><span>Читать.<br />Делиться.<br /><i>Повторять.</i></span><span className="hero-book-small">BOOKSWAP</span></div>
          <span className="hero-note">У каждой книги — новый читатель</span>
        </div>
      </section>
      <section aria-labelledby="catalog-title">
        <div className="section-heading"><div><p className="eyebrow">ВЫБИРАЙТЕ СВОЮ ИСТОРИЮ</p><h2 id="catalog-title">Книжная полка</h2></div><span className="muted" aria-live="polite">Показано: {visibleBooks.length} из {books.length}</span></div>
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
