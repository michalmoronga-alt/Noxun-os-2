
import { useEffect, useState } from 'react';
import { useRepository } from '@/data/DataProvider';

export default function Clients() {
    const repo = useRepository();
    const [clientNames, setClientNames] = useState<string[]>([]);

    useEffect(() => {
        // Derive unique clients from orders and agreements
        Promise.all([repo.getOrders(), repo.getAgreements()]).then(([orders, agreements]) => {
            const names = new Set<string>();
            orders.forEach(o => names.add(o.clientName));
            agreements.forEach(a => names.add(a.clientName));
            setClientNames(Array.from(names));
        });
    }, [repo]);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Clients</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {clientNames.map(name => (
                    <div key={name} className="p-6 border rounded-xl bg-card text-card-foreground shadow">
                        <div className="font-semibold text-lg">{name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
