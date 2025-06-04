import React from 'react';
import dig from '.././images/dig-mark.jpeg';
import web from '../images/web-div.jpeg';
import js from '.././images/js.jpeg';
import react from '../images/react.png';
import cosc from '.././images/cosc.jpeg';
import job from '../images/job.png';

function Education() {
  return (
    <section id="education" className="black" style={{marginTop: "0px"}}>
      <h1 className="section-title" style={{color: "black"}}>Education & Experiences</h1>
      <div className="edu">
        <a href={dig} className="education">
          <img src={dig} alt="digital marketing certificate" />
          <div className="info">
            <h3>Certificate Title</h3>
            <div>Digital Marketing</div>
          </div>
        </a>
        <a href={web} className="education">
          <img src={web} alt="Web Development certificate" />
          <div className="info">
            <h3>Certificate Title</h3>
            <div>Web Development</div>
          </div>
        </a>
        <a href={js} className="education">
          <img src={js} alt="JavaScript certificate" />
          <div className="info">
            <h3>Certificate Title</h3>
            <div>JavaScript</div>
          </div>
        </a>
        <a href= {react} className="education">
          <img src={react} alt="React certificate" />
          <div className="info">
            <h3>Certificate Title</h3>
            <div>React JS</div>
          </div>
        </a>
        <a href={cosc} className="education">
          <img src={cosc} alt="Basic Concepts of computer Science" />
          <div className="info">
            <h3>Certificate Title</h3>
            <div>Basic Concepts of Computer Science</div>
          </div>
        </a>
        <a href={job} className="education">
          <img src={job} alt="Job certificate" />
          <div className="info">
            <h3>Work Title</h3>
            <div>Software Engineering Work Simulations</div>
          </div>
        </a>
      </div>
    </section>
  );
}

export default Education;
