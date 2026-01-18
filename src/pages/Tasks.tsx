
import { useEffect, useState } from 'react';
import { useRepository } from '@/data/DataProvider';
import type { Task } from '@/domain/types';

export default function Tasks() {
    const repo = useRepository();
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        repo.getTasks().then(setTasks);
    }, [repo]);

    const handleToggle = async (id: string) => {
        await repo.toggleTask(id);
        setTasks(await repo.getTasks());
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Úlohy</h1>
            <div className="space-y-2">
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-2 p-3 border rounded">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggle(task.id)}
                            className="w-4 h-4"
                        />
                        <span className={task.completed ? "line-through text-gray-400" : ""}>
                            {task.title}
                        </span>
                        {task.orderId && (
                            <span className="text-xs text-blue-500 ml-auto">
                                Zákazka: {task.orderId}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
