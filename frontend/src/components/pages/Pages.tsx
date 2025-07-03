import React from 'react';
import Navigation from '../Navigation'
import Hero from '../Hero';
import About from '../About';
import Services from '../Services';
import Education from '../Education';
import Projects from '../Projects';
import Work from '../Work';
import Contact from '../Contact';
import Footer from '../Footer'; 
import Chatbot from '../Chat/Chatbot';



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
      <Chatbot />
      
    </div>
  );
}

export default App;
