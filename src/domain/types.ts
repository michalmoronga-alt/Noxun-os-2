
export type OrderStatus = 'waiting' | 'in-progress' | 'done';

export interface ProcessStep {
    id: string;
    name: string;
    status: 'pending' | 'done';
}

export interface Order {
    id: string;
    title: string;
    clientName: string;
    steps: ProcessStep[];
    // Derived or stored, but we'll calculate it via rules usually
    status: OrderStatus;
    createdAt: string;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    orderId?: string; // Optional link to order
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
