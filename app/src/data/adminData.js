/* ── Mock admin data — replaced by real API calls in Phase 2 ── */

export const MOCK_USERS = [
  { id: 1,  name: 'Arjun Mehta',    email: 'arjun@gmail.com',        plan: 'premium', joined: '2026-03-01', lastSeen: '2026-04-27', status: 'active'  },
  { id: 2,  name: 'Priya Sharma',   email: 'priya@outlook.com',       plan: 'premium', joined: '2026-03-10', lastSeen: '2026-04-26', status: 'active'  },
  { id: 3,  name: 'Sneha Reddy',    email: 'sneha@company.com',       plan: 'free',    joined: '2026-03-18', lastSeen: '2026-04-20', status: 'active'  },
  { id: 4,  name: 'Vikram Nair',    email: 'vikram@startup.io',       plan: 'premium', joined: '2026-03-22', lastSeen: '2026-04-25', status: 'active'  },
  { id: 5,  name: 'Ananya Singh',   email: 'ananya.singh@infosys.com', plan: 'free',   joined: '2026-04-01', lastSeen: '2026-04-22', status: 'active'  },
  { id: 6,  name: 'Rohan Gupta',    email: 'rohan@wipro.com',         plan: 'free',    joined: '2026-04-05', lastSeen: '2026-04-15', status: 'active'  },
  { id: 7,  name: 'Deepa Krishna',  email: 'deepa@amazon.com',        plan: 'premium', joined: '2026-04-08', lastSeen: '2026-04-28', status: 'active'  },
  { id: 8,  name: 'Karan Malhotra', email: 'karan@tcs.com',           plan: 'free',    joined: '2026-04-10', lastSeen: '2026-04-18', status: 'active'  },
  { id: 9,  name: 'Meera Joshi',    email: 'meera@flipkart.com',      plan: 'premium', joined: '2026-04-12', lastSeen: '2026-04-27', status: 'active'  },
  { id: 10, name: 'Suresh Iyer',    email: 'suresh@zomato.com',       plan: 'free',    joined: '2026-04-15', lastSeen: '2026-04-21', status: 'suspended'},
  { id: 11, name: 'Pooja Verma',    email: 'pooja@paytm.com',         plan: 'free',    joined: '2026-04-17', lastSeen: '2026-04-24', status: 'active'  },
  { id: 12, name: 'Amit Saxena',    email: 'amit@swiggy.com',         plan: 'premium', joined: '2026-04-18', lastSeen: '2026-04-28', status: 'active'  },
  { id: 13, name: 'Neha Patel',     email: 'neha@razorpay.com',       plan: 'free',    joined: '2026-04-20', lastSeen: '2026-04-26', status: 'active'  },
  { id: 14, name: 'Demo User',      email: 'free@demo.com',           plan: 'free',    joined: '2026-04-01', lastSeen: '2026-04-28', status: 'active'  },
  { id: 15, name: 'Premium User',   email: 'premium@demo.com',        plan: 'premium', joined: '2026-04-01', lastSeen: '2026-04-28', status: 'active'  },
]

export const MOCK_CONTENT = [
  { id: 1, title: 'My Google L5 Data Engineer Interview Experience',     author: 'Arjun Mehta',  type: 'interview-experience', status: 'published', date: '2026-04-20', views: 3240 },
  { id: 2, title: 'I Failed the Amazon SDE2 Interview Twice',            author: 'Priya Sharma', type: 'interview-experience', status: 'published', date: '2026-04-10', views: 2100 },
  { id: 3, title: 'Kafka Consumer Groups: What the Docs Won\'t Tell You', author: 'Rahul Yadav',  type: 'tech-article',         status: 'published', date: '2026-04-15', views: 4870 },
  { id: 4, title: 'Why We Moved Our Real-Time Pipelines From Spark to Flink', author: 'Arjun Mehta', type: 'tech-article',    status: 'published', date: '2026-04-05', views: 3890 },
  { id: 5, title: 'How to negotiate a senior role without prior title',   author: 'Sneha Reddy',  type: 'career',               status: 'pending',   date: '2026-04-25', views: 0    },
  { id: 6, title: 'Airbnb data science onsite — all 5 rounds breakdown', author: 'Community',    type: 'interview-experience', status: 'pending',   date: '2026-04-26', views: 0    },
  { id: 7, title: 'Real-time feature store design patterns',              author: 'Community',    type: 'tech-article',         status: 'pending',   date: '2026-04-27', views: 0    },
  { id: 8, title: 'The STAR Framework That Actually Works at FAANG',     author: 'Sneha Reddy',  type: 'career',               status: 'published', date: '2026-04-01', views: 1650 },
]

export const ANALYTICS = {
  pageviews:   { today: 1243, week: 8920,  month: 34500, trend: +12 },
  signups:     { today:   18, week:   142, month:   580, trend: +8  },
  premium:     { today:    4, week:    29, month:   112, trend: +15 },
  revenue:     { today: 3996, week: 28971, month: 111888, trend: +15 },

  topPages: [
    { path: '/notes/data-engineer/kafka',        views: 4240, change: +18 },
    { path: '/interview/dsa/two-sum',             views: 3120, change: +5  },
    { path: '/blog/kafka-consumer-groups-production', views: 2870, change: +22 },
    { path: '/notes/data-engineer/spark',         views: 2340, change: +9  },
    { path: '/interview/system-design',           views: 1980, change: +14 },
    { path: '/courses/data-engineer',             views: 1760, change: +31 },
  ],

  chartData: [
    { day: 'Mon', views: 920,  signups: 14 },
    { day: 'Tue', views: 1100, signups: 18 },
    { day: 'Wed', views: 980,  signups: 12 },
    { day: 'Thu', views: 1340, signups: 22 },
    { day: 'Fri', views: 1560, signups: 28 },
    { day: 'Sat', views: 780,  signups: 10 },
    { day: 'Sun', views: 620,  signups: 8  },
  ],
}

export function formatINR(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n}`
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
