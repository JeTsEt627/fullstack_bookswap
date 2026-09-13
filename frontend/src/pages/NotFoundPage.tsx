import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import PageHeading from '../components/PageHeading'

function NotFoundPage({ book = false }: { book?: boolean }) {
  return (
    <section className="empty-state panel">
      <PageHeading eyebrow="404" title={book ? 'Книга не найдена' : 'Страница не найдена'} description="Возможно, в адресе опечатка. Найдите новую историю в нашем каталоге." />
      <Button component={Link} to="/" variant="contained">Перейти в каталог</Button>
    </section>
  )
}

export default NotFoundPage
