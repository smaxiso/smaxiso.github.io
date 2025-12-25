'use client'
import { useState, useEffect } from 'react'
import { SiteConfig } from '@/context/ProfileContext'
import { Loader2 } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export function ProfileEditor() {
    const [config, setConfig] = useState<SiteConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_API_URL + '/config')
            .then(res => res.json())
            .then(data => {
                setConfig(data)
                setLoading(false)
            })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            })
            if (!res.ok) throw new Error("Failed to update")
            alert("Profile updated successfully! Refresh site to see changes.")
        } catch (err) {
            alert("Error updating profile")
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
        try {
            const storageRef = ref(storage, `profile/${Date.now()}_${file.name}`)
            const snapshot = await uploadBytes(storageRef, file)
            const downloadURL = await getDownloadURL(snapshot.ref)
            setConfig({ ...config, [field]: downloadURL })
        } catch (err) {
            console.error(err)
            alert("Failed to upload image")
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
                        <div className="flex gap-2">
                            <input className="w-full p-2 border rounded" value={config.profile_image} readOnly />
                            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border rounded px-3 py-2">
                                <i className='bx bx-upload'></i>
                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'profile_image')} accept="image/*" />
                            </label>
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
                            <input type="number" name="years_experience" value={config.years_experience} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Projects Done</label>
                            <input type="number" name="projects_completed" value={config.projects_completed} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">About Image</label>
                        <div className="flex gap-2">
                            <input className="w-full p-2 border rounded" value={config.about_image} readOnly />
                            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border rounded px-3 py-2">
                                <i className='bx bx-upload'></i>
                                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'about_image')} accept="image/*" />
                            </label>
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

            <button disabled={saving} type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    )
}
