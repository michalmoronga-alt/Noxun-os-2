
import { useEffect, useState } from 'react';
import { useRepository } from '@/data/DataProvider';
import type { Agreement } from '@/domain/types';

export default function CalendarModule() {
    const repo = useRepository();
    const [agreements, setAgreements] = useState<Agreement[]>([]);

    useEffect(() => {
        repo.getAgreements().then(setAgreements);
    }, [repo]);

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">Agreements Timeline</p>
            <div className="space-y-2">
                {agreements.map(a => (
                    <div key={a.id} className="p-3 border rounded bg-slate-50">
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm text-gray-500">
                            {a.dateRange.od} — {a.dateRange.do}
                        </div>
                        <div className="text-xs text-gray-400">Client: {a.clientName}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
