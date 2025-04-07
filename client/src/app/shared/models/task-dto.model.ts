export interface TaskDto {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    priority: string | null; 
    taskStatus: string | null; 
    employeeId: number;
    employeeName: string;
  }