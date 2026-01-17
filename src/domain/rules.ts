
import { type DateRange, type Order, type OrderStatus } from './types';

export function validateDateRange(range: DateRange): boolean {
    const start = new Date(range.od).getTime();
    const end = new Date(range.do).getTime();
    return start <= end;
}

export function deriveOrderStatus(order: Order): OrderStatus {
    if (order.steps.every(s => s.status === 'done')) {
        return 'done';
    }
    if (order.steps.some(s => s.status === 'done')) {
        return 'in-progress';
    }
    return 'waiting';
}
