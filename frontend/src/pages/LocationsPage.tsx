import { books, locations } from '../data/demo'
import type { Reservation } from '../types'
import { getBookStatus } from '../utils/books'

function LocationsPage({ reservations }: { reservations: Reservation[] }) {
  return (
    <>
      <div className="page-heading">
        <h1>Места выдачи</h1>
      </div>
      <div className="locations-grid">
        {locations.map((location) => {
          const localBooks = books.filter((book) => book.locationId === location.id)
          const available = localBooks.filter((book) => getBookStatus(book.id, reservations) === 'available').length

          return (
            <article className="location-card panel" id={`location-${location.id}`} key={location.id}>
              <img className="location-image" src="/building-placeholder.svg" alt="" width="320" height="180" />
              <div className="location-content">
                <h2>{location.name}</h2>
                <p className="location-address">{location.address}</p>
                <p className="hours">{location.hours}</p>
                <p className="muted">{location.description}</p>
                <div className="location-count">
                  <strong>{available}</strong>
                  <span>доступно книг из {localBooks.length}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

export default LocationsPage
