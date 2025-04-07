export interface Task {
    employeeId: number;
    title: string;
    description: string;
    dueDate: string; // ISO 8601 format (e.g., "2025-04-06")
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    taskStatus?: string;
}