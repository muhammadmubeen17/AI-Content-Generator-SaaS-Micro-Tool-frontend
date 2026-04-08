export default function ProgressBar({ value, max, label, showPercent = true, color = 'indigo' }) {
  const percent = Math.min(100, Math.round((value / max) * 100))
  const colors = {
    indigo: 'bg-indigo-600',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }

  return (
    <div>
      {(label || showPercent) && (
        <div className="mb-1.5 flex justify-between text-sm">
          {label && <span className="text-gray-600 dark:text-gray-400">{label}</span>}
          {showPercent && <span className="font-medium text-gray-900 dark:text-white">{percent}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
