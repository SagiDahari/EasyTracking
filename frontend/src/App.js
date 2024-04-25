import './App.css';
import React from 'react';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home.js';
import MyMeals from './components/MyMeals.js';



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/mymeals" element={<MyMeals />} />
      </Routes>
    </Router>
  )
}



export default App;
