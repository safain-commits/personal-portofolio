import type { Project } from "./api"

export const PROJECT_FILTERS = [
  "All",
  "Technical Project Work",
  "Engineering Support",
  "3D CAD Modeling",
] as const

export type FilterLabel = typeof PROJECT_FILTERS[number]

export const buildProjectText = (project: Project) => [
  project.title,
  project.subtitle,
  project.summary,
  ...project.tags,
].join(" ").toLowerCase()

export const getProjectBuckets = (project: Project): FilterLabel[] => {
  const text = buildProjectText(project)
  const buckets = new Set<FilterLabel>()

  if (
    project.is3d ||
    /\b3d\b|cad|model|inventor|blender|solidworks|fusion 360/.test(text) ||
    project.tags.some(tag => tag.toLowerCase() === "3d design")
  ) {
    buckets.add("3D CAD Modeling")
  }

  if (
    /engineering|support|plant|cement|equipment|kiln|feeder|site|execution|structural/.test(text) ||
    project.tags.some(tag => tag.toLowerCase() === "engineering")
  ) {
    buckets.add("Engineering Support")
  }

  if (
    /draft|drawing|documentation|fabrication|technical/.test(text) ||
    project.tags.some(tag => ["industrial design", "product design", "appliance design"].includes(tag.toLowerCase()))
  ) {
    buckets.add("Technical Project Work")
  }

  if (buckets.size === 0) {
    buckets.add("Technical Project Work")
  }

  return PROJECT_FILTERS.filter((label): label is FilterLabel => label !== "All" && buckets.has(label))
}

export const getPrimaryProjectLabel = (project: Project): Exclude<FilterLabel, "All"> => {
  const buckets = getProjectBuckets(project)
  const preferredOrder: Array<Exclude<FilterLabel, "All">> = [
    "Technical Project Work",
    "Engineering Support",
    "3D CAD Modeling",
  ]

  return preferredOrder.find(label => buckets.includes(label)) || "Technical Project Work"
}
