import { TaskStatus } from "../constants";

export type Task = {
    id: number,
    name: string,
    description: string,
    dueDate: Date,
    createdAt: Date,
    status: TaskStatus,
}