import { getInitials } from '../../utils'

const sizes = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
}

export default function Avatar({ name, src, size = 'md', className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`
        flex items-center justify-center rounded-full
        bg-indigo-600 font-semibold text-white
        ${sizes[size]} ${className}
      `}
    >
      {getInitials(name)}
    </div>
  )
}
