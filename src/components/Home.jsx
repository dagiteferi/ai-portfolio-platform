import React from "react";

function Home(){
    return(
        <section id="home">
    <div className="inner-width">
      <div className="content">   
    <h1 style={{fontSize: "40px"}}>Hi, I am</h1>
        <div className="sm">
            <a href="https://www.facebook.com/dagmawi.teferi.98/"><i class="fa fa-facebook" style={{fontSize:"24px"}}></i></a>
            <a href="https://www.instagram.com/dagmawi_teferi/" ><i class="fa fa-instagram" style={{fontSize:"24px"}}></i></a>
            <a href="https://www.linkedin.com/in/dagmawi-teferi/" ><i class="fa fa-linkedin" style={{fontSize:"24px"}}></i></a>
            <a href="https://t.me/@Pro_dagiiiEal" ><i class="fa fa-telegram" style={{fontSize:"24px"}}></i></a>
            <a href="https://github.com/dagiteferi "><i class="fa fa-github" style={{fontSize:"24px"}}></i></a>
        </div>
        <div className="buttons">
            <a href="#contact" id="myButton" >Get in Touch </a>

            <a href="images/CV.pdf"  target="_blank" id="myButton"  >Resume</a>
            
        </div>
      </div>
    </div>
    </section>
    );
}
export default Home;