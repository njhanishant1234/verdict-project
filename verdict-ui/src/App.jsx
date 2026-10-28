import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import WorkspacePage from './pages/WorkspacePage';
import SubmissionsPage from './pages/SubmissionsPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';

// Pages that should NOT show the main navbar (workspace uses its own top bar)
const NAVBAR_HIDDEN_ROUTES = ['/problems/:id'];

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Workspace — standalone layout */}
      <Route path="/problems/:id" element={<WorkspacePage />} />

      {/* Standard layout — with navbar */}
      <Route
        path="*"
        element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        }
      />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-center px-4 pt-16">
      <div>
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold hover:from-blue-400 hover:to-violet-500 transition-all"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
