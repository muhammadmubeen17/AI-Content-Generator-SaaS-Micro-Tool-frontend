import { useState } from 'react'
import { Copy, RotateCcw, Sparkles, Check, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import useContentStore from '../store/useContentStore'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Card, { CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { CONTENT_TYPES, TONES, LENGTHS } from '../constants'
import { copyToClipboard } from '../utils'

const EXAMPLE_PROMPTS = [
  'Write a blog post about the top 5 productivity tips for remote workers',
  'Create a Facebook ad for a fitness app targeting busy professionals',
  'Write a professional follow-up email after a sales demo',
  'Generate a product description for noise-cancelling wireless headphones',
]

export default function GenerateContent() {
  const { generateContent, generatedContent, isGenerating } = useContentStore()
  const { updateUser } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ contentType: '', tone: '', length: '', prompt: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.contentType) errs.contentType = 'Select a content type'
    if (!form.tone) errs.tone = 'Select a tone'
    if (!form.length) errs.length = 'Select a length'
    if (!form.prompt.trim()) errs.prompt = 'Enter a prompt'
    else if (form.prompt.trim().length < 10) errs.prompt = 'Prompt must be at least 10 characters'
    return errs
  }

  const handleGenerate = async (e) => {
    e?.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    const result = await generateContent(form)

    if (result.success) {
      toast.success('Content generated successfully!')
      if (result.creditsRemaining !== undefined) {
        updateUser({ credits: result.creditsRemaining })
      }
    } else {
      if (result.error?.toLowerCase().includes('credit')) {
        toast.error('Not enough credits. Please upgrade your plan.')
      } else {
        toast.error(result.error || 'Generation failed. Please try again.')
      }
    }
  }

  const handleCopy = async () => {
    if (!generatedContent) return
    const ok = await copyToClipboard(generatedContent.content)
    if (ok) {
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Generate Content</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Describe what you need and let AI do the heavy lifting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Content Settings" subtitle="Configure your generation parameters" />
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Content Type"
                options={CONTENT_TYPES}
                value={form.contentType}
                onChange={set('contentType')}
                error={errors.contentType}
                placeholder="Select type"
              />
              <Select
                label="Tone"
                options={TONES}
                value={form.tone}
                onChange={set('tone')}
                error={errors.tone}
                placeholder="Select tone"
              />
            </div>
            <Select
              label="Content Length"
              options={LENGTHS}
              value={form.length}
              onChange={set('length')}
              error={errors.length}
              placeholder="Select length"
            />
            <Textarea
              label="Your Prompt"
              placeholder="Describe what you want to generate in detail..."
              rows={5}
              value={form.prompt}
              onChange={set('prompt')}
              error={errors.prompt}
              hint={`${form.prompt.length} / 500 characters`}
              maxLength={500}
            />
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Example prompts
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, prompt: p }))}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400"
                  >
                    {p.slice(0, 40)}...
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" loading={isGenerating} className="w-full" size="lg" icon={Sparkles}>
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader
            title="Generated Output"
            subtitle={generatedContent ? `${generatedContent.wordCount} words` : 'Your content will appear here'}
            action={generatedContent && <Badge variant="success">Ready</Badge>}
          />

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
                <Sparkles className="h-7 w-7 animate-pulse text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI is crafting your content...</p>
              <p className="mt-1 text-xs text-gray-400">This usually takes 2–5 seconds</p>
              <div className="mt-4 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          ) : generatedContent ? (
            <div className="space-y-4">
              <div className="min-h-64 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                {generatedContent.content}
              </div>
              <div className="flex gap-2.5">
                <Button variant="secondary" icon={copied ? Check : Copy} onClick={handleCopy} className="flex-1">
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="secondary" icon={RotateCcw} onClick={handleGenerate} loading={isGenerating} className="flex-1">
                  Regenerate
                </Button>
                <Button
                  variant="ghost"
                  icon={Download}
                  title="Download"
                  onClick={() => {
                    const blob = new Blob([generatedContent.content], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `content-${Date.now()}.txt`
                    a.click()
                    URL.revokeObjectURL(url)
                    toast.success('Downloaded!')
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700">
                <Sparkles className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fill in the form and click Generate</p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Your AI-generated content will appear here</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
