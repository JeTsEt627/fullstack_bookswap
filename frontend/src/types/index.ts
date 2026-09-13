export interface Book {
  id: number
  title: string
  author: string
  genre: string
  year: number
  pages: number
  description: string
  locationId: number
  coverColor: string
  coverInk: string
}

export interface PickupLocation {
  id: number
  name: string
  address: string
  hours: string
  description: string
}

export interface Reservation {
  id: string
  bookId: number
  userId: number
  status: 'reserved' | 'borrowed'
  reservedAt: string
  dueAt: string
}

export type BookStatus = 'available' | Reservation['status']
