import { useState } from "react"
import SEO from "../components/SEO"
import { submitContactForm } from "../lib/api"
import { SITE_BRAND } from "../lib/seo"

type FormState = {
  name: string
  email: string
  message: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  message: "",
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateForm = (values: FormState): FormErrors => {
  const errors: FormErrors = {}

  if (!values.name.trim()) {
    errors.name = "Please tell me your name."
  }

  if (!values.email.trim()) {
    errors.email = "An email address is required so I can reply."
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Please enter a valid email address."
  }

  if (!values.message.trim()) {
    errors.message = "Please share a short brief or question."
  } else if (values.message.trim().length < 20) {
    errors.message = "A bit more detail helps me respond usefully."
  }

  return errors
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value
    setForm((current) => ({ ...current, [field]: value }))
    setStatus(null)

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nextErrors = validateForm(form)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus({
        type: "error",
        message: "Please check the highlighted fields and try again.",
      })
      return
    }

    setLoading(true)
    setErrors({})
    setStatus(null)

    try {
      const res = await submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })

      if (res.success) {
        setSuccess(true)
        setForm(INITIAL_FORM)
        setStatus({
          type: "success",
          message: "Message sent successfully.",
        })
      } else {
        setStatus({
          type: "error",
          message: res.error || "Message failed to send. Please try again.",
        })
      }
    } catch {
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSuccess(false)
    setErrors({})
    setStatus(null)
    setForm(INITIAL_FORM)
  }

  return (
    <div className="pt-24 lg:pt-32 pb-24 max-w-7xl mx-auto px-4 lg:px-8">
      <SEO
        title="Contact"
        description="Get in touch with Achmad Safain, also known as Safain, for mechanical drafting, industrial design, 3D modeling, and engineering-focused collaboration or freelance inquiries."
        path="/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Achmad Safain (Safain)",
          url: "https://linearsaf.com/contact"
        }}
      />

      <div className="max-w-3xl space-y-6 mb-16">
        <p className="text-xs font-bold tracking-[0.28em] uppercase text-muted-foreground">
          Contact Intake
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">Contact</h1>
        <p className="text-xs font-bold tracking-[0.28em] uppercase text-muted-foreground">
          {SITE_BRAND} • Achmad Safain
        </p>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
          For technical drafting, 3D CAD modeling, engineering support, or fabrication-oriented documentation, send a concise brief here and I&apos;ll reply with the most practical next step.
        </p>
      </div>

      <div className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-20">
        <section className="w-full">
          <div className="border border-border bg-background">
            {success ? (
              <div className="p-8 md:p-12 space-y-6">
                <p className="text-xs font-bold tracking-[0.24em] uppercase text-muted-foreground">
                  Message Sent
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Thanks, your inquiry is in.
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl">
                  Your message has been delivered and recorded. If your inquiry is time-sensitive, you can also reach out directly by email or WhatsApp while I review the brief.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <a
                    href="mailto:a_sfn@live.com"
                    className="border border-border px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] hover:bg-muted/40 transition-colors text-center"
                  >
                    Email Directly
                  </a>
                  <a
                    href="https://wa.me/6282266663336"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-border px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] hover:bg-muted/40 transition-colors text-center"
                  >
                    Open WhatsApp
                  </a>
                </div>
                <button
                  onClick={resetForm}
                  className="underline underline-offset-8 font-semibold uppercase tracking-widest text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="p-8 md:p-12">
                <div className="border-b border-border pb-6 mb-8">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                        Best For
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Project briefs, freelance inquiries, collaboration requests, and technical scope discussions.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                        Helpful Detail
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Share the type of work, timeline, and any drawings, models, or fabrication context you already have.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-[0.22em] uppercase text-muted-foreground mb-2">
                        Response Style
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Clear, practical, and grounded in what can realistically move your project forward.
                      </p>
                    </div>
                  </div>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                  <div
                    aria-live="polite"
                    className={
                      status
                        ? status.type === "error"
                          ? "border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                          : "border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                        : "sr-only"
                    }
                  >
                    {status?.message || "Form status"}
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="name" className="text-sm font-bold tracking-widest uppercase text-muted-foreground">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange("name")}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : "name-help"}
                      className="w-full border-b border-border bg-transparent py-3 focus:outline-none focus:border-foreground transition-colors text-lg md:text-xl font-medium"
                      placeholder="Your name or company"
                      disabled={loading}
                    />
                    <p id="name-help" className="text-sm text-muted-foreground">
                      A personal name is enough. Company or team name is optional.
                    </p>
                    {errors.name && (
                      <p id="name-error" className="text-sm text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="email" className="text-sm font-bold tracking-widest uppercase text-muted-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : "email-help"}
                      className="w-full border-b border-border bg-transparent py-3 focus:outline-none focus:border-foreground transition-colors text-lg md:text-xl font-medium"
                      placeholder="your@email.com"
                      disabled={loading}
                    />
                    <p id="email-help" className="text-sm text-muted-foreground">
                      This is where I&apos;ll send the reply.
                    </p>
                    {errors.email && (
                      <p id="email-error" className="text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="message" className="text-sm font-bold tracking-widest uppercase text-muted-foreground">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange("message")}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "message-error" : "message-help"}
                      rows={6}
                      className="w-full border border-border bg-transparent p-5 focus:outline-none focus:border-foreground transition-colors resize-y text-lg md:text-xl font-medium"
                      placeholder="Tell me what you need, your timeline, and any relevant context."
                      disabled={loading}
                    />
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:justify-between">
                      <p id="message-help">
                        A good brief usually includes scope, timeline, and desired output.
                      </p>
                      <p>{form.message.trim().length} characters</p>
                    </div>
                    {errors.message && (
                      <p id="message-error" className="text-sm text-red-600">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-relaxed text-muted-foreground max-w-xl">
                      Prefer a faster back-and-forth? Use WhatsApp for urgent coordination and this form for detailed briefs.
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-foreground text-background px-10 py-5 font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-50 w-full sm:w-auto min-w-[220px]"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>

        <aside className="w-full">
          <div className="sticky top-32 border border-border bg-muted/20 p-8 md:p-10">
            <h2 className="text-2xl font-bold tracking-tighter mb-4">Direct Contact</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-8">
              Use the channel that matches the pace of your inquiry. The form is best for structured project requests. Direct channels are ideal when you already know the context.
            </p>

            <div className="flex flex-col space-y-8">
              <div className="group border-t border-border pt-6 first:border-t-0 first:pt-0">
                <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
                  Email
                </span>
                <a
                  href="mailto:a_sfn@live.com"
                  className="text-lg font-medium hover:text-muted-foreground transition-colors underline-offset-4 decoration-border/50 group-hover:underline break-all"
                >
                  a_sfn@live.com
                </a>
                <p className="mt-2 text-sm text-muted-foreground">
                  Best for detailed requirements, attachments, and professional follow-up.
                </p>
              </div>

              <div className="group border-t border-border pt-6">
                <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
                  WhatsApp
                </span>
                <a
                  href="https://wa.me/6282266663336"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium hover:text-muted-foreground transition-colors underline-offset-4 decoration-border/50 group-hover:underline"
                >
                  +62 822 6666 3336
                </a>
                <p className="mt-2 text-sm text-muted-foreground">
                  Best for quick coordination, timeline checks, and urgent project updates.
                </p>
              </div>

              <div className="group border-t border-border pt-6">
                <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
                  Instagram
                </span>
                <a
                  href="https://instagram.com/linearsaf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium hover:text-muted-foreground transition-colors underline-offset-4 decoration-border/50 group-hover:underline"
                >
                  @linearSAF
                </a>
                <p className="mt-2 text-sm text-muted-foreground">
                  Best for lighter introductions and portfolio-first conversations.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
