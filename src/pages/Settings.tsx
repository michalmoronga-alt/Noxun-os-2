import { useState, useEffect } from 'react';
import { useRepository } from '@/data/DataProvider';
import type { ProcessTemplate, TemplateStep } from '@/domain/types';

export default function Settings() {
    const repo = useRepository();
    const [templates, setTemplates] = useState<ProcessTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Edit state
    const [editName, setEditName] = useState('');
    const [editSteps, setEditSteps] = useState<TemplateStep[]>([]);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        const t = await repo.getTemplates();
        setTemplates([...t]); // Copy to trigger re-render if needed
    };

    const handleSelectTemplate = (t: ProcessTemplate) => {
        setSelectedTemplateId(t.id);
        setEditName(t.name);
        setEditSteps([...t.steps]); // deep copy steps? Steps are objects, shallow copy array is fine for structure
        setIsEditing(false);
    };

    const handleCreateTemplate = () => {
        // We'll just set it as "selected" but effectively it's a "draft" until saved?
        // Or we create it in repo immediately? For simplicity, create immediately or "draft" mode.
        // Let's go with "draft" in edit state.
        setSelectedTemplateId(null); // Deselect existing
        // Wait, better to have a "New" mode.
        // Let's just create it in memory and select it.
        const t: ProcessTemplate = {
            id: `tpl_${Date.now()}`,
            name: 'Nová šablóna',
            isDefault: false,
            steps: []
        };
        setTemplates([...templates, t]);
        setSelectedTemplateId(t.id);
        setEditName(t.name);
        setEditSteps([]);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!selectedTemplateId) return;
        const template = templates.find(t => t.id === selectedTemplateId);
        if (!template) return;

        const updated: ProcessTemplate = {
            ...template,
            name: editName,
            steps: editSteps
        };

        await repo.saveTemplate(updated);
        await loadTemplates();
        setIsEditing(false);
    };

    const handleSetDefault = async (e: React.MouseEvent, tpl: ProcessTemplate) => {
        e.stopPropagation();
        // Unset distinct others? Repo doesn't support batch update easily?
        // We can do it in memory logic or loop.
        const all = await repo.getTemplates();
        for (const t of all) {
            if (t.id === tpl.id) t.isDefault = true;
            else t.isDefault = false;
            await repo.saveTemplate(t);
        }
        await loadTemplates();
    };

    // Step operations
    const handleAddStep = () => {
        const newStep: TemplateStep = {
            id: `ts_${Date.now()}`,
            name: 'Nový krok'
        };
        setEditSteps([...editSteps, newStep]);
        setIsEditing(true);
    };

    const handleRemoveStep = (idx: number) => {
        const n = [...editSteps];
        n.splice(idx, 1);
        setEditSteps(n);
        setIsEditing(true);
    };

    const handleStepNameChange = (idx: number, val: string) => {
        const n = [...editSteps];
        n[idx] = { ...n[idx], name: val };
        setEditSteps(n);
        setIsEditing(true);
    };

    const handleMoveStep = (idx: number, direction: -1 | 1) => {
        if ((direction === -1 && idx === 0) || (direction === 1 && idx === editSteps.length - 1)) return;
        const n = [...editSteps];
        const temp = n[idx];
        n[idx] = n[idx + direction];
        n[idx + direction] = temp;
        setEditSteps(n);
        setIsEditing(true);
    };

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nastavenia</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Template List */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Procesné šablóny</h2>
                        <button onClick={handleCreateTemplate} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded">
                            + Nová
                        </button>
                    </div>
                    <div className="border rounded-lg overflow-hidden bg-white">
                        {templates.map(t => (
                            <div
                                key={t.id}
                                onClick={() => handleSelectTemplate(t)}
                                className={`p-3 border-b last:border-0 cursor-pointer flex justify-between items-center transition-colors ${selectedTemplateId === t.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div>
                                    <div className="font-medium">{t.name}</div>
                                    <div className="text-xs text-gray-500">{t.steps.length} krokov</div>
                                </div>
                                {t.isDefault && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                        Default
                                    </span>
                                )}
                                {!t.isDefault && (
                                    <button
                                        onClick={(e) => handleSetDefault(e, t)}
                                        className="text-xs text-gray-400 hover:text-primary p-1"
                                        title="Nastaviť ako predvolenú"
                                    >
                                        ★
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Template Details */}
                <div className="md:col-span-2">
                    {selectedTemplate ? (
                        <div className="bg-card border rounded-lg p-6 space-y-6">
                            <div className="flex justify-between items-center border-b pb-4">
                                <div className="flex-1 mr-4">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Názov šablóny</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => {
                                            setEditName(e.target.value);
                                            setIsEditing(true);
                                        }}
                                        className="w-full text-lg font-bold border-none p-0 focus:ring-0 bg-transparent placeholder-gray-300"
                                        placeholder="Názov šablóny"
                                    />
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={handleSave}
                                        className="bg-primary text-primary-foreground px-4 py-2 rounded shadow-sm hover:shadow transition-all"
                                    >
                                        Uložiť zmeny
                                    </button>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 mb-3 flex justify-between items-center">
                                    DEFINÍCIA KROKOV
                                    <span className="text-xs font-normal bg-gray-100 px-2 py-0.5 rounded">{editSteps.length}</span>
                                </h3>
                                <div className="space-y-2">
                                    {editSteps.map((step, idx) => (
                                        <div key={step.id || idx} className="flex items-center gap-2 p-3 bg-white border rounded shadow-sm group">
                                            <div className="flex flex-col gap-1 text-gray-300">
                                                <button
                                                    disabled={idx === 0}
                                                    onClick={() => handleMoveStep(idx, -1)}
                                                    className="hover:text-gray-600 disabled:opacity-30 disabled:hover:text-gray-300"
                                                >
                                                    ▲
                                                </button>
                                                <button
                                                    disabled={idx === editSteps.length - 1}
                                                    onClick={() => handleMoveStep(idx, 1)}
                                                    className="hover:text-gray-600 disabled:opacity-30 disabled:hover:text-gray-300"
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                            <div className="font-mono text-gray-400 text-sm w-6 text-center">{idx + 1}.</div>
                                            <input
                                                type="text"
                                                value={step.name}
                                                onChange={(e) => handleStepNameChange(idx, e.target.value)}
                                                className="flex-1 border-none focus:ring-0 bg-transparent text-sm"
                                                placeholder="Názov kroku"
                                            />
                                            <button
                                                onClick={() => handleRemoveStep(idx)}
                                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 px-2 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleAddStep}
                                    className="mt-4 w-full py-3 border-2 border-dashed border-gray-200 rounded text-gray-400 hover:border-primary/50 hover:text-primary transition-colors flex justify-center items-center gap-2 font-medium"
                                >
                                    + Pridať krok
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400 border-2 border-dashed rounded-lg">
                            Vyberte šablónu na úpravu
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
