import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import PageHeading from '../components/PageHeading'
import { books, locations } from '../data/demo'
import type { Reservation } from '../types'
import { getBookStatus } from '../utils/books'

function LocationsPage({ reservations }: { reservations: Reservation[] }) {
  return (
    <>
      <PageHeading eyebrow="РЯДОМ С ВАМИ" title="Места выдачи" description="Забирайте и возвращайте книги там, где вам удобно. В каждом пункте вам помогут." />
      <div className="locations-grid">{locations.map((location, index) => {
        const localBooks = books.filter((book) => book.locationId === location.id)
        const available = localBooks.filter((book) => getBookStatus(book.id, reservations) === 'available').length
        return (
          <article className="location-card panel" id={`location-${location.id}`} key={location.id}>
            <div className={`location-illustration location-style-${index}`} aria-hidden="true"><span className="location-number">0{index + 1}</span><div className="building"><span /><span /><span /><span /><span /><span /></div><span className="building-ground" /></div>
            <div className="location-content"><span className="eyebrow">ПУНКТ ВЫДАЧИ · 0{index + 1}</span><h2>{location.name}</h2><p className="location-address">{location.address}</p><p className="hours">{location.hours}</p><p className="muted">{location.description}</p><div className="location-count"><strong>{available}</strong><span>доступно книг из {localBooks.length}</span></div></div>
          </article>
        )
      })}</div>
      <section className="how-it-works panel"><div><p className="eyebrow">ВСЁ ПРОСТО</p><h2>От полки до новой истории</h2></div><ol><li><strong>Выберите книгу</strong><span>В карточке указан её пункт выдачи.</span></li><li><strong>Забронируйте и заберите</strong><span>Приходите в часы работы пункта.</span></li><li><strong>Прочитайте и верните</strong><span>Срок возврата — в ваших бронированиях.</span></li></ol><Button component={Link} to="/" variant="contained">Выбрать книгу</Button></section>
    </>
  )
}

export default LocationsPage
