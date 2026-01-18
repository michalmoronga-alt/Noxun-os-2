
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepository } from '@/data/DataProvider';
import type { Order, Task } from '@/domain/types';

export default function Today() {
    const repo = useRepository();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    // Simulate "Today" as 2026-01-18 based on user metadata/seed context
    // Real app would use new Date()
    const TODAY_STR = '2026-01-18';

    useEffect(() => {
        Promise.all([repo.getOrders(), repo.getTasks()]).then(([o, t]) => {
            setOrders(o);
            setTasks(t);
        });
    }, [repo]);

    const isToday = (od?: string, until?: string) => {
        if (!od || !until) return false;
        return od <= TODAY_STR && until >= TODAY_STR;
    };

    const isPastDue = (until?: string, status?: string) => {
        if (!until || status === 'done') return false;
        return until < TODAY_STR;
    };

    const isUpcomingOrNoDate = (od?: string) => {
        if (!od) return true;
        return od > TODAY_STR;
    };

    const todayItems = orders.filter(o => isToday(o.dateRange?.od, o.dateRange?.do));
    const urgentItems = orders.filter(o => isPastDue(o.dateRange?.do, o.status));
    const waitingItems = orders.filter(o => isUpcomingOrNoDate(o.dateRange?.od) && !todayItems.includes(o) && !urgentItems.includes(o)); // Simple exclusion

    // For "Chýba objednať", we look for tasks with specific tag
    const orderTasks = tasks.filter(t => t.tags?.includes('OBJEDNAVKA') && !t.completed);

    const Card = ({ title, subtitle, date, onOpen, onAddTask, colorClass }: any) => (
        <div className={`p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow ${colorClass}`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
                {date && <span className="text-[10px] font-mono bg-gray-100 px-1 rounded">{date}</span>}
            </div>
            <div className="flex gap-2 mt-3">
                <button onClick={onOpen} className="flex-1 text-xs bg-primary text-primary-foreground py-1.5 px-3 rounded hover:bg-primary/90 transition-colors">
                    Otvoriť
                </button>
                <button onClick={onAddTask} className="flex-1 text-xs border border-input bg-background hover:bg-accent text-accent-foreground py-1.5 px-3 rounded transition-colors">
                    + Úloha
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-4 h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Dnes</h1>
                    <p className="text-muted-foreground text-sm">Prehľad dňa • {TODAY_STR}</p>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-6 min-w-[1000px] h-full pb-4">
                    {/* Dnes */}
                    <div className="flex-1 flex flex-col gap-4 min-w-[240px]">
                        <h2 className="font-medium text-sm text-blue-600 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            Dnes ({todayItems.length})
                        </h2>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                            {todayItems.map(o => (
                                <Card
                                    key={o.id}
                                    title={o.title}
                                    subtitle={o.clientName}
                                    date={o.dateRange ? `${o.dateRange.od} - ${o.dateRange.do}` : ''}
                                    colorClass="border-l-4 border-l-blue-500"
                                    onOpen={() => navigate('/zakazky')} // Placeholder link
                                    onAddTask={() => console.log('Add task to', o.id)}
                                />
                            ))}
                            {todayItems.length === 0 && <div className="text-sm text-gray-400 italic">Žiadne aktívne zákazky na dnes.</div>}
                        </div>
                    </div>

                    {/* Hori */}
                    <div className="flex-1 flex flex-col gap-4 min-w-[240px]">
                        <h2 className="font-medium text-sm text-red-600 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-600"></span>
                            Horí ({urgentItems.length})
                        </h2>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                            {urgentItems.map(o => (
                                <Card
                                    key={o.id}
                                    title={o.title}
                                    subtitle={o.clientName}
                                    date={o.dateRange ? `do ${o.dateRange.do}` : ''}
                                    colorClass="border-l-4 border-l-red-500 bg-red-50/50"
                                    onOpen={() => navigate('/zakazky')}
                                    onAddTask={() => console.log('Add task', o.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Caka */}
                    <div className="flex-1 flex flex-col gap-4 min-w-[240px]">
                        <h2 className="font-medium text-sm text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            Čaká ({waitingItems.length})
                        </h2>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                            {waitingItems.map(o => (
                                <Card
                                    key={o.id}
                                    title={o.title}
                                    subtitle={o.clientName}
                                    date={o.dateRange?.od ? `od ${o.dateRange.od}` : ''}
                                    colorClass="border-gray-200"
                                    onOpen={() => navigate('/zakazky')}
                                    onAddTask={() => console.log('Add task', o.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Chyba objednat */}
                    <div className="flex-1 flex flex-col gap-4 min-w-[240px]">
                        <h2 className="font-medium text-sm text-amber-600 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Chýba objednať ({orderTasks.length})
                        </h2>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                            {orderTasks.map(t => (
                                <div key={t.id} className="p-3 border rounded-lg shadow-sm bg-amber-50 border-amber-200">
                                    <h3 className="font-medium text-sm text-amber-900">{t.title}</h3>
                                    {t.orderId && <p className="text-xs text-amber-700 mt-1">Zákazka: {t.orderId}</p>}
                                    <div className="mt-3 flex gap-2">
                                        <button className="text-xs bg-white border border-amber-300 text-amber-800 px-2 py-1 rounded shadow-sm">
                                            ✓ Objednané
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
