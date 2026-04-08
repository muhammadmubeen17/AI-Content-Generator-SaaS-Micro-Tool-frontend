export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const truncate = (str, n = 100) => {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '...' : str
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export const getContentTypeLabel = (type) => {
  const map = {
    blog: 'Blog Post',
    ad_copy: 'Ad Copy',
    proposal: 'Business Proposal',
    email: 'Email',
    social: 'Social Media Post',
    product: 'Product Description',
  }
  return map[type] || type
}

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
