import { useEffect, useRef, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import { books, createDemoReservations, currentUser } from './data/demo'
import BookPage from './pages/BookPage'
import CatalogPage from './pages/CatalogPage'
import LocationsPage from './pages/LocationsPage'
import NotFoundPage from './pages/NotFoundPage'
import ReservationsPage from './pages/ReservationsPage'
import StatisticsPage from './pages/StatisticsPage'
import { dateAfterDays } from './utils/books'
import './App.css'

function App() {
  const [reservations, setReservations] = useState(createDemoReservations)
  const [notice, setNotice] = useState('')
  const { pathname, hash } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const heading = mainRef.current?.querySelector('h1')?.textContent
    document.title = heading ? `${heading} — BookSwap` : 'BookSwap'
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'center' })
    else window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname, hash])

  function reserveBook(bookId: number) {
    if (!books.some((book) => book.id === bookId) || reservations.some((item) => item.bookId === bookId)) return
    setReservations((previous) => previous.some((item) => item.bookId === bookId) ? previous : [
      { id: crypto.randomUUID(), bookId, userId: currentUser.id, status: 'reserved', reservedAt: dateAfterDays(0), dueAt: dateAfterDays(14) },
      ...previous,
    ])
    setNotice('Книга забронирована. Она появилась в ваших бронированиях.')
  }

  function cancelReservation(id: string) {
    setReservations((previous) => previous.filter((item) => !(item.id === id && item.userId === currentUser.id && item.status === 'reserved')))
    setNotice('Бронирование отменено. Книга снова доступна для обмена.')
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Перейти к содержимому</a>
      <Header />
      <main ref={mainRef} id="main-content" className="container main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<CatalogPage reservations={reservations} />} />
          <Route path="/books/:id" element={<BookPage reservations={reservations} onReserve={reserveBook} />} />
          <Route path="/reservations" element={<ReservationsPage reservations={reservations} onCancel={cancelReservation} />} />
          <Route path="/locations" element={<LocationsPage reservations={reservations} />} />
          <Route path="/statistics" element={<StatisticsPage reservations={reservations} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">BookSwap.</span>
        </div>
      </footer>
      <Snackbar open={Boolean(notice)} autoHideDuration={4500} onClose={() => setNotice('')}><Alert severity="success" onClose={() => setNotice('')}>{notice}</Alert></Snackbar>
    </>
  )
}

export default App
