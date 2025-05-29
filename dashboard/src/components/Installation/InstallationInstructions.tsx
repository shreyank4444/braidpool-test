import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlayCircle, Code2, CloudDownload, Terminal, ArrowRight } from 'lucide-react';
import Card from '../common/Card'; // Assuming Card is already refactored

const InstallationInstructions = () => {
  return (
    <Card
      title="Installation Instructions"
      subtitle="How to install and set up Braidpool"
      accentColor="var(--primary)" // Updated accentColor
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 w-full">
          <div className="bg-card text-foreground rounded-lg border border-primary/20 p-4 h-full">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Basic Installation
            </h3>

            <p className="text-sm text-muted-foreground mb-6">
              Follow these steps to install and run Braidpool node on your
              system. Make sure you have the prerequisites installed before
              proceeding.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <CloudDownload className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Clone the repository</p>
                  <p className="text-xs text-muted-foreground font-mono bg-muted/20 p-2 mt-1 rounded-md overflow-x-auto">
                    git clone https://github.com/braidpool/braidpool.git
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <Terminal className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Build the node</p>
                  <p className="text-xs text-muted-foreground font-mono bg-muted/20 p-2 mt-1 rounded-md overflow-x-auto">
                    cd node && cargo build
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <PlayCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Run the first seed node</p>
                  <p className="text-xs text-muted-foreground font-mono bg-muted/20 p-2 mt-1 rounded-md overflow-x-auto">
                    cargo run -- --bind=localhost:8989 --bitcoin=0.0.0.0 --rpcport=8332 --rpcuser=xxxx --rpcpass=yyyy --zmqhashblockport=28332
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-6 flex justify-center">
              <Button variant="default" size="sm" onClick={() => console.log('📝 Opening full documentation...')}>
                <Code2 className="mr-2 h-4 w-4" /> View Full Documentation
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="bg-card text-foreground rounded-lg border border-primary/20 p-4 h-full">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              CPUnet Testing Node
            </h3>

            <p className="text-sm text-muted-foreground mb-6">
              For testing purposes, you can set up the CPUnet testing node using
              nix-script from the root directory.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Terminal className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Build the nix-script</p>
                  <p className="text-xs text-muted-foreground font-mono bg-muted/20 p-2 mt-1 rounded-md overflow-x-auto">
                    nix-build cpunet_node.nix
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Navigate to result directory</p>
                  <p className="text-xs text-muted-foreground font-mono bg-muted/20 p-2 mt-1 rounded-md overflow-x-auto">
                    cd result
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <PlayCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Run the CPUnet node</p>
                  <p className="text-xs text-muted-foreground font-mono bg-muted/20 p-2 mt-1 rounded-md overflow-x-auto">
                    ./bin/bitcoind -cpunet -zmqpubsequence=tcp://127.0.0.1:28338
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3">
                <Terminal className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Generate blocks</p>
                  <p className="text-xs text-muted-foreground font-mono bg-muted/20 p-2 mt-1 rounded-md overflow-x-auto">
                    ./contrib/cpunet/miner --cli=./bin/bitcoin-cli --ongoing --address `./bin/bitcoin-cli -cpunet getnewaddress` --grind-cmd='./bin/bitcoin-util -cpunet -ntasks=1 grind'
                  </p>
                </div>
              </li>
            </ul>

            <Separator className="my-6" />

            <h4 className="text-lg font-medium text-foreground mb-2">Prerequisites</h4>

            <ul className="space-y-1 list-disc list-inside pl-1">
              <li className="text-sm text-muted-foreground">
                Rust toolchain (rustc, cargo)
              </li>
              <li className="text-sm text-muted-foreground">
                Nix package manager (for CPUnet)
              </li>
              <li className="text-sm text-muted-foreground">
                Bitcoin Core (for RPC and ZMQ access)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InstallationInstructions;
