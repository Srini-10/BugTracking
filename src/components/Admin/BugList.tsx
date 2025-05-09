import React from "react";
import { Bug } from "../../types";
import BugCard from "../shared/BugCard";

interface BugListProps {
  bugs: Bug[];
  title: string;
}

const BugList: React.FC<BugListProps> = ({ bugs, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>

      {bugs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No bugs to display</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bugs.map((bug) => (
            <BugCard key={bug.id} bug={bug} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;
