import { useState, useEffect } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import {
  Sparkles, Copy, RotateCcw, Download, Check, Lightbulb,
  PlayCircle, Briefcase, ShoppingBag, Users, FileText,
  Megaphone, Mail, Share2, Package, AlertTriangle, ArrowRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { TOOLS } from '../../constants'
import useContentStore from '../../store/useContentStore'
import useAuthStore from '../../store/useAuthStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import Card, { CardHeader } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { copyToClipboard } from '../../utils'

const ICON_MAP = {
  PlayCircle, Briefcase, ShoppingBag, Users, FileText, Megaphone, Mail, Share2, Package,
}

export default function ToolPage() {
  const { toolId } = useParams()
  const navigate = useNavigate()

  // ── All hooks must be called unconditionally ─────────────────────────────
  const { generateContent, isGenerating } = useContentStore()
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [output, setOutput] = useState(null)
  const [copied, setCopied] = useState(false)

  // Reset form and output whenever the tool changes
  useEffect(() => {
    setForm({})
    setErrors({})
    setOutput(null)
    setCopied(false)
  }, [toolId])

  const tool = TOOLS.find((t) => t.id === toolId)
  if (!tool) return <Navigate to="/dashboard" replace />

  const ToolIcon = ICON_MAP[tool.icon]

  // ── Helpers ──────────────────────────────────────────────────────────────
  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    tool.fields.forEach((field) => {
      if (field.required && !form[field.name]?.trim()) {
        errs[field.name] = `${field.label} is required`
      }
    })
    return errs
  }

  const handleGenerate = async () => {
    // Guard: redirect to email verification if not verified
    if (!user?.isEmailVerified) {
      navigate('/verify-email')
      return
    }

    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    const prompt = tool.buildPrompt(form)
    const contentType = tool.contentType
    const tone = form.tone || tool.defaultTone || 'professional'
    const length = form.length || tool.defaultLength || 'medium'

    const result = await generateContent({ contentType, tone, length, prompt })

    if (result.success) {
      setOutput(result.content)
      toast.success('Content generated!')
      if (result.creditsRemaining !== undefined) updateUser({ credits: result.creditsRemaining })
    } else {
      if (result.error?.toLowerCase().includes('credit')) {
        toast.error('Not enough credits. Please upgrade your plan.')
      } else {
        toast.error(result.error || 'Generation failed. Please try again.')
      }
    }
  }

  const handleCopy = async () => {
    if (!output) return
    const ok = await copyToClipboard(output.content)
    if (ok) {
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([output.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tool.id}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded!')
  }

  const applyExample = (example) => {
    setForm(example)
    setErrors({})
    toast.success('Example loaded!')
  }

  // ── Dynamic field renderer ────────────────────────────────────────────────
  const renderField = (field) => {
    const value = form[field.name] || ''
    const error = errors[field.name]

    if (field.type === 'select') {
      return (
        <Select
          key={field.name}
          label={field.label}
          options={field.options}
          value={value}
          onChange={set(field.name)}
          error={error}
          placeholder={`Select ${field.label.toLowerCase()}`}
        />
      )
    }
    if (field.type === 'textarea') {
      return (
        <Textarea
          key={field.name}
          label={field.label}
          placeholder={field.placeholder}
          rows={field.rows || 4}
          value={value}
          onChange={set(field.name)}
          error={error}
          maxLength={field.maxLength}
          hint={field.maxLength ? `${value.length} / ${field.maxLength}` : undefined}
        />
      )
    }
    return (
      <Input
        key={field.name}
        label={field.label}
        placeholder={field.placeholder}
        value={value}
        onChange={set(field.name)}
        error={error}
      />
    )
  }

  // Derive a clean label for the generate button
  const generateLabel = tool.label
    .replace(' Generator', '')
    .replace(' Creator', '')
    .replace(' Writer', '')

  return (
    <div className="space-y-6">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tool.color.bg}`}>
          {ToolIcon && <ToolIcon className={`h-6 w-6 ${tool.color.text}`} />}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tool.label}</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{tool.description}</p>
        </div>
      </div>

      {/* ── Email verification banner ─────────────────────────────────── */}
      {user && !user.isEmailVerified && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 dark:border-amber-800/50 dark:bg-amber-900/20">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Email verification required</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Verify your email address to start generating content with AI.
            </p>
          </div>
          <button
            onClick={() => navigate('/verify-email')}
            className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700 shrink-0"
          >
            Verify now <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Input form ─────────────────────────────────────────────────── */}
        <Card>
          <CardHeader title="Configure" subtitle="Fill in the details to generate your content" />
          <div className="space-y-4">
            {tool.fields.map(renderField)}

            {/* Example prompts */}
            {tool.examples.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Try an example
                </p>
                <div className="flex flex-wrap gap-2">
                  {tool.examples.map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyExample(ex)}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400"
                    >
                      Example {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              loading={isGenerating}
              className="w-full"
              size="lg"
              icon={Sparkles}
            >
              {isGenerating ? 'Generating...' : `Generate ${generateLabel}`}
            </Button>
          </div>
        </Card>

        {/* ── Output panel ───────────────────────────────────────────────── */}
        <Card>
          <CardHeader
            title="Generated Output"
            subtitle={output ? `${output.wordCount} words` : 'Your content will appear here'}
            action={output && <Badge variant="success">Ready</Badge>}
          />

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${tool.color.bg}`}>
                {ToolIcon
                  ? <ToolIcon className={`h-7 w-7 animate-pulse ${tool.color.text}`} />
                  : <Sparkles className="h-7 w-7 animate-pulse text-indigo-600 dark:text-indigo-400" />
                }
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI is crafting your content...</p>
              <p className="mt-1 text-xs text-gray-400">This usually takes 2–5 seconds</p>
              <div className="mt-4 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : output ? (
            <div className="space-y-4">
              <div className="min-h-64 max-h-[520px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200 scrollbar-thin">
                {output.content}
              </div>
              <div className="flex gap-2.5">
                <Button variant="secondary" icon={copied ? Check : Copy} onClick={handleCopy} className="flex-1">
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant="secondary" icon={RotateCcw} onClick={handleGenerate} loading={isGenerating} className="flex-1">
                  Regenerate
                </Button>
                <Button variant="ghost" icon={Download} title="Download as .txt" onClick={handleDownload} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${tool.color.bg}`}>
                {ToolIcon
                  ? <ToolIcon className={`h-8 w-8 opacity-50 ${tool.color.text}`} />
                  : <Sparkles className="h-8 w-8 text-gray-400" />
                }
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fill in the details and click Generate</p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Your AI-generated content will appear here</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
