/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import ConstantList from './constant'
import BillPrintEdit from './pages/BillPrintEdit';

const defaultHome = ConstantList.defaultHome;

function Home() {
  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to={`${defaultHome}/about`}>About</Link>
      </nav>
    </>
  )
}

function About() {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>That feels like an existential question, don't you think?</p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  )
}

const App = (): JSX.Element => {

  const location = useLocation();

  useEffect(() => {
    console.log(location);
  }, []);

  
  return (
    <div className="App">
      <h1>Welcome to React Router!</h1>
      <h1>{location.pathname}</h1>
      <Routes >
        <Route path={`${defaultHome}`} element={<BillPrintEdit />} />
        <Route path={`${defaultHome}/about`} element={<About />} />
      </Routes>
    </div>
  )
}

export default App
