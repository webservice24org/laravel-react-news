"use client"
declare function route(name: string, params?: any): string;
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useState } from "react";
import { router } from "@inertiajs/react";


interface Menu {
    id: number;
    title: string;
    url?: string;
    parent_id?: number | null;
    children?: Menu[];
}

interface Category {
    id: number;
    name: string;
}

interface Props {
    menus: Menu[];
    categories: Category[];
}

export default function MenuMaker({ menus, categories }: Props) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [parentId, setParentId] = useState<number | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.post(
        route('admin.menus.store'),
        {
            title,
            url,
            parent_id: parentId,
            category_id: categoryId
        },
        {
            preserveScroll: true,
            onSuccess: () => {
                // optional toast/notification
                console.log("Menu item added successfully!");
            }
        }
    );

    // Reset form fields
    setTitle('');
    setUrl('');
    setParentId(null);
    setCategoryId(null);
};

    // Render nested menus recursively
    const renderMenu = (menu: Menu, level = 0) => (
        <div key={menu.id} style={{ marginLeft: level * 20 }}>
            <p>{menu.title} {menu.url ? `(${menu.url})` : ''}</p>
            {menu.children && menu.children.map(child => renderMenu(child, level + 1))}
        </div>
    );

    return (
        <AppLayout breadcrumbs={[{title:"Menu Maker", href:route('admin.menus')}]} >
            <Head title="Menu Maker" />
            <div className="p-4 space-y-6">

                {/* Add Menu Item Form */}
                <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
                    <h2 className="font-bold text-lg">Add Menu Item</h2>

                    <div>
                        <label>Title</label>
                        <input type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full border px-2 py-1 rounded" required/>
                    </div>

                    <div>
                        <label>URL (optional)</label>
                        <input type="text" value={url} onChange={e=>setUrl(e.target.value)} className="w-full border px-2 py-1 rounded"/>
                    </div>

                    <div>
                        <label>Parent Menu (optional)</label>
                        <select value={parentId || ''} onChange={e=>setParentId(e.target.value ? Number(e.target.value) : null)} className="w-full border px-2 py-1 rounded">
                            <option value="">-- None --</option>
                            {menus.map(menu=>(
                                <option key={menu.id} value={menu.id}>{menu.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Category (optional)</label>
                        <select value={categoryId || ''} onChange={e=>setCategoryId(e.target.value ? Number(e.target.value) : null)} className="w-full border px-2 py-1 rounded">
                            <option value="">-- None --</option>
                            {categories.map(cat=>(
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add Menu</button>
                </form>

                {/* Menu Tree */}
                <div className="p-4 border rounded">
                    <h2 className="font-bold text-lg mb-2">Current Menu Structure</h2>
                    {menus.length ? menus.map(menu=>renderMenu(menu)) : <p>No menus yet.</p>}
                </div>

            </div>
        </AppLayout>
    );
}