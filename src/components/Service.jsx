import React from 'react';
import Content from './Content';

function Service() {
  return (
    <section id="service" className="dark">
      <h1 className="section-title" style={{ color: "white" }}>
        Services
      </h1>
      <div className="Services">
        <Content
          title="Design"
          des="Designing websites involves creating visually appealing layouts, ensuring user-friendly navigation, and providing an engaging and inclusive user experience."
        />

        <Content
          title="Build Websites"
          des="Building websites involves writing efficient code, optimizing for SEO, and continuously updating content to create engaging and accessible online platforms."
        />

        <Content
          title="Manage Databases"
          des="Managing a database involves designing, implementing, and supporting stored data to maximize its value."
        />
      </div>
      <div className="Services">
        <Content
          title="Digital Marketing"
          des="Digital marketing involves creating effective strategies, leveraging online platforms, and analyzing data to connect with customers, build brand awareness, and drive business growth."
        />

        <Content
          title="Programming"
          des="Programming is about writing efficient code, solving problems through debugging, mastering various languages and tools, and constantly learning new techniques to build secure and functional applications."
        />

        <Content title="Content Management" des="Content management is the process of creating, editing, 
            organizing, and publishing digital content. It requires
             understanding the audience, mastering content management
              systems, and staying updated with digital trends to keep 
              the content relevant and engaging" />
      </div>
    </section>
  );
}

export default Service;
