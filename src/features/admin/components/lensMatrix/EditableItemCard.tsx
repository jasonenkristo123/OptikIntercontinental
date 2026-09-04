'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

type EditableItemProps = {
  id: string;
  label: string;
  sublabel?: string;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  isDeleting: string | null;
};


export function EditableItemCard({
  id,
  label,
  sublabel,
  onDelete,
  onEdit,
  isDeleting,
}: EditableItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await onDelete(id);
    setConfirmDelete(false);
  };

  return (
    <div className="group relative bg-cream-100 border border-cream-300 rounded-md px-3 py-2 text-xs text-stone-600 flex items-center gap-2 transition-all hover:border-stone-400 hover:shadow-sm">
      <div className="flex-1 min-w-0">
        <span className="font-medium text-charcoal-900">{label}</span>
        {sublabel && <span className="text-stone-400 ml-1">{sublabel}</span>}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(id)}
          className="p-1 rounded hover:bg-cream-200 text-stone-400 hover:text-charcoal-900 transition"
          title="Edit"
          aria-label={`Edit ${label}`}
        >
          <Pencil className="w-3 h-3" />
        </button>

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={isDeleting === id}
              className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50"
              aria-label={`Confirm delete ${label}`}
            >
              {isDeleting === id ? '...' : 'Ya'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-1.5 py-0.5 text-[10px] font-semibold bg-cream-200 text-stone-500 rounded hover:bg-cream-300 transition"
              aria-label="Cancel delete"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
            title="Hapus"
            aria-label={`Delete ${label}`}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
