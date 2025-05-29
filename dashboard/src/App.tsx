import React from 'react'; // Removed useState as it's no longer used
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
// import ShareDetails from './components/ShareDetails/ShareDetails'; // Was commented out
import MinedSharesExplorer from './components/MinerDashboard/MinedSharesExplorer';
import './App.css'; // Keep if App.css has other relevant styles

function Copyright() {
  return (
    <p className="text-sm text-muted-foreground text-center">
      {'© '}
      <a
        href="https://github.com/braidpool/braidpool"
        className="text-primary hover:underline" // Assuming text-primary is desired for links
      >
        Braidpool
      </a>{' '}
      {new Date().getFullYear()}
      {' - Built with Vite 🚀'}
    </p>
  );
}

function App() {
  // const [shareDetailsOpen, setShareDetailsOpen] = useState(false); // Remove if not used

  return (
    <BrowserRouter>
      <div className="flex"> {/* Original outer Box */}
        {/* Commented out Button and ShareDetails were here - removed */}
        <div className="flex flex-col min-h-screen bg-background text-foreground w-full"> {/* Original main content Box */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/minedsharesexplorer"
              element={<MinedSharesExplorer />}
            />
            {/* Add more routes as needed */}
          </Routes>
          <footer className="py-6 mt-auto bg-card border-t border-white/5"> {/* Original footer Box */}
            <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8"> {/* Original Container */}
              <p className="text-base text-center mb-2">
                A visualization dashboard for the Braidpool decentralized
                mining pool
              </p>
              <Copyright />
            </div>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
