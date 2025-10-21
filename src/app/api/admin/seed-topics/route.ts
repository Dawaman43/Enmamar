import { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const categories = [
  {
    slug: 'dsa',
    name: 'Data Structures & Algorithms',
    description: 'Core problem-solving patterns for technical interviews.',
  },
  {
    slug: 'web-foundations',
    name: 'Web Foundations',
    description:
      'Essential skills for building accessible, responsive websites.',
  },
  {
    slug: 'frontend-frameworks',
    name: 'Frontend Frameworks',
    description: 'Modern UI development with component-based frameworks.',
  },
  {
    slug: 'backend-apis',
    name: 'Backend & APIs',
    description: 'Design and build reliable server-side applications and APIs.',
  },
  {
    slug: 'devops',
    name: 'DevOps & Platform',
    description:
      'Automate delivery pipelines and manage infrastructure at scale.',
  },
  {
    slug: 'cloud',
    name: 'Cloud Platforms',
    description:
      'Architect and operate workloads across major cloud providers.',
  },
  {
    slug: 'databases',
    name: 'Databases & Storage',
    description:
      'Model, query, and tune data stores for performance and scale.',
  },
  {
    slug: 'data-analytics',
    name: 'Data & Analytics',
    description: 'Turn raw data into insights with analysis and visualization.',
  },
  {
    slug: 'machine-learning',
    name: 'Machine Learning & AI',
    description:
      'Build intelligent systems from experimentation to production.',
  },
  {
    slug: 'mobile',
    name: 'Mobile Development',
    description: 'Craft native and cross-platform mobile experiences.',
  },
  {
    slug: 'security',
    name: 'Security & Compliance',
    description: 'Ship secure software and respond to emerging threats.',
  },
  {
    slug: 'career',
    name: 'Career & Leadership',
    description:
      'Level up professional skills, interviews, and team leadership.',
  },
]

const dsaTopics = [
  {
    title: 'Arrays',
    difficulty: 'beginner',
    description: 'Basics of arrays, traversal, and common patterns.',
  },
  {
    title: 'Strings',
    difficulty: 'beginner',
    description: 'String manipulation, sliding window, hashing.',
  },
  {
    title: 'Linked Lists',
    difficulty: 'beginner',
    description: 'Singly/Doubly lists, fast/slow pointers.',
  },
  {
    title: 'Stacks',
    difficulty: 'beginner',
    description: 'LIFO, monotonic stacks, parentheses problems.',
  },
  {
    title: 'Queues',
    difficulty: 'beginner',
    description: 'FIFO, deques, BFS patterns.',
  },
  {
    title: 'Hash Tables',
    difficulty: 'beginner',
    description: 'Maps/Sets, collisions, frequency counting.',
  },
  {
    title: 'Binary Search',
    difficulty: 'beginner',
    description: 'Search patterns, boundaries, predicates.',
  },
  {
    title: 'Two Pointers',
    difficulty: 'beginner',
    description: 'Opposite ends, same direction, partitioning.',
  },
  {
    title: 'Greedy',
    difficulty: 'intermediate',
    description: 'Local optimal choices for global optimum.',
  },
  {
    title: 'Recursion',
    difficulty: 'beginner',
    description: 'Base cases, stack frames, backtracking intro.',
  },
  {
    title: 'Backtracking',
    difficulty: 'intermediate',
    description: 'DFS with choices/constraints/pruning.',
  },
  {
    title: 'Sorting',
    difficulty: 'beginner',
    description: 'Quick/Merge/Heap sort and complexities.',
  },
  {
    title: 'Heaps/Priority Queues',
    difficulty: 'intermediate',
    description: 'Top-K, merging, scheduling.',
  },
  {
    title: 'Binary Trees',
    difficulty: 'beginner',
    description: 'Traversal (in/pre/post), height, balance.',
  },
  {
    title: 'Binary Search Trees',
    difficulty: 'intermediate',
    description: 'Insertion, deletion, invariants.',
  },
  {
    title: 'Graphs',
    difficulty: 'intermediate',
    description: 'Adjacency, DFS/BFS, components.',
  },
  {
    title: 'Graph Traversal',
    difficulty: 'intermediate',
    description: 'BFS, DFS, topological sort.',
  },
  {
    title: 'Shortest Paths',
    difficulty: 'intermediate',
    description: 'Dijkstra, Bellman-Ford, Floyd-Warshall.',
  },
  {
    title: 'Minimum Spanning Tree',
    difficulty: 'intermediate',
    description: 'Kruskal, Prim, DSU.',
  },
  {
    title: 'Disjoint Set (Union-Find)',
    difficulty: 'intermediate',
    description: 'Union by rank, path compression.',
  },
  {
    title: 'Dynamic Programming Intro',
    difficulty: 'intermediate',
    description: 'Memoization, tabulation, states.',
  },
  {
    title: 'Knapsack & Variants',
    difficulty: 'intermediate',
    description: '0/1, unbounded, bounded knapsack.',
  },
  {
    title: 'DP on Strings',
    difficulty: 'intermediate',
    description: 'LCS/ED, subsequences, pattern match.',
  },
  {
    title: 'DP on Trees',
    difficulty: 'advanced',
    description: 'Tree DP states and rerooting.',
  },
  {
    title: 'Bit Manipulation',
    difficulty: 'intermediate',
    description: 'Masks, bitsets, tricks.',
  },
  {
    title: 'Combinatorics',
    difficulty: 'advanced',
    description: 'Counting, permutations, binomial coeffs.',
  },
  {
    title: 'Number Theory',
    difficulty: 'advanced',
    description: 'GCD, primes, modular arithmetic.',
  },
]

const topicsByCategory: Record<
  string,
  Array<{ title: string; difficulty: string; description: string }>
> = {
  dsa: dsaTopics,
  'web-foundations': [
    {
      title: 'Semantic HTML',
      difficulty: 'beginner',
      description:
        'Structure documents with meaningful markup for accessibility.',
    },
    {
      title: 'Responsive Layouts with CSS',
      difficulty: 'beginner',
      description:
        'Create fluid layouts with modern CSS techniques and media queries.',
    },
    {
      title: 'Accessibility Fundamentals',
      difficulty: 'beginner',
      description:
        'Design inclusive experiences with WCAG guidelines and ARIA.',
    },
    {
      title: 'Modern JavaScript (ES6+)',
      difficulty: 'beginner',
      description:
        'Use contemporary language features for cleaner, expressive code.',
    },
    {
      title: 'Web Performance Basics',
      difficulty: 'intermediate',
      description:
        'Optimize load times with bundling, caching, and network strategies.',
    },
  ],
  'frontend-frameworks': [
    {
      title: 'React Fundamentals',
      difficulty: 'beginner',
      description: 'Build interactive UIs with components, hooks, and JSX.',
    },
    {
      title: 'State Management Patterns',
      difficulty: 'intermediate',
      description:
        'Manage complex state with Context, Redux Toolkit, and signals.',
    },
    {
      title: 'Next.js for Production',
      difficulty: 'intermediate',
      description:
        'Leverage SSR, routing, and data fetching for full-stack apps.',
    },
    {
      title: 'Testing React Applications',
      difficulty: 'intermediate',
      description:
        'Write reliable tests with React Testing Library and Vitest.',
    },
    {
      title: 'Component Design Systems',
      difficulty: 'advanced',
      description:
        'Scale UI with reusable tokens, theming, and accessibility patterns.',
    },
  ],
  'backend-apis': [
    {
      title: 'Node.js with Express',
      difficulty: 'beginner',
      description:
        'Build RESTful services using Express and middleware patterns.',
    },
    {
      title: 'REST API Design',
      difficulty: 'intermediate',
      description:
        'Model resources, handle versioning, and design robust endpoints.',
    },
    {
      title: 'GraphQL Basics',
      difficulty: 'intermediate',
      description:
        'Expose flexible APIs with schemas, resolvers, and query tooling.',
    },
    {
      title: 'Authentication and Authorization',
      difficulty: 'intermediate',
      description:
        'Implement sessions, tokens, and role-based access controls.',
    },
    {
      title: 'Microservices Architecture',
      difficulty: 'advanced',
      description:
        'Design service boundaries, communication, and resiliency patterns.',
    },
    {
      title: 'Event-Driven Systems',
      difficulty: 'advanced',
      description:
        'Coordinate decoupled services with events, queues, and streams.',
    },
  ],
  devops: [
    {
      title: 'Version Control with Git',
      difficulty: 'beginner',
      description:
        'Collaborate with branching, pull requests, and release workflows.',
    },
    {
      title: 'Continuous Integration Pipelines',
      difficulty: 'intermediate',
      description: 'Automate builds, tests, and deployments with CI tools.',
    },
    {
      title: 'Containerization with Docker',
      difficulty: 'intermediate',
      description:
        'Package applications with Dockerfiles, images, and registries.',
    },
    {
      title: 'Kubernetes Fundamentals',
      difficulty: 'advanced',
      description:
        'Orchestrate workloads with pods, services, and controllers.',
    },
    {
      title: 'Infrastructure as Code with Terraform',
      difficulty: 'advanced',
      description:
        'Provision repeatable infrastructure using declarative templates.',
    },
    {
      title: 'Monitoring and Observability',
      difficulty: 'intermediate',
      description: 'Gain insight with metrics, logs, tracing, and alerting.',
    },
  ],
  cloud: [
    {
      title: 'AWS Core Services',
      difficulty: 'beginner',
      description:
        'Understand compute, storage, networking, and IAM basics on AWS.',
    },
    {
      title: 'Azure Fundamentals',
      difficulty: 'beginner',
      description: 'Navigate Azure services, resource groups, and governance.',
    },
    {
      title: 'Google Cloud Essentials',
      difficulty: 'beginner',
      description:
        'Build on GCP with projects, IAM, and core managed services.',
    },
    {
      title: 'Cloud Security Best Practices',
      difficulty: 'intermediate',
      description:
        'Secure identities, workloads, and data across cloud platforms.',
    },
    {
      title: 'Serverless Architectures',
      difficulty: 'intermediate',
      description: 'Design event-driven systems with Functions-as-a-Service.',
    },
    {
      title: 'Cost Optimization Strategies',
      difficulty: 'intermediate',
      description:
        'Manage budgets with monitoring, autoscaling, and purchasing options.',
    },
  ],
  databases: [
    {
      title: 'SQL Fundamentals',
      difficulty: 'beginner',
      description:
        'Query relational data using joins, aggregates, and subqueries.',
    },
    {
      title: 'NoSQL Data Modeling',
      difficulty: 'intermediate',
      description:
        'Design schemas for document, key-value, and column databases.',
    },
    {
      title: 'Database Performance Tuning',
      difficulty: 'advanced',
      description:
        'Optimize queries with indexing, caching, and execution plans.',
    },
    {
      title: 'Caching Strategies',
      difficulty: 'intermediate',
      description: 'Use Redis and CDN caches to reduce latency and load.',
    },
    {
      title: 'Data Warehousing Concepts',
      difficulty: 'intermediate',
      description:
        'Model analytics systems with star schemas and ETL pipelines.',
    },
    {
      title: 'Event Sourcing Patterns',
      difficulty: 'advanced',
      description:
        'Capture system changes as immutable events for auditing and replay.',
    },
  ],
  'data-analytics': [
    {
      title: 'Python for Data Analysis',
      difficulty: 'beginner',
      description: 'Explore data with pandas, NumPy, and Jupyter notebooks.',
    },
    {
      title: 'Exploratory Data Analysis',
      difficulty: 'intermediate',
      description: 'Profile datasets to uncover quality issues and insights.',
    },
    {
      title: 'Data Visualization Principles',
      difficulty: 'intermediate',
      description:
        'Tell compelling stories with charts, dashboards, and metrics.',
    },
    {
      title: 'Statistics for Practitioners',
      difficulty: 'intermediate',
      description:
        'Apply inference, probability, and hypothesis testing to data.',
    },
    {
      title: 'Business Intelligence Dashboards',
      difficulty: 'intermediate',
      description:
        'Deliver self-serve insights with Tableau, Power BI, or Looker.',
    },
    {
      title: 'Data Governance Basics',
      difficulty: 'advanced',
      description: 'Manage data catalogs, quality, and compliance at scale.',
    },
  ],
  'machine-learning': [
    {
      title: 'Supervised Learning',
      difficulty: 'intermediate',
      description:
        'Train predictive models with regression, classification, and ensembles.',
    },
    {
      title: 'Unsupervised Learning',
      difficulty: 'intermediate',
      description:
        'Discover structure with clustering, dimensionality reduction, and anomaly detection.',
    },
    {
      title: 'Deep Learning Essentials',
      difficulty: 'advanced',
      description:
        'Build neural networks with frameworks like PyTorch and TensorFlow.',
    },
    {
      title: 'Model Evaluation Techniques',
      difficulty: 'intermediate',
      description:
        'Measure performance with validation strategies and error analysis.',
    },
    {
      title: 'Responsible AI Practices',
      difficulty: 'advanced',
      description:
        'Address bias, fairness, and transparency in machine learning systems.',
    },
    {
      title: 'MLOps Fundamentals',
      difficulty: 'advanced',
      description:
        'Operationalize models with pipelines, monitoring, and CI/CD for ML.',
    },
  ],
  mobile: [
    {
      title: 'iOS Development with SwiftUI',
      difficulty: 'intermediate',
      description: 'Build declarative interfaces with SwiftUI and Combine.',
    },
    {
      title: 'Android Development with Kotlin',
      difficulty: 'intermediate',
      description:
        'Create Android apps with Jetpack components and coroutines.',
    },
    {
      title: 'Cross-Platform with Flutter',
      difficulty: 'intermediate',
      description:
        'Deliver native experiences across platforms with Dart and Flutter.',
    },
    {
      title: 'Mobile App Architecture',
      difficulty: 'advanced',
      description:
        'Organize large apps with MVVM, modularization, and dependency injection.',
    },
    {
      title: 'Publishing Mobile Apps',
      difficulty: 'beginner',
      description: 'Navigate App Store and Play Store submission workflows.',
    },
    {
      title: 'Mobile Performance Optimization',
      difficulty: 'advanced',
      description:
        'Profile rendering, memory, and network usage for smooth apps.',
    },
  ],
  security: [
    {
      title: 'Application Security Fundamentals',
      difficulty: 'beginner',
      description:
        'Integrate secure practices throughout the software lifecycle.',
    },
    {
      title: 'Secure Coding Practices',
      difficulty: 'intermediate',
      description:
        'Prevent common vulnerabilities with input validation and safe APIs.',
    },
    {
      title: 'OWASP Top 10',
      difficulty: 'intermediate',
      description:
        'Identify and mitigate the most critical web application risks.',
    },
    {
      title: 'Threat Modeling',
      difficulty: 'advanced',
      description:
        'Systematically uncover risks using STRIDE and attack trees.',
    },
    {
      title: 'Identity and Access Management',
      difficulty: 'intermediate',
      description:
        'Control permissions with SSO, MFA, and least-privilege policies.',
    },
    {
      title: 'Incident Response Planning',
      difficulty: 'advanced',
      description:
        'Prepare playbooks and drills for rapid security incident handling.',
    },
  ],
  career: [
    {
      title: 'Technical Interview Prep',
      difficulty: 'beginner',
      description:
        'Structure practice for coding, behavioral, and system design rounds.',
    },
    {
      title: 'System Design Interviews',
      difficulty: 'advanced',
      description:
        'Communicate architectures, trade-offs, and scaling strategies.',
    },
    {
      title: 'Resume and Portfolio Building',
      difficulty: 'beginner',
      description:
        'Highlight impact with quantified achievements and strong storytelling.',
    },
    {
      title: 'Effective Communication for Engineers',
      difficulty: 'intermediate',
      description:
        'Collaborate across teams with clear written and verbal updates.',
    },
    {
      title: 'Agile Delivery in Practice',
      difficulty: 'intermediate',
      description:
        'Lead ceremonies, manage backlogs, and deliver iterative value.',
    },
    {
      title: 'Leading Engineering Projects',
      difficulty: 'advanced',
      description:
        'Drive alignment, manage risk, and mentor engineers effectively.',
    },
  ],
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || token !== process.env.ADMIN_TOKEN)
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  const supabase = await createSupabaseServerClient()

  const { error: catError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
  if (catError)
    return Response.json(
      { ok: false, error: catError.message },
      { status: 500 },
    )

  const { data: catRows, error: catFetchError } = await supabase
    .from('categories')
    .select('category_id, slug')
  if (catFetchError)
    return Response.json(
      { ok: false, error: catFetchError.message },
      { status: 500 },
    )

  const slugToId = new Map<string, string>()
  for (const row of catRows ?? []) {
    slugToId.set(row.slug, row.category_id)
  }

  let topicCount = 0
  let linkCount = 0

  for (const [slug, list] of Object.entries(topicsByCategory)) {
    if (!list.length) continue
    const categoryId = slugToId.get(slug)
    if (!categoryId) continue

    const titles = list.map((item) => item.title)

    const { error: topicError } = await supabase
      .from('topics')
      .upsert(list, { onConflict: 'title' })
    if (topicError)
      return Response.json(
        { ok: false, error: topicError.message },
        { status: 500 },
      )

    const { data: topicRows, error: topicFetchError } = await supabase
      .from('topics')
      .select('topic_id, title')
      .in('title', titles)
    if (topicFetchError)
      return Response.json(
        { ok: false, error: topicFetchError.message },
        { status: 500 },
      )

    topicCount += topicRows?.length ?? 0

    const links = (topicRows ?? []).map((row) => ({
      topic_id: row.topic_id,
      category_id: categoryId,
    }))

    if (links.length) {
      const { error: linkError } = await supabase
        .from('topic_categories')
        .upsert(links, { onConflict: 'topic_id,category_id' as any })
      if (linkError)
        return Response.json(
          { ok: false, error: linkError.message },
          { status: 500 },
        )
      linkCount += links.length
    }
  }

  return Response.json({
    ok: true,
    categories: categories.length,
    topics: topicCount,
    links: linkCount,
  })
}
