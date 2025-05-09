import React, { useState, useEffect } from "react";
import { User, Bug, BugStatus } from "../../types";
import { storageService } from "../../services/storageService";
import Header from "../Layout/Header";
import BugBoard from "./BugBoard";
import { Search } from "lucide-react";

interface DeveloperDashboardProps {
  user: User;
  onLogout: () => void;
}

const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  user,
  onLogout,
}) => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Load bugs from storage
  useEffect(() => {
    const loadBugs = () => {
      const allBugs = storageService.getBugs();
      setBugs(allBugs);
    };

    // Load initial data
    loadBugs();

    // Set up interval to check for updates
    const interval = setInterval(loadBugs, 2000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Handle drag and drop
  const handleDrop = (bugId: string, newStatus: BugStatus) => {
    const updatedBugs = bugs.map((bug) => {
      if (bug.id === bugId) {
        const updatedBug = { ...bug, status: newStatus };

        // Add verification info if moving to processing
        if (newStatus === "processing" && !updatedBug.verifiedBy) {
          updatedBug.verifiedBy = user.id;
          updatedBug.verifiedAt = new Date().toISOString();
        }

        // Add completion info if moving to completed
        if (newStatus === "completed" && !updatedBug.completedAt) {
          updatedBug.completedAt = new Date().toISOString();
        }

        // Update in storage
        storageService.updateBug(updatedBug);

        return updatedBug;
      }
      return bug;
    });

    setBugs(updatedBugs);
  };

  // Filter bugs
  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch =
      bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterPriority === "all" || bug.priority === filterPriority;

    return matchesSearch && matchesFilter;
  });

  // Group bugs by status
  const reportedBugs = filteredBugs.filter((bug) => bug.status === "reported");
  const processingBugs = filteredBugs.filter(
    (bug) => bug.status === "processing"
  );
  const completedBugs = filteredBugs.filter(
    (bug) => bug.status === "completed"
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>

          {/* Search and filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search bugs..."
              />
            </div>

            <div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Bug boards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BugBoard
              title="Reported"
              status="reported"
              bugs={reportedBugs}
              onDrop={handleDrop}
              badgeColor="bg-yellow-100 text-yellow-800"
              count={reportedBugs.length}
            />

            <BugBoard
              title="Processing"
              status="processing"
              bugs={processingBugs}
              onDrop={handleDrop}
              badgeColor="bg-blue-100 text-blue-800"
              count={processingBugs.length}
            />

            <BugBoard
              title="Completed"
              status="completed"
              bugs={completedBugs}
              onDrop={handleDrop}
              badgeColor="bg-green-100 text-green-800"
              count={completedBugs.length}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeveloperDashboard;
