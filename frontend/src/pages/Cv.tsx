import { Link, useLocation } from "react-router-dom"
import { ArrowLeft, Printer } from "lucide-react"
import SEO from "../components/SEO"
import { SITE_URL } from "../lib/seo"

const profilePhotoUrl = "/img/cv-profile-3x4.jpg"

type Locale = "en" | "id"

type ExperienceItem = {
  period: string
  title: string
  company: string
  bullets: string[]
}

type EducationItem = {
  degree: string
  institution: string
  period: string
}

type HighlightItem = {
  title: string
  bullets: string[]
}

type Content = {
  seoTitle: string
  seoDescription: string
  pageEyebrow: string
  pageLead: string
  backLabel: string
  printLabel: string
  langEnglish: string
  langIndonesian: string
  title: string
  role: string
  locationLabel: string
  intro: string
  coreExpertiseTitle: string
  softwareTitle: string
  additionalToolsTitle: string
  languagesTitle: string
  summaryTitle: string
  workExperienceTitle: string
  projectExperienceTitle: string
  educationTitle: string
  strengthsTitle: string
  summaryPoints: string[]
  strengths: string[]
  coreSkills: string[]
  softwareSkills: string[]
  complementarySkills: string[]
  education: EducationItem[]
  workExperience: ExperienceItem[]
  highlights: HighlightItem[]
  languages: { name: string; level: string }[]
}

