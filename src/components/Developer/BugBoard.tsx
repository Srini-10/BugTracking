import React, { useState } from 'react';
import { Bug, BugStatus } from '../../types';
import BugCard from '../shared/BugCard';

interface BugBoardProps {
  title: string;
  status: BugStatus;
  bugs: Bug[];
  onDrop: (bugId: string, newStatus: BugStatus) => void;
  badgeColor: string;
  count: number;
}

const BugBoard: React.FC<BugBoardProps> = ({ 
  title, status, bugs, onDrop, badgeColor, count 
}) => {
  const [isOver, setIsOver] = useState(false);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = () => {
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    
    const bugId = e.dataTransfer.getData('bugId');
    if (bugId) {
      onDrop(bugId, status);
    }
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, bug: Bug) => {
    e.dataTransfer.setData('bugId', bug.id);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        isOver ? 'ring-2 ring-blue-500' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
          {count}
        </span>
      </div>
      
      <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '400px' }}>
        {bugs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <p>Drag bugs here</p>
          </div>
        ) : (
          bugs.map(bug => (
            <BugCard 
              key={bug.id} 
              bug={bug} 
              onDragStart={handleDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BugBoard;