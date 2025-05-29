import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Wrench,
  Archive,
  Cpu,
  LayersIcon as Layers, // Using LayersIcon as Layers as per instruction
} from 'lucide-react';

// Components
import TopStatsBar from '../common/TopStatsBar';
import Card from '../common/Card';
import Header from '../common/Header';
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
const drawerWidth = 240; // Kept as per instruction, used for ml-60 (240px = 15rem, 60*4px = 240px)

// Define available pages as an enum
enum Page {
  INSTALLATION = 'installation',
  DASHBOARD = 'dashboard',
  MINING_INVENTORY = 'mining-inventory',
  MEMPOOL = 'mempool',
  DAG_VISUALIZATION = 'dag-visualization',
  MINER_STATS = 'miner-stats',
}

const Dashboard = () => {
  // const [mobileOpen, setMobileOpen] = useState(false); // Commented out
  const [_data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Loading braid data...');
        setLoading(true);
        setError(null);
        const braidData = await loadSampleBraidData();
        const transformedData = transformBraidData(braidData);
        setData(transformedData);
        console.log('✅ Data loaded successfully!');
      } catch (err) {
        console.error('❌ Error loading data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // const handleDrawerToggle = () => { // Commented out
  //   setMobileOpen(!mobileOpen);
  // };

  // Sidebar drawer content
  const sidebar = (
    <aside className="hidden sm:fixed sm:top-0 sm:left-0 sm:h-full sm:z-30 sm:w-60 bg-card border-r border-border flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-primary">Braidpool</h2>
      </div>
      <Separator className="my-2 bg-border" />
      <nav className="flex-grow p-2 space-y-1 overflow-y-auto">
        {[
          { page: Page.INSTALLATION, label: 'Installation', Icon: Wrench },
          { page: Page.DASHBOARD, label: 'Dashboard', Icon: LayoutDashboard },
          { page: Page.MINER_STATS, label: 'Beads', Icon: Cpu },
          { page: Page.MINING_INVENTORY, label: 'Inventory', Icon: Archive },
          { page: Page.MEMPOOL, label: 'Mempool', Icon: Cpu },
          { page: Page.DAG_VISUALIZATION, label: 'Visualize', Icon: Layers },
        ].map(({ page, label, Icon }) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors border-l-4 ${
              currentPage === page
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <Icon
              className={`h-5 w-5 ${
                currentPage === page ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );

  // Render the main content based on selected page
  const renderPage = () => {
    switch (currentPage) {
      case Page.INSTALLATION:
        return <InstallationInstructions />;
      case Page.DASHBOARD:
        return (
          <>
            <TopStatsBar loading={loading} />
            <div className="flex flex-wrap mt-4 -mx-2">
              <div className="w-full md:w-1/2 p-2">
                <Card title="Pool Hashrate">
                  <PoolHashrateChart loading={loading} />
                </Card>
              </div>
              <div className="w-full md:w-1/2 p-2">
                <Card title="Mempool Activity">
                  <MempoolLatencyStats />
                </Card>
              </div>
            </div>
            <div className="mt-4 -mx-2">
              <div className="p-2">
                <Card title="Recent Blocks">
                  <RecentBlocksTable />
                </Card>
              </div>
            </div>
          </>
        );
      case Page.MINING_INVENTORY:
        return <MineInventoryDashboard />;
      case Page.MEMPOOL:
        return (
          <div className="p-2">
            <Card title="Mempool Statistics">
              <MempoolLatencyStats />
            </Card>
          </div>
        );
      case Page.DAG_VISUALIZATION:
        return (
          <div className="p-2">
            <Card title="Braid Visualization">
              <div> {/* Retained original div wrapper for GraphVisualization */}
                <GraphVisualization />
              </div>
            </Card>
          </div>
        );
      default:
        return (
          <div className="p-2">
            <p className="text-muted-foreground">Coming soon</p>
          </div>
        );
      case Page.MINER_STATS:
        return <MinedSharesExplorer />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Header title="Braidpool" /> {/* Assuming Header is already refactored */}
      {sidebar}
      <main className="flex-grow p-6 sm:ml-60 pt-20">
        {renderPage()}
      </main>
    </div>
  );
};

export default Dashboard;
