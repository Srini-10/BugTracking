import React, { useState, useEffect } from "react";
import { User, Bug } from "../../types";
import { storageService } from "../../services/storageService";
import Header from "../Layout/Header";
import BugForm from "./BugForm";
import BugList from "./BugList";
import { Search } from "lucide-react";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Load bugs from storage
  useEffect(() => {
    const loadBugs = () => {
      const allBugs = storageService.getBugs();
      // Show all bugs if user is admin, otherwise filter by reportedBy
      const userBugs =
        user.role === "admin"
          ? allBugs
          : allBugs.filter((bug) => bug.reportedBy === user.id);
      setBugs(userBugs);
    };

    loadBugs();
    const interval = setInterval(loadBugs, 5000);
    return () => clearInterval(interval);
  }, [user.id, user.role]);

  const handleBugSubmitted = (bug: Bug) => {
    setBugs((prevBugs) => [bug, ...prevBugs]);
  };

  // Filter and search bugs
  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch =
      bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || bug.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Get bugs by status
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
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left column - Bug Form */}
            <div className="w-full md:w-1/3">
              <BugForm onBugSubmitted={handleBugSubmitted} userId={user.id} />
            </div>

            {/* Right column - Bug Lists */}
            <div className="w-full md:w-2/3 space-y-6">
              {/* Search and filter */}
              <div className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4">
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
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="reported">Reported</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Bug lists by status */}
              <div className="space-y-6">
                <BugList bugs={reportedBugs} title="Reported Bugs" />
                <BugList bugs={processingBugs} title="Bugs In Processing" />
                <BugList bugs={completedBugs} title="Completed Bugs" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
