import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { markdownComponents } from "./markdownComponents"

type Props = {
  content?: string | null
  className?: string
  fallback?: string
}

export default function MarkdownContent({ content, className = "", fallback }: Props) {
  const value = content?.trim()

  if (!value) {
    return fallback ? <p className={className}>{fallback}</p> : null
  }

  return (
    <div className={`prose prose-neutral prose-lg max-w-none ${className}`.trim()}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {value}
      </ReactMarkdown>
    </div>
  )
}
