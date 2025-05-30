import { useState, useEffect } from 'react';
// Removed MUI Drawer, List, ListItemButton, ListItemIcon, ListItemText
// Removed MUI colors import as sx props using it will be removed.

// Lucide Icons for Sidebar
import {
  LayoutDashboard,
  Wrench,
  Archive,
  Cpu, // For "Beads" (Miner Stats)
  BrainCog, // For "Mempool"
  Network as DagIcon, // For "Visualize" (DAG) - aliased to avoid conflict if Network is used elsewhere
} from 'lucide-react';

// Shadcn/ui Sheet components
import {
  Sheet,
  SheetContent,
  // SheetHeader, // Not explicitly used for a title in sidebar structure
  // SheetTitle, // Not explicitly used
} from '~/components/ui/sheet';

// Components
import TopStatsBar from '../common/TopStatsBar';
import Card from '../common/Card';
import Header from '../common/Header'; // Header might need a prop for mobile menu toggle
import InstallationInstructions from '../Installation/InstallationInstructions';
import MineInventoryDashboard from '../MinerDashboard/MineInventoryDashboard';
import PoolHashrateChart from './PoolHashrateChart';
import MempoolLatencyStats from './MempoolLatencyStats';
import RecentBlocksTable from './RecentBlocksTable';
import GraphVisualization from '../BraidPoolDAG/BraidPoolDAG';
import MinedSharesExplorer from '../MinerDashboard/MinedSharesExplorer';
// Utils
import {
  loadSampleBraidData,
  transformBraidData,
} from '../../utils/braidDataTransformer';

// Constants
// const drawerWidth = 240; // Replaced by Tailwind class w-[240px]

// Define available pages as an enum
enum Page {
  INSTALLATION = 'installation',
  DASHBOARD = 'dashboard',
  MINING_INVENTORY = 'mining-inventory',
  MEMPOOL = 'mempool',
  DAG_VISUALIZATION = 'dag-visualization',
  MINER_STATS = 'miner-stats', // "Beads"
}

const navItems = [
  { page: Page.INSTALLATION, label: 'Installation', icon: Wrench },
  { page: Page.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { page: Page.MINER_STATS, label: 'Beads', icon: Cpu },
  { page: Page.MINING_INVENTORY, label: 'Inventory', icon: Archive },
  { page: Page.MEMPOOL, label: 'Mempool', icon: BrainCog },
  { page: Page.DAG_VISUALIZATION, label: 'Visualize', icon: DagIcon },
];

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [_data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const braidData = await loadSampleBraidData();
        const transformedData = transformBraidData(braidData);
        setData(transformedData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setMobileOpen(false); // Close sheet on navigation
  };

  const SidebarContent = () => (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold text-primary">Braidpool</h2>
      </div>
      <hr className="border-border my-2" />
      <nav className="flex flex-col space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected = currentPage === item.page;
          return (
            <button
              key={item.label}
              onClick={() => handlePageChange(item.page)}
              className={`flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-100 ease-in-out
                ${isSelected
                  ? 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <Icon className={`h-5 w-5 mr-3 ${isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );

  // Render the main content based on selected page
  const renderPage = () => {
    switch (currentPage) {
      case Page.INSTALLATION: return <InstallationInstructions />;
      case Page.DASHBOARD:
        return (
          <>
            <TopStatsBar loading={loading} />
            <div className="flex flex-wrap mt-4 -mx-1">
              <div className="w-full md:w-1/2 p-1">
                <Card title="Pool Hashrate"><PoolHashrateChart loading={loading} /></Card>
              </div>
              <div className="w-full md:w-1/2 p-1">
                <Card title="Mempool Activity"><MempoolLatencyStats /></Card>
              </div>
            </div>
            <div className="mt-4 -mx-1">
              <div className="p-1">
                <Card title="Recent Blocks"><RecentBlocksTable /></Card>
              </div>
            </div>
          </>
        );
      case Page.MINING_INVENTORY: return <MineInventoryDashboard />;
      case Page.MEMPOOL:
        return (<div className="p-1"><Card title="Mempool Statistics"><MempoolLatencyStats /></Card></div>);
      case Page.DAG_VISUALIZATION:
        return (<div className="p-1"><Card title="Braid Visualization"><div><GraphVisualization /></div></Card></div>);
      default: // Includes Page.MINER_STATS which is MinedSharesExplorer
        return <MinedSharesExplorer />; // Assuming MinedSharesExplorer covers the "Beads" (MINER_STATS) page
                                        // Or add a specific case if MINER_STATS is different
                                        // For now, "Coming Soon" removed, MINER_STATS defaults here.
                                        // If Page.MINER_STATS is distinct:
                                        // case Page.MINER_STATS: return <MinedSharesExplorer />;
                                        // default: return <div className="p-1"><p>Page not found or coming soon.</p></div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Header might need a prop like onMenuClick={() => setMobileOpen(true)} */}
      <Header title="Braidpool" onMenuClick={() => setMobileOpen(true)} />

      {/* Desktop Sidebar */}
      <div className="hidden sm:flex sm:flex-col sm:w-[240px] bg-card border-r border-border fixed top-0 left-0 h-full pt-[56px] z-20">
        {/* Assuming header height is 56px, pt-[56px] pushes content below header */}
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[240px] sm:hidden pt-[56px] bg-card border-r border-border z-50">
          {/* pt-[56px] to push content below a potential fixed header */}
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <main className="flex-grow p-6 w-full sm:ml-[240px] mt-[56px]"> {/* Adjusted mt to 56px for header */}
        {renderPage()}
      </main>
    </div>
  );
};

export default Dashboard;
