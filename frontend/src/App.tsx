import React from 'react';
// import Header from './components/Common/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Work from './components/Work';
import Education from './components/Education';
import Contact from './components/Contact';

function App() {
  return (
    <div className="App">
      {/* <Header /> */}

      <Hero />
      <Projects />
      <Work />
      <Education />
      <Contact />
    </div>
  );
}

export default App;
