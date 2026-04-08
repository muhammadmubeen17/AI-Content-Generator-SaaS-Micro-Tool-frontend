export default function Textarea({
  label,
  error,
  hint,
  className = '',
  containerClass = '',
  rows = 4,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClass}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`
          block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900
          placeholder-gray-400 shadow-sm transition-colors resize-none
          focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
          disabled:bg-gray-50 disabled:cursor-not-allowed
          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500
          dark:focus:border-indigo-400
          ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  )
}
