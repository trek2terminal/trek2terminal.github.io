window.SITE_CONTENT = {
  meta: {
    name: "Subradeep Das",
    initials: "SD",
    title: "Project Coordinator & AI/ML Engineer",
    tagline: "Where Management Meets Machine Intelligence",
    subTagline: "ECE Graduate | C-DAC HPC-AI Certified | Building at the intersection of AI, data, and real-world problem solving",
    email: "subradeepdas24@gmail.com",
    phone: "+91-8259982540",
    location: "Agartala, Tripura, India",
    dob: "24 January 2002",
    nationality: "Indian",
    languages: "English, Hindi, Bengali",
    linkedin: "https://www.linkedin.com/in/subradeepdas02/",
    github: "https://github.com/trek2terminal",
    resume: "/assets/Subradeep_resume.pdf",
    favicon: "assets/favicon.png",
    avatar: "assets/pp-optimized.jpg",
    avatarAlt: "Portrait of Subradeep Das",
    typingRoles: [
      "Where Management Meets Machine Intelligence",
      "Coordinating teams that ship useful AI products",
      "Turning data, models, and roadmaps into delivery"
    ],
    typingRolesMobile: [
      "AI + delivery",
      "Models to real workflows",
      "Management meets ML"
    ]
  },

  labels: {
    availability: "Available for AI and delivery work",
    viewWork: "View My Work",
    downloadResume: "Download Resume",
    contactMe: "Contact Me",
    readCaseStudy: "Read Case Study",
    quickInfo: "Quick Info",
    coreExpertise: "Core Expertise",
    sendMessage: "Send Message",
    viewCredential: "View Credential",
    viewProject: "View Project",
    builtWith: "Built with semantic HTML, CSS, and JavaScript"
  },

  sectionTitles: {
    about: "About",
    skills: "Skills",
    projects: "Projects",
    process: "How I Work",
    experience: "Experience",
    certifications: "Certifications",
    contact: "Contact"
  },

  nav: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" }
  ],

  stats: [
    { value: 1, suffix: "+", label: "Years of Experience" },
    { value: 10, suffix: "+", label: "Projects Completed" },
    { value: 4, suffix: "+", label: "Certifications" },
    { value: 2, suffix: "", label: "Research Projects" }
  ],

  about: {
    intro: [
      "Hey, I'm Subradeep - an engineer who ended up loving the management side of tech just as much as the technical side. I did my B.Tech in Electronics and Communication from NEHU Shillong, then went deep into AI and High Performance Computing at C-DAC Guwahati. Now I work as a Project Coordinator at Codebucket Solutions, where I make sure things actually get built: on time, with the right people, doing the right things.",
      "I'm genuinely excited about AI and ML - not just the buzzwords, but actually training models, working with data, and building things that solve real problems. My background in ECE gives me a solid foundation in how things work at a hardware and signal level, which I think makes me a better AI/ML thinker.",
      "Outside of work, I love learning new languages, travelling to explore new cultures, and cooking food from places I've never been. I believe curiosity is the best skill anyone can have."
    ],
    quickInfo: [
      { label: "Location", value: "Agartala, Tripura, India", href: null, icon: "map-pin" },
      { label: "Email", value: "subradeepdas24@gmail.com", href: "mailto:subradeepdas24@gmail.com", icon: "mail" },
      { label: "Phone", value: "+91-8259982540", href: "tel:+918259982540", icon: "phone" },
      { label: "Experience", value: "1+ year in coordination and applied AI work", href: null, icon: "briefcase-business" },
      { label: "Languages", value: "English, Hindi, Bengali", href: null, icon: "languages" },
      { label: "Nationality", value: "Indian", href: null, icon: "flag" }
    ],
    expertise: [
      {
        icon: "brain-circuit",
        title: "AI/ML Engineering",
        description: "Training, tuning, evaluating, and explaining models with practical deployment in mind."
      },
      {
        icon: "workflow",
        title: "Project Coordination",
        description: "Keeping scope, people, risks, timelines, and delivery decisions aligned from plan to handoff."
      },
      {
        icon: "database",
        title: "Data Analytics",
        description: "Cleaning datasets, finding patterns, and turning analysis into decisions people can use."
      },
      {
        icon: "cpu",
        title: "HPC-AI Foundations",
        description: "Thinking about model workflows with performance, scale, and compute constraints in view."
      },
      {
        icon: "radio-tower",
        title: "ECE & Photonics",
        description: "Bringing hardware, signal systems, and optical communication context into technical thinking."
      },
      {
        icon: "sparkles",
        title: "Curious Builder Mindset",
        description: "Learning fast, asking clear questions, and building systems that survive real-world use."
      }
    ],
    interests: ["Learning languages", "Travelling", "Cooking"]
  },

  skills: [
    {
      title: "AI / Machine Learning",
      icon: "brain-circuit",
      items: [
        "TensorFlow",
        "PyTorch",
        "Keras",
        "scikit-learn",
        "XGBoost",
        "CNN",
        "RNN",
        "LSTM",
        "Transfer Learning",
        "Model Optimization",
        "Hyperparameter Tuning"
      ]
    },
    {
      title: "Data & Analytics",
      icon: "bar-chart-2",
      items: [
        "Python",
        "R",
        "Pandas",
        "NumPy",
        "Statistical Analysis",
        "Regression",
        "Classification",
        "Clustering",
        "Matplotlib",
        "Seaborn",
        "ggplot2",
        "Plotly"
      ]
    },
    {
      title: "Tools & Platforms",
      icon: "terminal",
      items: [
        "Jupyter",
        "Google Colab",
        "Kaggle",
        "VS Code",
        "Docker",
        "Flask",
        "Nginx",
        "Git",
        "GitHub",
        "Linux",
        "Bash / Shell Scripting",
        "SQL",
        "Java"
      ]
    },
    {
      title: "Management & Domain",
      icon: "network",
      items: [
        "Agile / Scrum Methodology",
        "Cross-functional Team Coordination",
        "Stakeholder Communication",
        "Task & Milestone Tracking",
        "Risk Management",
        "High Performance Computing",
        "Quantum Computing Basics",
        "Remote Sensing & Geospatial ML",
        "Signal Processing",
        "Photonics",
        "Optical Communication"
      ]
    }
  ],

  projects: [
    {
      id: "irctc",
      title: "Hybrid IRCTC Bot-Detection & Train Search Web App",
      period: "Mar 2025 - Aug 2025",
      eyebrow: "ML security + railway search",
      summary: "A full-stack web application combining human verification with ML-powered bot detection, layered with a smart train search interface.",
      stack: ["Python", "TensorFlow", "scikit-learn", "Flask", "Docker", "Nginx", "JavaScript"],
      highlights: [
        "Built a hybrid CAPTCHA flow using image CAPTCHA plus behavioral biometrics for real-time human/bot detection.",
        "Designed train search views with demand heatmaps, punctuality scores, and Random Forest confirmation probability estimates.",
        "Added retraining hooks, privacy-preserving telemetry, and admin audit logs for production-style operation."
      ],
      links: [
        { label: "View Code", url: "https://github.com/trek2terminal/IRCTC_Bot_Detection_And_Demand_Prediction.git", icon: "github" }
      ],
      caseStudy: {
        Role: "ML Engineer and full-stack builder",
        Stack: "Python, TensorFlow, scikit-learn, Flask, Docker, Nginx, JavaScript",
        Challenge: "Protect a train-search flow from bots without depending only on a static CAPTCHA.",
        Approach: "Combined CAPTCHA validation with behavior-derived model signals, then connected the verification layer to a richer train-search interface.",
        Outcome: "A production-minded prototype with audit logs, retraining paths, and interpretable travel-demand signals."
      }
    },
    {
      id: "chebyshev",
      title: "Design & Fabrication of Higher-Order Chebyshev Filter",
      period: "Feb 2024 - Jul 2024",
      eyebrow: "Photonics research",
      summary: "A photonics research project involving the design, simulation, and physical fabrication of an advanced optical filter on Silicon-on-Insulator.",
      stack: ["Lumerical", "KLayout", "MATLAB", "Python", "SOI", "EBL"],
      highlights: [
        "Designed a 7th-order Mach-Zehnder interferometer-based Chebyshev bandpass filter.",
        "Simulated optical behavior in Lumerical FDTD and prepared physical layout in KLayout.",
        "Fabricated on SOI with Electron Beam Lithography and ran Monte Carlo analysis for manufacturing variability."
      ],
      links: [
        { label: "View Research", url: "https://drive.google.com/file/d/196osbxHVGWdW8D5vdNvpmh3YtHFS9mqv/view?usp=drive_link", icon: "external-link" }
      ],
      caseStudy: {
        Role: "Research and project intern",
        Stack: "Lumerical, KLayout, MATLAB, Python, SOI, Electron Beam Lithography",
        Challenge: "Design a higher-order optical filter and reason about performance under fabrication variation.",
        Approach: "Moved from optical simulation to layout, fabrication workflow, and Monte Carlo variability analysis.",
        Outcome: "A research-grade design with applications in telecom wavelength division multiplexing and medical imaging systems."
      }
    }
  ],

  process: [
    {
      title: "Understand & Plan",
      description: "Deeply understanding the problem, gathering requirements from stakeholders, and designing a clear roadmap before execution begins."
    },
    {
      title: "Research & Design",
      description: "Applying domain knowledge - from ML model selection to system architecture - to design the best solution for the problem at hand."
    },
    {
      title: "Build & Iterate",
      description: "Developing, testing, and refining - whether it is code, a model pipeline, or a project workflow - with feedback loops at every stage."
    },
    {
      title: "Deploy & Coordinate",
      description: "Managing production deployments, cross-team coordination, and delivery handoffs so the final output meets real-world expectations."
    }
  ],

  experience: [
    {
      role: "Project Coordinator",
      company: "Codebucket Solutions Pvt. Ltd.",
      period: "November 2025 - Present",
      location: "Agartala, Tripura (Onsite)",
      logo: "assets/Cb.png",
      logoAlt: "Codebucket Solutions logo",
      bullets: [
        "Coordinate end-to-end project delivery across cross-functional teams, keeping timelines, deliverables, and stakeholder expectations visible.",
        "Bridge communication between developers, designers, and business stakeholders so product goals stay aligned with execution.",
        "Track milestones, manage task assignments, and maintain delivery accountability using agile working habits.",
        "Apply AI/ML knowledge to identify automation opportunities and improve internal workflows.",
        "Support technical decisions with an engineering mindset during planning and risk analysis."
      ]
    },
    {
      role: "Research & Project Intern",
      company: "Lightwave Communication Laboratory, NEHU",
      period: "2023 - 2024",
      location: "Shillong, Meghalaya",
      logo: "assets/nehu.png",
      logoAlt: "North-Eastern Hill University logo",
      bullets: [
        "Completed a photonics and optical communication lab project under Prof. Subhash Arya.",
        "Designed a 7th-order Mach-Zehnder interferometer Chebyshev filter, simulated it in Lumerical, and laid it out in KLayout.",
        "Worked through SOI fabrication with Electron Beam Lithography and Monte Carlo analysis for fabrication variability.",
        "Organized and participated in photonics workshops as a member of the lab."
      ]
    }
  ],

  education: [
    {
      degree: "Advanced Certification in HPC-AI",
      institute: "C-DAC, Guwahati",
      year: "Mar - Aug 2025",
      score: "67.08%"
    },
    {
      degree: "B.Tech - Electronics & Communication Engineering",
      institute: "NEHU, Shillong",
      year: "2020 - 2024",
      score: "CGPA: 7.37",
      link: "assets/Btech_Provisional_Certificate.pdf"
    },
    {
      degree: "Intermediate (CBSE)",
      institute: "Swami Dhananjoy Das Kathia Baba Mission School, Agartala",
      year: "2018 - 2020",
      score: "69.8%",
      link: "assets/12th_marksheet.pdf"
    },
    {
      degree: "Matriculation (TBSE)",
      institute: "Henry Derozio Academy H.S School, Agartala",
      year: "2017 - 2018",
      score: "75%",
      link: "assets/10th_marksheet.pdf"
    }
  ],

  certifications: [
    {
      title: "Quantum Computing",
      issuer: "C-DAC Hyderabad",
      date: "Jun 2025",
      credentialId: "CDACH/QML/2034",
      link: "assets/Quantum_Computing.pdf"
    },
    {
      title: "AI/ML for Crop Acreage Mapping",
      issuer: "IIRS, ISRO",
      date: "Apr 2025",
      credentialId: "2025234601756",
      link: "assets/AI_ML_Specific_crop.pdf"
    },
    {
      title: "Geodata Processing with Python & ML",
      issuer: "IIRS, ISRO",
      date: "Mar 2025",
      credentialId: "2025234601756",
      link: "assets/Geodata_Processing.pdf"
    },
    {
      title: "TCS iON Career Edge - Young Professional",
      issuer: "TCS iON",
      date: "Feb 2025",
      credentialId: "119854-27331871-1016",
      link: "assets/tcs_ion.pdf"
    }
  ],

  contact: {
    responseTime: "48 hours",
    fields: {
      name: "Name",
      email: "Email",
      message: "Message"
    }
  }
};
