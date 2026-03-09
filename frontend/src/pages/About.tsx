import SkillProfile from "../components/SkillProfile"
import { useTitle } from "../hooks/useTitle"

export default function About() {
  useTitle("About")
  const coreSkills = [
    { name: "Solidworks", level: 5 },
    { name: "Rhinoceros", level: 5 },
    { name: "Blender", level: 4 },
    { name: "Autocad", level: 4 },
    { name: "Illustrator", level: 4 },
    { name: "Photoshop", level: 3 },
    { name: "Fusion360", level: 3 },
    { name: "DaVinci Resolve", level: 3 },
  ] as const

  const otherSkills = [
    "Creo Parametric",
    "Vray",
    "Grasshopper",
    "Figma"
  ]

  return (
    <div className="container mx-auto px-6 sm:px-10 lg:px-16 pt-24 lg:pt-32 pb-24 max-w-5xl">

      {/* Header — Name + Info */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-16 border-b border-border pb-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
          Achmad Safain
        </h1>
        <div className="text-sm text-muted-foreground text-right leading-relaxed whitespace-nowrap">
          <div>18/04/2000</div>
          <div>Agrigento, Sicily</div>
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
              <div>missinnio51@gmail.com</div>
              <div>+39 3348355174</div>
              <div>insta: @emmecinquantuno</div>
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
                Born in Sicily, I'm constantly driven by an irrepressible nature for research and
                design, as well as a deep bond with the landscapes and culture of the island.
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
                  <h4 className="font-bold text-sm">Master of Science in Design & Engineering</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">Politecnico di Milano</p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">23/24 - Today</span>
              </div>
              <div className="flex justify-between items-baseline gap-4">
                <div>
                  <h4 className="font-bold text-sm">Bachelor in Industrial Design 110L/110</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">Università degli Studi di Palermo</p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">19/20 - 22/23</span>
              </div>
            </div>
          </section>

          {/* Languages */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Languages</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm">Italian</h4>
                <p className="text-muted-foreground text-sm">Native language</p>
              </div>
              <div>
                <h4 className="font-bold text-sm">English</h4>
                <p className="text-muted-foreground text-sm">ESOL International level C2</p>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}
