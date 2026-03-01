"use client";
declare function route(name: string, params?: any): string;

import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { toast } from "react-hot-toast";
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
import { GripVertical } from "lucide-react";

interface Section {
  id: number;
  type: string;
  category_slug: string;
  limit: number;
  order: number;
}

interface Props {
  sections: Section[];
}

function SortableItem({ section }: { section: Section }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 200ms ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 touch-none
        ${
          isDragging
            ? "bg-white shadow-2xl scale-[1.03] z-50"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
    >
      <div className="flex items-center gap-3">
        <GripVertical
          {...listeners}
          className={`text-gray-500 transition-colors ${
            isDragging
              ? "cursor-grabbing text-gray-700"
              : "cursor-grab hover:text-gray-700"
          }`}
          size={20}
        />
        <span className="font-medium">
          {section.type} - {section.category_slug} (limit: {section.limit})
        </span>
      </div>
    </div>
  );
}

export default function HomepageBuilder({ sections }: Props) {
  const [items, setItems] = useState(sections);
  const [activeItem, setActiveItem] = useState<Section | null>(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);

    setItems(newItems);
    setOrderChanged(true);
  };

  // 🔥 Debounced Auto Save
  useEffect(() => {
    if (!orderChanged) return;

    const timeout = setTimeout(() => {
      const order = items.map((item) => item.id);

      router.post(
        route("admin.homepage-builder.order"),
        { order },
        {
          preserveScroll: true,
          onSuccess: () => toast.success("Layout auto-saved"),
          onError: () => toast.error("Failed to save layout"),
        }
      );

      setOrderChanged(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [items, orderChanged]);

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Homepage Builder</h1>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Add Section
          </button>
        </div>

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
                <SortableItem key={section.id} section={section} />
              ))}
            </div>
          </SortableContext>

          {/* 🔵 Drag Overlay Ghost */}
          <DragOverlay>
            {activeItem ? (
              <div className="p-4 rounded-lg bg-white shadow-2xl border scale-105">
                {activeItem.type} - {activeItem.category_slug}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* ➕ Add Section Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Add Homepage Section
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                router.post(
                  route("admin.homepage-builder.store"),
                  {
                    type: "category",
                    category_slug: "sports",
                    limit: 6,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Section added");
                      setShowModal(false);
                    },
                    onError: () =>
                      toast.error("Failed to add section"),
                  }
                );
              }}
            >
              <input
                placeholder="Category Slug"
                className="w-full mb-3 p-2 border rounded"
              />

              <input
                type="number"
                placeholder="Limit"
                className="w-full mb-4 p-2 border rounded"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}