const localizedContent: Record<Locale, Content> = {
  en: {
    seoTitle: "Curriculum Vitae",
    seoDescription: "Professional CV of Achmad Safain, Mechanical Drafter, Engineering Support & 3D CAD Modeler, featuring cement plant drafting scope, 3D modeling, structural support work, and selected technical experience.",
    pageEyebrow: "Curriculum Vitae",
    pageLead: "Professional CV — print-ready A4",
    backLabel: "Back to About",
    printLabel: "Print CV",
    langEnglish: "English",
    langIndonesian: "Bahasa Indonesia",
    title: "Achmad Safain",
    role: "Mechanical Drafter, Engineering Support & 3D CAD Modeler",
    locationLabel: "East Java, Indonesia",
    intro: "Mechanical drafting and engineering support professional with cement plant experience across technical documentation, 3D CAD modeling, structural support work, and fabrication-aware design communication.",
    coreExpertiseTitle: "Core Expertise",
    softwareTitle: "Primary Software",
    additionalToolsTitle: "Analysis & Supporting Tools",
    languagesTitle: "Languages",
    summaryTitle: "Professional Summary",
    workExperienceTitle: "Work Experience",
    projectExperienceTitle: "Selected Technical Experience",
    educationTitle: "Education",
    strengthsTitle: "Professional Strengths",
    summaryPoints: [
      "Prepared technical drawings and 3D models for plant-related mechanical work, supporting fabrication, internal approval, presentations, and site execution.",
      "Experienced in mechanical drafting for cement plant equipment in the RMK area, including raw mill, coal mill, kiln, preheater, supporting steel structures, and connecting steel bridges between plant buildings.",
      "Delivering around 50 drawings per year using Autodesk Inventor and AutoCAD as primary daily tools, with additional capability in FEA, steel structure simulation with STAAD.Pro, and practical field-oriented engineering support.",
    ],
    strengths: [
      "Strong drafting discipline for fabrication-ready, site-aware documentation.",
      "Comfortable translating field constraints into clear technical outputs.",
      "Able to work across mechanical drafting, structural support work, and 3D CAD modeling.",
      "Combines plant practicality, visual clarity, and engineering communication.",
    ],
    coreSkills: [
      "Mechanical Drafting",
      "Engineering Support",
      "3D CAD Modeling",
      "Technical Drawing",
      "Shop Drawing & As-Built Drawing",
      "Fabrication-Oriented Documentation",
    ],
    softwareSkills: [
      "Autodesk Inventor",
      "AutoCAD",
      "Blender",
      "SolidWorks",
      "Adobe Illustrator",
      "Adobe Photoshop",
    ],
    complementarySkills: [
      "STAAD.Pro",
      "FEA Simulation",
      "Structural Steel Simulation",
      "SketchUp",
      "Ansys",
      "Navisworks",
    ],
    education: [
      {
        degree: "Bachelor in Data Science",
        institution: "Universitas Terbuka, Surabaya",
        period: "2025 – Present",
      },
      {
        degree: "Bachelor in Interior Design",
        institution: "Indonesian Institute of the Arts, Surakarta",
        period: "2014 – 2020",
      },
      {
        degree: "Bachelor in Informatics Engineering",
        institution: "UPN Veteran Jawa Timur, Surabaya",
        period: "2011 – 2015",
      },
    ],
    workExperience: [
      {
        period: "2021 – Present",
        title: "Mechanical Drafter & Engineering Support",
        company: "PT. SJU (contractor assignment at PT. SBI Cement Plant, Tuban)",
        bullets: [
          "Produce technical drawings, 3D models, shop drawings, and as-built drawings for plant-related mechanical and structural work.",
          "Support RMK area work covering raw mill, coal mill, kiln, preheater, supporting structures, and steel bridge connections between buildings.",
          "Prepare drawing packages for fabrication, internal approval, presentations, and site execution, with an average output of around 50 drawings per year.",
          "Use Autodesk Inventor and AutoCAD as primary daily software, while also contributing simulation-oriented work through FEA and STAAD.Pro when needed.",
        ],
      },
      {
        period: "2020 – 2021",
        title: "Mechanical Fitter",
        company: "PT. SJU (contractor assignment at PT. SBI Cement Plant, Tuban)",
        bullets: [
          "Handled hands-on mechanical fitting work in an industrial cement plant environment.",
          "Built practical understanding of installation conditions, maintenance access, execution constraints, and how field realities should inform technical drawings.",
        ],
      },
      {
        period: "2017 – 2020",
        title: "Freelance Full-Stack Website Developer",
        company: "Independent / Freelance",
        bullets: [
          "Developed websites with both front-end and back-end implementation responsibilities for freelance projects.",
          "Built a strong foundation in structured problem-solving, digital tooling, and project-based delivery that continues to support technical work today.",
        ],
      },
    ],
    highlights: [
      {
        title: "Mechanical Drafting for Cement Plant Equipment",
        bullets: [
          "Prepared drafting outputs and 3D models for raw mill, coal mill, kiln equipment, and preheater-related work in the RMK area.",
          "Supported documentation needs for mechanical modifications, fabrication preparation, and execution coordination in plant conditions.",
        ],
      },
      {
        title: "Structural & AFR Project Support",
        bullets: [
          "Contributed to a major non-fossil fuel material (AFR) project from design stage through shop drawings up to as-built documentation.",
          "Also worked on multiple steel bridge projects connecting buildings inside the cement plant, including structural drafting and support documentation.",
        ],
      },
      {
        title: "3D Modeling & Engineering Simulation Contribution",
        bullets: [
          "Contributed 3D modeling and engineering simulation work for kiln splined tyre replacement using a kiln cutting method.",
          "Used FEA and steel structure simulation tools, including STAAD.Pro, to support technical understanding and engineering communication.",
        ],
      },
    ],
    languages: [
      { name: "Indonesian", level: "Native" },
      { name: "English", level: "Working proficiency (B1)" },
    ],
  },
  id: {
    seoTitle: "Curriculum Vitae Bahasa Indonesia",
    seoDescription: "CV profesional Achmad Safain sebagai Mechanical Drafter, Engineering Support & 3D CAD Modeler, mencakup scope drafting di cement plant, pemodelan 3D, pekerjaan struktur, dan sorotan pengalaman teknis.",
    pageEyebrow: "Curriculum Vitae",
    pageLead: "Versi Bahasa Indonesia — siap cetak A4",
    backLabel: "Kembali ke About",
    printLabel: "Cetak CV",
    langEnglish: "English",
    langIndonesian: "Bahasa Indonesia",
    title: "Achmad Safain",
    role: "Mechanical Drafter, Engineering Support & 3D CAD Modeler",
    locationLabel: "Jawa Timur, Indonesia",
    intro: "Profesional mechanical drafting dan engineering support dengan pengalaman di lingkungan cement plant, mencakup dokumentasi teknis, pemodelan CAD 3D, pekerjaan struktur pendukung, dan komunikasi desain yang berorientasi fabrikasi.",
    coreExpertiseTitle: "Keahlian Inti",
    softwareTitle: "Software Utama",
    additionalToolsTitle: "Tools Analisis & Pendukung",
    languagesTitle: "Bahasa",
    summaryTitle: "Ringkasan Profesional",
    workExperienceTitle: "Pengalaman Kerja",
    projectExperienceTitle: "Sorotan Pengalaman Teknis",
    educationTitle: "Pendidikan",
    strengthsTitle: "Kekuatan Profesional",
    summaryPoints: [
      "Menyusun gambar teknis dan model 3D untuk pekerjaan mekanikal terkait plant, yang digunakan untuk fabrikasi, approval internal, presentasi, dan site execution.",
      "Berpengalaman dalam mechanical drafting untuk equipment cement plant di area RMK, termasuk raw mill, coal mill, kiln, preheater, struktur baja pendukung, serta jembatan baja penghubung antar building di plant.",
      "Menghasilkan sekitar 50 drawing per tahun dengan Autodesk Inventor dan AutoCAD sebagai software harian utama, serta memiliki kapabilitas tambahan dalam simulasi FEA, simulasi struktur baja dengan STAAD.Pro, dan engineering support yang dekat dengan kebutuhan lapangan.",
    ],
    strengths: [
      "Disiplin drafting yang kuat untuk dokumentasi yang siap fabrikasi dan relevan dengan kondisi site.",
      "Terbiasa menerjemahkan constraint lapangan menjadi output teknis yang jelas.",
      "Mampu bekerja lintas mechanical drafting, pekerjaan struktur pendukung, dan pemodelan CAD 3D.",
      "Menggabungkan kepraktisan plant, kejelasan visual, dan komunikasi engineering.",
    ],
    coreSkills: [
      "Mechanical Drafting",
      "Engineering Support",
      "3D CAD Modeling",
      "Technical Drawing",
      "Shop Drawing & As-Built Drawing",
      "Dokumentasi Berorientasi Fabrikasi",
    ],
    softwareSkills: [
      "Autodesk Inventor",
      "AutoCAD",
      "Blender",
      "SolidWorks",
      "Adobe Illustrator",
      "Adobe Photoshop",
    ],
    complementarySkills: [
      "STAAD.Pro",
      "Simulasi FEA",
      "Simulasi Struktur Baja",
      "SketchUp",
      "Ansys",
      "Navisworks",
    ],
    education: [
      {
        degree: "S1 Sains Data",
        institution: "Universitas Terbuka, Surabaya",
        period: "2025 – Sekarang",
      },
      {
        degree: "S1 Desain Interior",
        institution: "Institut Seni Indonesia Surakarta",
        period: "2014 – 2020",
      },
      {
        degree: "S1 Teknik Informatika",
        institution: "UPN Veteran Jawa Timur, Surabaya",
        period: "2011 – 2015",
      },
    ],
    workExperience: [
      {
        period: "2021 – Sekarang",
        title: "Mechanical Drafter & Engineering Support",
        company: "PT. SJU (penugasan kontraktor di PT. SBI Cement Plant, Tuban)",
        bullets: [
          "Menyusun gambar teknis, model 3D, shop drawing, dan as-built drawing untuk pekerjaan mekanikal maupun struktur pendukung di area plant.",
          "Mendukung pekerjaan di area RMK yang mencakup raw mill, coal mill, kiln, preheater, struktur pendukung, dan jembatan baja penghubung antar bangunan.",
          "Menyiapkan paket drawing untuk kebutuhan fabrikasi, approval internal, presentasi, dan site execution, dengan output rata-rata sekitar 50 drawing per tahun.",
          "Menggunakan Autodesk Inventor dan AutoCAD sebagai software harian utama, serta turut mengerjakan simulasi melalui FEA dan STAAD.Pro saat diperlukan.",
        ],
      },
      {
        period: "2020 – 2021",
        title: "Mechanical Fitter",
        company: "PT. SJU (penugasan kontraktor di PT. SBI Cement Plant, Tuban)",
        bullets: [
          "Menangani pekerjaan fitting mekanikal secara langsung di lingkungan industri semen.",
          "Pengalaman ini membangun pemahaman praktis terhadap kondisi instalasi, akses maintenance, constraint eksekusi, dan bagaimana realitas lapangan harus tercermin dalam gambar teknis.",
        ],
      },
      {
        period: "2017 – 2020",
        title: "Freelance Full-Stack Website Developer",
        company: "Mandiri / Freelance",
        bullets: [
          "Mengembangkan website dengan tanggung jawab implementasi front-end dan back-end untuk berbagai project freelance.",
          "Membangun fondasi kuat dalam problem-solving terstruktur, penggunaan tools digital, dan pola delivery berbasis project yang masih sangat membantu dalam pekerjaan teknis saat ini.",
        ],
      },
    ],
    highlights: [
      {
        title: "Mechanical Drafting untuk Equipment Cement Plant",
        bullets: [
          "Menyusun output drafting dan model 3D untuk raw mill, coal mill, kiln equipment, serta pekerjaan yang terkait area preheater pada area RMK.",
          "Dokumentasi tersebut mendukung kebutuhan modifikasi mekanikal, persiapan fabrikasi, dan koordinasi pelaksanaan kerja di lingkungan plant.",
        ],
      },
      {
        title: "Support Project Struktur & AFR",
        bullets: [
          "Berkontribusi pada project besar non-fossil fuel materials (AFR) sejak tahap desain, shop drawing, hingga as-built drawing.",
          "Juga mengerjakan berbagai project jembatan baja penghubung antar building di cement plant, termasuk drafting struktur dan dokumentasi pendukungnya.",
        ],
      },
      {
        title: "Kontribusi 3D Modeling & Simulasi Engineering",
        bullets: [
          "Memberikan kontribusi 3D modeling dan simulasi engineering pada project penggantian splined tyre kiln dengan metode pemotongan kiln.",
          "Menggunakan simulasi FEA dan simulasi struktur baja, termasuk dengan STAAD.Pro, untuk mendukung pemahaman teknis dan komunikasi engineering.",
        ],
      },
    ],
    languages: [
      { name: "Indonesia", level: "Bahasa ibu / native" },
      { name: "Inggris", level: "Kemampuan kerja (B1)" },
    ],
  },
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="cv-section-heading text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
      {children}
    </h2>
  )
}

