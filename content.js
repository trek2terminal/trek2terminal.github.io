/*
  Portfolio content source of truth.

  Edit this file to update the site content. The HTML stays structural, and
  main.js reads this object to build every visible section.

  Tips:
  - To add a project, copy one object inside projects[] and change its fields.
  - To hide a link, set it to null or remove it from the array.
  - Keep asset paths relative to this repo, for example: assets/resume.pdf.
*/

window.SITE_CONTENT = {
  // Global identity, links, and assets used across the whole page.
  meta: {
    name: "Subradeep Das",
    initials: "SD",
    title: "AI/ML Engineer",
    tagline: "Building applied ML systems with clean pipelines, model evaluation, and deployment-minded delivery.",
    email: "subradeepdas24@gmail.com",
    location: "Agartala, Tripura, India",
    linkedin: "https://www.linkedin.com/in/subradeepdas02/",
    github: "https://github.com/trek2terminal",
    resume: "assets/resume.pdf",
    favicon: "assets/favicon.png",
    avatar: "assets/pp-optimized.jpg",
    avatarAlt: "Portrait of Subradeep Das",
    openTo: ["AI/ML roles", "Internships", "Freelance"],
    typingRoles: ["AI/ML Engineer", "HPC-AI Practitioner", "Applied ML Builder"]
  },

  // Text labels used by buttons, headings inside widgets, and repeated UI.
  labels: {
    availability: "Available for Opportunities",
    viewProjects: "View Projects",
    downloadResume: "Download Resume",
    contactMe: "Contact Me",
    readCaseStudy: "Read Case Study",
    keyProficiencies: "Key Proficiencies",
    interests: "Interests",
    openTo: "Open to",
    quickLinks: "Quick Links",
    connect: "Connect",
    viewCertificate: "View Certificate",
    backToTop: "Back to top",
    sendMessage: "Send Message",
    successPrefix: "Message sent! I'll reply within"
  },

  // Main section headings. Rename sections here without touching HTML.
  sectionTitles: {
    whatIDo: "What I Build",
    projects: "Featured Projects",
    skills: "Skills & Tools",
    education: "Education",
    certifications: "Certifications",
    experience: "Experience & Labs",
    about: "About Me",
    contact: "Get In Touch"
  },

  // Navbar entries. Add/remove objects here to change navigation.
  nav: [
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Certifications", href: "#certifications" },
    { label: "Experience", href: "#experience" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ],

  // Hero stat counters. Values animate when the hero enters the viewport.
  stats: [
    { value: 2, label: "Featured Builds" },
    { value: 4, label: "Certifications" },
    { value: 3, label: "Core Domains" }
  ],

  // Capability cards in the "What I Build" section.
  whatIDo: [
    {
      icon: "cpu",
      title: "Applied ML Builds",
      description: "Data preparation, model training, evaluation, and user-facing workflows."
    },
    {
      icon: "zap",
      title: "HPC-AI Foundations",
      description: "Performance-aware thinking for training, inference, and system design."
    },
    {
      icon: "shield-check",
      title: "Reliable Systems",
      description: "Privacy-aware telemetry, retraining paths, logging, and operational checks."
    },
    {
      icon: "bar-chart-2",
      title: "Analytical Storytelling",
      description: "Clear visualizations and narratives that drive decisions."
    }
  ],

  // Featured projects. Each project can have its own stack, links, and modal case study.
  projects: [
    {
      id: "irctc",
      title: "Hybrid IRCTC Bot-Detection & Train Search",
      accentColor: ["#4f9eff", "#00d4aa"],
      stack: ["TensorFlow", "Behavioral Biometrics", "CAPTCHA", "Random Forest", "Flask", "Docker", "Nginx"],
      summary: "Built a production-style railway search and bot-detection prototype combining CAPTCHA validation, behavioral biometrics, TensorFlow inference, and operational dashboards.",
      highlights: [
        "Designed the human-verification flow with privacy-aware telemetry.",
        "Added demand heatmaps, punctuality views, and confirmation probability signals.",
        "Packaged the app with Flask, Docker, and Nginx deployment pieces."
      ],
      caseStudy: {
        role: "ML Engineer, Full-stack",
        stack: "TensorFlow, scikit-learn, Random Forest, Flask, Docker, Nginx",
        problem: "Railway search flows need a human-verification layer that does not rely only on a static CAPTCHA.",
        build: "Combined image CAPTCHA checks with behavioral biometrics, TensorFlow inference, demand heatmaps, punctuality views, and confirmation-probability signals.",
        engineeringFocus: "Flask API flow, Docker/Nginx packaging, privacy-aware telemetry, admin audit logs, and retraining hooks for model improvement."
      },
      links: [
        { label: "View Code", url: "https://github.com/trek2terminal/IRCTC_Bot_Detection_And_Demand_Prediction.git" }
      ]
    },
    {
      id: "mzi",
      title: "Higher-Order Chebyshev Filter (MZI)",
      accentColor: ["#a78bfa", "#f472b6"],
      stack: ["Photonics", "7th-order Chebyshev", "Lumerical", "KLayout", "SOI", "EBL", "Monte Carlo"],
      summary: "Designed and validated a 7th-order Mach-Zehnder interferometer filter for a photonics lab project, connecting simulation, layout, fabrication, and variability analysis.",
      highlights: [
        "Simulated filter behavior in Lumerical and prepared layout in KLayout.",
        "Worked with SOI fabrication constraints and E-beam lithography workflow.",
        "Performed Monte Carlo analysis to reason about process variability."
      ],
      caseStudy: {
        role: "Designer, Simulation & Fabrication",
        stack: "Lumerical, KLayout, SOI, EBL, Monte Carlo",
        problem: "Design a higher-order optical filter and reason about fabrication variability in a lab workflow.",
        build: "Created the 7th-order Mach-Zehnder interferometer design, simulated the response in Lumerical, and prepared layout in KLayout.",
        engineeringFocus: "SOI constraints, E-beam lithography workflow, Monte Carlo variability analysis, and documentation of results for review."
      },
      links: [
        { label: "See Results", url: "https://drive.google.com/file/d/196osbxHVGWdW8D5vdNvpmh3YtHFS9mqv/view?usp=drive_link" }
      ]
    }
  ],

  // Skill tabs. Object keys become tab labels; array values become chips.
  skills: {
    Languages: ["Python", "SQL", "R", "Java", "Bash"],
    "Machine Learning": ["TensorFlow", "PyTorch", "Keras", "scikit-learn", "XGBoost", "CNN", "RNN/LSTM", "Transfer Learning"],
    "Data & Visualization": ["Pandas", "NumPy", "Statistical Analysis", "Matplotlib", "Seaborn", "Plotly", "ggplot2"],
    Tools: ["Docker", "Nginx", "Flask", "Linux", "VS Code", "Jupyter", "Colab", "Kaggle"]
  },

  // Progress bars in the Skills section.
  proficiency: [
    { label: "Python", percent: 90 },
    { label: "TensorFlow / Keras", percent: 80 },
    { label: "Docker", percent: 75 },
    { label: "Data Visualization", percent: 85 },
    { label: "SQL", percent: 70 }
  ],

  // Education timeline entries. Set link to null when no document link is needed.
  education: [
    {
      institution: "C-DAC Guwahati",
      degree: "Advanced Certification in HPC-AI",
      period: "Mar 2025 - Aug 2025",
      score: "67.08%",
      link: null
    },
    {
      institution: "North-Eastern Hill University",
      degree: "B.Tech, Electronics & Communication Engineering",
      period: "2020 - 2024",
      score: "CGPA 7.37",
      link: { label: "View Degree Certificate", url: "assets/Btech_Provisional_Certificate.pdf" }
    },
    {
      institution: "Swami Dhananjoy Das Kathia Baba Mission School",
      degree: "Intermediate (CBSE)",
      period: "2018 - 2020",
      score: "69.8%",
      link: null
    },
    {
      institution: "Henry Derozio Academy H.S School",
      degree: "Matriculation (TBSE)",
      period: "2017 - 2018",
      score: "75%",
      link: null
    }
  ],

  // Certification cards. link can point to a PDF in assets/ or an external credential page.
  certifications: [
    {
      title: "Geodata Processing with Python & ML",
      issuer: "IIRS, ISRO",
      credentialId: "2025234601756",
      link: "assets/Geodata_Processing.pdf"
    },
    {
      title: "Quantum Computing",
      issuer: "C-DAC Hyderabad",
      credentialId: "CDACH/QML/2034",
      link: "assets/Quantum_Computing.pdf"
    },
    {
      title: "TCS iON Career Edge - Young Professional",
      issuer: "TCS iON",
      credentialId: "119854-27331871-1016",
      link: "assets/tcs_ion.pdf"
    },
    {
      title: "AI/ML for Crop Acreage Mapping",
      issuer: "IIRS, ISRO",
      credentialId: "2025234601756",
      link: "assets/AI_ML_Specific_crop.pdf"
    }
  ],

  // Experience timeline. Logos should stay in assets/ and include useful alt text.
  experience: [
    {
      role: "Project Coordinator",
      company: "Codebucket Solutions Pvt Ltd.",
      period: "Nov 2025 - Present",
      location: "Agartala, Tripura",
      logo: "assets/Cb.png",
      logoAlt: "Codebucket Solutions logo",
      bullets: [
        "Coordinate software and AI-driven project work across planning, delivery tracking, and client communication.",
        "Maintain structured timelines, deliverable checklists, and follow-ups so teams can move from scope to execution.",
        "Use the role to strengthen practical delivery habits around documentation, handoff, and stakeholder updates."
      ],
      link: null
    },
    {
      role: "Project Intern",
      company: "NIELIT Agartala",
      period: "Aug 2025 - Nov 2025",
      location: "",
      logo: "assets/NIELIT.png",
      logoAlt: "NIELIT Agartala logo",
      bullets: [
        "Worked on applied ML/data tasks, systems integration, and structured technical training modules.",
        "Practiced turning requirements into reproducible workflows, documentation, and reviewable outputs."
      ],
      link: { label: "View Offer Letter", url: "assets/offer_letter.pdf" }
    },
    {
      role: "Member",
      company: "Lightwave Communication Laboratory, NEHU",
      period: "",
      location: "North-Eastern Hill University",
      logo: "assets/nehu.png",
      logoAlt: "North-Eastern Hill University logo",
      bullets: [
        "Supported photonics workshop activity and lab coordination inside the Lightwave Communication Laboratory.",
        "Completed the higher-order Chebyshev MZI filter project under Prof. Subhash Arya."
      ],
      link: { label: "View LWCS Certificate", url: "assets/LWCS.pdf" }
    }
  ],

  // About section copy, interests, and animated terminal lines.
  about: {
    bio: "I am an AI/ML engineer with a background in electronics and communication engineering, HPC-AI training, and applied project delivery. I like work that connects models with real product behavior: useful interfaces, clear evaluation, privacy-aware telemetry, and systems that can be explained after they are built.",
    interests: [
      { emoji: "\u{1F310}", label: "Learning Languages" },
      { emoji: "\u2708\uFE0F", label: "Traveling" },
      { emoji: "\u{1F373}", label: "Cooking" }
    ],
    terminalLines: [
      "$ python train.py --epochs 50",
      "> Loading dataset... done.",
      "> Training model...",
      "> Epoch 50/50 - loss: 0.042 - acc: 98.3%",
      "> Saving model... done.",
      "$ docker build -t ml-app .",
      "> Successfully built 9f3a2c1d",
      "$ echo \"Ready to deploy\"",
      "> Ready to deploy"
    ]
  },

  // Contact form endpoint and field labels. Replace the Formspree ID when ready.
  contact: {
    formAction: "https://formspree.io/f/REPLACE_WITH_YOUR_ID",
    responseTime: "48 hours",
    fields: {
      name: "Name",
      email: "Email",
      message: "Message"
    }
  },

  // Footer copy.
  footer: {
    copyText: "Subradeep Das",
    builtWith: "Built with \u{1F4BB} & \u2615"
  }
};
