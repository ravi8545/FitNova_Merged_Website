import React, { useState } from 'react';
import { X, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import wheyImg from '../../assets/images/product-whey.jpg';

export default function AddSupplementModal({ isOpen, onClose, onAddSupplement }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Protein',
    dosage: '',
    timing: 'Post Workout',
    startDate: new Date().toISOString().split('T')[0],
    reminderTime: '09:00 AM',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dosage.trim()) {
      alert('Please fill out supplement name and dosage.');
      return;
    }

    onAddSupplement({
      id: `stack-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      dosage: formData.dosage,
      timing: formData.timing,
      startDate: formData.startDate,
      status: 'Active',
      image: wheyImg,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0D141C] border border-[#1E2D42] rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2BAF34]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#162230]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2BAF34]/15 border border-[#2BAF34]/30 flex items-center justify-center text-[#2BAF34]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Supplement to Stack</h3>
              <p className="text-xs text-slate-400">Track dosage, schedule reminders, and monitor consistency.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Supplement Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Optimum Nutrition Whey, Creatine Monohydrate"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#090D16] border border-[#1E2D42] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2BAF34]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#090D16] border border-[#1E2D42] rounded-xl text-white focus:outline-none focus:border-[#2BAF34]"
              >
                <option value="Protein">Protein</option>
                <option value="Creatine">Creatine</option>
                <option value="Pre-Workout">Pre-Workout</option>
                <option value="Vitamins">Vitamins</option>
                <option value="Amino Acids">Amino Acids</option>
                <option value="Omega 3">Omega 3 & Fats</option>
                <option value="Recovery">Post-Workout & Recovery</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Dosage</label>
              <input
                type="text"
                required
                placeholder="e.g. 1 scoop (30 g), 5 g, 2 capsules"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#090D16] border border-[#1E2D42] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2BAF34]"
              >
              </input>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Timing</label>
              <select
                value={formData.timing}
                onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#090D16] border border-[#1E2D42] rounded-xl text-white focus:outline-none focus:border-[#2BAF34]"
              >
                <option value="Pre Workout">Pre Workout (30m before)</option>
                <option value="Post Workout">Post Workout</option>
                <option value="After Breakfast">After Breakfast</option>
                <option value="After Dinner">After Dinner</option>
                <option value="Before Bed">Before Bed</option>
                <option value="With Water Daily">Anytime with Water</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#090D16] border border-[#1E2D42] rounded-xl text-white focus:outline-none focus:border-[#2BAF34]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#121B26]/60 border border-[#1E2D42] rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Auto-set Daily Push Reminder</span>
              <span className="text-[11px] text-slate-400">Receive alert when it's time to consume</span>
            </div>
            <span className="text-xs font-bold text-[#2BAF34]">Enabled</span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#162230]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#2BAF34] hover:bg-[#35D440] text-black font-bold transition-all shadow-md shadow-[#2BAF34]/25 active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add to Stack
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
