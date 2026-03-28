import { useState } from "react"
import { submitContactForm } from "../lib/api"
import { useTitle } from "../hooks/useTitle"

export default function Contact() {
  useTitle("Contact")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await submitContactForm(data)
      if (res.success) {
        setSuccess(true)
      } else {
        alert(res.error || "Failed to send message")
      }
    } catch {
      alert("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 lg:pt-32 pb-24 max-w-7xl mx-auto px-4 lg:px-8">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-16">Contact</h1>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Left Column (Golden Ratio: ~61.8%) - Form */}
        <div className="w-full lg:w-[61.8%]">
          {success ? (
            <div className="p-12 border border-border bg-muted/30 text-center space-y-4 rounded-sm">
              <h2 className="text-2xl font-bold">Message Sent</h2>
              <p className="text-muted-foreground text-lg">
                Thank you for reaching out. I'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 underline underline-offset-8 font-semibold uppercase tracking-widest text-sm"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-2xl">
                Have a project in mind or want to explore an interdisciplinary approach together?
                Let's connect.
              </p>

              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <label htmlFor="name" className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full border-b border-border bg-transparent py-3 focus:outline-none focus:border-foreground transition-colors text-xl font-medium"
                    placeholder="Your name"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-4">
                  <label htmlFor="email" className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full border-b border-border bg-transparent py-3 focus:outline-none focus:border-foreground transition-colors text-xl font-medium"
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-4">
                  <label htmlFor="message" className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full border border-border bg-transparent p-5 focus:outline-none focus:border-foreground transition-colors resize-none text-xl font-medium mt-2"
                    placeholder="How can I help you?"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-foreground text-background px-10 py-5 font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-50 w-full sm:w-auto min-w-[200px]"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Right Column (Golden Ratio: ~38.2%) - Direct Contact */}
        <div className="w-full lg:w-[38.2%]">
          <div className="sticky top-32 border-t border-border pt-8 lg:border-t-0 lg:pt-0">
            <h2 className="text-2xl font-bold tracking-tighter mb-10">Direct Contact</h2>
            <div className="flex flex-col space-y-10">
              <div className="group">
                <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">Email</span>
                <a href="mailto:a_sfn@live.com" className="text-xl font-medium hover:text-muted-foreground transition-colors underline-offset-4 decoration-border/50 group-hover:underline">
                  a_sfn@live.com
                </a>
              </div>
              <div className="group">
                <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">WhatsApp</span>
                <a href="https://wa.me/6282266663336" target="_blank" rel="noopener noreferrer" className="text-xl font-medium hover:text-muted-foreground transition-colors underline-offset-4 decoration-border/50 group-hover:underline">
                  +62 822 6666 3336
                </a>
              </div>
              <div className="group">
                <span className="block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">Instagram</span>
                <a href="https://instagram.com/linearsaf" target="_blank" rel="noopener noreferrer" className="text-xl font-medium hover:text-muted-foreground transition-colors underline-offset-4 decoration-border/50 group-hover:underline">
                  @linearSAF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
