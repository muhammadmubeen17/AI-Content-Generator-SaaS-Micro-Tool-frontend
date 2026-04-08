import { useState, useEffect } from 'react'
import { FileText, ShoppingBag, Mail, Share2, ArrowRight, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import useContentStore from '../store/useContentStore'
import useAuthStore from '../store/useAuthStore'
import useTemplateStore from '../store/useTemplateStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import { CardSkeleton } from '../components/ui/Skeleton'

const ICONS = { FileText, ShoppingBag, Mail, Share2 }
const categoryColors = {
  Content: 'primary',
  'E-commerce': 'warning',
  Communication: 'success',
  Social: 'purple',
  Marketing: 'danger',
  Business: 'default',
}

export default function Templates() {
  const { generateContent, isGenerating, generatedContent } = useContentStore()
  const { updateUser } = useAuthStore()
  const { templates, isLoading, fetchTemplates } = useTemplateStore()

  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [fieldValues, setFieldValues] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')

  useEffect(() => {
    fetchTemplates()
  }, [])

  const categories = ['All', ...new Set(templates.map((t) => t.category))]

  const filtered = filterCategory === 'All'
    ? templates
    : templates.filter((t) => t.category === filterCategory)

  const openTemplate = (template) => {
    setSelectedTemplate(template)
    setFieldValues({})
    setShowResult(false)
  }

  const handleGenerate = async () => {
    const fieldSummary = Object.entries(fieldValues)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')

    const result = await generateContent({
      contentType: selectedTemplate.contentType || 'blog',
      tone: fieldValues.tone || selectedTemplate.defaultTone || 'professional',
      length: selectedTemplate.defaultLength || 'medium',
      prompt: `Template: ${selectedTemplate.title}. ${fieldSummary}`,
      templateId: selectedTemplate._id,
    })

    if (result.success) {
      if (result.creditsRemaining !== undefined) updateUser({ credits: result.creditsRemaining })
      setShowResult(true)
      toast.success('Content generated!')
    } else {
      toast.error(result.error || 'Generation failed')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Templates</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose from pre-built templates to get started quickly.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
          No templates found. Check back later.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((template) => {
            const Icon = ICONS[template.icon] || FileText
            return (
              <div
                key={template._id}
                onClick={() => openTemplate(template)}
                className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors dark:bg-indigo-900/30">
                    <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <Badge variant={categoryColors[template.category] || 'default'}>
                    {template.category}
                  </Badge>
                </div>
                <h3 className="mb-1.5 font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {template.title}
                </h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {template.description}
                </p>
                <div className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Use template <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Template Modal */}
      <Modal
        isOpen={!!selectedTemplate}
        onClose={() => { setSelectedTemplate(null); setShowResult(false) }}
        title={selectedTemplate?.title}
        size="md"
      >
        {selectedTemplate && !showResult && (
          <div className="space-y-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedTemplate.description}</p>

            {(selectedTemplate.fields || []).map((field) => {
              const commonProps = {
                key: field.name,
                label: field.label,
                value: fieldValues[field.name] || '',
                onChange: (e) => setFieldValues((prev) => ({ ...prev, [field.name]: e.target.value })),
                placeholder: field.placeholder,
              }
              if (field.type === 'textarea') return <Textarea {...commonProps} rows={3} />
              if (field.type === 'select') {
                return (
                  <Select
                    {...commonProps}
                    options={(field.options || []).map((o) => ({ value: o.toLowerCase(), label: o }))}
                    placeholder={`Select ${field.label.toLowerCase()}`}
                  />
                )
              }
              return <Input {...commonProps} type="text" />
            })}

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setSelectedTemplate(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleGenerate} loading={isGenerating} icon={Sparkles} className="flex-1">
                Generate
              </Button>
            </div>
          </div>
        )}

        {showResult && generatedContent && (
          <div className="space-y-4">
            <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
              {generatedContent.content}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowResult(false)} className="flex-1">
                Edit inputs
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent.content)
                  toast.success('Copied!')
                }}
                className="flex-1"
              >
                Copy Content
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
