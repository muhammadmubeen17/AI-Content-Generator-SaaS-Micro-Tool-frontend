import { create } from 'zustand'

const MOCK_HISTORY = [
  {
    id: '1',
    type: 'blog',
    title: 'The Future of AI in Healthcare',
    preview: 'Artificial intelligence is revolutionizing the healthcare industry at an unprecedented pace. From diagnostic imaging to drug discovery...',
    content: `Artificial intelligence is revolutionizing the healthcare industry at an unprecedented pace. From diagnostic imaging to drug discovery, AI is enabling medical professionals to make more accurate diagnoses, develop treatments faster, and improve patient outcomes across the board.

In the realm of diagnostic imaging, machine learning algorithms trained on millions of medical images can now detect conditions like cancer, diabetic retinopathy, and cardiovascular disease with accuracy that rivals—and in some cases surpasses—human specialists. This doesn't replace doctors; it empowers them with a powerful second opinion that operates at scale.

Drug discovery, traditionally a decade-long and billion-dollar process, is being compressed by AI systems that can model molecular interactions, predict drug efficacy, and identify promising compounds in weeks rather than years. Companies like DeepMind have demonstrated this potential with AlphaFold's revolutionary protein structure predictions.

Patient care is being transformed through AI-powered monitoring systems that track vital signs in real time, alert nurses to early warning signs of deterioration, and personalize treatment plans based on individual patient data. The result is proactive, rather than reactive, medicine.

As we look ahead, the integration of AI in healthcare promises not just improved clinical outcomes, but a fundamental reimagining of how we prevent, diagnose, and treat disease.`,
    tone: 'professional',
    length: 'medium',
    createdAt: '2024-12-01T10:30:00Z',
    wordCount: 420,
  },
  {
    id: '2',
    type: 'ad_copy',
    title: 'Summer Sale Campaign - E-commerce',
    preview: 'Don\'t miss out on our biggest summer sale ever! Up to 70% off on premium products...',
    content: `Don't miss out on our biggest summer sale ever! 🌞

Up to 70% off on premium products — but only for 48 hours.

Whether you're upgrading your home, refreshing your wardrobe, or finding the perfect gift, we've got thousands of deals waiting for you.

✅ Free shipping on orders over $50
✅ 30-day hassle-free returns
✅ Exclusive member perks

The clock is ticking. Shop now before your favorites sell out.

👉 SHOP THE SALE NOW`,
    tone: 'persuasive',
    length: 'short',
    createdAt: '2024-11-28T14:15:00Z',
    wordCount: 85,
  },
  {
    id: '3',
    type: 'email',
    title: 'Client Follow-up After Meeting',
    preview: 'Thank you for taking the time to meet with us yesterday. I wanted to follow up on the key points we discussed...',
    content: `Subject: Follow-Up on Yesterday's Strategy Meeting

Hi Sarah,

Thank you for taking the time to meet with us yesterday. I wanted to follow up on the key points we discussed and outline our proposed next steps.

To summarize the main takeaways from our conversation:
- We aligned on a Q1 2025 launch timeline for Phase 1
- The budget allocation has been approved at $150,000
- Your team will handle content creation while we manage technical implementation

I've attached a detailed project roadmap that reflects everything we discussed. Please review it and let me know if any adjustments are needed before we finalize.

Our team is excited about this partnership and we're confident we can deliver exceptional results. I'll schedule a follow-up call for next Thursday to address any questions.

Looking forward to working together.

Best regards,
Alex Johnson
Senior Account Manager`,
    tone: 'professional',
    length: 'medium',
    createdAt: '2024-11-25T09:00:00Z',
    wordCount: 165,
  },
  {
    id: '4',
    type: 'social',
    title: 'Product Launch - LinkedIn Post',
    preview: 'Excited to announce the launch of our new AI-powered analytics dashboard...',
    content: `Excited to announce the launch of our new AI-powered analytics dashboard! 🚀

After 8 months of development and feedback from 500+ beta users, we're finally live.

What's new:
→ Real-time data visualization
→ AI-powered trend predictions
→ One-click report generation
→ Integrations with 50+ platforms

The result? Our beta users saw an average of 3x faster decision-making and 40% reduction in reporting time.

This is just the beginning. We're building the future of business intelligence — and we'd love your feedback.

Try it free for 14 days. Link in bio.

#ProductLaunch #AI #Analytics #BusinessIntelligence #SaaS`,
    tone: 'casual',
    length: 'short',
    createdAt: '2024-11-20T11:45:00Z',
    wordCount: 120,
  },
  {
    id: '5',
    type: 'product',
    title: 'Premium Wireless Headphones Description',
    preview: 'Experience audio like never before with the SoundPro X1 wireless headphones...',
    content: `Experience audio like never before with the SoundPro X1 wireless headphones.

Engineered for audiophiles and professionals who refuse to compromise, the SoundPro X1 delivers studio-quality sound in a sleek, lightweight design that you can wear all day.

**Key Features:**
- **40-hour battery life** — Power through your entire week on a single charge
- **Active Noise Cancellation 3.0** — Intelligent noise cancellation that adapts to your environment
- **Hi-Res Audio certified** — Hear every detail with 40mm custom-tuned drivers
- **Multi-point connection** — Seamlessly switch between up to 3 devices
- **Premium comfort** — Memory foam ear cushions and adjustable headband for all-day wear

Whether you're working from home, commuting, or diving deep into your favorite playlist, the SoundPro X1 creates your perfect sonic environment.

Available in Midnight Black, Pearl White, and Space Gray.

*Free shipping. 30-day returns. 2-year warranty.*`,
    tone: 'professional',
    length: 'medium',
    createdAt: '2024-11-15T16:20:00Z',
    wordCount: 165,
  },
]

const useContentStore = create((set, get) => ({
  history: MOCK_HISTORY,
  generatedContent: null,
  isGenerating: false,
  selectedHistoryItem: null,

  generateContent: async (params) => {
    set({ isGenerating: true, generatedContent: null })
    await new Promise((r) => setTimeout(r, 2000))

    const mockContent = `This is AI-generated content based on your prompt: "${params.prompt}".

The content has been crafted with a ${params.tone} tone and optimized for ${params.contentType} format.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`

    const newItem = {
      id: Date.now().toString(),
      type: params.contentType,
      title: params.prompt.slice(0, 50) + (params.prompt.length > 50 ? '...' : ''),
      preview: mockContent.slice(0, 120) + '...',
      content: mockContent,
      tone: params.tone,
      length: params.length,
      createdAt: new Date().toISOString(),
      wordCount: mockContent.split(' ').length,
    }

    set((state) => ({
      generatedContent: newItem,
      history: [newItem, ...state.history],
      isGenerating: false,
    }))

    return newItem
  },

  deleteHistoryItem: (id) => {
    set((state) => ({ history: state.history.filter((h) => h.id !== id) }))
  },

  setSelectedHistoryItem: (item) => set({ selectedHistoryItem: item }),

  clearGenerated: () => set({ generatedContent: null }),
}))

export default useContentStore
