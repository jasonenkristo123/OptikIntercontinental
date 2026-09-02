'use client';

import { useState } from 'react';
import { createMasterItem, createAuthenticityTag, createLensType, deleteMasterItem } from '@/app/actions/masterActions';
import { MasterItem, AuthenticityTag, LensType } from '@/shared/types/database';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  data: {
    categories: MasterItem[];
    materials: MasterItem[];
    authenticity: AuthenticityTag[];
    lensTypes: LensType[];
    budgets: MasterItem[];
  };
  onRefresh: () => void;
}

export default function MasterLookupTab({ data, onRefresh }: Props) {
  const [newCategory, setNewCategory] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newAuthName, setNewAuthName] = useState('');
  const [hasLogo, setHasLogo] = useState(false);
  const [newLensType, setNewLensType] = useState('');

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await createMasterItem('frame_categories', newCategory);
    setNewCategory('');
    onRefresh();
  };

  const handleAddMaterial = async () => {
    if (!newMaterial.trim()) return;
    await createMasterItem('frame_materials', newMaterial);
    setNewMaterial('');
    onRefresh();
  };

  const handleAddAuth = async () => {
    if (!newAuthName.trim()) return;
    await createAuthenticityTag(newAuthName, hasLogo);
    setNewAuthName('');
    onRefresh();
  };

  const handleAddLensType = async () => {
    if (!newLensType.trim()) return;
    await createLensType(newLensType);
    setNewLensType('');
    onRefresh();
  };

  const handleDelete = async (table: string, id: string) => {
    if (confirm('Hapus item master ini?')) {
      await deleteMasterItem(table, id);
      onRefresh();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      {/* Kategori Frame */}
      <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
        <h3 className="font-serif font-normal text-charcoal-900 text-base">Kategori Frame</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Kategori baru (misal: Sports)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
          />
          <button onClick={handleAddCategory} className="bg-charcoal-900 px-3 py-2 rounded-sm text-cream-50">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {data.categories.map((c) => (
            <span key={c.id} className="bg-cream-100 border border-cream-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
              {c.name}
              <button onClick={() => handleDelete('frame_categories', c.id)} className="text-stone-400 hover:text-rose-700">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Material Frame */}
      <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
        <h3 className="font-serif font-normal text-charcoal-900 text-base">Material Frame</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Material baru (misal: Carbon)"
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
            className="flex-1 bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
          />
          <button onClick={handleAddMaterial} className="bg-charcoal-900 px-3 py-2 rounded-sm text-cream-50">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {data.materials.map((m) => (
            <span key={m.id} className="bg-cream-100 border border-cream-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
              {m.name}
              <button onClick={() => handleDelete('frame_materials', m.id)} className="text-stone-400 hover:text-rose-700">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tag Keaslian */}
      <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
        <h3 className="font-serif font-normal text-charcoal-900 text-base">Tag Keaslian (Authenticity)</h3>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Tag Keaslian baru"
            value={newAuthName}
            onChange={(e) => setNewAuthName(e.target.value)}
            className="flex-1 bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
          />
          <label className="flex items-center gap-1.5 text-xs text-stone-500">
            <input type="checkbox" checked={hasLogo} onChange={(e) => setHasLogo(e.target.checked)} />
            Logo
          </label>
          <button onClick={handleAddAuth} className="bg-charcoal-900 px-3 py-2 rounded-sm text-cream-50">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {data.authenticity.map((a) => (
            <span key={a.id} className="bg-cream-100 border border-cream-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
              {a.name} {a.has_logo ? '🏷️' : ''}
              <button onClick={() => handleDelete('authenticity_tags', a.id)} className="text-stone-400 hover:text-rose-700">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Master Tipe Lensa */}
      <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
        <h3 className="font-serif font-normal text-charcoal-900 text-base">Master Tipe Lensa</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tipe Lensa baru (misal: Anti-Fatigue)"
            value={newLensType}
            onChange={(e) => setNewLensType(e.target.value)}
            className="flex-1 bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
          />
          <button onClick={handleAddLensType} className="bg-charcoal-900 px-3 py-2 rounded-sm text-cream-50">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {data.lensTypes.map((lt) => (
            <span key={lt.id} className="bg-cream-100 border border-cream-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
              {lt.name}
              <button onClick={() => handleDelete('lens_types', lt.id)} className="text-stone-400 hover:text-rose-700">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}