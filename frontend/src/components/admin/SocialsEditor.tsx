'use client'
import { useState, useEffect } from 'react'
import { SocialLink } from '@/context/ProfileContext'
import { Trash2, Plus, GripVertical } from 'lucide-react'

export function SocialsEditor() {
    const [socials, setSocials] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)

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

    const handleAdd = async () => {
        const platform = prompt("Platform Name (e.g. linkedin, twitter)")
        if (!platform) return
        const url = prompt("URL")
        const icon = prompt("Icon Class (e.g. bx bxl-linkedin)")

        if (platform && url) {
            await fetch(process.env.NEXT_PUBLIC_API_URL + '/socials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, url, icon: icon || 'bx bx-link', is_active: true })
            })
            fetchSocials()
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <button onClick={handleAdd} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    <Plus size={16} /> Add Link
                </button>
            </div>

            <div className="grid gap-4">
                {socials.map(social => (
                    <div key={social.id} className="flex items-center gap-4 p-4 border rounded bg-white shadow-sm">
                        <div className="p-2 bg-slate-100 rounded text-xl">
                            <i className={social.icon}></i>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium capitalize">{social.platform}</p>
                            <p className="text-sm text-slate-500 truncate">{social.url}</p>
                        </div>
                        <button onClick={() => handleDelete(social.id)} className="text-red-500 hover:text-red-700 p-2">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
