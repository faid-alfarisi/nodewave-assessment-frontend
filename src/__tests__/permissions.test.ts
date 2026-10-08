import { describe, it, expect } from 'vitest';
import {
  isTaskBlockedByDependencies,
  canUserMoveToDone,
  canUserEditDescription,
  canUserToggleClientVisibility,
} from '../lib/permissions';
import { User, Task } from '../types';

describe('Frontend Permission & Dependency Rules', () => {
  const pmUser: User = {
    id: 'user-pm',
    email: 'pm@nodewave.id',
    fullName: 'Alex Morgan',
    role: 'PRODUCT_MANAGER',
    department: 'MANAGEMENT',
  };

  const feUser: User = {
    id: 'user-fe',
    email: 'fe@nodewave.id',
    fullName: 'Devin Cole',
    role: 'INTERNAL_TEAM',
    department: 'FRONTEND',
  };

  const clientUser: User = {
    id: 'user-client',
    email: 'client@clientcorp.com',
    fullName: 'Victoria Sterling',
    role: 'CLIENT_GUEST',
    department: 'CLIENT',
  };

  describe('isTaskBlockedByDependencies', () => {
    it('should return false if task has no dependencies', () => {
      const task: Partial<Task> = { dependencies: [] };
      expect(isTaskBlockedByDependencies(task)).toBe(false);
    });

    it('should return false if all prerequisite tasks are DONE', () => {
      const task: Partial<Task> = {
        dependencies: [
          {
            id: 'dep-1',
            dependentTaskId: 'task-c',
            prerequisiteTaskId: 'task-a',
            prerequisiteTask: { id: 'p1', title: 'Task 1', status: 'DONE', department: 'UIUX' },
          },
        ],
      };
      expect(isTaskBlockedByDependencies(task)).toBe(false);
    });

    it('should return true if any prerequisite task is not DONE', () => {
      const task: Partial<Task> = {
        dependencies: [
          {
            id: 'dep-1',
            dependentTaskId: 'task-c',
            prerequisiteTaskId: 'task-a',
            prerequisiteTask: { id: 'p1', title: 'Task 1', status: 'IN_PROGRESS', department: 'UIUX' },
          },
        ],
      };
      expect(isTaskBlockedByDependencies(task)).toBe(true);
    });
  });

  describe('canUserMoveToDone', () => {
    it('should forbid PM from moving IN_PROGRESS task to DONE', () => {
      expect(canUserMoveToDone(pmUser, 'IN_PROGRESS')).toBe(false);
    });

    it('should allow PM to mark TODO task directly to DONE if needed', () => {
      expect(canUserMoveToDone(pmUser, 'TODO')).toBe(true);
    });

    it('should allow Internal Team to complete IN_PROGRESS task', () => {
      expect(canUserMoveToDone(feUser, 'IN_PROGRESS')).toBe(true);
    });

    it('should strictly forbid Client Guest from completing any task', () => {
      expect(canUserMoveToDone(clientUser, 'IN_PROGRESS')).toBe(false);
      expect(canUserMoveToDone(clientUser, 'TODO')).toBe(false);
    });
  });

  describe('canUserEditDescription', () => {
    it('should allow PM to edit task description', () => {
      expect(canUserEditDescription(pmUser)).toBe(true);
    });

    it('should forbid Internal Team from editing task description', () => {
      expect(canUserEditDescription(feUser)).toBe(false);
    });

    it('should forbid Client Guest from editing task description', () => {
      expect(canUserEditDescription(clientUser)).toBe(false);
    });
  });

  describe('canUserToggleClientVisibility', () => {
    it('should allow only PM to toggle client visibility', () => {
      expect(canUserToggleClientVisibility(pmUser)).toBe(true);
      expect(canUserToggleClientVisibility(feUser)).toBe(false);
      expect(canUserToggleClientVisibility(clientUser)).toBe(false);
    });
  });
});

