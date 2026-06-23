
import type { Repository } from './repo';
import type { Order, Task, Agreement, ProcessStep, ProcessTemplate } from '../domain/types';

const SEED_ORDERS: Order[] = [
    {
        id: 'o1',
        title: 'Inštalácia FVE - Rodinný dom',
        clientName: 'Ján Novák',
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        dateRange: { od: '2026-01-10', do: '2026-01-20' }, // Current/Active
        steps: [
            { id: 's1', name: 'Zameranie', status: 'done' },
            { id: 's2', name: 'Montáž', status: 'pending' },
            { id: 's2b', name: 'Revízia', status: 'pending' },
        ]
    },
    {
        id: 'o2',
        title: 'Servis klimatizácie',
        clientName: 'Firma ABC s.r.o.',
        status: 'waiting',
        createdAt: new Date().toISOString(),
        // Future / Waiting
        dateRange: { od: '2026-02-01', do: '2026-02-10' },
        steps: [
            { id: 's3', name: 'Obhliadka', status: 'pending' },
        ]
    },
    {
        id: 'o3',
        title: 'Výmena rozvádzača',
        clientName: 'Peter Kováč',
        status: 'done', // Done but maybe was due yesterday
        createdAt: new Date().toISOString(),
        dateRange: { od: '2026-01-01', do: '2026-01-15' },
        steps: [
            { id: 's4', name: 'Nákup materiálu', status: 'done' },
            { id: 's5', name: 'Realizácia', status: 'done' },
        ]
    },
    {
        id: 'o4',
        title: 'Havarijná oprava - Voda',
        clientName: 'Bytové družstvo',
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        dateRange: { od: '2025-12-01', do: '2026-01-15' }, // Past due
        steps: []
    }
];

const SEED_TASKS: Task[] = [
    { id: 't1', title: 'Zavolať klientovi ohľadom termínu', completed: false, orderId: 'o1', tags: ['follow-up'] },
    { id: 't2', title: 'Vystaviť faktúru', completed: true, orderId: 'o3' },
    { id: 't3', title: 'Kúpiť ističe', completed: false, tags: ['OBJEDNAVKA'] },
    { id: 't4', title: 'Objednať náhradné diely', completed: false, orderId: 'o2', tags: ['OBJEDNAVKA'] },
];

const SEED_AGREEMENTS: Agreement[] = [
    {
        id: 'a1',
        title: 'Servisná zmluva 2026',
        clientName: 'Firma ABC s.r.o.',
        dateRange: { od: '2026-01-01', do: '2026-12-31' }
    }
];

const DEFAULT_TEMPLATE_STEPS = [
    'Prvé zameranie',
    'Vizualizácie',
    'Cenová ponuka',
    'Zameranie finál',
    'Príprava dokumentácie (Kancelária)',
    'Objednávky (Kancelária)',
    'Prijatie materiálu (Dielňa)',
    'Výroba (Dielňa)',
    'Montáž (Montáž)',
    'Odovzdanie'
];

const SEED_TEMPLATES: ProcessTemplate[] = [
    {
        id: 'tpl_default',
        name: 'Default',
        isDefault: true,
        steps: DEFAULT_TEMPLATE_STEPS.map((name, idx) => ({
            id: `ts_${idx + 1}`,
            name
        }))
    }
];

export class MemoryRepository implements Repository {
    private orders: Order[] = [...SEED_ORDERS];
    private tasks: Task[] = [...SEED_TASKS];
    private agreements: Agreement[] = [...SEED_AGREEMENTS];
    private templates: ProcessTemplate[] = [...SEED_TEMPLATES];

    async getOrders(): Promise<Order[]> {
        return this.orders;
    }

    async getOrder(id: string): Promise<Order | undefined> {
        return this.orders.find(o => o.id === id);
    }

