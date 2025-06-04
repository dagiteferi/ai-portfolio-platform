import React from "react";
import react from '../images/react.png';
import cpp from '.././images/cpp pro.jpeg';
import sea from '../images/seasor.jpeg';
import ana from '../images/anapro.jpeg'

function Project(){
    return(
        
        <section  className="dark">
        <div className="inner-width">
          <h1 className="section-title" style={{color: "white"}}>Projects</h1>
          <div className="pro">
          <a href="https://github.com/dagiteferi/library-managment-sysem" className="project">
              <img src={cpp} alt="" />
            
              <div className="info">
                <h3>library-managment-sysem </h3>
                <div className="cat">using c++</div>
              </div>
            </a>
            <a href="https://github.com/dagiteferi/Search-And-Sort-Algorithms-using-c-" className="project">
              <img src={sea} alt="" />
              <div className="info">
                <h3>Search-And-Sort-Algorithms-using-c- </h3>
                <div className="cat">using c++</div>
              </div>
            </a>
            <a href="https://anasimos.netlify.app/" className="project">
              <img src={ana} alt="" />
              <div className="info">
                <h3>A website for Anasimos Charity organization</h3>
                <div className="cat">HTML,CSS,JS,BOOTSTRAP,SACSS</div>
              </div>
            </a>
          </div>
        </div>
      </section>

    );
}
export default Project;