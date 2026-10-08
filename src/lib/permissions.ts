import { Task, User, Role } from '@/types';

/**
 * Checks whether a task is blocked by incomplete prerequisites.
 */
export function isTaskBlockedByDependencies(task: Partial<Task>): boolean {
  if (!task.dependencies || task.dependencies.length === 0) {
    return false;
  }
  return task.dependencies.some((dep) => dep.prerequisiteTask.status !== 'DONE');
}

/**
 * Checks whether a user has permission to transition a task from IN_PROGRESS to DONE.
 * PMs are explicitly forbidden from completing tasks in progress; only the executor can.
 */
export function canUserMoveToDone(user: User | null, currentTaskStatus: string): boolean {
  if (!user) return false;
  if (user.role === 'CLIENT_GUEST') return false;
  if (user.role === 'PRODUCT_MANAGER' && currentTaskStatus === 'IN_PROGRESS') {
    return false;
  }
  return true;
}

/**
 * Checks whether a user has permission to edit core task description and title.
 * Internal team and Client Guests are forbidden from altering core descriptions.
 */
export function canUserEditDescription(user: User | null): boolean {
  if (!user) return false;
  return user.role === 'PRODUCT_MANAGER';
}

/**
 * Checks whether a user can alter client visibility flag.
 */
export function canUserToggleClientVisibility(user: User | null): boolean {
  if (!user) return false;
  return user.role === 'PRODUCT_MANAGER';
}

