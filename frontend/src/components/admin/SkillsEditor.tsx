'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSkills, createSkill, updateSkill, deleteSkill } from '@/lib/api';
import { Skill } from '@/types';
import { Trash2, Plus, Edit2, Search } from 'lucide-react';
import { IconPicker } from './IconPicker';

export function SkillsEditor() {
    const { user } = useAuth();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
    const [originalSkill, setOriginalSkill] = useState<Partial<Skill> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showIconPicker, setShowIconPicker] = useState(false);

    const hasChanges = editingSkill && originalSkill && JSON.stringify(editingSkill) !== JSON.stringify(originalSkill);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getSkills();
            setSkills(data);
        } catch (err) {
            setError('Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSkill) return;

        try {
            const token = await user?.getIdToken() || '';
            if (editingSkill.id) {
                await updateSkill(editingSkill.id, editingSkill, token);
            } else {
                await createSkill(editingSkill, token);
            }
            setEditingSkill(null);
            fetchData();
        } catch (err) {
            setError('Failed to save skill');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;
        try {
            const token = await user?.getIdToken() || '';
            await deleteSkill(id, token);
            fetchData();
        } catch (err) {
            setError('Failed to delete skill');
        }
    };

    const filteredSkills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = Array.from(new Set(skills.map(s => s.category)));

    if (loading) return <div className="p-4 text-center">Loading skills...</div>;

    return (
        <div className="space-y-4 sm:space-y-6">
            {error && <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded text-sm">{error}</div>}

            {editingSkill ? (
                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{editingSkill.id ? 'Edit Skill' : 'New Skill'}</h2>
                    <form onSubmit={handleSave} className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-1">Name</label>
                                <input
                                    className="w-full border p-2 rounded text-sm"
                                    value={editingSkill.name || ''}
                                    onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })}
                                    required
                                    placeholder="e.g. React"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-1">Category</label>
                                <input
                                    list="categories"
                                    className="w-full border p-2 rounded text-sm"
                                    value={editingSkill.category || ''}
                                    onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value })}
                                    required
                                    placeholder="e.g. Frontend"
                                />
                                <datalist id="categories">
                                    {categories.map(cat => <option key={cat} value={cat} />)}
                                </datalist>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-1">Icon</label>
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2 border rounded p-2 bg-slate-50">
                                    <i className={`${editingSkill.icon || 'bx bx-code'} text-2xl text-slate-700`}></i>
                                    <code className="text-xs text-slate-600 truncate">
                                        {editingSkill.icon || 'No icon selected'}
                                    </code>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowIconPicker(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap text-sm"
                                >
                                    Choose Icon
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-1">Level (0-100)</label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded text-sm"
                                value={editingSkill.level || "0"}
                                onChange={e => setEditingSkill({ ...editingSkill, level: e.target.value })}
                                min="0"
                                max="100"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                            <button type="button" onClick={() => { setEditingSkill(null); setOriginalSkill(null); }} className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded">Cancel</button>
                            {hasChanges && (
                                <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Save Skill
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search skills..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => {
                                const newSkill = { name: '', category: '', level: "80", icon: 'bx bx-code-alt' };
                                setEditingSkill(newSkill);
                                setOriginalSkill(newSkill);
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
                        >
                            <i className='bx bx-plus'></i> Add Skill
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {filteredSkills.map(skill => (
                            <div key={skill.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 bg-slate-50 rounded text-xl">
                                        <i className={skill.icon}></i>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm truncate">{skill.name}</h3>
                                        <p className="text-xs text-slate-500 truncate">{skill.category} • {skill.level}%</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setEditingSkill(skill); setOriginalSkill(skill); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => skill.id && handleDelete(skill.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredSkills.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed text-slate-500">
                            No skills found matching your search.
                        </div>
                    )}
                </>
            )}

            {showIconPicker && (
                <IconPicker
                    value={editingSkill?.icon || ''}
                    onChange={(icon) => setEditingSkill({ ...editingSkill, icon })}
                    onClose={() => setShowIconPicker(false)}
                    category="tech"
                    title="Choose Skill Icon"
                />
            )}
        </div>
    );
}
