import React, { useState, useRef } from 'react';
import Navigation from '../Navigation'
import Hero from '../Hero';
import About from '../About';
import Services from '../Services/Services';
import Education from '../Education/Education';
import Gallery from '../Gallery/Gallery';
import Projects from '../Projects/Projects';
import Work from '../Work/Work';
import Contact from '../Contact';
import Footer from '../Footer'; 
import Chatbot, { ChatbotHandle } from '../Chat/Chatbot';



function App() {
  const chatbotRef = useRef<ChatbotHandle>(null);

  return (
    <div className="App">
      <Navigation />     
      <Hero onChatButtonClick={() => chatbotRef.current?.openChat('fullscreen')} />
      <About />
      <Services />
      <Education />
      <Gallery />
      <Work />
      <Projects />
      <Contact />
      <Footer />
      <Chatbot ref={chatbotRef} />
      
    </div>
  );
}

export default App;
