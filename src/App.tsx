import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { MachineDetail } from './pages/MachineDetail';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './AuthProvider';
import { RequireAuth } from './RequireAuth';
import { SettingsProvider, useSettings } from './SettingsContext';
import { Activity, LogOut, Scale } from 'lucide-react';
import './index.css';

function AppContent() {
  const { user, logout } = useAuth();
  const { unit, toggleUnit } = useSettings();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      <header className="border-b border-border bg-bg-secondary sticky top-0 z-10 backdrop-blur bg-opacity-80">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-accent hover:text-accent-hover transition-colors">
            <Activity className="w-6 h-6" />
            <span>Kieser Training</span>
          </Link>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary hidden md:inline">Welcome, {user.username}</span>

              <button
                onClick={toggleUnit}
                className="flex items-center gap-1 px-2 py-1 bg-bg-tertiary hover:bg-bg-hover rounded border border-border text-xs font-bold transition-all"
                title={`Switch to ${unit === 'lb' ? 'kg' : 'lb'}`}
              >
                <Scale className="w-3 h-3 text-accent" />
                <span className={unit === 'lb' ? 'text-accent' : 'text-muted'}>LB</span>
                <span className="text-border mx-0.5">/</span>
                <span className={unit === 'kg' ? 'text-accent' : 'text-muted'}>KG</span>
              </button>

              <button onClick={logout} className="button-outline text-sm px-3 py-1 flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/machine/:id" element={
            <RequireAuth>
              <MachineDetail />
            </RequireAuth>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
