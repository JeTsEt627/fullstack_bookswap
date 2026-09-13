import { NavLink } from 'react-router-dom'
import { currentUser } from '../data/demo'

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 5v16M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z" /></svg>
          BookSwap.
        </div>
        <nav className="main-nav" aria-label="Основная навигация">
          <NavLink to="/" end>Каталог</NavLink>
          <NavLink to="/reservations">Мои бронирования</NavLink>
          <NavLink to="/locations">Места выдачи</NavLink>
          <NavLink to="/statistics">Статистика</NavLink>
        </nav>
        <div className="user-label"><span className="avatar" aria-hidden="true">А</span><span>{currentUser.name}</span></div>
      </div>
    </header>
  )
}

export default Header
