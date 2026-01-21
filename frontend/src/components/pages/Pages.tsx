import React, { useRef } from 'react';
import Navigation from '../Navigation'
import Hero from '../Hero';
import About from '../About/AboutContent';
import Services from '../Services/Services';
import Education from '../Education/EducationContent';
import Gallery from '../Gallery/Gallery';
import Projects from '../Projects/Projects';
import Work from '../Work/Work';
import Contact from '../Contact/Contact';
import Footer from '../Footer';
import Chatbot, { ChatbotHandle } from '../Chat/Chatbot';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import StatsCounter from '../Stats';

function App() {
  const chatbotRef = useRef<ChatbotHandle>(null);
  const { data, isLoading, isError } = usePortfolioData();

  return (
    <div className="App">
      <Navigation />
      <Hero
        onChatButtonClick={() => chatbotRef.current?.openChat('fullscreen')}
        cvData={data.cvs}
      />
      <About skillsData={data.skills} />
      <Services />
      <Education
        educationData={data.education}
        certificatesData={data.certificates}
      />
      <Gallery momentsData={data.moments} />
      <Work experienceData={data.experience} />
      <StatsCounter />
      <Projects projectsData={data.projects} />
      <Contact />
      <Footer />
      <Chatbot ref={chatbotRef} />
    </div>
  );
}

export default App;
