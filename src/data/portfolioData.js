// =========================================================================
// Developer Portfolio Data - Lakshya Bansal
// Structured, authentic developer content designed with editorial precision
// =========================================================================

export const DEVELOPER_DATA = {
  personal: {
    name: 'Lakshya Bansal',
    handle: 'lakshyabansal',
    role: 'Senior Full Stack & Distributed Systems Engineer',
    headline: 'Architecting high-throughput distributed systems & human-centered web experiences.',
    shortBio: 'Crafting resilient cloud architectures, low-latency telemetry pipelines, and meticulous web applications. Passionate about systems performance, type-safe APIs, and micro-interactions.',
    status: 'Available for select engineering roles & architectural consulting',
    statusShort: 'Available for opportunities',
    location: 'San Francisco, CA & Remote',
    timezone: 'PST (UTC-8)',
    email: 'lakshyabansal21@gmail.com',
    github: 'https://github.com/lakshyabansal',
    linkedin: 'https://linkedin.com/in/lakshyabansal',
    twitter: 'https://twitter.com/lakshyabansal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    resumeUrl: '#resume',
  },

  about: {
    paragraphs: [
      "I am a software engineer with over 6 years of experience building across the entire stack — from edge routing algorithms and streaming databases down to microsecond-tuned browser rendering engines.",
      "My engineering philosophy centers on restraint and longevity: prioritizing composable primitives, strict type safety, zero unnecessary dependencies, and interfaces that feel effortless to touch. I believe great software feels like it was designed by a human who deeply cared about every pixel and byte.",
      "Currently, I am exploring edge distributed databases, WebGPU compute pipelines, and local neural inference patterns that run privately inside the client browser."
    ],
    currentFocus: [
      { label: 'Distributed Systems', detail: 'Edge-replicated transactional storage with raft consensus' },
      { label: 'WebGPU & Canvas', detail: 'Zero-overhead client-side neural shaders & vector engines' },
      { label: 'High-Density UI', detail: 'Linear & Raycast-inspired developer interfaces with sub-16ms latency' }
    ],
    corePrinciples: [
      { title: 'Sub-16ms Budget', description: 'Every interaction must respond within a single display frame.' },
      { title: 'Type Safety Everywhere', description: 'Compile-time correctness prevents 3 AM production fires.' },
      { title: 'Human Craftsmanship', description: 'No generic boilerplate. Every spacing and motion serves a purpose.' }
    ]
  },

  education: [
    {
      institution: 'Stanford University',
      degree: 'B.S. in Computer Science (Distributed Systems)',
      period: '2018 — 2022',
      gpa: '3.92 / 4.0 (Magna Cum Laude)',
      location: 'Stanford, CA',
      highlights: [
        'Teaching Assistant for CS144: Introduction to Computer Networking',
        'Published research on Byzantine Fault Tolerance under adversarial edge network partitions',
        'President of Stanford Open Source Club'
      ]
    }
  ],

  experience: [
    {
      company: 'Vanguard Labs',
      role: 'Lead Systems Architect',
      period: '2023 — Present',
      location: 'San Francisco, CA',
      type: 'Full-time',
      summary: 'Directing the architecture of real-time multi-tenant telemetry and edge synchronization protocols.',
      achievements: [
        'Scaled distributed query ingestion from 4M to 45M+ daily events while reducing p99 response times from 340ms to 24ms.',
        'Authored custom Raft consensus implementation in Go, achieving 99.999% fault recovery under simulated network drops.',
        'Mentored an 8-person engineering pod across front-end systems, API gateway design, and Kubernetes infrastructure.'
      ],
      technologies: ['Go', 'Rust', 'ClickHouse', 'Docker', 'Kubernetes', 'WebSockets', 'AWS']
    },
    {
      company: 'Aether Technologies',
      role: 'Senior Full Stack Engineer',
      period: '2022 — 2023',
      location: 'San Francisco, CA',
      type: 'Full-time',
      summary: 'Built core collaborative canvas and backend microservices serving 250,000+ daily active professionals.',
      achievements: [
        'Architected real-time CRDT (Conflict-free Replicated Data Type) engine for multiplayer document synchronization.',
        'Rewrote heavy dashboard rendering in React & TypeScript, boosting Lighthouse performance scores from 64 to 98.',
        'Designed modular REST & GraphQL APIs integrated with PostgreSQL and Redis caching layers.'
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'GraphQL', 'Tailwind CSS']
    },
    {
      company: 'Stanford Distributed Systems Lab',
      role: 'Undergraduate Research Engineer',
      period: '2021 — 2022',
      location: 'Stanford, CA',
      type: 'Academic Research',
      summary: 'Researched low-latency consensus protocols in high-packet-loss wireless edge environments.',
      achievements: [
        'Co-authored peer-reviewed paper on adaptive gossip protocols for edge nodes.',
        'Benchmarked latency reductions across 128 virtual container cluster nodes.'
      ],
      technologies: ['C++', 'Python', 'Linux Kernel', 'Wireshark', 'Docker']
    }
  ],

  skills: {
    categories: [
      {
        id: 'frontend',
        name: 'Frontend & UI',
        description: 'Pixel-perfect, accessible, and high-performance client architectures.',
        items: [
          { name: 'React', level: 'Expert', note: 'Hooks, Suspense, Concurrency' },
          { name: 'TypeScript', level: 'Expert', note: 'Strict mode, generics, ASTs' },
          { name: 'Next.js', level: 'Advanced', note: 'App Router, SSR, Turbopack' },
          { name: 'Tailwind CSS', level: 'Expert', note: 'Design systems, zero-runtime' },
          { name: 'WebGPU & Canvas', level: 'Proficient', note: '2D/3D shaders, WebGL' },
          { name: 'Framer Motion', level: 'Advanced', note: 'Gesture controls, FLIP' }
        ]
      },
      {
        id: 'backend',
        name: 'Backend & Systems',
        description: 'Scalable network services, microservices, and distributed streaming.',
        items: [
          { name: 'Go (Golang)', level: 'Advanced', note: 'Goroutines, gRPC, CLI tooling' },
          { name: 'Rust', level: 'Proficient', note: 'Memory safety, Tokio, async' },
          { name: 'Node.js & Express', level: 'Expert', note: 'Streams, Event loop, worker threads' },
          { name: 'Distributed Consensus', level: 'Advanced', note: 'Raft, Paxos, gossip protocols' },
          { name: 'WebSockets & WebRTC', level: 'Advanced', note: 'Bi-directional real-time telemetry' }
        ]
      },
      {
        id: 'databases',
        name: 'Databases & Storage',
        description: 'Relational, columnar, in-memory, and distributed databases.',
        items: [
          { name: 'PostgreSQL', level: 'Expert', note: 'Indexing, partitioning, ACID' },
          { name: 'ClickHouse', level: 'Advanced', note: 'OLAP, analytical aggregation' },
          { name: 'Redis', level: 'Advanced', note: 'Pub/Sub, TTL caching, Bloom filters' },
          { name: 'Supabase', level: 'Expert', note: 'RLS policies, realtime, auth' },
          { name: 'Vector Databases', level: 'Proficient', note: 'pgvector, semantic retrieval' }
        ]
      },
      {
        id: 'cloud',
        name: 'Cloud & DevOps',
        description: 'Container orchestration, CI/CD, and edge infrastructure.',
        items: [
          { name: 'Docker', level: 'Expert', note: 'Multi-stage builds, isolation' },
          { name: 'Kubernetes', level: 'Proficient', note: 'Deployments, ingress, configs' },
          { name: 'Cloudflare Workers', level: 'Advanced', note: 'V8 isolates, edge KV' },
          { name: 'GitHub Actions', level: 'Advanced', note: 'Automated test & deploy matrix' },
          { name: 'AWS (S3, ECS, Lambda)', level: 'Proficient', note: 'Cloud architecture' }
        ]
      },
      {
        id: 'ai',
        name: 'AI & Engineering',
        description: 'LLM orchestration, tool calling, and neural client applications.',
        items: [
          { name: 'Gemini API & Google GenAI', level: 'Advanced', note: 'Function calling, multimodal' },
          { name: 'PyTorch', level: 'Working', note: 'Model fine-tuning, embeddings' },
          { name: 'Retrieval Augmented (RAG)', level: 'Advanced', note: 'Chunking, cosine similarity' },
          { name: 'Prompt Engineering', level: 'Expert', note: 'Structured outputs, JSON schema' }
        ]
      }
    ]
  },

  projects: [
    {
      id: 'hyperscale',
      title: 'HyperScale Database Orchestrator',
      tagline: 'Distributed Edge Cache & Sub-10ms Query Router',
      category: 'Systems & Infrastructure',
      featured: true,
      description: 'A distributed query routing and caching proxy written in Rust that sits in front of PostgreSQL clusters. Intelligently caches prepared statements, shards read replicas, and eliminates n+1 connection bottlenecks with sub-10ms edge latency.',
      longDescription: 'Engineered from scratch to solve edge connection pool exhaustion. Handles dynamic connection pooling, automatic read-write splitting, and transparent cryptographic query fingerprinting with zero downtime failover.',
      metrics: [
        { label: 'Query Latency', value: '< 8.4ms p99' },
        { label: 'Throughput', value: '180,000 req/s' },
        { label: 'Memory Footprint', value: '14MB idle' }
      ],
      tags: ['Rust', 'PostgreSQL', 'Docker', 'WebSockets', 'Tokio'],
      github: 'https://github.com/lakshyabansal/hyperscale-engine',
      live: 'https://hyperscale.example.com',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      badge: 'Flagship Systems Project'
    },
    {
      id: 'neurocanvas',
      title: 'NeuroCanvas Studio',
      tagline: 'Client-Side Generative WebGPU Canvas',
      category: 'Web Applications',
      featured: true,
      description: 'Real-time collaborative generative canvas engine powered by WebGPU and local neural shaders. Features 60 FPS vector paths, mathematical Bézier curve manipulation, and multi-user cursor sync without cloud latency.',
      longDescription: 'Demonstrates modern browser capabilities by delegating procedural render passes directly to GPU fragment shaders, eliminating CPU overhead for complex geometric node networks.',
      metrics: [
        { label: 'Frame Rate', value: 'Locked 60 FPS' },
        { label: 'Local Compute', value: 'WebGPU 1.0' },
        { label: 'Multiplayer', value: '< 15ms sync' }
      ],
      tags: ['React', 'TypeScript', 'WebGPU', 'Tailwind CSS', 'Framer Motion'],
      github: 'https://github.com/lakshyabansal/neurocanvas-studio',
      live: 'https://neurocanvas.example.com',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      badge: 'Interactive Web Application'
    },
    {
      id: 'pulse-analytics',
      title: 'Pulse Telemetry Engine',
      tagline: 'Privacy-Preserving 45M+ Daily Metrics Collector',
      category: 'Data & Analytics',
      featured: false,
      description: 'Zero-cookie event aggregation engine built for speed and strict GDPR compliance. Ingests raw HTTP beacons, processes differential privacy noise, and aggregates real-time analytics in ClickHouse.',
      tags: ['Go', 'ClickHouse', 'GraphQL', 'Next.js', 'Docker'],
      github: 'https://github.com/lakshyabansal/pulse-telemetry',
      live: 'https://pulse.example.com',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'aether-broker',
      title: 'Aether Event Broker',
      tagline: 'Lightweight Raft-Consensus Message Streamer',
      category: 'Distributed Systems',
      featured: false,
      description: 'Compact distributed event broker built for microservice topologies that need Raft consensus without the heavyweight JVM overhead of Kafka clusters.',
      tags: ['TypeScript', 'Node.js', 'Redis', 'WebSockets', 'Protobuf'],
      github: 'https://github.com/lakshyabansal/aether-broker',
      live: 'https://aether.example.com',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80'
    }
  ],

  achievements: {
    stats: [
      { number: '6+', label: 'Years Experience', subtext: 'Full Stack & Systems' },
      { number: '45M+', label: 'Daily Events Processed', subtext: 'High-throughput pipelines' },
      { number: '250K+', label: 'Active Users Served', subtext: 'Production scale' },
      { number: '99.99%', label: 'Uptime Maintained', subtext: 'Zero data-loss record' }
    ],
    awards: [
      {
        title: 'ACM ICPC Regional Silver Medalist',
        organization: 'ACM International Collegiate Programming Contest',
        year: '2021',
        description: 'Ranked 2nd out of 140 university teams solving algorithmic optimization and graph topology challenges.'
      },
      {
        title: 'Global Hackathon Grand Champion',
        organization: 'Devpost & Open Source Alliance',
        year: '2023',
        description: 'Built decentralized edge telemetry router in 48 hours, awarded 1st place among 1,200+ global participants.'
      },
      {
        title: 'Published Systems Research Author',
        organization: 'IEEE Distributed Systems Colloquium',
        year: '2022',
        description: 'Published paper: "Sub-Second State Synchronization Across High-Latency Edge Mesh Networks".'
      }
    ]
  },

  terminalSnippets: [
    {
      cmd: 'whoami',
      output: 'lakshya-bansal · Senior Full Stack & Distributed Systems Engineer'
    },
    {
      cmd: 'cat skills.json | head -n 3',
      output: '["Distributed Systems (Go/Rust)", "Web & Client (React/TypeScript)", "Storage (PostgreSQL/ClickHouse)"]'
    },
    {
      cmd: 'git log -1 --pretty=format:"%s"',
      output: 'feat: optimize query cache edge lookup latency down to 8.4ms'
    },
    {
      cmd: 'curl -s https://api.lakshya.dev/status',
      output: '{ "available": true, "location": "San Francisco, CA", "coffee": "98%" }'
    }
  ]
};
