export const CONTENT_TYPES = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'ad_copy', label: 'Ad Copy' },
  { value: 'proposal', label: 'Business Proposal' },
  { value: 'email', label: 'Email' },
  { value: 'social', label: 'Social Media Post' },
  { value: 'product', label: 'Product Description' },
]

export const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'informative', label: 'Informative' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'formal', label: 'Formal' },
]

export const LENGTHS = [
  { value: 'short', label: 'Short (~150 words)' },
  { value: 'medium', label: 'Medium (~400 words)' },
  { value: 'long', label: 'Long (~800 words)' },
]

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 10,
    maxCredits: 10,
    features: ['10 AI generations/month', '3 templates', 'Basic export', 'Email support'],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    credits: 200,
    maxCredits: 200,
    features: ['200 AI generations/month', 'All templates', 'Priority support', 'API access', 'History (90 days)'],
    highlighted: true,
  },
]

export const CREDIT_PACKS = [
  {
    id: 'small',
    name: '50 Credits',
    credits: 50,
    price: 5,
    pricePerCredit: '$0.10',
    color: 'indigo',
  },
  {
    id: 'medium',
    name: '150 Credits',
    credits: 150,
    price: 12,
    pricePerCredit: '$0.08',
    color: 'purple',
    popular: true,
  },
  {
    id: 'large',
    name: '500 Credits',
    credits: 500,
    price: 35,
    pricePerCredit: '$0.07',
    color: 'emerald',
  },
]

export const TEMPLATES = [
  {
    id: 'blog-writer',
    title: 'Blog Writer',
    description: 'Generate SEO-optimized blog posts on any topic.',
    icon: 'FileText',
    category: 'Content',
    fields: [
      { name: 'topic', label: 'Blog Topic', type: 'text', placeholder: 'e.g. The future of AI in healthcare' },
      { name: 'keywords', label: 'Target Keywords', type: 'text', placeholder: 'e.g. AI, healthcare, automation' },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Informative'] },
      { name: 'length', label: 'Word Count', type: 'select', options: ['500 words', '800 words', '1200 words'] },
    ],
  },
  {
    id: 'product-description',
    title: 'Product Description',
    description: 'Write compelling product descriptions that convert.',
    icon: 'ShoppingBag',
    category: 'E-commerce',
    fields: [
      { name: 'product', label: 'Product Name', type: 'text', placeholder: 'e.g. Wireless Noise-Cancelling Headphones' },
      { name: 'features', label: 'Key Features', type: 'textarea', placeholder: 'List main features...' },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g. Remote workers, students' },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Persuasive'] },
    ],
  },
  {
    id: 'email-generator',
    title: 'Email Generator',
    description: 'Craft professional emails for any occasion.',
    icon: 'Mail',
    category: 'Communication',
    fields: [
      { name: 'subject', label: 'Email Subject', type: 'text', placeholder: 'e.g. Follow-up on our meeting' },
      { name: 'recipient', label: 'Recipient Type', type: 'select', options: ['Client', 'Colleague', 'Manager', 'Partner'] },
      { name: 'purpose', label: 'Email Purpose', type: 'textarea', placeholder: 'Describe what the email should achieve...' },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Formal', 'Professional', 'Friendly'] },
    ],
  },
  {
    id: 'social-media-post',
    title: 'Social Media Post',
    description: 'Create engaging posts for Instagram, Twitter, and LinkedIn.',
    icon: 'Share2',
    category: 'Social',
    fields: [
      { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'Twitter/X', 'LinkedIn', 'Facebook'] },
      { name: 'topic', label: 'Post Topic', type: 'text', placeholder: 'e.g. Product launch announcement' },
      { name: 'cta', label: 'Call to Action', type: 'text', placeholder: 'e.g. Shop now, Learn more' },
      { name: 'hashtags', label: 'Include Hashtags', type: 'select', options: ['Yes', 'No'] },
    ],
  },
]

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/generate', label: 'Generate Content', icon: 'Sparkles' },
  { path: '/templates', label: 'Templates', icon: 'LayoutTemplate' },
  { path: '/history', label: 'History', icon: 'History' },
  { path: '/billing', label: 'Billing', icon: 'CreditCard' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
]

// ─── Tool Platform ─────────────────────────────────────────────────────────────

