"use client";

import { useState, useEffect } from "react";
import { getExperiences, createExperience, updateExperience, deleteExperience } from "@/lib/api";
import { Experience } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function ExperienceEditor() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Omit<Experience, "id">>({
        company: "",
        company_logo: "",
        title: "",
        start_date: "",
        end_date: "",
        description: "",
        technologies: [],
        order: 0,
    });

    const { user } = useAuth();

    useEffect(() => {
        fetchExperiences();
    }, []);

    async function fetchExperiences() {
        try {
            const data = await getExperiences();
            setExperiences(data);
        } catch (error) {
            console.error("Failed to fetch experiences:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const token = await user?.getIdToken();
        if (!token) return;

        try {
            if (editingId) {
                await updateExperience(editingId, formData, token);
            } else {
                await createExperience(formData, token);
            }
            await fetchExperiences();
            resetForm();
        } catch (error) {
            console.error("Failed to save experience:", error);
            alert("Failed to save experience");
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Are you sure you want to delete this experience?")) return;

        const token = await user?.getIdToken();
        if (!token) return;

        try {
            await deleteExperience(id, token);
            await fetchExperiences();
        } catch (error) {
            console.error("Failed to delete experience:", error);
            alert("Failed to delete experience");
        }
    }

    function handleEdit(exp: Experience) {
        setEditingId(exp.id);
        setFormData({
            company: exp.company,
            company_logo: exp.company_logo || "",
            title: exp.title,
            start_date: exp.start_date,
            end_date: exp.end_date || "",
            description: exp.description || "",
            technologies: exp.technologies || [],
            order: exp.order,
        });
        setShowForm(true);
    }

    function resetForm() {
        setFormData({
            company: "",
            company_logo: "",
            title: "",
            start_date: "",
            end_date: "",
            description: "",
            technologies: [],
            order: 0,
        });
        setEditingId(null);
        setShowForm(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Work Experience</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? "Cancel" : "Add Experience"}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Company *</label>
                            <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full p-2 border rounded bg-white border-slate-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Job Title *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-2 border rounded bg-white border-slate-300"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Start Date * (YYYY-MM)</label>
                            <input
                                type="text"
                                required
                                placeholder="2024-01"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="w-full p-2 border rounded bg-white border-slate-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">End Date (YYYY-MM or empty)</label>
                            <input
                                type="text"
                                placeholder="Present"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="w-full p-2 border rounded bg-white border-slate-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                className="w-full p-2 border rounded bg-white border-slate-300"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Company Logo URL</label>
                        <input
                            type="text"
                            placeholder="https://..."
                            value={formData.company_logo}
                            onChange={(e) => setFormData({ ...formData, company_logo: e.target.value })}
                            className="w-full p-2 border rounded bg-white border-slate-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded bg-white border-slate-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Technologies (comma-separated)</label>
                        <input
                            type="text"
                            placeholder="Python, AWS, Kafka, Docker"
                            value={formData.technologies?.join(", ") || ""}
                            onChange={(e) => setFormData({ ...formData, technologies: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                            className="w-full p-2 border rounded bg-white border-slate-300"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            {editingId ? "Update" : "Create"} Experience
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* List */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <div
                            key={exp.id}
                            className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-start"
                        >
                            <div>
                                <h4 className="font-bold text-lg text-slate-900">{exp.title}</h4>
                                <p className="text-sm text-slate-600">{exp.company}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {exp.start_date} - {exp.end_date || "Present"} (Order: {exp.order})
                                </p>
                                {exp.technologies && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {exp.technologies.slice(0, 5).map((tech, i) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-white rounded border border-slate-200 text-slate-600">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(exp)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
