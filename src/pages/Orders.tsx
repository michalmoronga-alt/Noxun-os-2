
import { useEffect, useState } from 'react';
import { useRepository } from '@/data/DataProvider';
import type { Order } from '@/domain/types';

export default function Orders() {
    const repo = useRepository();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        repo.getOrders().then(setOrders);
    }, [repo]);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Zákazky</h1>
            <p className="text-muted-foreground">Spravované cez repozitár</p>
            <div className="grid gap-4">
                {orders.map(order => (
                    <div key={order.id} className="p-4 border rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">{order.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'done' ? 'bg-green-100 text-green-800' :
                                order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">Klient: {order.clientName}</p>
                        <div className="mt-2 text-xs text-gray-400">
                            Kroky: {order.steps.map(s => s.name).join(', ')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
