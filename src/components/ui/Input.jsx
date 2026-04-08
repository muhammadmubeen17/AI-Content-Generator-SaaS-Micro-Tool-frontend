export default function Input({
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  containerClass = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClass}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <input
          className={`
            block w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900
            placeholder-gray-400 shadow-sm transition-colors
            focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
            disabled:bg-gray-50 disabled:cursor-not-allowed
            dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500
            dark:focus:border-indigo-400
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-gray-300'}
            ${Icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  )
}
