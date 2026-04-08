import { useState } from 'react'
import { Search, Trash2, Eye, Filter, History as HistoryIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import useContentStore from '../store/useContentStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import EmptyState from '../components/ui/EmptyState'
import { formatDate, getContentTypeLabel } from '../utils'
import { CONTENT_TYPES } from '../constants'

const typeColors = {
  blog: 'primary',
  ad_copy: 'warning',
  email: 'success',
  social: 'purple',
  product: 'default',
  proposal: 'danger',
}

export default function History() {
  const { history, deleteHistoryItem } = useContentStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [viewItem, setViewItem] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const filtered = history.filter((item) => {
    const matchSearch = !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase())
    const matchType = !typeFilter || item.type === typeFilter
    return matchSearch && matchType
  })

  const handleDelete = async (id) => {
    setDeletingId(id)
    await new Promise((r) => setTimeout(r, 400))
    deleteHistoryItem(id)
    setDeletingId(null)
    toast.success('Item deleted')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">History</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Browse and manage your generated content.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search by title or content..."
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClass="flex-1"
        />
        <Select
          options={CONTENT_TYPES}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          placeholder="All types"
          className="sm:w-48"
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <Filter className="h-4 w-4" />
          {filtered.length} of {history.length} items
        </span>
        {(search || typeFilter) && (
          <button
            onClick={() => { setSearch(''); setTypeFilter('') }}
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <Card padding={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title={history.length === 0 ? 'No content yet' : 'No results found'}
            description={
              history.length === 0
                ? 'Generate your first piece of content to see it here.'
                : 'Try adjusting your search or filters.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Title
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Type
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    Tone
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    Words
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${deletingId === item.id ? 'opacity-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {item.preview}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={typeColors[item.type] || 'default'}>
                        {getContentTypeLabel(item.type)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                        {item.tone}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.wordCount}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewItem(item)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={!!deletingId}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* View Modal */}
      <Modal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.title}
        size="lg"
      >
        {viewItem && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={typeColors[viewItem.type] || 'default'}>
                {getContentTypeLabel(viewItem.type)}
              </Badge>
              <Badge variant="default">{viewItem.tone}</Badge>
              <Badge variant="default">{viewItem.wordCount} words</Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(viewItem.createdAt)}
              </span>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 max-h-96 overflow-y-auto">
              {viewItem.content}
            </div>
            <Button
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(viewItem.content)
                toast.success('Copied!')
              }}
            >
              Copy Content
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
