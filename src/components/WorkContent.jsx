import React from "react";

function WorkContent(props){
    return(
        <div className="block" style={{color: "rgb(19, 18, 18)"}}>
        <h4>{props.year}</h4>
        <h3>{props.title}</h3>
        <p>{props.where}</p>
      </div>
    );
    
}
export default WorkContent;