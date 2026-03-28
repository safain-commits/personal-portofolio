import { useMemo, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { markdownComponents } from "./markdownComponents"

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  helpText?: string
}

type ToolbarAction = {
  label: string
  title: string
  run: (input: HTMLTextAreaElement, currentValue: string) => { nextValue: string; selectionStart?: number; selectionEnd?: number }
}

const wrapSelection = (
  input: HTMLTextAreaElement,
  currentValue: string,
  before: string,
  after: string = before,
  placeholder: string = "text"
) => {
  const start = input.selectionStart ?? currentValue.length
  const end = input.selectionEnd ?? currentValue.length
  const selected = currentValue.slice(start, end) || placeholder
  const nextValue = `${currentValue.slice(0, start)}${before}${selected}${after}${currentValue.slice(end)}`
  const selectionStart = start + before.length
  const selectionEnd = selectionStart + selected.length

  return { nextValue, selectionStart, selectionEnd }
}

const prefixLines = (
  input: HTMLTextAreaElement,
  currentValue: string,
  prefixer: (line: string, index: number) => string
) => {
  const start = input.selectionStart ?? currentValue.length
  const end = input.selectionEnd ?? currentValue.length
  const lineStart = currentValue.lastIndexOf("\n", Math.max(0, start - 1)) + 1
  const lineEndIndex = currentValue.indexOf("\n", end)
  const lineEnd = lineEndIndex === -1 ? currentValue.length : lineEndIndex
  const block = currentValue.slice(lineStart, lineEnd)
  const lines = block.split("\n")
  const prefixed = lines.map((line, index) => prefixer(line, index)).join("\n")
  const nextValue = `${currentValue.slice(0, lineStart)}${prefixed}${currentValue.slice(lineEnd)}`

  return {
    nextValue,
    selectionStart: lineStart,
    selectionEnd: lineStart + prefixed.length
  }
}

const insertLink = (input: HTMLTextAreaElement, currentValue: string) => {
  const start = input.selectionStart ?? currentValue.length
  const end = input.selectionEnd ?? currentValue.length
  const selected = currentValue.slice(start, end) || "link text"
  const snippet = `[${selected}](https://example.com)`
  const nextValue = `${currentValue.slice(0, start)}${snippet}${currentValue.slice(end)}`
  return {
    nextValue,
    selectionStart: start + 1,
    selectionEnd: start + 1 + selected.length
  }
}

const actions: ToolbarAction[] = [
  {
    label: "B",
    title: "Bold",
    run: (input, currentValue) => wrapSelection(input, currentValue, "**")
  },
  {
    label: "I",
    title: "Italic",
    run: (input, currentValue) => wrapSelection(input, currentValue, "*")
  },
  {
    label: "H2",
    title: "Heading 2",
    run: (input, currentValue) => prefixLines(input, currentValue, (line) => line.startsWith("## ") ? line : `## ${line || "Heading"}`)
  },
  {
    label: "H3",
    title: "Heading 3",
    run: (input, currentValue) => prefixLines(input, currentValue, (line) => line.startsWith("### ") ? line : `### ${line || "Heading"}`)
  },
  {
    label: "• List",
    title: "Bullet List",
    run: (input, currentValue) => prefixLines(input, currentValue, (line) => line.startsWith("- ") ? line : `- ${line || "List item"}`)
  },
  {
    label: "1. List",
    title: "Numbered List",
    run: (input, currentValue) => prefixLines(input, currentValue, (line, index) => {
      const cleaned = line.replace(/^\d+\.\s+/, "")
      return `${index + 1}. ${cleaned || "List item"}`
    })
  },
  {
    label: "☑ Task",
    title: "Checklist",
    run: (input, currentValue) => prefixLines(input, currentValue, (line) => line.startsWith("- [ ] ") ? line : `- [ ] ${line || "Task item"}`)
  },
  {
    label: "Link",
    title: "Insert Link",
    run: (input, currentValue) => insertLink(input, currentValue)
  },
  {
    label: "Code",
    title: "Inline Code",
    run: (input, currentValue) => wrapSelection(input, currentValue, "`", "`", "code")
  },
  {
    label: "```",
    title: "Code Block",
    run: (input, currentValue) => wrapSelection(input, currentValue, "```\n", "\n```", "code block")
  },
  {
    label: "Quote",
    title: "Blockquote",
    run: (input, currentValue) => prefixLines(input, currentValue, (line) => line.startsWith("> ") ? line : `> ${line || "Quote"}`)
  }
]

export default function MarkdownEditor({
  label,
  value,
  onChange,
  placeholder,
  rows = 8,
  helpText
}: Props) {
  const [tab, setTab] = useState<"write" | "preview">("write")
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const hasContent = useMemo(() => value.trim().length > 0, [value])

  const applyAction = (action: ToolbarAction) => {
    const input = textareaRef.current
    if (!input) return

    const result = action.run(input, value)
    onChange(result.nextValue)
    setTab("write")

    requestAnimationFrame(() => {
      textareaRef.current?.focus()
      if (typeof result.selectionStart === "number" && typeof result.selectionEnd === "number") {
        textareaRef.current?.setSelectionRange(result.selectionStart, result.selectionEnd)
      }
    })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <label className="text-xs uppercase font-bold tracking-widest text-muted-foreground block">{label}</label>
        <div className="flex self-start border text-xs">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`px-3 py-1 ${tab === "write" ? "bg-foreground text-background" : "bg-background"}`}
          >
            Raw
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`px-3 py-1 border-l ${tab === "preview" ? "bg-foreground text-background" : "bg-background"}`}
          >
            Preview
          </button>
        </div>
      </div>

      {helpText && <p className="text-xs text-muted-foreground mb-2">{helpText}</p>}

      <div className="flex flex-wrap gap-2 mb-3 rounded-md border bg-background/60 p-2">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            title={action.title}
            onClick={() => applyAction(action)}
            className="border px-3 py-1.5 text-xs font-medium bg-background hover:border-foreground transition-colors rounded-sm"
          >
            {action.label}
          </button>
        ))}
      </div>

      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          rows={rows}
          className="w-full min-h-[320px] resize-y border p-4 bg-background outline-none font-mono text-sm leading-7"
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <div className="min-h-[320px] border bg-background p-5 prose prose-neutral max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 overflow-auto">
          {hasContent ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-sm text-muted-foreground">Preview will appear here.</p>
          )}
        </div>
      )}
    </div>
  )
}
