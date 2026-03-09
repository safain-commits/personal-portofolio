import { Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"

const Home = lazy(() => import("./pages/Home"))
const Projects = lazy(() => import("./pages/Projects"))
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"))
const About = lazy(() => import("./pages/About"))
const Contact = lazy(() => import("./pages/Contact"))
const Admin = lazy(() => import("./pages/Admin"))

function LoadingScreen() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
