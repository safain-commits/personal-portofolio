import { Link } from "react-router-dom"
import SEO from "../components/SEO"
import SkillProfile from "../components/SkillProfile"
import { SITE_BRAND, SITE_URL } from "../lib/seo"

export default function About() {
  const coreSkills = [
    { name: "Autodesk Inventor", level: 5 },
    { name: "AutoCAD", level: 5 },
    { name: "Blender", level: 4 },
    { name: "SolidWorks", level: 4 },
    { name: "Adobe Illustrator", level: 4 },
    { name: "Adobe Photoshop", level: 3 },
    { name: "Fusion 360", level: 3 },
    { name: "DaVinci Resolve", level: 3 },
  ] as const

  const otherSkills = [
    "SketchUp",
    "Ansys",
    "STAAD.Pro",
    "Navisworks"
  ]

  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-16 pt-24 lg:pt-32 pb-24 max-w-5xl">
      <SEO
        title="About"
        description="Learn more about Safain, the personal brand of Achmad Safain, a mechanical drafter, engineering support professional, and 3D CAD modeler with experience in cement plant documentation, technical drafting, structural support work, and fabrication-oriented design communication."
        path="/about"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Achmad Safain (Safain)",
          url: `${SITE_URL}/about`,
          mainEntity: {
            "@type": "Person",
            name: "Achmad Safain",
            alternateName: [
              "Safain",
              "Safain A.",
              "LinearSAF"
            ],
            url: SITE_URL,
            jobTitle: "Mechanical Drafter, Engineering Support & 3D CAD Modeler",
            alumniOf: [
              "Universitas Terbuka",
              "Indonesian Institute of the Arts, Surakarta",
              "UPN Veteran Jawa Timur"
            ]
          }
        }}
      />

      <div className="flex flex-col gap-4 mb-16 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
            Achmad Safain
          </h1>
          <p className="mt-2 text-xs sm:text-sm uppercase tracking-[0.28em] font-semibold text-muted-foreground">
            {SITE_BRAND} • LinearSAF
          </p>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Mechanical Drafter, Engineering Support &amp; 3D CAD Modeler
          </p>
        </div>
        <div className="text-sm text-muted-foreground text-right leading-relaxed whitespace-nowrap">
          <div>Tuban, Jawa Timur</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.618fr] gap-16 lg:gap-24">
        <div className="space-y-16">
          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Skills</h2>
            <div className="space-y-2">
              {coreSkills.map(skill => (
                <SkillProfile
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                />
              ))}
            </div>

            <div className="mt-6 pt-4">
              <h3 className="font-bold text-sm mb-1">Analysis & Supporting Tools</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {otherSkills.join(", ")}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Contacts</h2>
            <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <div>a_sfn@live.com</div>
              <div>+62 822 6666 3336</div>
              <div><a href="https://www.linkedin.com/in/achmad-safain/" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a></div>
              <div>Instagram: @hy_saf</div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Curriculum Vitae</h2>
            <div className="border border-border/60 bg-muted/20 p-5 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Need a formal one-page version? Open the print-ready CV for a concise overview of my drafting scope, engineering support experience, software stack, and selected technical highlights.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/cv"
                  className="inline-flex items-center gap-2 border border-foreground px-4 py-2 text-sm font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
                >
                  View Curriculum Vitae (EN)
                </Link>
                <Link
                  to="/cv/id"
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm font-semibold uppercase tracking-widest hover:bg-muted transition-colors"
                >
                  View Curriculum Vitae (ID)
                </Link>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Professional Overview</h2>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-4">
              <p>
                I work in mechanical drafting, engineering support, and 3D CAD modeling, primarily for cement plant documentation and execution needs.
                My day-to-day work includes technical drawings, shop drawings, as-built drawings, and visual documentation used for fabrication,
                internal review, presentations, and site execution.
              </p>
              <p>
                Online, my work is often referenced under the names Safain or LinearSAF, alongside my full name Achmad Safain. This site brings those identities together into one technical portfolio focused on practical engineering communication.
              </p>
              <p>
                My experience covers RMK-related equipment and supporting structures across raw mill, coal mill, kiln, preheater,
                and steel bridge connections between plant buildings. I also contribute to selected analysis and simulation tasks,
                including FEA studies and structural checks using STAAD.Pro when required.
              </p>
              <p>
                I aim to produce documentation that is clear, practical, and ready to support coordination in real field conditions.
                The focus is not only visual clarity, but also technical usefulness for fabrication, installation, and implementation.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Education</h2>
            <div className="space-y-5">
              <div className="flex justify-between items-baseline gap-4">
                <div>
                  <h4 className="font-bold text-sm">Bachelor in Data Science</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">Universitas Terbuka, Surabaya</p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">2025 – Present</span>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <div>
                  <h4 className="font-bold text-sm">Bachelor in Interior Design</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">Indonesian Institute of the Arts, Surakarta</p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">2014 – 2020</span>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <div>
                  <h4 className="font-bold text-sm">Bachelor in Informatics Engineering</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">UPN Veteran Jawa Timur, Surabaya</p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">2011 – 2015</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Languages</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm">Indonesian</h4>
                <p className="text-muted-foreground text-sm">Native</p>
              </div>
              <div>
                <h4 className="font-bold text-sm">English</h4>
                <p className="text-muted-foreground text-sm">Working proficiency (B1)</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
