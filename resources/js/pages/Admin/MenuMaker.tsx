"use client"

declare function route(name: string, params?: any): string;

import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";

import MenuItem from "@/components/Admin/Menu/MenuItem";

interface Menu {
  id: number;
  title: string;
  url?: string;
  parent_id?: number | null;
  depth?: number;
  childrenRecursive?: Menu[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  category_id: number;
}

interface Props {
  menus: Menu[];
  categories: Category[];
  subcategories: SubCategory[];
}

export default function MenuMaker({ menus, categories, subcategories }: Props) {

  const [items, setItems] = useState<Menu[]>(menus ?? []);

  const [type, setType] = useState<"category" | "subcategory" | "custom">("category");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const INDENT_WIDTH = 30;

  /*
  |--------------------------------------------------------------------------
  | LISTEN FOR DELETE / UPDATE EVENT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const handler = (e: any) => {
      if (e.detail) {
        setItems(e.detail);
      }
    };

    window.addEventListener("menuUpdated", handler);

    return () => {
      window.removeEventListener("menuUpdated", handler);
    };

  }, []);


  // -----------------------------
  // FLATTEN MENU
  // -----------------------------
  const flattenMenus = (menus: Menu[], parentId: number | null = null, depth = 0): Menu[] => {
    return menus.reduce<Menu[]>((acc, menu) => {

      acc.push({
        ...menu,
        parent_id: parentId,
        depth
      });

      if (menu.childrenRecursive && menu.childrenRecursive.length > 0) {
        acc.push(...flattenMenus(menu.childrenRecursive, menu.id, depth + 1));
      }

      return acc;

    }, []);
  };

  // -----------------------------
  // BUILD TREE FROM FLAT
  // -----------------------------
  const buildTree = (flat: Menu[]) => {

    const map: Record<number, Menu> = {};

    flat.forEach(i => {
      map[i.id] = { ...i, childrenRecursive: [] };
    });

    const tree: Menu[] = [];

    flat.forEach(item => {

      if (item.parent_id && map[item.parent_id]) {
        map[item.parent_id].childrenRecursive!.push(map[item.id]);
      } else {
        tree.push(map[item.id]);
      }

    });

    return tree;
  };

  // -----------------------------
  // ADD MENU
  // -----------------------------
  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    router.post(route("admin.menus.store"), {
      type,
      title,
      url,
      category_id: type === "category" ? categoryId : null,
      sub_category_id: type === "subcategory" ? subCategoryId : null,
      parent_id: parentId
    }, {

      preserveScroll: true,

      onSuccess: (page: any) => {

        toast.success("Menu added successfully");

        if (page.props.menus) {
          setItems(page.props.menus);
        }

        setTitle("");
        setUrl("");
        setCategoryId(null);
        setSubCategoryId(null);
        setParentId(null);
      },

      onError: () => {
        toast.error("Failed to add menu");
      }

    });

  };

  // -----------------------------
  // DRAG END
  // -----------------------------
  const handleDragEnd = (event: DragEndEvent) => {

    const { active, over, delta } = event;

    if (!over || active.id === over.id) return;

    const flat = flattenMenus(items);

    const oldIndex = flat.findIndex(i => i.id === active.id);
    const newIndex = flat.findIndex(i => i.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newFlat = arrayMove(flat, oldIndex, newIndex);

    // calculate depth by horizontal movement
    const dragDepth = Math.round(delta.x / INDENT_WIDTH);

    let newDepth = (newFlat[newIndex].depth ?? 0) + dragDepth;

    if (newDepth < 0) newDepth = 0;

    let parentId: number | null = null;

    if (newDepth > 0) {

    for (let i = newIndex - 1; i >= 0; i--) {

        const prev = newFlat[i];

        if ((prev.depth ?? 0) === newDepth - 1) {
        parentId = prev.id;
        break;
        }

        if ((prev.depth ?? 0) < newDepth - 1) {
        newDepth = (prev.depth ?? 0) + 1;
        parentId = prev.id;
        break;
        }

    }

    }

    newFlat[newIndex].depth = newDepth;
    newFlat[newIndex].parent_id = parentId;

    const tree = buildTree(newFlat);

    setItems(tree);

    router.post(route("admin.menus.order"), {

      order: newFlat.map(m => ({
        id: m.id,
        parent_id: m.parent_id
    }))

    }, {

      preserveScroll: true,

      onSuccess: () => {
        toast.success("Menu order updated");
      },

      onError: () => {
        toast.error("Failed to reorder menu");
      }

    });

  };

  // -----------------------------
  // RENDER MENU
  // -----------------------------
  const renderMenu = (menus: Menu[], level = 0) => (

    <div className="space-y-1">

      {menus.map(menu => (

        <div key={menu.id} style={{ marginLeft: level * INDENT_WIDTH }}>

          <MenuItem
            id={menu.id}
            title={menu.title}
            url={menu.url}
          />

          {menu.childrenRecursive && menu.childrenRecursive.length > 0 &&
            renderMenu(menu.childrenRecursive, level + 1)
          }

        </div>

      ))}

    </div>

  );

  

  // -----------------------------
  // UI
  // -----------------------------
  return (

    <AppLayout breadcrumbs={[{ title: "Menu Maker", href: route("admin.menus") }]}>

      <Head title="Menu Maker" />

      <div className="p-6 space-y-6">

        {/* ADD MENU FORM */}

