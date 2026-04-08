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
    features: ['10 AI generations/month', '3 templates', 'Basic export', 'Email support'],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    credits: 200,
    features: ['200 AI generations/month', 'All templates', 'Priority support', 'API access', 'History (90 days)'],
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    credits: 1000,
    features: ['Unlimited generations', 'All templates', '24/7 dedicated support', 'API access', 'Unlimited history', 'Team seats (5)'],
    highlighted: false,
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
