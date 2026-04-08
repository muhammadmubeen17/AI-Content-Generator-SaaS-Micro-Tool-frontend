import { ChevronDown } from 'lucide-react'

export default function Select({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
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
        <select
          className={`
            block w-full appearance-none rounded-lg border bg-white px-3 py-2.5 pr-10 text-sm text-gray-900
            shadow-sm transition-colors cursor-pointer
            focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
            disabled:bg-gray-50 disabled:cursor-not-allowed
            dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
            dark:focus:border-indigo-400
            ${error ? 'border-red-400' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
