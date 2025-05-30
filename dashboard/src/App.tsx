import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
// ShareDetails import is kept as the component usage is still present (commented out)
import ShareDetails from './components/ShareDetails/ShareDetails';
import MinedSharesExplorer from './components/MinerDashboard/MinedSharesExplorer';
// import { Button } from "~/components/ui/button"; // Not needed as the MUI Button is commented out

function Copyright() {
  return (
    <p className="text-sm text-muted-foreground text-center">
      {'© '}
      <a href="https://github.com/braidpool/braidpool" className="hover:underline">
        Braidpool
      </a>{' '}
      {new Date().getFullYear()}
      {' - Built with Vite 🚀'}
    </p>
  );
}

function App() {
  // The state 'shareDetailsOpen' and 'setShareDetailsOpen' were related to the commented-out MUI Button.
  // Since the button and its functionality are commented out, this state is not strictly necessary
  // but keeping it doesn't harm if the intention is to re-enable it later.
  // For a cleaner migration, if the button is indefinitely commented, this state could be removed.
  // const [shareDetailsOpen, setShareDetailsOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex"> {/* Top-level Box replaced */}
        {/* Test button for ShareDetails - MUI Button commented out */}
        {/* <Button
            variant='contained'
            color='primary'
            onClick={() => setShareDetailsOpen(true)}
            sx={{ // sx prop would not work with shadcn button directly
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 9999,
            }}>
            Test Share Details
          </Button> */}

        {/* ShareDetails component - usage commented out */}
        {/* <ShareDetails
            open={shareDetailsOpen}
            onClose={() => setShareDetailsOpen(false)}
          /> */}

        {/* Primary content Box replaced with main and Tailwind classes */}
        <main className="flex flex-col min-h-screen w-full bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/minedsharesexplorer"
              element={<MinedSharesExplorer />}
            />
            {/* Add more routes as needed */}
          </Routes>
          {/* Footer Box replaced with footer and Tailwind classes */}
          <footer className="py-6 mt-auto bg-card border-t border-border">
            {/* Container replaced with div and Tailwind container classes */}
            <div className="container mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
              <p className="text-base text-center mb-2">
                A visualization dashboard for the Braidpool decentralized
                mining pool
              </p>
              <Copyright />
            </div>
          </footer>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
