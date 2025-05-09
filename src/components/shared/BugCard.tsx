import React from 'react';
import { Bug } from '../../types';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface BugCardProps {
  bug: Bug;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, bug: Bug) => void;
}

const BugCard: React.FC<BugCardProps> = ({ bug, onDragStart }) => {
  // Determine priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Determine status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-white cursor-pointer"
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart && onDragStart(e, bug)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">{bug.title}</h3>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(bug.priority)}`}>
            {bug.priority}
          </span>
          {getStatusIcon(bug.status)}
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{bug.description}</p>
      
      <div className="mt-3 flex items-center text-xs text-gray-500">
        <span>Reported {formatDistanceToNow(new Date(bug.reportedAt))} ago</span>
        
        {bug.status === 'processing' && bug.verifiedAt && (
          <span className="ml-4">
            Verified {formatDistanceToNow(new Date(bug.verifiedAt))} ago
          </span>
        )}
        
        {bug.status === 'completed' && bug.completedAt && (
          <span className="ml-4">
            Completed {formatDistanceToNow(new Date(bug.completedAt))} ago
          </span>
        )}
      </div>
    </div>
  );
};

export default BugCard;