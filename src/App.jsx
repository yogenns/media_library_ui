
import NavBar from './Navbar'
import './App.css'
import { Container } from 'react-bootstrap';
import './bootstrap-4.0.0-dist/css/bootstrap.min.css'
import ContentTable from './components/ContentTable'
import ContentTablePagination from './components/ContentTablePagination';
import { useState } from 'react';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WishList from './components/WishList';
import Analysis from './components/Analysis';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    const storedValue = sessionStorage.getItem("loggedIn");
    return storedValue !== null ? JSON.parse(storedValue) : "";
  });

  const handleLogin = () => {
    // handle login logic here
    console.log("login")
    sessionStorage.setItem("loggedIn", JSON.stringify(true));
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // handle logout logic here
    sessionStorage.setItem("loggedIn", JSON.stringify(false));
    setLoggedIn(false);
  };

  return (
    <>
      <Router>
        {loggedIn ? (
          <>
            <NavBar />
            <Container >
              <Routes>
                <Route exact path="/" element={<ContentTablePagination />} />
                  
                <Route exact path="/wishlist" element={<WishList />} />
                <Route exact path="/analysis" element={<Analysis />} />
              </Routes>
            </Container>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </Router>
    </>
  )
}

export default App