export default function Cv() {
  const location = useLocation()
  const locale: Locale = location.pathname.startsWith("/cv/id") ? "id" : "en"
  const content = localizedContent[locale]
  const seoPath = locale === "id" ? "/cv/id" : "/cv"

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: locale === "id" ? "Curriculum Vitae Bahasa Indonesia — Achmad Safain" : "Curriculum Vitae — Achmad Safain",
    url: `${SITE_URL}${seoPath}`,
    mainEntity: {
      "@type": "Person",
      name: "Achmad Safain",
      url: SITE_URL,
      image: `${SITE_URL}${profilePhotoUrl}`,
      jobTitle: content.role,
      alumniOf: content.education.map(item => item.institution),
      knowsAbout: [
        ...content.coreSkills,
        ...content.softwareSkills,
      ],
      sameAs: [
        "https://www.linkedin.com/in/achmad-safain/",
        "https://www.instagram.com/hy_saf/"
      ]
    }
  }

  return (
    <div className="cv-page bg-zinc-100/70 px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      <SEO
        title={content.seoTitle}
        description={content.seoDescription}
        path={seoPath}
        structuredData={structuredData}
      />

      <style>{`
        .cv-page {
          background: #f4f4f5;
        }

        .dark .cv-page {
          background: #09090b;
        }

        .cv-sheet {
          --cv-paper: #ffffff;
          --cv-paper-muted: #fafafa;
          --cv-paper-soft: #f4f4f5;
          --cv-text: #18181b;
          --cv-text-muted: #52525b;
          --cv-border: #d4d4d8;
          background: var(--cv-paper) !important;
          color: var(--cv-text) !important;
          border-color: var(--cv-border) !important;
        }

        .cv-sheet h1,
        .cv-sheet h2,
        .cv-sheet h3,
        .cv-sheet p,
        .cv-sheet li,
        .cv-sheet span,
        .cv-sheet a {
          color: var(--cv-text);
        }

        .cv-sheet .cv-section-heading,
        .cv-sheet .cv-meta-grid,
        .cv-sheet .cv-meta-muted {
          color: var(--cv-text-muted) !important;
        }

        .cv-sheet .cv-link {
          color: var(--cv-text) !important;
          text-decoration: none;
          transition: color 0.2s ease, text-decoration-color 0.2s ease;
        }

        .cv-sheet .cv-link:hover {
          color: var(--cv-text-muted) !important;
          text-decoration: underline;
          text-underline-offset: 0.18em;
        }

        .cv-sheet .cv-accent-bar {
          background: #27272a !important;
        }

        .cv-sheet .cv-header,
        .cv-sheet .cv-sidebar,
        .cv-sheet .cv-card,
        .cv-sheet .cv-strength-card,
        .cv-sheet .cv-chip,
        .cv-sheet .cv-photo {
          border-color: var(--cv-border) !important;
        }

        .cv-sheet .cv-sidebar,
        .cv-sheet .cv-strength-card {
          background: var(--cv-paper-muted) !important;
        }

        .cv-sheet .cv-card,
        .cv-sheet .cv-chip {
          background: var(--cv-paper) !important;
        }

        .cv-sheet .cv-chip {
          color: var(--cv-text-muted) !important;
        }

        .cv-sheet .cv-bullet-dot {
          background: #3f3f46 !important;
        }

        @page {
          size: A4 portrait;
          margin: 10mm;
        }

        @media print {
          html, body {
            width: 210mm;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          header, footer {
            display: none !important;
          }

          body {
            background: #ffffff !important;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
          }

          .cv-page {
            padding: 0 !important;
            background: #ffffff !important;
          }

          .cv-screen-only {
            display: none !important;
          }

          .cv-sheet {
            width: 190mm !important;
            min-height: 277mm;
            box-shadow: none !important;
            border: 1px solid #a1a1aa !important;
            margin: 0 auto !important;
            max-width: none !important;
          }

          .cv-accent-bar {
            height: 2.6mm !important;
            background: #27272a !important;
          }

          .cv-header {
            padding: 7mm 8mm 6mm !important;
          }

          .cv-header-grid {
            display: grid !important;
            grid-template-columns: 1fr 36mm !important;
            gap: 6mm !important;
            align-items: start !important;
          }

          .cv-header-title {
            font-size: 20pt !important;
            line-height: 1 !important;
          }

          .cv-header-role {
            font-size: 10.5pt !important;
          }

          .cv-meta-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 1.5mm 5mm !important;
            font-size: 8.5pt !important;
            line-height: 1.35 !important;
          }

          .cv-intro {
            margin-top: 3.5mm !important;
            max-width: none !important;
            font-size: 8.8pt !important;
            line-height: 1.45 !important;
          }

          .cv-photo {
            width: 34mm !important;
          }

          .cv-body-grid {
            display: grid !important;
            grid-template-columns: 56mm 1fr !important;
          }

          .cv-sidebar {
            padding: 6mm !important;
            background: #f8f8f8 !important;
          }

          .cv-main {
            padding: 6mm !important;
          }

          .cv-section {
            margin-top: 4.6mm !important;
          }

          .cv-section:first-child {
            margin-top: 0 !important;
          }

          .cv-section-heading {
            font-size: 7.8pt !important;
            letter-spacing: 0.14em !important;
            padding-bottom: 1.2mm !important;
            border-bottom: 1px solid #d4d4d8 !important;
            color: #52525b !important;
          }

          .cv-copy,
          .cv-list,
          .cv-list li,
          .cv-card,
          .cv-strength-card,
          .cv-meta-grid,
          .cv-sidebar p,
          .cv-sidebar li {
            font-size: 8.4pt !important;
            line-height: 1.4 !important;
          }

          .cv-card {
            padding: 3mm !important;
            border: 1px solid #d4d4d8 !important;
            border-left: 1.2mm solid #3f3f46 !important;
            background: #ffffff !important;
          }

          .cv-chip {
            background: #f4f4f5 !important;
            border-color: #d4d4d8 !important;
            border-radius: 0 !important;
            font-size: 7pt !important;
            letter-spacing: 0.05em !important;
            text-transform: uppercase !important;
          }

          .cv-bullet-dot {
            width: 1.6mm !important;
            height: 1.6mm !important;
            margin-top: 2.2mm !important;
            background: #27272a !important;
          }

          .cv-strength-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 2mm !important;
          }

          .cv-strength-card {
            padding: 2.6mm !important;
            background: #fafafa !important;
            border-color: #d4d4d8 !important;
          }

          .cv-avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="cv-screen-only mx-auto mb-6 flex max-w-[210mm] flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{content.pageEyebrow}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">{content.pageLead}</h1>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft size={16} />
              {content.backLabel}
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              <Printer size={16} />
              {content.printLabel}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/cv"
            className={`inline-flex items-center justify-center border px-3 py-1.5 text-sm font-semibold transition-colors ${locale === "en" ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:bg-muted"}`}
          >
            {content.langEnglish}
          </Link>
          <Link
            to="/cv/id"
            className={`inline-flex items-center justify-center border px-3 py-1.5 text-sm font-semibold transition-colors ${locale === "id" ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:bg-muted"}`}
          >
            {content.langIndonesian}
          </Link>
        </div>
      </div>

      <article className="cv-sheet mx-auto max-w-[210mm] overflow-hidden border border-zinc-300/80 bg-background shadow-[0_18px_48px_rgba(0,0,0,0.06)] print:shadow-none">
        <div className="cv-accent-bar h-1.5 bg-zinc-800" />

        <div className="cv-header border-b border-zinc-300/80 px-6 py-6 md:px-8 md:py-7 lg:px-10">
          <div className="cv-header-grid grid gap-6 md:grid-cols-[1fr_170px] md:items-start">
            <div>
              <p className="cv-meta-muted text-[11px] font-semibold uppercase tracking-[0.24em]">{content.pageEyebrow}</p>
              <h1 className="cv-header-title mt-3 text-4xl font-black tracking-tight text-foreground sm:text-5xl">{content.title}</h1>
              <p className="cv-header-role mt-2 text-lg font-medium">{content.role}</p>

              <div className="cv-meta-grid mt-5 grid gap-2 text-sm leading-relaxed sm:grid-cols-2">
                <p>{content.locationLabel}</p>
                <p><a className="cv-link" href="mailto:a_sfn@live.com">a_sfn@live.com</a></p>
                <p><a className="cv-link" href="tel:+6282266663336">+62 822 6666 3336</a></p>
                <p><a className="cv-link" href={SITE_URL} target="_blank" rel="noreferrer">{SITE_URL.replace(/^https?:\/\//, "")}</a></p>
              </div>

              <p className="cv-intro mt-5 max-w-3xl text-sm leading-7">
                {content.intro}
              </p>
            </div>

            <div className="cv-avoid-break flex justify-start md:justify-end">
              <img
                src={profilePhotoUrl}
                alt="Professional portrait of Achmad Safain"
                className="cv-photo aspect-[2/3] w-[150px] border border-zinc-300/80 object-cover"
              />
            </div>
          </div>
        </div>

        <div className="cv-body-grid grid gap-0 md:grid-cols-[220px_1fr]">
          <aside className="cv-sidebar border-b border-zinc-300/80 bg-zinc-50 px-6 py-6 md:border-b-0 md:border-r md:px-7 lg:px-8 print:bg-white">
            <section className="cv-section cv-avoid-break">
              <SectionTitle>{content.coreExpertiseTitle}</SectionTitle>
              <ul className="cv-list mt-4 space-y-2.5 text-sm leading-relaxed">
                {content.coreSkills.map((skill) => (
                  <li key={skill} className="border-b border-border/40 pb-2 last:border-b-0 last:pb-0">{skill}</li>
                ))}
              </ul>
            </section>

            <section className="cv-section cv-avoid-break mt-8">
              <SectionTitle>{content.softwareTitle}</SectionTitle>
              <div className="mt-4 flex flex-wrap gap-2 text-xs leading-relaxed">
                {content.softwareSkills.map((skill) => (
                  <span key={skill} className="cv-chip rounded-sm border border-zinc-300 bg-background px-2.5 py-1 uppercase tracking-[0.08em] print:bg-white">{skill}</span>
                ))}
              </div>
            </section>

            <section className="cv-section cv-avoid-break mt-8">
              <SectionTitle>{content.additionalToolsTitle}</SectionTitle>
              <p className="cv-copy mt-4 text-sm leading-7">{content.complementarySkills.join(", ")}</p>
            </section>

            <section className="cv-section cv-avoid-break mt-8">
              <SectionTitle>{content.languagesTitle}</SectionTitle>
              <div className="cv-copy mt-4 space-y-2 text-sm leading-relaxed">
                {content.languages.map((item) => (
                  <p key={item.name}><span className="font-semibold">{item.name}</span> — {item.level}</p>
                ))}
              </div>
            </section>
          </aside>

          <div className="cv-main px-6 py-6 md:px-8 lg:px-10">
            <section className="cv-section cv-avoid-break">
              <SectionTitle>{content.summaryTitle}</SectionTitle>
              <div className="cv-copy mt-4 space-y-3 text-sm leading-7">
                {content.summaryPoints.map((point) => (
                  <div key={point} className="flex gap-3">
                    <span className="cv-bullet-dot mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full" />
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="cv-section cv-avoid-break mt-8">
              <SectionTitle>{content.workExperienceTitle}</SectionTitle>
              <div className="mt-4 space-y-4">
                {content.workExperience.map((item) => (
                  <article key={`${item.period}-${item.title}`} className="cv-card border border-zinc-300/80 border-l-[3px] border-l-zinc-700 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-base font-bold tracking-tight text-foreground">{item.title}</h3>
                        <p className="cv-meta-muted mt-1 text-sm">{item.company}</p>
                      </div>
                      <span className="cv-meta-muted text-sm sm:whitespace-nowrap">{item.period}</span>
                    </div>

                    <ul className="cv-list mt-3 space-y-2 text-sm leading-7">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="cv-bullet-dot mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section className="cv-section cv-avoid-break mt-8">
              <SectionTitle>{content.projectExperienceTitle}</SectionTitle>
              <div className="mt-4 space-y-4">
                {content.highlights.map((item) => (
                  <article key={item.title} className="cv-card border border-zinc-300/80 border-l-[3px] border-l-zinc-700 p-4">
                    <h3 className="text-base font-bold tracking-tight text-foreground">{item.title}</h3>
                    <ul className="cv-list mt-3 space-y-2 text-sm leading-7">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="cv-bullet-dot mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section className="cv-section cv-avoid-break mt-8">
              <SectionTitle>{content.educationTitle}</SectionTitle>
              <div className="mt-4 space-y-4">
                {content.education.map((item) => (
                  <div key={`${item.degree}-${item.institution}`} className="flex flex-col gap-1 border-b border-border/50 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground/95">{item.degree}</h3>
                      <p className="cv-meta-muted mt-1 text-sm">{item.institution}</p>
                    </div>
                    <span className="cv-meta-muted text-sm sm:whitespace-nowrap">{item.period}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="cv-section cv-avoid-break mt-8">
              <SectionTitle>{content.strengthsTitle}</SectionTitle>
              <div className="cv-strength-grid mt-4 grid gap-3 sm:grid-cols-2">
                {content.strengths.map((item) => (
                  <div key={item} className="cv-strength-card border border-zinc-300/80 bg-zinc-50 p-3 text-sm leading-relaxed print:bg-white">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
  )
}
