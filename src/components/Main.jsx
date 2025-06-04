import React from "react";
import Nav from "./Nav";
import Home from "./Home";
import About from "./About";
import Service from "./Service"
import Education from "./Education";
import Works from "./Works";
import Contact from "./Contact";
import Footer from "./Footer";

function Main(){
    return(
        <div>
        <Nav />
        <Home />
        <About />
        <Service />
        <Education />
        <Works />
        <Contact />
        <Footer />
        </div>
        
    );
}
export default Main;