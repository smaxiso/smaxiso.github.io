'use client'
import { useState, useEffect } from 'react'
import { SocialLink } from '@/context/ProfileContext'
import { Trash2, Plus, Edit2 } from 'lucide-react'

export function SocialsEditor() {
    const [socials, setSocials] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<SocialLink | null>(null)

    useEffect(() => {
        fetchSocials()
    }, [])

    const fetchSocials = () => {
        fetch(process.env.NEXT_PUBLIC_API_URL + '/socials')
            .then(res => res.json())
            .then(data => {
                setSocials(data)
                setLoading(false)
            })
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this link?")) return
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/socials/${id}`, { method: 'DELETE' })
        fetchSocials()
    }

    const handleAdd = () => {
        setEditing({ id: 0, platform: '', url: '', icon: 'bx bx-link', is_active: true })
    }

    const handleEdit = (social: SocialLink) => {
        setEditing({ ...social })
    }

    const handleSave = async () => {
        if (!editing) return

        if (editing.id === 0) {
            // Create new
            await fetch(process.env.NEXT_PUBLIC_API_URL + '/socials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform: editing.platform, url: editing.url, icon: editing.icon, is_active: editing.is_active })
            })
        } else {
            // Update existing
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/socials/${editing.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform: editing.platform, url: editing.url, icon: editing.icon, is_active: editing.is_active })
            })
        }

        setEditing(null)
        fetchSocials()
    }

    if (loading) return <div className="p-4 text-center">Loading...</div>

    return (
        <div className="space-y-4 sm:space-y-6">
            {editing ? (
                <div className="bg-slate-50 p-4 rounded-lg border">
                    <h3 className="font-semibold mb-4">{editing.id === 0 ? 'Add Social Link' : 'Edit Social Link'}</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Platform</label>
                            <input
                                value={editing.platform}
                                onChange={e => setEditing({ ...editing, platform: e.target.value })}
                                className="w-full p-2 border rounded text-sm"
                                placeholder="e.g. linkedin, twitter"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">URL</label>
                            <input
                                value={editing.url}
                                onChange={e => setEditing({ ...editing, url: e.target.value })}
                                className="w-full p-2 border rounded text-sm"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Icon Class</label>
                            <input
                                value={editing.icon}
                                onChange={e => setEditing({ ...editing, icon: e.target.value })}
                                className="w-full p-2 border rounded text-sm"
                                placeholder="bx bxl-linkedin"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <button onClick={() => setEditing(null)} className="w-full sm:w-auto px-4 py-2 border rounded">Cancel</button>
                            <button onClick={handleSave} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <h3 className="text-lg font-semibold">Social Media Links</h3>
                        <button onClick={handleAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
                            <Plus size={16} /> Add Link
                        </button>
                    </div>

                    <div className="grid gap-3 sm:gap-4">
                        {socials.map(social => (
                            <div key={social.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 border rounded bg-white shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    <div className="p-2 bg-slate-100 rounded text-lg sm:text-xl flex-shrink-0">
                                        <i className={social.icon}></i>
                                    </div>
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <p className="font-medium capitalize text-sm sm:text-base">{social.platform}</p>
                                        <p className="text-xs sm:text-sm text-slate-500 truncate break-all">{social.url}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between sm:justify-end gap-2 flex-shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 mt-1 sm:mt-0">
                                    <button onClick={() => handleEdit(social)} className="flex-1 sm:flex-none flex items-center justify-center gap-1 p-2 text-blue-500 hover:text-blue-700 rounded border sm:border-0 border-blue-100">
                                        <Edit2 size={16} />
                                        <span className="sm:hidden text-xs font-medium">Edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(social.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1 p-2 text-red-500 hover:text-red-700 rounded border sm:border-0 border-red-100">
                                        <Trash2 size={16} />
                                        <span className="sm:hidden text-xs font-medium">Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
