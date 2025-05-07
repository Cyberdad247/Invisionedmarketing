import React, { useEffect, useState } from "react";
import { getAppStoreFunctions, AppStoreFunction } from "../api/aci/appStore";

// Reusable App Store Card
function AppStoreCard({ tool }: { tool: AppStoreFunction }) {
  return (
    <div className="relative bg-agent-shadow border-2 border-electric rounded-xl p-6 shadow-[0_0_24px_#BF00FF44] hover:shadow-[0_0_32px_#FFD70088] transition group">
      {/* Agent Silhouette Background */}
      <img
        src="/assets/agent-silhouette.svg"
        alt=""
        aria-hidden="true"
        className="absolute right-2 bottom-2 w-16 h-16 opacity-10 group-hover:opacity-20 pointer-events-none"
      />
      <h2 className="text-2xl font-orbitron text-gold mb-2">{tool.name}</h2>
      <p className="text-accent">{tool.description}</p>
    </div>
  );
}

// Cyberpunk Spinner
function CyberpunkSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-12 h-12 border-4 border-electric border-t-gold rounded-full animate-spin mb-4"></div>
      <span className="text-electric font-orbitron tracking-widest">Loading App Store...</span>
    </div>
  );
}

// Cyberpunk Error
function CyberpunkError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <span className="text-gold font-orbitron text-xl mb-2">Error</span>
      <span className="text-accent">{message}</span>
    </div>
  );
}

const AciAppStorePage: React.FC = () => {
  const [tools, setTools] = useState<AppStoreFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch tools from the ACI App Store
    const fetchTools = async () => {
      try {
        // Attempt to fetch the tools
        const data = await getAppStoreFunctions();
        setTools(data);
      } catch (err) {
        // Catch any errors during the API call
        setError("Failed to fetch tools"); // Set a user-friendly error message
        console.error("Error fetching ACI App Store tools:", err); // Log the error for debugging
      } finally {
        // Always set loading to false after the attempt
        setLoading(false);
      }
    };
    fetchTools();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) return <CyberpunkSpinner />;
  if (error) return <CyberpunkError message={error} />;

  return (
    <div className="min-h-screen bg-background text-gold font-orbitron">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-orbitron text-electric mb-8 tracking-widest drop-shadow-[0_0_8px_#BF00FF]">
          ACI App Store
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <AppStoreCard key={tool.name} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AciAppStorePage;