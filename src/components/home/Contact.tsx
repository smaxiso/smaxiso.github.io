"use client";

import siteConfig from "@/data/site-config.json";
import { useState } from "react";

export default function Contact() {
    const { contact } = siteConfig;
    const { form } = contact;
    const [formData, setFormData] = useState<any>({});
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch(form.action, {
                method: form.method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({});
                // Reset after 5s
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section className="contact section" id="contact">
            <div className="container max-w-2xl">
                <h2 className="section-title text-center mb-12">{contact.sectionTitle}</h2>

                <div className="contact__container bg-surface-1 p-8 rounded-2xl shadow-lg border border-outline-variant">
                    {status === 'success' ? (
                        <div className="text-center p-8">
                            <i className="bx bx-check-circle text-5xl text-primary-500 mb-4"></i>
                            <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                            <p className="text-on-surface-variant">{form.messages.success}</p>
                        </div>
                    ) : (
                        <form id="contactForm" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {form.fields.filter(f => f.type !== 'textarea').map((field) => (
                                    <div key={field.id} className={`${field.name === 'subject' ? 'md:col-span-2' : ''}`}>
                                        <label htmlFor={field.id} className="block text-sm font-medium text-on-surface-variant mb-1">{field.label}</label>
                                        <input
                                            type={field.type}
                                            id={field.id}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            className="w-full px-4 py-3 rounded-lg bg-surface-0 border border-outline focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                                            onChange={handleChange}
                                            value={formData[field.name] || ''}
                                        />
                                    </div>
                                ))}
                            </div>

                            {form.fields.filter(f => f.type === 'textarea').map((field) => (
                                <div key={field.id}>
                                    <label htmlFor={field.id} className="block text-sm font-medium text-on-surface-variant mb-1">{field.label}</label>
                                    <textarea
                                        id={field.id}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        // @ts-ignore
                                        rows={field.rows || 4}
                                        required={field.required}
                                        className="w-full px-4 py-3 rounded-lg bg-surface-0 border border-outline focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                                        onChange={handleChange}
                                        value={formData[field.name] || ''}
                                    ></textarea>
                                </div>
                            ))}

                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className={`btn btn-primary w-full md:w-auto px-8 py-3 ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {status === 'submitting' ? <i className='bx bx-loader-alt animate-spin'></i> : <i className='bx bx-send'></i>}
                                    {form.submitButton.label}
                                </button>
                                {status === 'error' && <p className="text-red-500 mt-4 text-sm">{form.messages.error}</p>}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
