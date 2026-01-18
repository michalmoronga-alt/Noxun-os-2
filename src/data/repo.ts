
import type { Order, Task, Agreement, ProcessStep, ProcessTemplate } from '../domain/types';

export interface Repository {
    // Orders
    getOrders(): Promise<Order[]>;
    getOrder(id: string): Promise<Order | undefined>;
    upsertOrder(order: Order): Promise<void>;

    // Tasks
    getTasks(): Promise<Task[]>;
    addTask(task: Task): Promise<void>;
    updateTask(task: Task): Promise<void>;
    toggleTask(id: string): Promise<void>;

    // Agreements
    getAgreements(): Promise<Agreement[]>;
    addAgreement(agreement: Agreement): Promise<void>;

    // Steps (often part of order, but if needed separately)
    getSteps(orderId: string): Promise<ProcessStep[]>;

    // Templates
    getTemplates(): Promise<ProcessTemplate[]>;
    saveTemplate(template: ProcessTemplate): Promise<void>;
}
