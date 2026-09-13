import type { BookStatus, Reservation } from '../types'

export function getBookStatus(bookId: number, reservations: Reservation[]): BookStatus {
  return reservations.find((reservation) => reservation.bookId === bookId)?.status ?? 'available'
}

export function dateAfterDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(`${value}T12:00:00`))
}
