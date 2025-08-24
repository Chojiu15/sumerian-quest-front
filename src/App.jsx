import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import TrialOfTheScribe from './components/trials/TrialOfScribe';
import TrialOfTheMerchant from './components/trials/TrialOfMerchant'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/rite/first" element={<TrialOfTheScribe />} />
        <Route path="/rite/second" element={<TrialOfTheMerchant />} /> */}
      </Routes>
    </Router>
  );
}

export default App;