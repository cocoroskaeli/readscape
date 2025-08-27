import './index.css'
import App from './App.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BookDetails from './pages/BookDetails'
import MyShelf from './pages/MyShelf'
import "./i18n";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Home />}/>
          <Route path='/book/:id' element={<BookDetails />}/>
          <Route path='/shelf' element={<MyShelf />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
