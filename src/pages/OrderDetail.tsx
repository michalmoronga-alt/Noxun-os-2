
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRepository } from '@/data/DataProvider';
import type { Order, Task, Agreement } from '@/domain/types';

export default function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const repo = useRepository();

    const [order, setOrder] = useState<Order | undefined>(undefined);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [agreements, setAgreements] = useState<Agreement[]>([]);

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newAgreementTitle, setNewAgreementTitle] = useState('');

    const [addingTaskToStep, setAddingTaskToStep] = useState<string | null>(null);
    const [stepTaskTitle, setStepTaskTitle] = useState('');

    const refreshData = async () => {
        if (!id) return;
        const o = await repo.getOrder(id);
        const t = await repo.getTasks();
        const a = await repo.getAgreements();

        setOrder(o);
        setTasks(t.filter(task => task.orderId === id));
        if (o) {
            setAgreements(a.filter(agree => agree.clientName === o.clientName));
        }
    };

    useEffect(() => {
        refreshData();
    }, [id, repo]);

    const handleToggleTask = async (taskId: string) => {
        await repo.toggleTask(taskId);
        refreshData();
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !id) return;

        await repo.addTask({
            id: `t_${Date.now()}`,
            title: newTaskTitle,
            completed: false,
            orderId: id
        });
        setNewTaskTitle('');
        refreshData();
    };

    const handleAddAgreement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAgreementTitle.trim() || !order) return;

        // Default to current year for demo
        await repo.addAgreement({
            id: `a_${Date.now()}`,
            title: newAgreementTitle,
            clientName: order.clientName,
            dateRange: { od: new Date().toISOString().split('T')[0], do: new Date().toISOString().split('T')[0] }
        });
        setNewAgreementTitle('');
        refreshData();
    };

    const handleAddStepTask = async (stepId: string) => {
        if (!stepTaskTitle.trim() || !id) return;

        await repo.addTask({
            id: `t_${Date.now()}`,
            title: stepTaskTitle,
            completed: false,
            status: 'todo', // Explicitly set status to trigger new logic if needed
            orderId: id,
            processStepId: stepId
        });
        setStepTaskTitle('');
        setAddingTaskToStep(null);
        refreshData();
    };

    if (!id) return <div>Invalid ID</div>;
    if (!order) return <div className="p-4">Načítavam... (alebo zákazka neexistuje)</div>;

    return (
        <div className="p-4 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground mb-2">
                    ← Späť
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">{order.title}</h1>
                        <div className="text-lg text-muted-foreground mt-1">{order.clientName}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'done' ? 'bg-green-100 text-green-800' :
                        order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order.status}
                    </div>
                </div>
                {order.dateRange && (
                    <div className="mt-2 text-sm font-mono bg-gray-100 inline-block px-2 py-1 rounded">
                        {order.dateRange.od} — {order.dateRange.do}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kroky */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        Kroky
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{order.steps.length}</span>
                    </h2>
                    <div className="border rounded-lg bg-card overflow-hidden">
                        {order.steps.length === 0 ? (
                            <div className="p-4 text-sm text-gray-500 text-center">Žiadne kroky</div>
                        ) : (
                            order.steps.map(step => {
                                const stepTasks = tasks.filter(t => t.processStepId === step.id);
                                const isAdding = addingTaskToStep === step.id;

                                return (
                                    <div key={step.id} className="border-b last:border-0 bg-white">
                                        <div className="p-3 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${step.status === 'done' ? 'bg-green-500' :
                                                    step.status === 'in-progress' ? 'bg-blue-500' :
                                                        'bg-gray-300'
                                                    }`} />
                                                <span className={step.status === 'done' ? 'text-gray-500' : 'font-medium'}>
                                                    {step.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wider ${step.status === 'done' ? 'bg-green-100 text-green-700' :
                                                        step.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {step.status === 'pending' ? 'Čaká' :
                                                        step.status === 'in-progress' ? 'Prebieha' :
                                                            step.status === 'done' ? 'Hotovo' : step.status}
                                                </span>
                                                <button
                                                    onClick={() => setAddingTaskToStep(step.id)}
                                                    className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded transition-colors"
                                                >
                                                    + Úloha
                                                </button>
                                            </div>
                                        </div>

                                        {/* Step Tasks */}
                                        {(stepTasks.length > 0 || isAdding) && (
                                            <div className="px-3 pb-3 pl-9 space-y-2">
                                                {stepTasks.map(t => (
                                                    <div key={t.id} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded border border-gray-100">
                                                        <input
                                                            type="checkbox"
                                                            checked={t.completed}
                                                            onChange={() => handleToggleTask(t.id)}
                                                            className="w-4 h-4 accent-primary cursor-pointer"
                                                        />
                                                        <span className={t.completed ? "line-through text-gray-400" : "text-gray-700"}>
                                                            {t.title}
                                                        </span>
                                                        <div className="ml-auto flex gap-1">
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${t.status === 'done' ? 'bg-green-50 text-green-600' :
                                                                t.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                                                                    'bg-gray-100 text-gray-500'
                                                                }`}>
                                                                {t.status || (t.completed ? 'DONE' : 'TODO')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}

                                                {isAdding && (
                                                    <form
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            handleAddStepTask(step.id);
                                                        }}
                                                        className="flex gap-2 animate-in fade-in slide-in-from-top-1"
                                                    >
                                                        <input
                                                            autoFocus
                                                            type="text"
                                                            className="flex-1 text-sm border rounded px-2 py-1"
                                                            placeholder="Názov úlohy..."
                                                            value={stepTaskTitle}
                                                            onChange={e => setStepTaskTitle(e.target.value)}
                                                            onBlur={() => {
                                                                // Optional: cancel on blur if empty?
                                                                // setAddingTaskToStep(null);
                                                            }}
                                                        />
                                                        <button type="submit" className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded">
                                                            OK
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setAddingTaskToStep(null)}
                                                            className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded"
                                                        >
                                                            Zrušiť
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Dohody */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        Dohody
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{agreements.length}</span>
                    </h2>
                    <div className="space-y-2">
                        {agreements.map(a => (
                            <div key={a.id} className="p-3 border rounded-lg bg-white shadow-sm">
                                <div className="font-medium text-sm">{a.title}</div>
                                <div className="text-xs text-gray-500 mt-1">{a.dateRange.od} - {a.dateRange.do}</div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddAgreement} className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 text-sm border rounded px-3 py-2"
                            placeholder="Nová dohoda..."
                            value={newAgreementTitle}
                            onChange={e => setNewAgreementTitle(e.target.value)}
                        />
                        <button type="submit" className="bg-secondary text-secondary-foreground text-sm px-4 py-2 rounded">
                            +
                        </button>
                    </form>
                </div>
            </div>

            {/* Ulohy */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    Úlohy
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">{tasks.length}</span>
                </h2>
                <div className="space-y-2">
                    {tasks.map(t => (
                        <div key={t.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white shadow-sm hover:shadow transition-shadow">
                            <input
                                type="checkbox"
                                checked={t.completed}
                                onChange={() => handleToggleTask(t.id)}
                                className="w-5 h-5 accent-primary cursor-pointer"
                            />
                            <span className={t.completed ? "line-through text-gray-400" : ""}>
                                {t.title}
                            </span>
                            {t.tags && t.tags.length > 0 && (
                                <div className="ml-auto flex gap-1">
                                    {t.tags.map(tag => (
                                        <span key={tag} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleAddTask} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 border rounded px-3 py-2 shadow-sm"
                        placeholder="Pridať novú úlohu k tejto zákazke..."
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                    />
                    <button type="submit" className="bg-primary text-primary-foreground font-medium px-4 py-2 rounded shadow">
                        Pridať
                    </button>
                </form>
            </div>
        </div>
    );
}