    async upsertOrder(order: Order): Promise<void> {
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index >= 0) {
            this.orders[index] = order;
        } else {
            // New order - check if we need to generate steps
            if (!order.steps || order.steps.length === 0) {
                const defaultTemplate = this.templates.find(t => t.isDefault);
                if (defaultTemplate) {
                    order.steps = defaultTemplate.steps.map(s => ({
                        id: Math.random().toString(36).substr(2, 9),
                        name: s.name,
                        status: 'pending'
                    }));
                }
            }
            this.orders.push(order);
        }
    }

    async getTasks(): Promise<Task[]> {
        return this.tasks;
    }

    async addTask(task: Task): Promise<void> {
        this.tasks.push(task);
        // If task is added with status/step, we might need to update step status
        if (task.processStepId && task.orderId) {
            await this.recalculateStepStatus(task.orderId, task.processStepId);
        }
    }

    async updateTask(task: Task): Promise<void> {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index >= 0) {
            this.tasks[index] = task;
            if (task.processStepId && task.orderId) {
                await this.recalculateStepStatus(task.orderId, task.processStepId);
            }
        }
    }

    async toggleTask(id: string): Promise<void> {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            // Sync status if present
            if (task.status) {
                task.status = task.completed ? 'done' : 'todo';
            } else {
                // If no status, maybe init it
                task.status = task.completed ? 'done' : 'todo';
            }

            if (task.processStepId && task.orderId) {
                await this.recalculateStepStatus(task.orderId, task.processStepId);
            }
        }
    }

    private async recalculateStepStatus(orderId: string, stepId: string) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const stepIndex = order.steps.findIndex(s => s.id === stepId);
        if (stepIndex === -1) return;

        // Find all tasks for this step
        const stepTasks = this.tasks.filter(t => t.orderId === orderId && t.processStepId === stepId);

        if (stepTasks.length === 0) {
            // No tasks? Maybe keep logic or default to pending?
            // "status kroku počítaj z úloh kroku" - if 0 tasks, manual override applies or stays as is?
            // User: "Manuálny override kroku zatiaľ len priprav pole" implies we might not overwrite if manually set?
            // But here we want to drive it. If 0 tasks, let's leave it alone or default pending.
            // Leaving it alone is safer.
            return;
        }

        const allDone = stepTasks.every(t => t.status === 'done' || t.completed);
        const anyInProgress = stepTasks.some(t => t.status === 'in-progress');

        let newStatus: 'pending' | 'in-progress' | 'done' = 'pending';
        if (allDone) {
            newStatus = 'done';
        } else if (anyInProgress) {
            newStatus = 'in-progress';
        } else {
            // Check if any is done? "aspoň jedna IN_PROGRESS -> krok IN_PROGRESS".
            // "všetky DONE -> krok DONE".
            // implicitly if some are done but not all, and none in progress?
            // Usually usually means "in-progress".
            // If I have 1 done, 1 todo. Logic says not all done. Not in progress (explicitly).
            // So it would be pending? That seems wrong.
            // Let's assume if some are done (but not all) -> in-progress.
            // But user spec: "aspoň jedna IN_PROGRESS -> krok IN_PROGRESS".
            // Implicitly: "inak NEW/PENDING".
            // If I have 1 Done, 1 Todo. Is it In Progress?
            // Technically yes, we started.
            // Let's stick to user spec strictly first?
            // "všetky DONE -> DONE"
            // "aspoň jedna IN_PROGRESS -> krok IN_PROGRESS"
            // "inak NEW/PENDING"
            // If I have 3 tasks: Done, Todo, Todo.
            // All done? No.
            // Any InProgress? No (assuming Done is done, Todo is todo).
            // Status -> Pending?
            // Maybe "Done" counts as progress?
            // I'll add: if any is 'done' AND not all done -> 'in-progress'.
            const anyDone = stepTasks.some(t => t.status === 'done' || t.completed);
            if (anyDone && !allDone) {
                newStatus = 'in-progress';
            }
        }

        if (order.steps[stepIndex].status !== newStatus) {
            order.steps[stepIndex].status = newStatus;
            // Trigger update? Reference is modified in memory, so getting it next time works.
        }
    }

    async getAgreements(): Promise<Agreement[]> {
        return this.agreements;
    }

    async addAgreement(agreement: Agreement): Promise<void> {
        this.agreements.push(agreement);
    }

    async getSteps(orderId: string): Promise<ProcessStep[]> {
        const order = this.orders.find(o => o.id === orderId);
        return order ? order.steps : [];
    }

    async getTemplates(): Promise<ProcessTemplate[]> {
        return this.templates;
    }

    async saveTemplate(template: ProcessTemplate): Promise<void> {
        const idx = this.templates.findIndex(t => t.id === template.id);
        if (idx >= 0) {
            this.templates[idx] = template;
        } else {
            this.templates.push(template);
        }
    }
}
