import React from 'react';
import Navigation from'./components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Work from './components/Work';
import Education from './components/Education';
import Contact from './components/Contact';
import About from './components/About' 

function App() {
  return (
    <div className="App">
      <Navigation />     
      <Hero />
      <About />
      <Projects />
      <Work />
      <Education />
      <Contact />
    </div>
  );
}

export default App;
