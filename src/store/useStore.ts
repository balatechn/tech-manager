import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskCategory = 'Network' | 'Server' | 'Backup' | 'Security' | 'CCTV' | 'Email' | 'Hardware';
export type TaskFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'One-time';

export interface Task {
    id: string;
    title: string;
    description: string;
    category: TaskCategory;
    priority: TaskPriority;
    frequency: TaskFrequency;
    dueDate: string;
    status: TaskStatus;
    remarks: string;
    completionDate?: string;
    assignedTo: string; // engineer ID
    imageUrl?: string;
    isPreventive: boolean;
}

export interface User {
    id: string;
    name: string;
    role: 'Admin' | 'Engineer';
}

export interface Report {
    id: string;
    weekStarting: string;
    submittedBy: string; // engineer ID
    totalAssigned: number;
    totalCompleted: number;
    pendingItems: number;
    criticalIssues: string[];
    status: 'Pending Approval' | 'Approved';
    submissionDate: string;
}

interface AppState {
    currentUser: User | null;
    tasks: Task[];
    reports: Report[];
    login: (user: User) => void;
    logout: () => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    submitReport: (report: Report) => void;
    approveReport: (id: string) => void;
}

// Mock initial data
const mockTasks: Task[] = [
    { id: '1', title: 'Check Firewall Logs', description: 'Review weekly firewall logs for any anomalies.', category: 'Security', priority: 'High', frequency: 'Weekly', dueDate: new Date().toISOString(), status: 'Pending', remarks: '', assignedTo: 'eng-1', isPreventive: true },
    { id: '2', title: 'Verify NAS Backup', description: 'Ensure all NAS backups are completing successfully.', category: 'Backup', priority: 'High', frequency: 'Daily', dueDate: new Date().toISOString(), status: 'In Progress', remarks: 'Checking integrity now.', assignedTo: 'eng-1', isPreventive: true },
    { id: '3', title: 'Update Antivirus on Servers', description: 'Deploy latest definitions to all VMs.', category: 'Server', priority: 'Medium', frequency: 'Weekly', dueDate: new Date().toISOString(), status: 'Pending', remarks: '', assignedTo: 'eng-1', isPreventive: true },
    { id: '4', title: 'Fix CCTV port 4', description: 'Port 4 on NVR is not recording correctly.', category: 'CCTV', priority: 'Low', frequency: 'One-time', dueDate: new Date().toISOString(), status: 'Completed', remarks: 'Replaced cable.', completionDate: new Date().toISOString(), assignedTo: 'eng-1', isPreventive: false }
];

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            currentUser: null,
            tasks: mockTasks,
            reports: [],
            login: (user) => set({ currentUser: user }),
            logout: () => set({ currentUser: null }),
            addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
            })),
            submitReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
            approveReport: (id) => set((state) => ({
                reports: state.reports.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)),
            })),
        }),
        {
            name: 'tech-manager-storage',
        }
    )
);
