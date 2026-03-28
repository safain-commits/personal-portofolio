export function stripMarkdown(input = ''): string {
  return input
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[>#\-*+]\s?/gm, '')
    .replace(/^\d+\.\s?/gm, '')
    .replace(/[*_~`]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function truncateText(input = '', maxLength = 160): string {
  if (input.length <= maxLength) return input
  return `${input.slice(0, maxLength).trimEnd()}…`
}
