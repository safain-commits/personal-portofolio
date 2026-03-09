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
    <div className="pt-24 lg:pt-32 pb-24 max-w-2xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8">Contact</h1>
      
      {success ? (
        <div className="p-8 border border-border bg-muted/30 text-center space-y-4">
          <h2 className="text-2xl font-bold">Message Sent</h2>
          <p className="text-muted-foreground">
            Thank you for reaching out. I'll get back to you as soon as possible.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-4 underline underline-offset-4 font-semibold"
          >
            Send another message
          </button>
        </div>
      ) : (
        <>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            Have a project in mind or want to explore an interdisciplinary approach together?
            Let's connect.
          </p>
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label htmlFor="name" className="text-sm font-semibold tracking-wide uppercase">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                required
                className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-foreground transition-colors text-lg"
                placeholder="Your name"
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-semibold tracking-wide uppercase">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                required
                className="w-full border-b border-border bg-transparent py-2 focus:outline-none focus:border-foreground transition-colors text-lg"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="message" className="text-sm font-semibold tracking-wide uppercase">Message</label>
              <textarea 
                id="message" 
                name="message"
                required
                rows={4}
                className="w-full border border-border bg-transparent p-4 focus:outline-none focus:border-foreground transition-colors resize-none text-lg mt-2"
                placeholder="How can I help you?"
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary text-primary-foreground px-8 py-4 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 w-full sm:w-auto min-w-[200px]"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
