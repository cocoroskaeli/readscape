import {Link, Outlet} from 'react-router-dom'
import './App.css'
 export default function App()
 {
  return (
    <div>
      <nav className='bar'>
        <Link className='nav' to='/'>Home</Link>
        <Link className='nav' to='/shelf'>My Shelf</Link>
      </nav>

      <Outlet />
    </div>
  );
 }