'use client'
import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { searchIcons, IconDefinition, TECH_ICONS, SOCIAL_ICONS, GENERAL_ICONS } from '@/lib/iconLibrary';

interface IconPickerProps {
    value: string;
    onChange: (iconClass: string) => void;
    onClose: () => void;
    category?: 'social' | 'tech' | 'general' | 'all';
    title?: string;
}

export function IconPicker({ value, onChange, onClose, category = 'all', title = 'Choose an Icon' }: IconPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<'social' | 'tech' | 'general' | 'all'>(category);

    const filteredIcons = useMemo(() => {
        return searchIcons(searchQuery, activeCategory === 'all' ? undefined : activeCategory);
    }, [searchQuery, activeCategory]);

    const handleSelect = (iconClass: string) => {
        onChange(iconClass);
        onClose();
    };

    const getCategoryIcons = (cat: 'social' | 'tech' | 'general') => {
        switch (cat) {
            case 'social': return SOCIAL_ICONS;
            case 'tech': return TECH_ICONS;
            case 'general': return GENERAL_ICONS;
        }
    };

    const categories = [
        { id: 'all' as const, label: 'All', count: TECH_ICONS.length + SOCIAL_ICONS.length + GENERAL_ICONS.length },
        { id: 'tech' as const, label: 'Tech', count: TECH_ICONS.length },
        { id: 'social' as const, label: 'Social', count: SOCIAL_ICONS.length },
        { id: 'general' as const, label: 'General', count: GENERAL_ICONS.length },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search icons..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="px-4 pt-3 border-b">
                    <div className="flex gap-2 overflow-x-auto">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-t-lg transition whitespace-nowrap ${activeCategory === cat.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 hover:bg-slate-200'
                                    }`}
                            >
                                {cat.label} <span className="text-xs opacity-75">({cat.count})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Icon Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    {filteredIcons.length > 0 ? (
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                            {filteredIcons.map((icon) => (
                                <button
                                    key={icon.class}
                                    onClick={() => handleSelect(icon.class)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition group hover:border-blue-500 hover:bg-blue-50 ${value === icon.class ? 'border-blue-600 bg-blue-50' : 'border-slate-200'
                                        }`}
                                    title={icon.name}
                                >
                                    <i className={`${icon.class} text-2xl mb-1 ${value === icon.class ? 'text-blue-600' : 'text-slate-700 group-hover:text-blue-600'}`}></i>
                                    <span className="text-[10px] text-slate-600 text-center line-clamp-1">{icon.name}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <i className='bx bx-search text-4xl mb-2'></i>
                            <p className="text-sm">No icons found matching "{searchQuery}"</p>
                            <p className="text-xs mt-1">Try a different search term</p>
                        </div>
                    )}
                </div>

                {/* Footer - Current Selection */}
                {value && (
                    <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <i className={`${value} text-3xl text-blue-600`}></i>
                            <div>
                                <p className="text-xs text-slate-500">Selected Icon</p>
                                <code className="text-sm font-mono text-slate-700">{value}</code>
                            </div>
                        </div>
                        <button
                            onClick={() => handleSelect(value)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Select
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
