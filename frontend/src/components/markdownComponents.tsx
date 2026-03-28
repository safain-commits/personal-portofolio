import type { Components } from "react-markdown"

const getAlignmentClass = (align?: string) => {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

const resolveAlign = (node: any, align?: string) => align || node?.properties?.align || undefined

export const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="text-3xl font-bold tracking-tight mt-8 mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-bold tracking-tight mt-6 mb-3">{children}</h3>,
  p: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="my-4 ml-6 list-outside list-disc space-y-2 marker:text-foreground">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 ml-6 list-outside list-decimal space-y-2 marker:text-foreground">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-relaxed [&>input]:mr-2 [&>input]:align-middle [&>input]:accent-foreground">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-blue-600 underline underline-offset-4 hover:text-blue-700 break-words"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-foreground/20 pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="my-5 overflow-x-auto rounded-md border border-border bg-muted px-4 py-3 text-sm leading-6">
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code className={className ? "font-mono text-[0.9em]" : "rounded bg-muted px-1.5 py-0.5 text-[0.9em] font-mono"}>
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border bg-background/80 shadow-sm">
      <table className="min-w-full border-separate border-spacing-0 text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/90 text-foreground">{children}</thead>,
  tbody: ({ children }) => <tbody className="bg-background/70">{children}</tbody>,
  tr: ({ children, node }: any) => {
    const isHeaderRow = node?.children?.some((child: any) => child?.tagName === 'th')
    return (
      <tr
        className={isHeaderRow
          ? "[&>*:not(:last-child)]:border-r border-border"
          : "odd:bg-background even:bg-muted/35 [&:not(:last-child)>*]:border-b [&>*:not(:last-child)]:border-r border-border transition-colors"
        }
      >
        {children}
      </tr>
    )
  },
  th: ({ children, node, ...props }: any) => {
    const align = resolveAlign(node, props.align)
    return (
      <th className={`bg-muted px-4 py-3 font-semibold text-foreground whitespace-nowrap ${getAlignmentClass(align)}`}>
        {children}
      </th>
    )
  },
  td: ({ children, node, ...props }: any) => {
    const align = resolveAlign(node, props.align)
    return (
      <td className={`px-4 py-3 align-top text-muted-foreground ${getAlignmentClass(align)}`}>
        {children}
      </td>
    )
  },
  input: ({ checked, ...props }) => (
    <input
      {...props}
      checked={checked}
      disabled
      type="checkbox"
      className="h-4 w-4 rounded border-border accent-foreground"
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
}
