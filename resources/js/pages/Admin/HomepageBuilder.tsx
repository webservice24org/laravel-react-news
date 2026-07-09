"use client";
declare function route(name: string, params?: any): string;

import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { toast } from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

/* ---------------------------------------------
   Section Layouts
--------------------------------------------- */
const SECTION_COMPONENTS = [
  { key: "category-five-split", label: "Category Five Split", preview: "/storage/sections/category-five-split.png" },
  { key: "category-grid", label: "Category Grid", preview: "/storage/sections/category-grid.png" },
  { key: "category-nine-split", label: "Category Nine Split", preview: "/storage/sections/category-nine-split.png" },
  { key: "category-section", label: "Category Section", preview: "/storage/sections/category-section.png" },
  { key: "four-category-block", label: "Four Category Block", preview: "/storage/sections/four-category-block.png" },
  { key: "two-column-featured-list", label: "Two Column Featured List", preview: "/storage/sections/two-column-featured-list.png" },
  { key: "category-four-premium", label: "Category Four Premium", preview: "/storage/sections/category-four-premium.png" },
] as const;

type SectionComponentKey = (typeof SECTION_COMPONENTS)[number]["key"];

/* ---------------------------------------------
   Types
--------------------------------------------- */
interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Section {
  id: number;
  type: SectionComponentKey;
  category_slug: string;
  limit: number;
  order: number;
  status: boolean;
}

interface Props {
  sections: Section[];
  categories: Category[];
}

/* ---------------------------------------------
   Sortable Item
--------------------------------------------- */
function SortableItem({
  section,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  section: Section;
  onEdit: (section: Section) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, status: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms ease",
  };

  const preview = SECTION_COMPONENTS.find((c) => c.key === section.type)?.preview;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 touch-none ${
        isDragging
          ? "bg-white shadow-2xl scale-[1.03] z-50"
          : section.status
          ? "bg-gray-100 hover:bg-gray-200"
          : "bg-gray-100 opacity-60"
      }`}
    >
      <div className="flex items-center gap-3">
        <GripVertical
          {...listeners}
          className="cursor-grab text-gray-500 hover:text-gray-700"
          size={20}
        />

        {preview && (
          <img
            src={preview}
            alt={section.type}
            className="w-12 h-12 object-cover rounded-md border"
          />
        )}

        <div className="flex flex-col">
          <span className="font-medium">{section.type}</span>
          <span className="text-sm text-gray-600">{section.category_slug}</span>
          <span className="text-xs text-gray-500">Limit: {section.limit}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {section.status ? "Active" : "Inactive"}
          </span>
          <Switch
            checked={section.status}
            onCheckedChange={(value) => onToggleStatus(section.id, value)}
          />
        </div>

        <button
          onClick={() => onEdit(section)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Pencil size={18} />
        </button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-red-600 hover:text-red-800">
              <Trash2 size={18} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this section?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => onDelete(section.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Homepage Builder
--------------------------------------------- */
export default function HomepageBuilder({ sections, categories }: Props) {
  const [items, setItems] = useState<Section[]>(sections);
  const [activeItem, setActiveItem] = useState<Section | null>(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [form, setForm] = useState<{
    type: SectionComponentKey | "";
    category_slug: string;
    limit: number;
  }>({
    type: "",
    category_slug: "",
    limit: 6,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  /* ---------- Drag ---------- */
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveItem(null);
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    setItems(arrayMove(items, oldIndex, newIndex));
    setOrderChanged(true);
  };

  /* ---------- Auto Save Order ---------- */
  useEffect(() => {
    if (!orderChanged) return;

    const timeout = setTimeout(() => {
      router.post(
        route("admin.homepage-builder.order"),
        { order: items.map((i) => i.id) },
        {
          preserveScroll: true,
          onSuccess: () => toast.success("Layout auto-saved"),
        }
      );
      setOrderChanged(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [items, orderChanged]);

  /* ---------- Delete ---------- */
  const handleDelete = (id: number) => {
    router.delete(route("admin.homepage-builder.destroy", id), {
      preserveScroll: true,
      onSuccess: () => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Section deleted");
      },
    });
  };

  /* ---------- Toggle Status ---------- */
  const handleToggleStatus = (id: number, newStatus: boolean) => {
  // Optimistic update
  setItems((prev) =>
    prev.map((s) =>
      s.id === id ? { ...s, status: newStatus } : s
    )
  );

  router.put(
    route("admin.homepage-builder.status", id),
    { status: newStatus },
    {
      preserveScroll: true,
      onError: () => {
        // rollback if failed
        setItems((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, status: !newStatus } : s
          )
        );
        toast.error("Failed to update status");
      },
    }
  );
};

  /* ---------- Open Modal ---------- */
  const openEditModal = (section: Section | null) => {
    setEditingSection(section);
    if (section) {
      setForm({
        type: section.type,
        category_slug: section.category_slug,
        limit: section.limit,
      });
    } else {
      setForm({ type: "", category_slug: "", limit: 6 });
    }
    setShowModal(true);
  };

  /* ---------- Submit ---------- */
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.type) return toast.error("Select a layout");

  if (editingSection) {
  // Type narrowing
  const updatedType = form.type as SectionComponentKey;

  router.put(
    route("admin.homepage-builder.update", editingSection.id),
    form,
    {
      preserveScroll: true,
      onSuccess: () => {
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingSection.id
              ? {
                  ...item,
                  type: updatedType,
                  category_slug: form.category_slug,
                  limit: form.limit,
                }
              : item
          )
        );

        toast.success("Section updated");
        setShowModal(false);
      },
    }
  );
} else {
    router.post(route("admin.homepage-builder.store"), form, {
      preserveScroll: true,
      onSuccess: (page: any) => {
        // assume backend returns created section in flash or props
        const newSection = page.props.section;

        if (newSection) {
          setItems((prev) => [...prev, newSection]);
        }

        toast.success("Section added");
        setShowModal(false);
      },
    });
  }
};

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Homepage Builder</h1>
          <button
            onClick={() => openEditModal(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Add Section
          </button>
        </div>

        {/* DND */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => {
            const item = items.find((i) => i.id === event.active.id);
            setActiveItem(item || null);
          }}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveItem(null)}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {items.map((section) => (
                <SortableItem
                  key={section.id}
                  section={section}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeItem && (
              <div className="p-4 rounded-lg bg-white shadow-2xl border flex items-center gap-3">
                <img
                  src={
                    SECTION_COMPONENTS.find(
                      (c) => c.key === activeItem.type
                    )?.preview
                  }
                  className="w-12 h-12 object-cover rounded-md border"
                />
                <div>
                  <div className="font-medium">{activeItem.type}</div>
                  <div className="text-sm text-gray-600">
                    {activeItem.category_slug}
                  </div>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingSection ? "Edit Section" : "Add Section"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Choose Layout
                </label>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {SECTION_COMPONENTS.map((component) => (
                    <div
                      key={component.key}
                      onClick={() =>
                        setForm({ ...form, type: component.key })
                      }
                      className={`cursor-pointer border rounded-lg p-2 ${
                        form.type === component.key
                          ? "border-blue-600 ring-2 ring-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={component.preview}
                        className="w-full h-24 object-cover rounded-md mb-2"
                      />
                      <p className="text-sm text-center">
                        {component.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  value={form.category_slug}
                  onChange={(e) =>
                    setForm({ ...form, category_slug: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Post Limit</label>
                <input
                  type="number"
                  min="1"
                  value={form.limit}
                  onChange={(e) =>
                    setForm({ ...form, limit: Number(e.target.value) })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  {editingSection ? "Update Section" : "Save Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}