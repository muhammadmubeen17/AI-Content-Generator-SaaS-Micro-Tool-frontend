import { useState, useEffect, useCallback } from 'react'
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
import { TableSkeleton } from '../components/ui/Skeleton'
import { formatDate, getContentTypeLabel } from '../utils'
import { CONTENT_TYPES } from '../constants'
import { getContentById } from '../services/contentService'

const typeColors = {
  blog: 'primary', ad_copy: 'warning', email: 'success',
  social: 'purple', product: 'default', proposal: 'danger',
}

export default function History() {
  const { history, historyTotal, historyLoading, fetchHistory, deleteHistoryItem } = useContentStore()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [viewItem, setViewItem] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const limit = 10

  const load = useCallback(() => {
    fetchHistory({ page, limit, type: typeFilter || undefined, search: search || undefined })
  }, [page, typeFilter, search])

  useEffect(() => { load() }, [load])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchHistory({ page: 1, limit, type: typeFilter || undefined, search: search || undefined })
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const handleView = async (item) => {
    setViewLoading(true)
    setViewItem({ ...item, content: null })
    try {
      const { data } = await getContentById(item._id || item.id)
      setViewItem(data.content)
    } catch {
      toast.error('Failed to load content')
      setViewItem(null)
    } finally {
      setViewLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    const result = await deleteHistoryItem(id)
    setDeletingId(null)
    if (result.success) {
      toast.success('Deleted successfully')
      load()
    } else {
      toast.error(result.error || 'Delete failed')
    }
  }

  const totalPages = Math.ceil(historyTotal / limit)

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
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
          placeholder="All types"
          className="sm:w-48"
        />
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <Filter className="h-4 w-4" />
          {historyTotal} item{historyTotal !== 1 ? 's' : ''}
        </span>
        {(search || typeFilter) && (
          <button
            onClick={() => { setSearch(''); setTypeFilter(''); setPage(1) }}
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <Card padding={false}>
        {historyLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : history.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title={historyTotal === 0 && !search && !typeFilter ? 'No content yet' : 'No results found'}
            description={
              historyTotal === 0 && !search && !typeFilter
                ? 'Generate your first piece of content to see it here.'
                : 'Try adjusting your search or filters.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  {['Title', 'Type', 'Tone', 'Words', 'Date', 'Actions'].map((h) => (
                    <th key={h} className={`px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${['Tone', 'Words'].includes(h) ? 'hidden md:table-cell' : h === 'Date' ? 'hidden lg:table-cell' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {history.map((item) => {
                  const id = item._id || item.id
                  return (
                    <tr
                      key={id}
                      className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${deletingId === id ? 'opacity-40' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {item.prompt?.slice(0, 80)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={typeColors[item.type] || 'default'}>
                          {getContentTypeLabel(item.type)}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-sm capitalize text-gray-600 dark:text-gray-400">{item.tone}</span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.wordCount}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(item.createdAt)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleView(item)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            disabled={!!deletingId}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Modal */}
      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.title} size="lg">
        {viewItem && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={typeColors[viewItem.type] || 'default'}>{getContentTypeLabel(viewItem.type)}</Badge>
              <Badge variant="default">{viewItem.tone}</Badge>
              <Badge variant="default">{viewItem.wordCount} words</Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(viewItem.createdAt)}</span>
            </div>
            {viewLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                {viewItem.output || viewItem.content || 'No content available'}
              </div>
            )}
            <Button
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(viewItem.output || viewItem.content || '')
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
