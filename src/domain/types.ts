
export type OrderStatus = 'waiting' | 'in-progress' | 'done';
export type StepStatus = 'pending' | 'in-progress' | 'done';

export interface TemplateStep {
    id: string; // e.g. "ts_1"
    name: string;
}

export interface ProcessTemplate {
    id: string;
    name: string;
    isDefault: boolean;
    steps: TemplateStep[];
}

export interface ProcessStep {
    id: string; // instance id
    name: string;
    status: StepStatus;
}

export interface Order {
    id: string;
    title: string;
    clientName: string;
    steps: ProcessStep[];
    // Derived or stored, but we'll calculate it via rules usually
    status: OrderStatus;
    createdAt: string;
    dateRange?: DateRange;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean; // Keep for backward compat, but we might rely on status derived from this? "completed" is bool.
    // User didn't ask to change Task status to enum, but "Change status of task" implies maybe more than bool?
    // User said "Zmeň stav úlohy -> zmení sa odvodený stav kroku".
    // "všetky DONE -> krok DONE", "aspoň jedna IN_PROGRESS -> krok IN_PROGRESS".
    // If Task only has completed (bool), it can only be Pending (false) or Done (true).
    // So for "IN_PROGRESS" task, checking "completed" is likely not enough unless I add "status" to Task OR "inProgress" flag.
    // The user requirement "aspoň jedna IN_PROGRESS" strongly suggests Tasks need an 'in-progress' state.
    // However, the current Task interface only has `completed: boolean`.
    // I should probably upgrade Task to have `status` or Keep `completed` and add `status`?
    // Let's look at `SEED_TASKS`.
    // If I change Task structure significantly, I might break other things.
    // But to support "Task is IN_PROGRESS", I need state.
    // I will add `status?: 'pending' | 'in-progress' | 'done'` to Task.
    // And mark `completed` as deprecated or kept in sync.
    orderId?: string; // Optional link to order
    processStepId?: string; // Link to specific step
    tags?: string[];
    status?: 'todo' | 'in-progress' | 'done'; // New user constraint implies task status
}

export interface DateRange {
    od: string; // ISO Date string
    do: string; // ISO Date string
}

export interface Agreement {
    id: string;
    title: string;
    dateRange: DateRange;
    clientName: string;
}
