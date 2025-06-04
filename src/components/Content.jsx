import React from "react";

function Content(Props) {
  // Define the getIconClass function
  const getIconClass = (title) => {
    switch (title.toLowerCase()) {
      case "design":
        return "fa-paint-brush"; // Replace with the actual class for the design icon
      case "build websites":
        return "fa-cogs"; // Replace with the actual class for the programming icon
      case "manage databases":
        return "fa-database"; // Replace with the actual class for the content management icon
      case "digital marketing":
        return "fa-bullhorn";
        case "programming":
          return "fa-code";
          case "content management":
          return "fa-edit";
          
      default:
        return ""; // Default icon class (if no match)
    }
  };

  return (
    <div className="service">
      <i className={`icon fa ${getIconClass(Props.title)}`}></i>
      <h4>{Props.title}</h4>
      <p>{Props.des}</p>
    </div>
  );
}

export default Content;
