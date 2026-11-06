import React, { useState } from 'react';
import {
  Zap,
  Flame,
  Dumbbell,
  Heart,
  ArrowRight,
  ShoppingCart,
  Star,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  Check,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  SUPPLEMENT_CATEGORIES,
  CATEGORY_CARDS,
  FEATURED_SUPPLEMENTS,
  INITIAL_USER_STACK,
  SUPPLEMENT_OVERVIEW,
  SUPPLEMENT_GOALS,
  INITIAL_REMINDERS,
  ARTICLES_AND_TIPS,
} from '../services/supplementsData';
import heroBg from '../assets/images/supplements-hero.jpg';
import AddSupplementModal from '../components/common/AddSupplementModal';

export default function SupplementsPage({ searchQuery = '', onOpenAddModal }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userStack, setUserStack] = useState(INITIAL_USER_STACK);
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [wishlist, setWishlist] = useState(['supp-1']);
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id));
      showToast('Removed from wishlist');
    } else {
      setWishlist([...wishlist, id]);
      showToast('Added to wishlist');
    }
  };

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    showToast(`Added ${product.name.split(' ')[0]} to cart!`);
  };

  const toggleReminder = (id) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleAddSupplement = (newSupp) => {
    setUserStack([newSupp, ...userStack]);
    showToast(`${newSupp.name} added to your stack!`);
  };

  const handleDeleteFromStack = (id) => {
    setUserStack(userStack.filter((s) => s.id !== id));
    showToast('Supplement removed from stack');
  };

  // Filter products by search and category
  const filteredProducts = FEATURED_SUPPLEMENTS.filter((item) => {
    const matchesCat =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="w-full">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D141C] border border-[#2BAF34] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <Check className="w-4 h-4 text-[#2BAF34]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Page Layout: Two Columns (Main Feed + Right Panel) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left / Center Main Content (8 cols on XL) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Header Title */}
          <div>
            <h1 className="page-title">
              Supplements
            </h1>
            <p className="page-subtitle">
              Support your fitness journey with trusted supplements.
            </p>
          </div>

          {/* Hero Banner with Glow Aesthetic */}
          <div className="relative overflow-hidden rounded-2xl border border-[#1E2D42] bg-[#090D16] shadow-2xl p-6 sm:p-8 min-h-[220px] flex items-center">
            {/* Background Graphic with Optimized Mobile Opacity */}
            <div className="absolute inset-0 pointer-events-none opacity-30 sm:opacity-75 lg:opacity-90">
              <img
                src={heroBg}
                alt="FitNova Supplements Banner"
                className="w-full h-full object-cover object-right"
              />
            </div>

            {/* Dark Gradient Overlay for Maximum Text Contrast & Readability on Mobile */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#090D16] via-[#090D16]/90 to-[#090D16]/40 sm:via-[#090D16]/65 sm:to-transparent" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#090D16]/80 via-transparent to-transparent sm:hidden" />

            {/* Banner Left Content */}
            <div className="relative z-10 max-w-lg space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2BAF34]/20 border border-[#2BAF34]/40 text-[#2BAF34] text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-xs">
                <Sparkles className="w-3 h-3" />
                Support Your Goals
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                Better Supplements. <br />
                <span className="text-[#2BAF34] drop-shadow-md">Better Results.</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 sm:text-slate-300 leading-relaxed max-w-sm drop-shadow-sm font-medium">
                High quality supplements to boost performance, recovery and overall health.
              </p>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('featured-supplements');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2BAF34] hover:bg-[#35D440] text-black font-bold text-xs tracking-wide shadow-lg shadow-[#2BAF34]/25 transition-all duration-200 active:scale-95"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mini Feature Badges */}
              <div className="pt-3 flex flex-wrap items-center gap-2.5 sm:gap-4 text-[11px] text-slate-200 sm:text-slate-300 font-medium">
                <div className="flex items-center gap-1.5 bg-[#0D141C]/70 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-lg border border-[#1E2D42]/60 sm:border-0 backdrop-blur-xs">
                  <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>More Energy</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0D141C]/70 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-lg border border-[#1E2D42]/60 sm:border-0 backdrop-blur-xs">
                  <Dumbbell className="w-3.5 h-3.5 text-[#2BAF34]" />
                  <span>Faster Recovery</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0D141C]/70 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-lg border border-[#1E2D42]/60 sm:border-0 backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Better Performance</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0D141C]/70 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-lg border border-[#1E2D42]/60 sm:border-0 backdrop-blur-xs">
                  <Heart className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>Overall Wellness</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SUPPLEMENT_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2BAF34] text-black shadow-md shadow-[#2BAF34]/20'
                      : 'bg-[#0D141C] text-slate-400 hover:text-white border border-[#162230]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Featured Supplements Section */}
          <div id="featured-supplements" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">
                Featured Supplements
              </h3>
              <button
                onClick={() => setSelectedCategory('all')}
                className="flex items-center gap-1 text-xs font-bold text-[#2BAF34] hover:underline"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Product Cards Carousel / Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {filteredProducts.map((product) => {
                const isWished = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-[#0D141C] border border-[#162230] hover:border-[#2BAF34]/50 rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/60 group relative"
                  >
                    {/* Top Tag & Wishlist */}
                    <div className="flex items-center justify-between mb-2">
                      {product.badge ? (
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-md ${product.badge.color}`}
                        >
                          {product.badge.text}
                        </span>
                      ) : (
                        <span />
                      )}

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isWished
                              ? 'text-red-500 fill-red-500'
                              : 'text-slate-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Image */}
                    <div className="w-full h-24 flex items-center justify-center my-1 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain rounded-xl filter drop-shadow-md"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">
                        {product.brand}
                      </p>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                        {product.name}
                      </h4>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                        <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="font-bold text-white">
                          {product.rating}
                        </span>
                        <span>({product.reviewsCount})</span>
                      </div>

                      {/* Price & Cart Button */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs sm:text-sm font-extrabold text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="p-2 rounded-xl bg-[#121B26] hover:bg-[#2BAF34] text-slate-300 hover:text-black transition-colors"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              Categories
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORY_CARDS.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    const match = SUPPLEMENT_CATEGORIES.find((c) =>
                      cat.name.toLowerCase().includes(c.id)
                    );
                    if (match) setSelectedCategory(match.id);
                  }}
                  className="bg-[#0D141C] border border-[#162230] hover:border-[#2BAF34]/40 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer group transition-all duration-200 hover:bg-[#121B26]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#121B26] p-1.5 flex items-center justify-center border border-[#1E2D42]">
                      <img
                        src={cat.icon}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#2BAF34] transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#2BAF34] group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* My Supplement Stack Section */}
          <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  My Supplement Stack
                </h3>
                <p className="text-xs text-slate-400">
                  Track and manage the supplements you are currently using.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2BAF34] hover:bg-[#35D440] text-black font-bold text-xs transition-all duration-200 active:scale-95 shadow-md shadow-[#2BAF34]/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Stack</span>
              </button>
            </div>

            {/* Stack Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#162230] text-slate-400 text-[11px] font-semibold">
                    <th className="py-3 px-3">Supplement</th>
                    <th className="py-3 px-3">Dosage</th>
                    <th className="py-3 px-3">Timing</th>
                    <th className="py-3 px-3">Start Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#162230]/60">
                  {userStack.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#121B26] transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#121B26] p-1 flex items-center justify-center border border-[#1E2D42]">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="font-bold text-white">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {item.dosage}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {item.timing}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {item.startDate}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2BAF34]/15 text-[#2BAF34] border border-[#2BAF34]/30">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              showToast(`Editing ${item.name} dosage settings`)
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFromStack(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Panel (4 cols on XL) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Supplement Overview Card */}
          <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                My Supplement Overview
              </h3>
              <button
                onClick={() => showToast('Viewing complete supplement logs')}
                className="text-xs font-semibold text-[#2BAF34] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Active */}
              <div className="p-3.5 rounded-xl bg-[#121B26] border border-[#1E2D42] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2BAF34]/15 border border-[#2BAF34]/30 flex items-center justify-center text-[#2BAF34]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xl font-black text-white block leading-none">
                    {userStack.length}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Active Supplements
                  </span>
                </div>
              </div>

              {/* Completed */}
              <div className="p-3.5 rounded-xl bg-[#121B26] border border-[#1E2D42] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2BAF34]/15 border border-[#2BAF34]/30 flex items-center justify-center text-[#2BAF34]">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xl font-black text-white block leading-none">
                    {SUPPLEMENT_OVERVIEW.completedCount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Completed
                  </span>
                </div>
              </div>

              {/* Streak */}
              <div className="p-3.5 rounded-xl bg-[#121B26] border border-[#1E2D42] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                  <Flame className="w-4 h-4 fill-[#F59E0B]" />
                </div>
                <div>
                  <span className="text-xl font-black text-white block leading-none">
                    {SUPPLEMENT_OVERVIEW.streakDays} days
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Current Streak
                  </span>
                </div>
              </div>

              {/* Reminders */}
              <div className="p-3.5 rounded-xl bg-[#121B26] border border-[#1E2D42] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2BAF34]/15 border border-[#2BAF34]/30 flex items-center justify-center text-[#2BAF34]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xl font-black text-white block leading-none">
                    {reminders.filter((r) => r.enabled).length}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Reminders Set
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Supplement Goals */}
          <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Supplement Goals</h3>
              <button
                onClick={() => showToast('Editing target thresholds')}
                className="text-xs font-semibold text-[#2BAF34] hover:underline"
              >
                Edit Goals
              </button>
            </div>

            <div className="space-y-3.5">
              {SUPPLEMENT_GOALS.map((goal) => (
                <div key={goal.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">
                      {goal.title}
                    </span>
                    <span className="font-bold text-white">
                      {goal.percentage}%
                    </span>
                  </div>
                  {/* Custom Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#162230] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2BAF34] shadow-glow-subtle transition-all duration-500"
                      style={{ width: `${goal.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supplement Reminders */}
          <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Supplement Reminders
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold text-[#2BAF34] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-3">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#121B26] border border-[#1E2D42]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#121B26] p-1 flex items-center justify-center">
                      <img
                        src={rem.icon}
                        alt={rem.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {rem.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {rem.dose} •{' '}
                        <span className="text-[#2BAF34]">{rem.time}</span>
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
                      rem.enabled ? 'bg-[#2BAF34]' : 'bg-[#1E293B]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
                        rem.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Articles & Tips */}
          <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Articles & Tips</h3>
              <button
                onClick={() => showToast('Opening Knowledge Hub')}
                className="text-xs font-semibold text-[#2BAF34] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {ARTICLES_AND_TIPS.map((art) => (
                <div
                  key={art.id}
                  onClick={() => showToast(`Reading: ${art.title}`)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#121B26] cursor-pointer group transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#121B26] p-1 flex-shrink-0 border border-[#1E2D42] overflow-hidden flex items-center justify-center">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#2BAF34] transition-colors leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {art.subtitle}
                    </p>
                    <span className="text-[9px] text-slate-500 block mt-1">
                      {art.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Supplement Modal */}
      <AddSupplementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSupplement={handleAddSupplement}
      />
    </div>
  );
}