export const TOOLS = [
  // ── New specialized tools ──────────────────────────────────────────────────
  {
    id: 'youtube',
    label: 'YouTube Generator',
    description: 'SEO-optimized titles, descriptions & tags for YouTube videos',
    icon: 'PlayCircle',
    color: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
    contentType: 'youtube',
    defaultTone: 'casual',
    defaultLength: 'medium',
    fields: [
      { name: 'topic', label: 'Video Topic', type: 'text', placeholder: 'e.g. 10 AI tools every creator needs in 2024', required: true },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g. Content creators, entrepreneurs, beginners', required: true },
      { name: 'style', label: 'Video Style', type: 'select', options: [
        { value: 'tutorial', label: 'Tutorial / How-To' },
        { value: 'listicle', label: 'Listicle (Top 10...)' },
        { value: 'vlog', label: 'Vlog / Storytelling' },
        { value: 'review', label: 'Product Review' },
        { value: 'commentary', label: 'Commentary / Opinion' },
      ], required: true },
    ],
    examples: [
      { topic: '10 AI tools every content creator needs in 2024', audience: 'YouTubers and content creators', style: 'listicle' },
      { topic: 'How I grew my YouTube channel from 0 to 10k subscribers', audience: 'Beginner content creators', style: 'vlog' },
    ],
    buildPrompt: (f) =>
      `Video Topic: ${f.topic}\nTarget Audience: ${f.audience}\nVideo Style: ${f.style}\n\nGenerate complete YouTube content including SEO-optimized titles, a full description with timestamps placeholder, and relevant tags.`,
  },

  {
    id: 'upwork',
    label: 'Upwork Proposal Generator',
    description: 'Win more clients with compelling, personalized Upwork proposals',
    icon: 'Briefcase',
    color: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
    contentType: 'upwork',
    defaultTone: 'professional',
    defaultLength: 'medium',
    fields: [
      { name: 'jobTitle', label: 'Job Title / Project Type', type: 'text', placeholder: 'e.g. Build a React e-commerce website', required: true },
      { name: 'clientDescription', label: "Client's Job Description", type: 'textarea', placeholder: "Paste the client's job description or key requirements here...", rows: 4, required: true },
      { name: 'skills', label: 'Your Relevant Skills & Experience', type: 'text', placeholder: 'e.g. React, Node.js, MongoDB, 5 years experience', required: true },
      { name: 'uniqueValue', label: 'Your Track Record / Results (optional)', type: 'text', placeholder: 'e.g. Top Rated Plus, 98% JSS, 60+ completed projects', required: false },
    ],
    examples: [
      { jobTitle: 'Full-Stack MERN Developer for SaaS Platform', clientDescription: 'Looking for an experienced MERN stack developer to build a SaaS application with user authentication, subscription billing, and dashboard analytics. Must have experience with Stripe and chart libraries.', skills: 'React, Node.js, MongoDB, Express, Stripe integration, 4+ years experience', uniqueValue: 'Top Rated Plus, 98% JSS, 60+ completed projects' },
      { jobTitle: 'WordPress Website for Local Restaurant', clientDescription: 'Need a professional WordPress site for our restaurant with online menu, reservation form, photo gallery, and Google Maps integration. Mobile-friendly is a must.', skills: 'WordPress, Elementor, WooCommerce, PHP, responsive design, 3 years experience', uniqueValue: '50+ WordPress sites delivered, 5-star rating average' },
    ],
    buildPrompt: (f) =>
      `Job Title: ${f.jobTitle}\n\nClient's Requirements:\n${f.clientDescription}\n\nMy Skills: ${f.skills}${f.uniqueValue ? `\nMy Track Record: ${f.uniqueValue}` : ''}\n\nWrite a compelling, personalized Upwork proposal that stands out from 50+ applicants.`,
  },

  {
    id: 'fiverr',
    label: 'Fiverr Gig Generator',
    description: 'Create optimized Fiverr gigs that attract buyers and rank high in search',
    icon: 'ShoppingBag',
    color: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    contentType: 'fiverr_gig',
    defaultTone: 'professional',
    defaultLength: 'long',
    fields: [
      { name: 'service', label: 'Your Service', type: 'text', placeholder: 'e.g. WordPress website development', required: true },
      { name: 'audience', label: 'Target Buyers', type: 'text', placeholder: 'e.g. Small businesses, e-commerce store owners', required: true },
      { name: 'deliverables', label: 'Key Deliverables (optional)', type: 'text', placeholder: 'e.g. Responsive website, 5 pages, SEO setup, 3 revisions', required: false },
      { name: 'experience', label: 'Your Experience Level', type: 'select', options: [
        { value: 'beginner', label: 'Beginner (0–2 years)' },
        { value: 'intermediate', label: 'Intermediate (2–5 years)' },
        { value: 'expert', label: 'Expert (5+ years)' },
      ], required: true },
    ],
    examples: [
      { service: 'WordPress website development', audience: 'Small businesses and startups', deliverables: 'Responsive 5-page website, SEO optimization, contact form, 3 revisions', experience: 'expert' },
      { service: 'React frontend development', audience: 'Tech companies and digital agencies', deliverables: 'Component library, responsive UI, API integration, clean code', experience: 'intermediate' },
    ],
    buildPrompt: (f) =>
      `Service: ${f.service}\nTarget Audience: ${f.audience}${f.deliverables ? `\nKey Deliverables: ${f.deliverables}` : ''}\nExperience Level: ${f.experience}\n\nGenerate a complete Fiverr gig with: SEO-optimized title, compelling description, 3 packages (Basic/Standard/Premium) with suggested pricing and inclusions, 5 relevant tags, and 3 FAQs.`,
  },

  {
    id: 'linkedin',
    label: 'LinkedIn Generator',
    description: 'Write scroll-stopping LinkedIn posts that drive engagement and followers',
    icon: 'Users',
    color: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    contentType: 'linkedin',
    defaultTone: 'professional',
    defaultLength: 'medium',
    fields: [
      { name: 'topic', label: 'Post Topic', type: 'text', placeholder: 'e.g. Lessons I learned launching my first SaaS product', required: true },
      { name: 'angle', label: 'Content Angle', type: 'select', options: [
        { value: 'personal_story', label: 'Personal Story / Experience' },
        { value: 'professional_insight', label: 'Professional Insight' },
        { value: 'industry_trend', label: 'Industry Trend / News' },
        { value: 'tips_list', label: 'Tips & Advice List' },
        { value: 'achievement', label: 'Achievement / Milestone' },
      ], required: true },
      { name: 'cta', label: 'Call to Action (optional)', type: 'text', placeholder: "e.g. What's your experience? Drop it in the comments!", required: false },
    ],
    examples: [
      { topic: '5 lessons I learned building a profitable SaaS product', angle: 'personal_story', cta: 'Have you launched a SaaS? Share your biggest lesson below!' },
      { topic: 'How AI is transforming content marketing in 2024', angle: 'industry_trend', cta: 'Follow me for weekly AI + marketing insights' },
    ],
    buildPrompt: (f) =>
      `Topic: ${f.topic}\nContent Angle: ${f.angle.replace(/_/g, ' ')}${f.cta ? `\nCall to Action: ${f.cta}` : ''}\n\nWrite a high-engagement LinkedIn post with a compelling hook, value-driven body, and a clear call-to-action. Use line breaks for readability and include relevant hashtags.`,
  },

  // ── Existing content types exposed as specialized tools ────────────────────
  {
    id: 'blog',
    label: 'Blog Generator',
    description: 'Generate SEO-optimized blog posts that rank on Google and convert readers',
    icon: 'FileText',
    color: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800' },
    contentType: 'blog',
    defaultTone: 'informative',
    defaultLength: 'long',
    fields: [
      { name: 'topic', label: 'Blog Topic', type: 'text', placeholder: 'e.g. The ultimate guide to remote work productivity in 2024', required: true },
      { name: 'keywords', label: 'Target SEO Keywords (optional)', type: 'text', placeholder: 'e.g. remote work, productivity, work from home tips', required: false },
      { name: 'audience', label: 'Target Audience (optional)', type: 'text', placeholder: 'e.g. Remote workers, freelancers, digital nomads', required: false },
      { name: 'tone', label: 'Writing Tone', type: 'select', options: TONES, required: true },
      { name: 'length', label: 'Post Length', type: 'select', options: LENGTHS, required: true },
    ],
    examples: [
      { topic: 'The ultimate guide to remote work productivity in 2024', keywords: 'remote work, productivity, time management, WFH', audience: 'Remote workers and freelancers', tone: 'informative', length: 'long' },
      { topic: 'Top 10 AI tools for content creators that save 10+ hours per week', keywords: 'AI tools, content creation, automation, productivity', audience: 'Content creators, bloggers, and marketers', tone: 'casual', length: 'medium' },
    ],
    buildPrompt: (f) =>
      `Blog Topic: ${f.topic}${f.keywords ? `\nTarget Keywords: ${f.keywords}` : ''}${f.audience ? `\nTarget Audience: ${f.audience}` : ''}\n\nWrite a comprehensive, SEO-optimized blog post with an engaging introduction, well-structured sections with subheadings, and a strong conclusion.`,
  },

  {
    id: 'ad',
    label: 'Ad Generator',
    description: 'Create high-converting ad copy for Facebook, Google, LinkedIn & more',
    icon: 'Megaphone',
    color: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
    contentType: 'ad_copy',
    defaultTone: 'persuasive',
    defaultLength: 'short',
    fields: [
      { name: 'product', label: 'Product / Service', type: 'text', placeholder: 'e.g. AI-powered email marketing tool', required: true },
      { name: 'platform', label: 'Ad Platform', type: 'select', options: [
        { value: 'Facebook / Instagram', label: 'Facebook / Instagram' },
        { value: 'Google Ads', label: 'Google Ads' },
        { value: 'LinkedIn Ads', label: 'LinkedIn Ads' },
        { value: 'Twitter / X Ads', label: 'Twitter / X Ads' },
        { value: 'TikTok Ads', label: 'TikTok Ads' },
      ], required: true },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g. Marketing managers at SMBs, age 28–45', required: true },
      { name: 'offer', label: 'Special Offer / USP (optional)', type: 'text', placeholder: 'e.g. 14-day free trial, 50% off first month', required: false },
    ],
    examples: [
      { product: 'AI-powered email marketing tool that writes campaigns automatically', platform: 'Facebook / Instagram', audience: 'Small business owners and marketing managers', offer: '14-day free trial, no credit card required' },
      { product: 'Online fitness coaching for busy professionals', platform: 'Facebook / Instagram', audience: 'Professionals aged 25–45 who want to get fit but lack time', offer: '30% off first month + free nutrition guide' },
    ],
    buildPrompt: (f) =>
      `Product/Service: ${f.product}\nPlatform: ${f.platform}\nTarget Audience: ${f.audience}${f.offer ? `\nSpecial Offer / USP: ${f.offer}` : ''}\n\nWrite high-converting ad copy optimized for ${f.platform} with a strong hook, key benefits, social proof, and a clear call-to-action.`,
  },

  {
    id: 'email',
    label: 'Email Generator',
    description: 'Craft professional emails that get opened, read, and replied to',
    icon: 'Mail',
    color: { bg: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800' },
    contentType: 'email',
    defaultTone: 'professional',
    defaultLength: 'short',
    fields: [
      { name: 'emailType', label: 'Email Type', type: 'select', options: [
        { value: 'Cold Outreach', label: 'Cold Outreach' },
        { value: 'Follow-Up', label: 'Follow-Up' },
        { value: 'Sales Email', label: 'Sales Email' },
        { value: 'Onboarding / Welcome', label: 'Onboarding / Welcome' },
        { value: 'Newsletter', label: 'Newsletter' },
        { value: 'Apology / Recovery', label: 'Apology / Recovery' },
      ], required: true },
      { name: 'recipient', label: 'Recipient / Audience', type: 'text', placeholder: 'e.g. Enterprise marketing directors, SaaS founders', required: true },
      { name: 'goal', label: 'Email Goal', type: 'text', placeholder: 'e.g. Schedule a 15-min product demo', required: true },
      { name: 'context', label: 'Additional Context (optional)', type: 'textarea', placeholder: 'Any relevant details about your company, the situation, or the relationship...', rows: 3, required: false },
    ],
    examples: [
      { emailType: 'Cold Outreach', recipient: 'Marketing directors at SaaS companies', goal: 'Book a 30-minute strategy call about our AI content tool', context: 'They likely struggle with content production at scale and need consistent, high-quality output.' },
      { emailType: 'Follow-Up', recipient: 'Prospect who attended a product demo last week', goal: 'Re-engage and close the deal before end of month', context: 'Demo went well and they expressed interest but said they needed to check with their team first.' },
    ],
    buildPrompt: (f) =>
      `Email Type: ${f.emailType}\nRecipient: ${f.recipient}\nGoal: ${f.goal}${f.context ? `\nContext: ${f.context}` : ''}\n\nWrite a professional, high-converting email with a compelling subject line, personalized opening, clear value proposition, and a strong call-to-action.`,
  },

  {
    id: 'social',
    label: 'Social Media Generator',
    description: 'Create platform-native posts that drive engagement, shares, and followers',
    icon: 'Share2',
    color: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
    contentType: 'social',
    defaultTone: 'casual',
    defaultLength: 'short',
    fields: [
      { name: 'platform', label: 'Platform', type: 'select', options: [
        { value: 'Instagram', label: 'Instagram' },
        { value: 'Twitter / X', label: 'Twitter / X' },
        { value: 'Facebook', label: 'Facebook' },
        { value: 'TikTok Caption', label: 'TikTok Caption' },
      ], required: true },
      { name: 'topic', label: 'Post Topic / Idea', type: 'text', placeholder: 'e.g. Behind the scenes of running a one-person business', required: true },
      { name: 'goal', label: 'Post Goal', type: 'select', options: [
        { value: 'Drive Engagement', label: 'Drive Engagement (comments, shares)' },
        { value: 'Grow Followers', label: 'Grow Followers' },
        { value: 'Drive Traffic', label: 'Drive Website Traffic' },
        { value: 'Brand Awareness', label: 'Build Brand Awareness' },
        { value: 'Promote', label: 'Promote Product / Service' },
      ], required: true },
      { name: 'hashtags', label: 'Include Hashtags?', type: 'select', options: [
        { value: 'yes', label: 'Yes, include hashtags' },
        { value: 'no', label: 'No hashtags' },
      ], required: false },
    ],
    examples: [
      { platform: 'Instagram', topic: 'Morning routine of a 7-figure entrepreneur', goal: 'Drive Engagement', hashtags: 'yes' },
      { platform: 'Twitter / X', topic: 'Why most startups fail in their first 18 months', goal: 'Grow Followers', hashtags: 'no' },
    ],
    buildPrompt: (f) =>
      `Platform: ${f.platform}\nTopic: ${f.topic}\nGoal: ${f.goal}${f.hashtags ? `\nHashtags: ${f.hashtags === 'yes' ? 'Include relevant hashtags' : 'No hashtags'}` : ''}\n\nWrite an engaging, platform-native ${f.platform} post that is optimized for the platform's format, audience behavior, and algorithm.`,
  },

  {
    id: 'product',
    label: 'Product Description Generator',
    description: 'Write conversion-focused product descriptions that turn browsers into buyers',
    icon: 'Package',
    color: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    contentType: 'product',
    defaultTone: 'persuasive',
    defaultLength: 'medium',
    fields: [
      { name: 'productName', label: 'Product Name', type: 'text', placeholder: 'e.g. UltraComfort Ergonomic Chair Pro', required: true },
      { name: 'category', label: 'Product Category (optional)', type: 'text', placeholder: 'e.g. Office furniture, fitness equipment', required: false },
      { name: 'features', label: 'Key Features & Benefits', type: 'textarea', placeholder: 'Describe the main features and what makes this product stand out...', rows: 3, required: true },
      { name: 'audience', label: 'Target Buyer', type: 'text', placeholder: 'e.g. Remote workers who suffer from back pain', required: true },
      { name: 'platform', label: 'Listing Platform', type: 'select', options: [
        { value: 'Amazon', label: 'Amazon' },
        { value: 'Shopify / Own Store', label: 'Shopify / Own Store' },
        { value: 'Etsy', label: 'Etsy' },
        { value: 'General / Website', label: 'General / Website' },
      ], required: true },
    ],
    examples: [
      { productName: 'UltraComfort Pro Ergonomic Chair', category: 'Office furniture', features: 'Lumbar support system, 4D adjustable armrests, breathable mesh back, seat depth adjustment, 5-year warranty, weight capacity 300lbs', audience: 'Remote workers and office professionals with back pain', platform: 'Amazon' },
      { productName: 'Handmade Genuine Leather Journal Notebook', category: 'Stationery & gifts', features: 'Full-grain vegetable-tanned leather, 200 acid-free pages, lay-flat binding, ribbon bookmark, refillable, handcrafted in Italy', audience: 'Writers, creatives, and journal enthusiasts who love quality stationery', platform: 'Etsy' },
    ],
    buildPrompt: (f) =>
      `Product: ${f.productName}${f.category ? `\nCategory: ${f.category}` : ''}\nTarget Buyer: ${f.audience}\nKey Features: ${f.features}\nPlatform: ${f.platform}\n\nWrite a compelling, conversion-focused product description for ${f.platform} with a powerful headline, benefit-driven bullet points, and a persuasive call-to-action.`,
  },
]
