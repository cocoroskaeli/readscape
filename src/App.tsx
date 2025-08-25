import {Link, Outlet} from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
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
      <Toaster position='bottom-right'/>
    </div>
  );
 }