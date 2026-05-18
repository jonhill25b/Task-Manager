import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const { token, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
        
        {/* Global Task Engine Header */}
        <header className="border-b border-zinc-900 bg-zinc-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <h1 className="text-lg font-black tracking-wider text-zinc-100">
              TASK<span className="text-amber-500">_</span>ENGINE
            </h1>
          </div>
          {token && (
            <button 
              onClick={logout} 
              className="text-xs font-bold uppercase tracking-wider bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-zinc-400 px-4 py-2 rounded-md border border-zinc-700 hover:border-red-900/50 transition-all cursor-pointer"
            >
              Secure Sign Out
            </button>
          )}
        </header>

        {/* Dynamic Route Switching Viewport */}
        <main className="grow flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Guarded Core Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Default Catch-All Routing Checkpoint */}
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;