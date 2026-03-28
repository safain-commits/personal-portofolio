import SkillProfile from "../components/SkillProfile"
import { useTitle } from "../hooks/useTitle"

export default function About() {
  useTitle("About")
  const coreSkills = [
    { name: "Autodesk Inventor", level: 5 },
    { name: "Autodesk AutoCAD", level: 5 },
    { name: "Blender", level: 4 },
    { name: "Solidworks", level: 4 },
    { name: "Adobe Illustrator", level: 4 },
    { name: "Adobe Photoshop", level: 3 },
    { name: "Autodesk Fusion 360", level: 3 },
    { name: "DaVinci Resolve", level: 3 },
  ] as const

  const otherSkills = [
    "SketchUp",
    "Ansys",
    "Staad.PRO",
    "Navisworks"
  ]

  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-16 pt-24 lg:pt-32 pb-24 max-w-5xl">

      {/* Header — Name + Info */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-16 border-b border-border pb-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
          Achmad Safain
        </h1>
        <div className="text-sm text-muted-foreground text-right leading-relaxed whitespace-nowrap">
          <div>29/06/1991</div>
          <div>Tuban, Jawa Timur</div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.618fr] gap-16 lg:gap-24">

        {/* Left Column — Skills + Contacts */}
        <div className="space-y-16">
          {/* Skills */}
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
              <h3 className="font-bold text-sm mb-1">Others:</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {otherSkills.join(", ")}
              </p>
            </div>
          </section>

          {/* Contacts */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Contacts</h2>
            <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
              <div>a_sfn@live.com</div>
              <div>+62 822 6666 3336</div>
              <div>insta: @hy_saf</div>
            </div>
          </section>
        </div>

        {/* Right Column — About + Education + Languages */}
        <div className="space-y-16">
          {/* About */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">About</h2>
            <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
              <p>
                As a seasoned Mechanical Drafter and Industrial Designer,
                I specialize in crafting comprehensive CAD technical drafts and developing high-fidelity 3D models.
              </p>
              <p>
                I love to delve deeper, explore, focus on interdisciplinarity to approach problems
                critically. Dedicated to knowledge and affection, I occasionally break with chess.
              </p>
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Education</h2>
            <div className="space-y-5">
              <div className="flex justify-between items-baseline gap-4">
                <div>
                  <h4 className="font-bold text-sm">Bachelor of Data Science</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">Universitas Terbuka, Surabaya</p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">25/26 - Today</span>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <div>
                  <h4 className="font-bold text-sm">Bachelor in Interior Design</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">Indonesian Institute of the Arts, Surakarta</p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">14/15 - 19/20</span>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <div>
                  <h4 className="font-bold text-sm">Bachelor in Informatics Engineering</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">UPN Veteran Jawa Timur, Surabaya</p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">11/12 - 14/15</span>
              </div>
            </div>
          </section>

          {/* Languages */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Languages</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm">Indonesian</h4>
                <p className="text-muted-foreground text-sm">Native language</p>
              </div>
              <div>
                <h4 className="font-bold text-sm">English</h4>
                <p className="text-muted-foreground text-sm">B1 English level</p>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}
