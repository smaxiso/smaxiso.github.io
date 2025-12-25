'use client'
import { useState, useEffect } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { Trash2, Upload, CheckCircle2, Circle } from 'lucide-react'

interface ResumeFile {
    id: number
    name: string
    url: string
    is_active: boolean
    created_at?: string
}

export function ResumeEditor() {
    const [resumes, setResumes] = useState<ResumeFile[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchResumes()
    }, [])

    const fetchResumes = async () => {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/resumes')
            const data = await res.json()
            setResumes(data)
        } catch (err) {
            console.error('Failed to fetch resumes', err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        if (resumes.length >= 5) {
            alert('Maximum 5 resumes allowed!')
            return
        }

        const file = e.target.files[0]
        const name = prompt('Enter a name for this resume (e.g. "Software Engineer 2024")')
        if (!name) return

        setUploading(true)
        try {
            const storageRef = ref(storage, `resumes/${Date.now()}_${file.name}`)
            const snapshot = await uploadBytes(storageRef, file)
            const downloadURL = await getDownloadURL(snapshot.ref)

            await fetch(process.env.NEXT_PUBLIC_API_URL + '/resumes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, url: downloadURL, is_active: false })
            })

            fetchResumes()
        } catch (err) {
            alert('Failed to upload resume')
        } finally {
            setUploading(false)
        }
    }

    const handleSetActive = async (resume: ResumeFile) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resumes/${resume.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...resume, is_active: true })
            })
            fetchResumes()
            alert('Active resume updated!')
        } catch (err) {
            alert('Failed to set active')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this resume?')) return
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resumes/${id}`, {
                method: 'DELETE'
            })
            fetchResumes()
        } catch (err) {
            alert('Failed to delete')
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Resume Files</h3>
                    <p className="text-sm text-slate-500">Upload up to 5 resumes. Mark one as active to display on your portfolio.</p>
                </div>
                <label className={`flex items-center gap-2 px-4 py-2 rounded ${resumes.length >= 5 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'} text-white`}>
                    <Upload size={16} />
                    {uploading ? 'Uploading...' : 'Upload Resume'}
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleUpload}
                        accept=".pdf"
                        disabled={resumes.length >= 5 || uploading}
                    />
                </label>
            </div>

            <div className="grid gap-4">
                {resumes.map(resume => (
                    <div key={resume.id} className={`flex items-center gap-4 p-4 border rounded-lg ${resume.is_active ? 'border-green-500 bg-green-50' : 'bg-white'}`}>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="font-medium">{resume.name}</h4>
                                {resume.is_active && (
                                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Active</span>
                                )}
                            </div>
                            <a href={resume.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate block max-w-md">
                                {resume.url}
                            </a>
                        </div>
                        <div className="flex gap-2">
                            {!resume.is_active && (
                                <button
                                    onClick={() => handleSetActive(resume)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                                    title="Set as active"
                                >
                                    <Circle size={20} />
                                </button>
                            )}
                            {resume.is_active && (
                                <div className="p-2 text-green-600">
                                    <CheckCircle2 size={20} />
                                </div>
                            )}
                            <button
                                onClick={() => handleDelete(resume.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {resumes.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        No resumes uploaded yet. Click "Upload Resume" to add one.
                    </div>
                )}
            </div>
        </div>
    )
}
