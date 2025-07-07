import { MapPin, Calendar } from 'lucide-react';

export interface WorkExperienceEntry {
  title: string;
  company: string;
  location: string;
  period: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export const workExperience: WorkExperienceEntry[] = [
  {
    title: 'AI Engineer Intern,',
    company: 'Kifiya Financial Technology',
    location: 'Addis Ababa, Ethiopia',
    period: 'Mar2025 - Present',
    type: 'Full-time',
    description: 'Crafting innovative AI solutions at Kifiya Financial Technology, I specialize in building and fine-tuning Agentic AI systems with LLMs and RAG pipelines. Working closely with diverse teams, I create scalable tools that boost decision-making, streamline operations, and elevate customer experiences in the fintech world.',
    achievements: [
      'Developing GenAI solutions using LangGraph and Retrieval-Augmented Generation (RAG) techniques.',
      'Designing and implementing conversational workflows with the LangChain ecosystem for enterprise use cases.',
      'Test and modify the ML models',
      'Collaborating with senior engineers and cross-functional teams',
      'Gaining hands-on experience in applying AI technologies within fintech and digital services.'
    ],
    technologies: ['Python', 'LangGraph', 'Docker', 'FastAPI', 'VectorDB', 'Docker' ,'postgresql']
  },
  {
    title: 'Youth Advisor ',
    company: 'Kifiya Financial Technology',
    location: 'Addis Ababa, Ethiopia',
    period: 'Dec 2023 -  April 2025',
    type: 'part-time',
    description: 'As a Youth Advisor, I amplify the voices of young people, translating their needs into actionable insights for impactful programs. Through strategic collaboration with stakeholders in multiple engagements, I shape and deliver initiatives that tackle real challenges, fostering meaningful, youth-driven solutions that inspire change.',
    achievements: [
      'Identified and communicated the needs of the youth, providing valuable advice and insights to support youth-focused initiatives',
      'Collaborated with stakeholders in 4+ meetings to design and implement strategic programs that address youth needs,ensuring effective and impactful solutions.',
      
    ],
    technologies : ['Advisory', 'Teamwork', 'Communication', 'Ideas Development', 'Easily Adaptable']  },
  {
    title: 'Computer Networking Engineer',
    company: 'GABI Technology PLC',
    location: 'Adama, Oromia Region, Ethiopia',
    period: 'july 2024 - Dec 2024',
    type: 'Full-time',
    description: 'At GABI Technology PLC, I engineered robust network solutions, designing and implementing LAN infrastructure for Adama City Administration to ensure reliable connectivity for over 500 users. By configuring Cisco switches and routers, I boosted network performance and security, while collaborating with teams to troubleshoot issues and build a scalable data center for enhanced data accessibility.',
    achievements: [
      ' Designed and implemented a LAN network infrastructure for Adama City Administration, reducing downtime and ensuring reliable connectivity for over 500 users.',
      'Configured and optimized Cisco switches and routers, enhancing network performance and security for seamless organizational communication.',
      'Collaborated with cross-functional teams to troubleshoot and resolve network issues, minimizing disruptions and ensuring smooth daily operations.',
      'Built and configured a data center to support scalable and secure data storage, improving data accessibility and processing efficiency.'
    ],
    technologies: ['putty ', 'cisco packet tracer', 'CMD', 'punch down tool', 'Crimper', 'fibber optic', ' Utp- calble' ]
  },
  {
    title: 'Software Engineering Intern',
    company: 'Forage',
    location: 'Remote',
    period: 'Nov 2023 - Nov 2023',
    type: 'Internship',
    description: 'Software Engineer Intern at Forage, I honed my skills in software development, mastering best practices in coding, debugging, and version control. Working remotely, I contributed to impactful projects, leveraging project management tools to deliver efficient solutions and gain practical experience in a dynamic tech environment.',
    achievements: [
      'Developed and debugged features for Forage’s virtual job simulation platform',
      'Streamlined code integration using version contro',
      'Earned recognition for high-quality code contributions during intern code reviews',
      'Received outstanding intern performance rating'
    ],
    technologies: ['JavaScript', 'Python', 'Git', 'Node.js', 'React', 'Jira']
  },

  {
    title: 'Frontend Web Developer',
    company: 'PURPOSE BLACK ETH',
    location: 'Remote',
    period: 'Mar 2023 - Jun 2023',
    type: 'Internship',
    description: 'I crafted and optimized user-friendly web interfaces, enhancing user experience through responsive design and seamless functionality. Collaborating closely with design and development teams in a hybrid setting, I implemented new features and improved applications, ensuring alignment with project goals and timely delivery',
    achievements: [
      'Developed and optimized user-friendly web interfaces, improving user experience through responsive design and enhanced functionality.',
      'Collaborated with design and development teams to implement new features and improve existing applications, ensuring alignment with project requirements and deadlines.',
      
    ],
    technologies: ['React.js', 'Bootstrap', 'GitLab', 'Front-End Development' ]
  }
];
