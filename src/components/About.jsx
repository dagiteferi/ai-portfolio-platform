import React from "react";
import AboutImg from '../images/about3.jpeg';



function About(){
    return(
        <div>
        <section id="about" style={{backgroundColor: "#f1f1f1;"}}>
        <h1 className="section-title" style={{marginTop: "80px;"}}>About</h1>
        <div className="inner-width">
        
        <div className="containerr">
          <div className="content-wrapper">
          <div className="roww">
  <img src={AboutImg} alt="dagmawi-photo" className="img-responsive" />
</div>

            <div className="about-content">
              <p>Welcome to my digital corner! I'm <b>Dagmawi Teferi</b>, a passionate and certified Digital Marketer,
                Web Developer,  Programmer and skilled Database Administrator . I enjoy creating digital experiences 
                that make a difference.Currently in my third year of <b>Computer Science </b> Student with high GPA of 
                <strong>3.92</strong> <mark style={{backgroundColor:"#48dbfb"}}> I'm not just writing code; I'm making 
                the future of technology.I am on the wey to Start Technology start up called (S.S.S triple S)</mark> 
                Beyond the certificates and lines of code, my journey is fueled by a commitment to continuous learning
                and pushing the boundaries of technology.But there’s more to me than just coding.  I’m also inspired by 
                spiritual books,especially the <b>Bible.</b>This book help me to shaping my perspectivesee and behaviour.
                <br />Come explore my digital world, where technology meets purpose. Let’s connect and navigate this 
                ever-changing digital world together..</p>
               <div className="buttons">
                  <a href="images/CV.pdf"  target="_blank" id="myButton" >Look My CV</a>
                </div>
            </div>
           </div>
          </div>
         </div>
        
         </section>
        
         <section style={{backgroundColor: "#f1f1f1"}}>
          <div className="inner-wiidth">
       
            <div className="about-content">
              <div className="about-text">
             
                <h3>
                  Some introduction to my skill abilities and value is below. LET'S BUILD SOMETHING AWESOME TOGETHER
                </h3>
         
              </div>
            </div>
      
            <div className="skills">
              <div className="skill">
                <div className="skill-info">
                  <span>HTML</span>
                  <span>80%</span>
                </div>
                <div className="skill-bar html"></div>
              </div>
      
              <div className="skill">
                <div className="skill-info">
                  <span>Css</span>
                  <span>80%</span>
                </div>
                <div className="skill-bar css"></div>
              </div>
      
              <div className="skill">
                <div className="skill-info">
                  <span>Javascript</span>
                  <span>70%</span>
                </div>
                <div className="skill-bar js"></div>
              </div>
      
              <div className="skill">
                <div className="skill-info">
                  <span>React</span>
                  <span>90%</span>
                </div>
                <div className="skill-bar php"></div>
              </div>
      
              <div className="skill" action="index.php">
                <div className="skill-info">
                  <span>MySQL</span>
                  <span>90%</span>
                </div>
                <div className="skill-bar mysql"></div>
              </div>
      
              <div className="skill">
                <div className="skill-info">
                  <span>C++</span>
                  <span>80%</span>
                </div>
                <div className="skill-bar cs"></div>
              </div>
              <div className="skill">
                <div className="skill-info">
                  <span>Node js</span>
                  <span>90%</span>
                </div>
                <div className="skill-bar cs"></div>
              </div>
              <div className="skill">
                <div className="skill-info">
                  <span>Java</span>
                  <span>50%</span>
                </div>
                <div className="skill-bar cs"></div>
              </div>
            </div>
          </div>
        </section>
         </div>
    );
}
export default About;