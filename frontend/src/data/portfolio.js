// Portfolio data - Edit this file to customize your portfolio content

export const personalInfo = {
  name: "Kunal Dhangar",
  firstName: "Kunal",
  lastName: "Dhangar",
  title: "Full-Stack Web & Android Developer",
  email: "kunaldhangar184@gmail.com",
  location: "India",
  tagline: "I help founders turn ideas into seamless digital experiences",
  bio: [
    "I'm Kunal Dhangar, a Computer Science student passionate about building scalable and user-focused digital products. My interests span modern web technologies, Web3 ecosystems, and Android development.",
    "I enjoy turning complex ideas into practical solutions. I'm driven by continuous learning and love exploring emerging technologies that shape the future of the internet.",
    "I believe in waking up each day eager to make a difference!",
  ],
  social: {
    github: "https://github.com/imkunal01",
    linkedin: "https://www.linkedin.com/in/kunaldhangar/",
    twitter: "https://x.com/",
    email: "mailto:kunaldhangar184@gmail.com",
  },
  available: true,
  resumeUrl: "#",
};

export const skills = {
  languages: [
    { name: "C", icon: "https://cdn.simpleicons.org/c/A8B9CC" },
    { name: "C++", icon: "https://cdn.simpleicons.org/cplusplus/00599C" },
    { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
    { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
    { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
    { name: "PHP", icon: "https://cdn.simpleicons.org/php/777BB4" },
    { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  ],
  frontend: [
    { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
    { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/white" },
    { name: "React Native", icon: "https://cdn.simpleicons.org/react/61DAFB" },
    { name: "Redux", icon: "https://cdn.simpleicons.org/redux/764ABC" },
    { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
    { name: "HTML5", icon: "https://cdn.simpleicons.org/html5/E34F26" },
    { name: "CSS3", icon: "https://cdn.simpleicons.org/css3/1572B6" },
  ],
  backend: [
    { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
    { name: "Express.js", icon: "https://cdn.simpleicons.org/express/white" },
    { name: "GraphQL", icon: "https://cdn.simpleicons.org/graphql/E10098" },
    { name: "Socket.io", icon: "https://cdn.simpleicons.org/socketdotio/white" },
    { name: "REST APIs", icon: "https://cdn.simpleicons.org/fastapi/009688" },
  ],
  databases: [
    { name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb/47A248" },
    { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
    { name: "Redis", icon: "https://cdn.simpleicons.org/redis/DC382D" },
  ],
  devops: [
    { name: "AWS", icon: "https://cdn.simpleicons.org/amazonwebservices/FF9900" },
    { name: "Docker", icon: "https://cdn.simpleicons.org/docker/2496ED" },
    { name: "Jenkins", icon: "https://cdn.simpleicons.org/jenkins/D24939" },
    { name: "GCP", icon: "https://cdn.simpleicons.org/googlecloud/4285F4" },
  ],
  tools: [
    { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
    { name: "GitHub", icon: "https://cdn.simpleicons.org/github/white" },
    { name: "Postman", icon: "https://cdn.simpleicons.org/postman/FF6C37" },
    { name: "Jest", icon: "https://cdn.simpleicons.org/jest/C21325" },
    { name: "Bash", icon: "https://cdn.simpleicons.org/gnubash/white" },
  ],
};

// Flatten all skills for the marquee
export const allSkills = [
  ...skills.languages,
  ...skills.frontend,
  ...skills.backend,
  ...skills.databases,
  ...skills.devops,
  ...skills.tools,
];

export const projects = [
  {
    id: 1,
    slug: "kripa-connect",
    title: "KripaConnect",
    category: "E-COMMERCE",
    quarter: "Q1 2025",
    description:
      "A production-grade, full-stack e-commerce platform with B2B retailer portal, admin dashboard, Razorpay payments, PDF invoices, and a native Android TWA app.",
    longDescription:
      "KripaConnect is a comprehensive e-commerce ecosystem serving customers, B2B retailers, and administrators. Customers browse products, manage carts, and checkout via Cash on Delivery or Razorpay. Retailers access a dedicated bulk-ordering portal with spending analytics. Admins control everything — products, orders, users, reviews, and real-time revenue dashboards — from a feature-rich panel. The platform ships as a responsive PWA, and a native Android app via Trusted Web Activity.",
    tags: [
      { name: "REACT", icon: "https://cdn.simpleicons.org/react/61DAFB" },
      { name: "NODE.JS", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
      { name: "MONGODB", icon: "https://cdn.simpleicons.org/mongodb/47A248" },
      { name: "EXPRESS.JS", icon: "https://cdn.simpleicons.org/express/white" },
      { name: "RAZORPAY", icon: "https://cdn.simpleicons.org/razorpay/0C68FF" },
    ],
    features: [
      {
        title: "Multi-Role Access Control",
        description:
          "Three distinct user roles — Customer, Retailer, and Admin — each with dedicated dashboards, routes, and backend middleware enforcement.",
      },
      {
        title: "Razorpay Payment Integration",
        description:
          "Full payment lifecycle with Razorpay checkout modal, HMAC signature verification, webhook handler, and a transaction audit trail alongside COD support.",
      },
      {
        title: "Admin Dashboard & Analytics",
        description:
          "Real-time KPI cards, revenue charts, order distribution, low-stock alerts, product/order/user/review management, and PDF invoice generation.",
      },
      {
        title: "PWA + Android TWA App",
        description:
          "Installable Progressive Web App with offline caching, plus a native Android app via Trusted Web Activity with Digital Asset Links verification.",
      },
    ],
    techStack: [
      { name: "React 19", url: "https://react.dev", description: "Frontend SPA with lazy-loaded routes and Context API state management" },
      { name: "Node.js + Express 5", url: "https://expressjs.com", description: "REST API with JWT dual-token auth, rate limiting, Helmet, and input sanitization" },
      { name: "MongoDB Atlas", url: "https://mongodb.com", description: "Cloud NoSQL database with Mongoose ODM for all platform data" },
      { name: "Razorpay", url: "https://razorpay.com", description: "Online payment gateway with order creation, verification, and webhook support" },
      { name: "Cloudinary", url: "https://cloudinary.com", description: "Cloud image storage for product photos and profile pictures" },
      { name: "SendGrid", url: "https://sendgrid.com", description: "Transactional emails — OTP login, password reset, and order confirmations" },
      { name: "Recharts", url: "https://recharts.org", description: "Interactive charts for admin analytics — revenue trends, order distribution" },
      { name: "PDFKit", url: "https://pdfkit.org", description: "Server-side PDF generation for downloadable order invoices" },
    ],
    challenges: [
      {
        title: "Dual-Token Authentication",
        description:
          "Implementing a secure JWT access + refresh token pattern with httpOnly cookies, Google OAuth, and passwordless Email OTP — all while preventing token theft and ensuring seamless session renewal.",
      },
      {
        title: "Payment Security & Idempotency",
        description:
          "Building a PCI-compliant Razorpay integration with raw-body HMAC webhook verification, idempotent payment capture, and graceful handling of edge cases like failed payments and duplicate webhooks.",
      },
      {
        title: "Multi-Role Architecture",
        description:
          "Designing a system where Customer, Retailer, and Admin personas coexist with isolated routes, context-aware dashboards, and backend middleware that enforces role boundaries without code duplication.",
      },
    ],
    outcome:
      "Delivered a production-ready e-commerce platform with complete order lifecycle management, secure online payments, role-based dashboards, transactional emails, PDF invoicing, and multi-platform delivery (Web, PWA, Android).",
    screenshots: [],
    link: "https://kripa-connect-app.vercel.app",
    github: "https://github.com/imkunal01/KripaConnect-App",
    image: "",
  },
  {
    id: 2,
    slug: "project-two",
    title: "Project Two",
    category: "MOBILE APP",
    quarter: "Q4 2024",
    description:
      "A cross-platform mobile application with seamless UX, real-time data sync, and modern design patterns.",
    longDescription:
      "Project Two is an intuitive mobile companion for organizing your digital wallets and analyzing your financial health. Built with React Native for cross-platform compatibility, it delivers a native-like experience with beautiful charts and real-time data synchronization.",
    tags: [
      { name: "REACT NATIVE", icon: "https://cdn.simpleicons.org/react/61DAFB" },
      { name: "TYPESCRIPT", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
      { name: "REDUX", icon: "https://cdn.simpleicons.org/redux/764ABC" },
      { name: "SOCKET.IO", icon: "https://cdn.simpleicons.org/socketdotio/white" },
    ],
    features: [
      {
        title: "Cross-Platform Compatibility",
        description:
          "Single codebase running natively on both iOS and Android with platform-specific optimizations.",
      },
      {
        title: "Real-Time Data Sync",
        description:
          "Socket.IO powered live updates ensuring data consistency across devices.",
      },
      {
        title: "Beautiful Data Visualizations",
        description:
          "Interactive charts and graphs for financial analytics using Gifted Charts.",
      },
      {
        title: "Offline-First Architecture",
        description:
          "Full functionality without internet using local storage with automatic sync when online.",
      },
    ],
    techStack: [
      { name: "React Native", url: "https://reactnative.dev", description: "Cross-platform mobile framework" },
      { name: "TypeScript", url: "https://typescriptlang.org", description: "Type safety for reliable development" },
      { name: "Redux", url: "https://redux.js.org", description: "Predictable state management" },
      { name: "Socket.IO", url: "https://socket.io", description: "Real-time bidirectional event-based communication" },
    ],
    challenges: [
      {
        title: "Cross-Platform UI Consistency",
        description:
          "Achieving pixel-perfect UI consistency across iOS and Android while respecting platform-specific design guidelines.",
      },
      {
        title: "Offline Data Synchronization",
        description:
          "Implementing a robust offline-first architecture with conflict resolution when devices reconnect.",
      },
    ],
    outcome:
      "Delivered a smooth, cross-platform financial management app with real-time sync and beautiful data visualization.",
    screenshots: [],
    link: "#",
    github: "https://github.com/imkunal01",
    image: "",
  },
  {
    id: 3,
    slug: "project-three",
    title: "Project Three",
    category: "WEB APP",
    quarter: "Q3 2024",
    description:
      "An e-commerce platform with advanced search, payment integration, and admin analytics dashboard.",
    longDescription:
      "Project Three is a modern e-commerce platform designed for scalability and performance. It features advanced product search with filters, secure payment processing, and a comprehensive admin dashboard for inventory management and sales analytics.",
    tags: [
      { name: "NEXT.JS", icon: "https://cdn.simpleicons.org/nextdotjs/white" },
      { name: "POSTGRESQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
      { name: "REDIS", icon: "https://cdn.simpleicons.org/redis/DC382D" },
      { name: "DOCKER", icon: "https://cdn.simpleicons.org/docker/2496ED" },
      { name: "AWS", icon: "https://cdn.simpleicons.org/amazonwebservices/FF9900" },
    ],
    features: [
      {
        title: "Advanced Search & Filtering",
        description:
          "Full-text search with faceted filters, autocomplete, and relevance-based ranking.",
      },
      {
        title: "Secure Payment Processing",
        description:
          "PCI-compliant payment integration with multiple payment gateway support.",
      },
      {
        title: "Admin Analytics Dashboard",
        description:
          "Comprehensive dashboard with real-time sales tracking, inventory management, and customer insights.",
      },
      {
        title: "Containerized Deployment",
        description:
          "Docker-based deployment pipeline with CI/CD for consistent environments.",
      },
    ],
    techStack: [
      { name: "Next.js", url: "https://nextjs.org", description: "Full-stack React framework with SSR and API routes" },
      { name: "PostgreSQL", url: "https://postgresql.org", description: "Robust relational database for complex queries" },
      { name: "Redis", url: "https://redis.io", description: "In-memory caching for fast data retrieval" },
      { name: "Docker", url: "https://docker.com", description: "Container platform for consistent deployments" },
      { name: "AWS", url: "https://aws.amazon.com", description: "Cloud infrastructure for scalable hosting" },
    ],
    challenges: [
      {
        title: "Search Performance at Scale",
        description:
          "Optimizing search queries to maintain sub-100ms response times even with large product catalogs.",
      },
      {
        title: "Payment Security",
        description:
          "Implementing PCI-compliant payment flows while maintaining a seamless checkout experience.",
      },
      {
        title: "Infrastructure as Code",
        description:
          "Setting up reproducible infrastructure with Docker and AWS for both development and production environments.",
      },
    ],
    outcome:
      "Built a high-performance e-commerce platform handling thousands of concurrent users with sub-second page loads and 99.9% uptime.",
    screenshots: [],
    link: "#",
    github: "https://github.com/imkunal01",
    image: "",
  },
  {
    id: 4,
    slug: "project-four",
    title: "Project Four",
    category: "WEB3",
    quarter: "Q2 2024",
    description:
      "A decentralized application exploring Web3 technologies with smart contracts and blockchain integration.",
    longDescription:
      "Project Four is a decentralized application that bridges traditional web experiences with blockchain technology. It features smart contract interactions, wallet connectivity, and on-chain data visualization with a user-friendly interface designed for both crypto-native and new users.",
    tags: [
      { name: "REACT", icon: "https://cdn.simpleicons.org/react/61DAFB" },
      { name: "NODE.JS", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
      { name: "GRAPHQL", icon: "https://cdn.simpleicons.org/graphql/E10098" },
      { name: "TYPESCRIPT", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
    ],
    features: [
      {
        title: "Smart Contract Integration",
        description:
          "Seamless interaction with Ethereum smart contracts through an intuitive interface.",
      },
      {
        title: "Wallet Connectivity",
        description:
          "Multi-wallet support with MetaMask, WalletConnect, and other popular providers.",
      },
      {
        title: "On-Chain Analytics",
        description:
          "Real-time visualization of blockchain data with interactive charts and insights.",
      },
      {
        title: "GraphQL API Layer",
        description:
          "Efficient data querying with GraphQL for optimized blockchain data retrieval.",
      },
    ],
    techStack: [
      { name: "React", url: "https://react.dev", description: "Frontend library for building the dApp interface" },
      { name: "Node.js", url: "https://nodejs.org", description: "Backend runtime for API and indexing services" },
      { name: "GraphQL", url: "https://graphql.org", description: "Query language for efficient blockchain data fetching" },
      { name: "TypeScript", url: "https://typescriptlang.org", description: "Type-safe development for contract interactions" },
    ],
    challenges: [
      {
        title: "Blockchain Data Indexing",
        description:
          "Building efficient indexing solutions to query blockchain state without relying on centralized services.",
      },
      {
        title: "UX for Web3",
        description:
          "Designing intuitive interfaces that abstract blockchain complexity while maintaining transparency.",
      },
    ],
    outcome:
      "Successfully built a user-friendly dApp that makes blockchain interactions accessible to non-technical users while maintaining full decentralization.",
    screenshots: [],
    link: "#",
    github: "https://github.com/imkunal01",
    image: "",
  },
];

export const testimonials = [
  {
    id: 1,
    quote: "Kunal delivered exceptional work on our project. His attention to detail and technical expertise made the entire process seamless.",
    name: "Alex Johnson",
    title: "CTO • Tech Startup",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: 2,
    quote: "Working with Kunal was a fantastic experience. He understood our vision and turned it into reality with clean, efficient code.",
    name: "Priya Sharma",
    title: "Product Manager • Digital Agency",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  },
  {
    id: 3,
    quote: "Kunal's full-stack skills are impressive. He built our entire platform from scratch and it performs flawlessly under heavy load.",
    name: "Rahul Mehta",
    title: "Founder • SaaS Platform",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
  },
  {
    id: 4,
    quote: "His ability to solve complex problems and deliver on tight deadlines is remarkable. Highly recommend working with Kunal.",
    name: "Sarah Lee",
    title: "Engineering Lead • Fintech Co",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 5,
    quote: "Kunal brought a fresh perspective to our Android app. The app's performance improved dramatically after his optimizations.",
    name: "David Chen",
    title: "Mobile Lead • App Studio",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: 6,
    quote: "Outstanding developer! Kunal's code quality and communication throughout the project were top-notch. A true professional.",
    name: "Emily Brooks",
    title: "Director • Creative Agency",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
];

export const experience = [
  {
    id: 1,
    role: "Full-Stack Developer",
    company: "Freelance",
    period: "2024 - Present",
    description:
      "Building modern web and mobile applications for clients worldwide. Specializing in React, Node.js, and cloud deployments.",
  },{
    id: 2,
    role: "Web Developer Intern",
    company: "Orbosis Global PVT. LTD.",
    period: "Nov' 2025 - Jan 2026 ",
    description:
      "Building modern web and mobile applications for clients worldwide. Specializing in React, Node.js, and cloud deployments.",
  },
];

export const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Work", href: "#projects" },
];

export const moreLinks = {
  cards: [
    {
      name: "Guestbook",
      description: "Let me know you were here",
      href: "#contact",
      route: "/guestbook",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop",
    },
    {
      name: "Bucket List",
      description: "Things to do at least once in my life",
      href: "#",
      route: "/bucket-list",
      image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=250&fit=crop",
    },
    {
      name: "My Picks",
      description: "Movies, series, anime & books I recommend",
      href: "#",
      route: "/recommendations",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop",
    },
  ],
  items: [
    {
      name: "Links",
      description: "All my links are here",
      href: "#",
      icon: "link",
    },
    {
      name: "Uses",
      description: "A peek into my digital...",
      href: "#skills",
      icon: "monitor",
    },
    {
      name: "Attribution",
      description: "Journey to create this site",
      href: "#",
      icon: "heart",
    },
  ],
};
