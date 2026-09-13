import Header from './components/Header'
import CatalogPage from './pages/CatalogPage'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main className="container main-content">
        <CatalogPage />
      </main>
    </>
  )
}

export default App
