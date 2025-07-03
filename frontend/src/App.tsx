import React from 'react';
import Navigation from'./components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Education from './components/Education';
import Projects from './components/Projects';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer'; 



function App() {
  return (
    <div className="App">
      <Navigation />     
      <Hero />
      <About />
      <Services />
      <Education />
      <Work />
      <Projects />
      <Contact />
      <Footer />
      
    </div>
  );
}

export default App;