        <form onSubmit={handleSubmit} className="space-y-4 border rounded p-4">

          <h2 className="font-bold text-lg">Add Menu Item</h2>

          <div>
            <label className="block text-sm font-medium">Menu Type</label>

            <select
              value={type}
              onChange={e => {
                setType(e.target.value as any)
                setCategoryId(null)
                setSubCategoryId(null)
              }}
              className="w-full border px-2 py-2 rounded"
            >

              <option value="category">Category</option>
              <option value="subcategory">Subcategory</option>
              <option value="custom">Custom Link</option>

            </select>

          </div>

          {(type === "category" || type === "subcategory") && (

            <div>

              <label className="block text-sm font-medium">Select Category</label>

              <select
                value={type === "category" ? categoryId ?? "" : subCategoryId ?? ""}
                onChange={e => {

                  const val = e.target.value ? Number(e.target.value) : null

                  if (type === "category") setCategoryId(val)
                  else setSubCategoryId(val)

                }}
                className="w-full border px-2 py-2 rounded"
              >

                <option value="">Select...</option>

                {categories.map(cat => (

                  <optgroup key={cat.id} label={cat.name}>

                    {type === "category" &&
                      <option value={cat.id}>{cat.name}</option>
                    }

                    {type === "subcategory" &&
                      subcategories
                        .filter(sub => sub.category_id === cat.id)
                        .map(sub => (
                          <option key={sub.id} value={sub.id}>
                            └ {sub.name}
                          </option>
                        ))
                    }

                  </optgroup>

                ))}

              </select>

            </div>

          )}

          {type === "custom" && (

            <>
              <div>

                <label className="block text-sm font-medium">Title</label>

                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full border px-2 py-2 rounded"
                />

              </div>

              <div>

                <label className="block text-sm font-medium">URL</label>

                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full border px-2 py-2 rounded"
                />

              </div>
            </>

          )}

          <div>

            <label className="block text-sm font-medium">Parent Menu</label>

            <select
              value={parentId ?? ""}
              onChange={e =>
                setParentId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full border px-2 py-2 rounded"
            >

              <option value="">None</option>

              {items.map(menu => (
                <option key={menu.id} value={menu.id}>
                  {menu.title}
                </option>
              ))}

            </select>

          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Menu
          </button>

        </form>

        {/* MENU BUILDER */}

        <div className="border p-4 rounded">

          <h2 className="font-bold mb-4">Current Menu Structure</h2>

          {items.length > 0 ? (

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >

              <SortableContext
                items={flattenMenus(items).map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >

                {renderMenu(items)}

              </SortableContext>

            </DndContext>

          ) : (

            <p>No menu items yet.</p>

          )}

        </div>

      </div>

    </AppLayout>

  );

}