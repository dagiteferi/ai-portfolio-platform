import React from 'react';

function Nav(){
    return(
   <nav className="navbar">
    <div className="inner-width">
      <a href="#home" className="logo"></a>
      <button className="menu-toggler">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className="navbar-menu">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#service">Services</a>
        <a href="#education">Education</a>
        <a href="#work">Works</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </nav>
    );
}
export default Nav;
