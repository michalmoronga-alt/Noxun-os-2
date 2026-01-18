
import type { Repository } from './repo';
import type { Order, Task, Agreement, ProcessStep } from '../domain/types';

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

export class MemoryRepository implements Repository {
    private orders: Order[] = [...SEED_ORDERS];
    private tasks: Task[] = [...SEED_TASKS];
    private agreements: Agreement[] = [...SEED_AGREEMENTS];

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
            this.orders.push(order);
        }
    }

    async getTasks(): Promise<Task[]> {
        return this.tasks;
    }

    async addTask(task: Task): Promise<void> {
        this.tasks.push(task);
    }

    async toggleTask(id: string): Promise<void> {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
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
}
