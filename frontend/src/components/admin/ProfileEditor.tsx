'use client'
import { useState, useEffect } from 'react'
import { SiteConfig } from '@/context/ProfileContext'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { uploadFile } from '@/lib/cloudinary' // Replaced Firebase
// import { storage } from '@/lib/firebase' // Remove this
import { useToast } from '@/context/ToastContext'

export function ProfileEditor() {
    const { user } = useAuth()
    const { showToast } = useToast()
    const [config, setConfig] = useState<SiteConfig | null>(null)
    const [originalConfig, setOriginalConfig] = useState<SiteConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    const hasChanges = config && originalConfig && JSON.stringify(config) !== JSON.stringify(originalConfig)

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_API_URL + '/config')
            .then(res => res.json())
            .then(data => {
                setConfig(data)
                setOriginalConfig(data)
                setLoading(false)
            })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const token = await user?.getIdToken()
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(config)
            })
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                // Handle FastAPI validation errors (422)
                if (errorData.detail) {
                    if (Array.isArray(errorData.detail)) {
                        // FastAPI validation errors
                        const messages = errorData.detail.map((err: any) =>
                            `${err.loc.join('.')}: ${err.msg}`
                        ).join(', ');
                        throw new Error(messages);
                    } else if (typeof errorData.detail === 'string') {
                        throw new Error(errorData.detail);
                    }
                }
                throw new Error("Failed to update profile");
            }
            setOriginalConfig(config)
            showToast("Profile updated successfully!", "success")
        } catch (err: any) {
            console.error('Profile update error:', err);
            showToast(err.message || "Error updating profile", "error")
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!config) return
        const val = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
        setConfig({ ...config, [e.target.name]: val })
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteConfig) => {
        if (!e.target.files || e.target.files.length === 0 || !config) return
        const file = e.target.files[0]
        setUploading(true)
        setUploading(true)
        try {
            const downloadURL = await uploadFile(file)
            setConfig({ ...config, [field]: downloadURL })
        } catch (err) {
            console.error(err)
            showToast("Failed to upload image", "error")
        } finally {
            setUploading(false)
        }
    }

    if (loading) return <div>Loading...</div>
    if (!config) return <div>Error loading config</div>

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">General Info</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <input name="name" value={config.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hero Title</label>
                        <input name="title" value={config.title} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Greeting</label>
                        <input name="greeting" value={config.greeting} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hero Subtitle</label>
                        <textarea name="subtitle" value={config.subtitle} onChange={handleChange} rows={3} className="w-full p-2 border rounded" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Profile Image</label>
                        <div className="flex flex-col gap-2">
                            {config.profile_image && (
                                <div className="w-24 h-24 rounded-lg overflow-hidden border bg-slate-100">
                                    <img
                                        src={config.profile_image.startsWith('http') ? config.profile_image : (config.profile_image.startsWith('/') ? config.profile_image : `/${config.profile_image}`)}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex gap-2">
                                <input className="w-full p-2 border rounded text-xs sm:text-sm" value={config.profile_image} readOnly />
                                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border rounded px-3 py-2 flex items-center shrink-0">
                                    <i className='bx bx-upload'></i>
                                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'profile_image')} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">About Section</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">About Title</label>
                        <input name="about_title" value={config.about_title} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">About Description</label>
                        <textarea name="about_description" value={config.about_description} onChange={handleChange} rows={4} className="w-full p-2 border rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Years Exp.</label>
                            <input type="number" name="years_experience" value={config.years_experience} onChange={handleChange} className="w-full p-2 border rounded" min="0" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Months</label>
                            <input type="number" name="experience_months" value={config.experience_months || 0} onChange={handleChange} className="w-full p-2 border rounded" min="0" max="11" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">About Image</label>
                        <div className="flex flex-col gap-2">
                            {config.about_image && (
                                <div className="w-full aspect-video rounded-lg overflow-hidden border bg-slate-100 max-h-40">
                                    <img
                                        src={config.about_image.startsWith('http') ? config.about_image : (config.about_image.startsWith('/') ? config.about_image : `/${config.about_image}`)}
                                        alt="About Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex gap-2">
                                <input className="w-full p-2 border rounded text-xs sm:text-sm" value={config.about_image} readOnly />
                                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border rounded px-3 py-2 flex items-center shrink-0">
                                    <i className='bx bx-upload'></i>
                                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'about_image')} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Resume PDF</label>
                        <div className="flex gap-2">
                            <input className="w-full p-2 border rounded" value={config.resume_url} readOnly />
                            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border rounded px-3 py-2">
                                <i className='bx bx-upload'></i>
                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'resume_url')} accept=".pdf" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {hasChanges && (
                <div className="sticky bottom-4 flex justify-end">
                    <button
                        disabled={saving}
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transform transition hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-4 duration-300"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <i className='bx bx-save text-xl'></i>}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </form>
    )
}
