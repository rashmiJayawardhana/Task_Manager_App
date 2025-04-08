export interface TaskDto {
    id: number;
    title: string;
    description: string;
    createdAt?: string;
    dueDate: string | Date;
    priority: string | null; 
    taskStatus: string | null; 
    employeeId: number;
    employeeName: string;
}

export interface CreateTaskDto {
    title: string;
    description: string;
    dueDate: string | Date;
    priority: string | null;
    taskStatus: string | null;
    employeeId: number;
}