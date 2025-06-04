import React from 'react';
import WorkContent from './WorkContent';
import Project from './Project';

function Works() {
  return (
    <section id="work">
      <h1 className="section-title" style={{color: "white"}}>Work</h1>
      <div className="time-line">
        <WorkContent year="2023"
        title="Social Media Manager"
        where="Free service at tutor by AAU website"
        />
        <WorkContent year="2023"
        title="Youth Advisory Group Member"
        where=<p>
        At Kifiya Financial Technology Addis Ababa {' '}
        <a href="https://kifiya.com/" target="_blank" rel="noopener noreferrer">
          kifiya.com
        </a>. 
      </p>
        />
        <WorkContent year="2023"
        title="Coding Coach"
        where=<p>
        At  {' '}
        <a href="https://codejika.org/" target="_blank" rel="noopener noreferrer">
          CodeJIKA.com
        </a> website Part-time job.
       
      </p>
        />

        <WorkContent year="2023"
        title="Volunteer Leader"
        where=<p>
        At  {' '}
        <a href="https://younglife.org" target="_blank" rel="noopener noreferrer">
          younglife.org .
        </a> I guide and mentor young individuals in their spiritual journey.
       
      </p>
        />

        <Project />
       
        {/*<div className="buttons1">
          <p><a href="https://www.linkedin.com/in/dagmawi-teferi/">For More Information</a></p>
  </div>*/}
      </div>
    </section>
  );
}

export default Works;
