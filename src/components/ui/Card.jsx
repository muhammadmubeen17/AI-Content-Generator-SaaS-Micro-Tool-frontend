export default function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div
      className={`
        rounded-xl border border-gray-200 bg-white shadow-sm
        dark:border-gray-700 dark:bg-gray-800
        ${padding ? 'p-6' : ''}
        ${hover ? 'transition-shadow hover:shadow-md cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`mb-4 flex items-start justify-between ${className}`}>
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
