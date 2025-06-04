import React from 'react';

function Contact() {
  return (
    <section id="contact" className="black">
      <h1 className="section-title">Contact</h1>
      <div className="contact-info">
        <div className="item">
          <i className="fa fa-mobile"></i>
          +251 920 362324
        </div>
        <div className="item">
          <i className="fa fa-envelope"></i>
          dagiteferi2011@gmail.com
        </div>
        <div className="item">
          {/* <i className="fa fa-map-marker"></i> */}
          {/* Adama, Oromia, Ethiopia <a href="#" style={{color: "#48dbfb"}}>Google Map</a>  */}
           <iframe 
           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.5855252528504!2d39.24758767414101!3d8.539556391503536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b21e49ef24ef1%3A0x93fd7ea291aea92f!2sUnity%20University.!5e0!3m2!1sen!2set!4v1709682875855!5m2!1sen!2set" 
           width="410" height="160" style={{border:"0" ,padding:"2px"}} 
           allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">

           </iframe>
        
        </div> 
      </div>
      <form action="#" className="contact-form">
        <input type="email" className="emailZone" placeholder="Your Email" />
        <input type="text" className="subjectZone" placeholder="Subject" />
        <textarea className="messageZone" placeholder="Message"></textarea>
        <input type="submit" value="Send " className="btn" />
      </form>
    </section>
  );
}

export default Contact;
