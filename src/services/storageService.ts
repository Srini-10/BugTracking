import { Bug, User } from '../types';

const USERS_KEY = 'bug_tracker_users';
const BUGS_KEY = 'bug_tracker_bugs';
const CURRENT_USER_KEY = 'bug_tracker_current_user';

export const storageService = {
  // User related functions
  getUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUsers: (users: User[]): void => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User): void => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  clearCurrentUser: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Bug related functions
  getBugs: (): Bug[] => {
    const bugs = localStorage.getItem(BUGS_KEY);
    return bugs ? JSON.parse(bugs) : [];
  },

  saveBugs: (bugs: Bug[]): void => {
    localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));
  },

  addBug: (bug: Bug): void => {
    const bugs = storageService.getBugs();
    bugs.push(bug);
    storageService.saveBugs(bugs);
  },

  updateBug: (updatedBug: Bug): void => {
    const bugs = storageService.getBugs();
    const index = bugs.findIndex(bug => bug.id === updatedBug.id);
    
    if (index !== -1) {
      bugs[index] = updatedBug;
      storageService.saveBugs(bugs);
    }
  },

  deleteBug: (id: string): void => {
    const bugs = storageService.getBugs();
    const filteredBugs = bugs.filter(bug => bug.id !== id);
    storageService.saveBugs(filteredBugs);
  },

  // Initialize with sample data if empty
  initializeStorage: (): void => {
    // Initialize users if empty
    if (storageService.getUsers().length === 0) {
      const sampleUsers: User[] = [
        { id: '1', name: 'Admin User', role: 'admin' },
        { id: '2', name: 'Dev User', role: 'developer' }
      ];
      storageService.saveUsers(sampleUsers);
    }

    // Initialize bugs if empty
    if (storageService.getBugs().length === 0) {
      const sampleBugs: Bug[] = [
        {
          id: '1',
          title: 'Login button not working on Safari',
          description: 'Users cannot log in using Safari browser',
          steps: '1. Open Safari\n2. Navigate to login page\n3. Enter credentials\n4. Click login button',
          priority: 'high',
          status: 'reported',
          reportedBy: '2',
          reportedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: '2',
          title: 'Incorrect calculation in dashboard metrics',
          description: 'The total shown in the dashboard does not match the actual sum of values',
          steps: '1. Log in\n2. Navigate to dashboard\n3. Compare the total with manual calculation',
          priority: 'medium',
          status: 'processing',
          reportedBy: '2',
          reportedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          verifiedBy: '1',
          verifiedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: '3',
          title: 'Profile image not uploading',
          description: 'Users cannot upload new profile images',
          steps: '1. Go to profile page\n2. Click "Change Image"\n3. Select an image\n4. Submit',
          priority: 'low',
          status: 'completed',
          reportedBy: '2',
          reportedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          verifiedBy: '1',
          verifiedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          completedAt: new Date().toISOString()
        }
      ];
      storageService.saveBugs(sampleBugs);
    }
  }
};