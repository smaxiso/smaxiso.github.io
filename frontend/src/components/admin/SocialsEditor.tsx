'use client'
import { useState, useEffect } from 'react'
import { SocialLink, getSocials, createSocial, updateSocial, deleteSocial } from '@/lib/api'
import { Trash2, Plus, Edit2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { IconPicker } from './IconPicker'
import { SOCIAL_PLATFORM_PRESETS, detectPlatformFromUrl } from '@/lib/iconLibrary'
import { useToast } from '@/context/ToastContext'

export function SocialsEditor() {
    const { user } = useAuth()
    const { showToast } = useToast()
    const [socials, setSocials] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<SocialLink | null>(null)
    const [original, setOriginal] = useState<SocialLink | null>(null)
    const [showIconPicker, setShowIconPicker] = useState(false)

    const hasChanges = editing && original && JSON.stringify(editing) !== JSON.stringify(original)

    useEffect(() => {
        loadSocials()
    }, [])

    const loadSocials = () => {
        getSocials()
            .then(data => {
                setSocials(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this link?")) return
        try {
            const token = await user?.getIdToken()
            if (!token) return;
            await deleteSocial(id, token)
            loadSocials()
            showToast("Link deleted", "success")
        } catch (error) {
            console.error(error)
            showToast("Failed to delete link", "error")
        }
    }

    const handleAdd = () => {
        const newSocial = { id: 0, platform: '', url: '', icon: 'bx bx-link', is_active: true };
        setEditing(newSocial)
        setOriginal(newSocial)
    }

    const handleEdit = (social: SocialLink) => {
        setEditing({ ...social })
        setOriginal({ ...social })
    }

    const handlePlatformChange = (platform: string) => {
        const preset = SOCIAL_PLATFORM_PRESETS.find(p => p.platform === platform);
        if (preset && editing) {
            setEditing({
                ...editing,
                platform: preset.platform,
                icon: preset.icon,
            });
        } else if (editing) {
            setEditing({ ...editing, platform });
        }
    }

    const handleUrlChange = (url: string) => {
        if (!editing) return;

        // Auto-detect platform from URL
        const detected = detectPlatformFromUrl(url);
        if (detected && (!editing.platform || editing.platform === '')) {
            setEditing({
                ...editing,
                url,
                platform: detected.platform,
                icon: detected.icon,
            });
        } else {
            setEditing({ ...editing, url });
        }
    }

    const handleSave = async () => {
        if (!editing) return

        try {
            const token = await user?.getIdToken()
            if (!token) return;

            const payload = {
                platform: editing.platform,
                url: editing.url,
                icon: editing.icon,
                is_active: editing.is_active
            };

            if (editing.id === 0) {
                await createSocial(payload, token)
            } else {
                await updateSocial(editing.id, payload, token)
            }

            setEditing(null)
            loadSocials()
            showToast("Social link saved", "success")
        } catch (error) {
            console.error(error)
            showToast("Failed to save link", "error")
        }
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
                            <select
                                value={editing.platform}
                                onChange={e => handlePlatformChange(e.target.value)}
                                className="w-full p-2 border rounded text-sm"
                            >
                                <option value="">Select a platform...</option>
                                {SOCIAL_PLATFORM_PRESETS.map(preset => (
                                    <option key={preset.platform} value={preset.platform}>
                                        {preset.platform}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">URL</label>
                            <input
                                value={editing.url}
                                onChange={e => handleUrlChange(e.target.value)}
                                className="w-full p-2 border rounded text-sm"
                                placeholder={SOCIAL_PLATFORM_PRESETS.find(p => p.platform === editing.platform)?.placeholder || 'https://...'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Icon</label>
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2 border rounded p-2 bg-white">
                                    <i className={`${editing.icon} text-2xl text-slate-700`}></i>
                                    <code className="text-xs text-slate-600 truncate">
                                        {editing.icon}
                                    </code>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowIconPicker(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap text-sm"
                                >
                                    Change Icon
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <button onClick={() => { setEditing(null); setOriginal(null); }} className="w-full sm:w-auto px-4 py-2 border rounded">Cancel</button>
                            {hasChanges && (
                                <button onClick={handleSave} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 animate-in fade-in slide-in-from-right-2 duration-200">
                                    Save
                                </button>
                            )}
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

            {showIconPicker && (
                <IconPicker
                    value={editing?.icon || ''}
                    onChange={(icon) => setEditing({ ...editing!, icon })}
                    onClose={() => setShowIconPicker(false)}
                    category="social"
                    title="Choose Social Icon"
                />
            )}
        </div>
    )
}
