import { useCallback, useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Plus,
  Trash2,
  Link,
  Camera,
  BookOpen,
  Milestone,
  Sparkles,
} from 'lucide-react';
import { memories } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { ThreeDCarousel } from '@/components/ThreeDCarousel';
import { useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';

export function MemoriesPage() {
  const { navigate } = useRouter();
  const [active, setActive] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Links (Digital Photo Album)
  const [links, setLinks] = useState<{ id?: string; url: string; label: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('archive-links') || '[]'); } catch { return []; }
  });
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');

  // Notes (Our Shared Notes)
  const [notes, setNotes] = useState<{ id?: string; text: string }[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('archive-notes') || '[]');
      return stored.map((n: any) => typeof n === 'string' ? { text: n } : n);
    } catch {
      return [];
    }
  });
  const [newNote, setNewNote] = useState('');

  // Moments (Milestone Moments)
  const [moments, setMoments] = useState<{ id?: string; title: string; date: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('archive-moments') || '[]'); } catch { return []; }
  });
  const [newMomentTitle, setNewMomentTitle] = useState('');
  const [newMomentDate, setNewMomentDate] = useState('');

  // --- Fetching from Supabase on load if available ---
  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const { data, error } = await client
          .from('shared_memories')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data) {
          const l: typeof links = [];
          const n: typeof notes = [];
          const m: typeof moments = [];

          data.forEach((item) => {
            if (item.type === 'link') {
              l.push({ id: item.id, url: item.content.url, label: item.content.label });
            } else if (item.type === 'note') {
              n.push({ id: item.id, text: item.content.text });
            } else if (item.type === 'moment') {
              m.push({ id: item.id, title: item.content.title, date: item.content.date });
            }
          });

          setLinks(l);
          setNotes(n);
          setMoments(m);
        }
      } catch (err) {
        console.error('Error loading shared memories:', err);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  // --- Helper CRUD Actions ---

  const addLink = async () => {
    if (!newLinkUrl.trim()) return;
    const item = { url: newLinkUrl.trim(), label: newLinkLabel.trim() || newLinkUrl.trim() };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('shared_memories')
          .insert([{ type: 'link', content: item }])
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setLinks((prev) => [...prev, { id: data[0].id, ...item }]);
        }
      } catch (err) {
        console.error('Error saving link:', err);
      }
    } else {
      const next = [...links, item];
      setLinks(next);
      localStorage.setItem('archive-links', JSON.stringify(next));
    }

    setNewLinkUrl('');
    setNewLinkLabel('');
  };

  const deleteLink = async (id?: string, index?: number) => {
    if (supabase && id) {
      try {
        const { error } = await supabase
          .from('shared_memories')
          .delete()
          .eq('id', id);
        if (error) throw error;
        setLinks((prev) => prev.filter((l) => l.id !== id));
      } catch (err) {
        console.error('Error deleting link:', err);
      }
    } else if (index !== undefined) {
      const next = links.filter((_, i) => i !== index);
      setLinks(next);
      localStorage.setItem('archive-links', JSON.stringify(next));
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    const item = { text: newNote.trim() };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('shared_memories')
          .insert([{ type: 'note', content: item }])
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setNotes((prev) => [...prev, { id: data[0].id, ...item }]);
        }
      } catch (err) {
        console.error('Error saving note:', err);
      }
    } else {
      const next = [...notes, item];
      setNotes(next);
      localStorage.setItem('archive-notes', JSON.stringify(next));
    }

    setNewNote('');
  };

  const deleteNote = async (id?: string, index?: number) => {
    if (supabase && id) {
      try {
        const { error } = await supabase
          .from('shared_memories')
          .delete()
          .eq('id', id);
        if (error) throw error;
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } catch (err) {
        console.error('Error deleting note:', err);
      }
    } else if (index !== undefined) {
      const next = notes.filter((_, i) => i !== index);
      setNotes(next);
      localStorage.setItem('archive-notes', JSON.stringify(next));
    }
  };

  const addMoment = async () => {
    if (!newMomentTitle.trim()) return;
    const item = { title: newMomentTitle.trim(), date: newMomentDate || 'No date' };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('shared_memories')
          .insert([{ type: 'moment', content: item }])
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setMoments((prev) => [...prev, { id: data[0].id, ...item }]);
        }
      } catch (err) {
        console.error('Error saving moment:', err);
      }
    } else {
      const next = [...moments, item];
      setMoments(next);
      localStorage.setItem('archive-moments', JSON.stringify(next));
    }

    setNewMomentTitle('');
    setNewMomentDate('');
  };

  const deleteMoment = async (id?: string, index?: number) => {
    if (supabase && id) {
      try {
        const { error } = await supabase
          .from('shared_memories')
          .delete()
          .eq('id', id);
        if (error) throw error;
        setMoments((prev) => prev.filter((m) => m.id !== id));
      } catch (err) {
        console.error('Error deleting moment:', err);
      }
    } else if (index !== undefined) {
      const next = moments.filter((_, i) => i !== index);
      setMoments(next);
      localStorage.setItem('archive-moments', JSON.stringify(next));
    }
  };

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((a) => (a === null ? a : (a + 1) % memories.length)),
    []
  );
  const prev = useCallback(
    () => setActive((a) => (a === null ? a : (a - 1 + memories.length) % memories.length)),
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, next, prev]);

  // Helper to format date strings into "15 May 2026" (DD Mon YYYY)
  const formatMilestoneDate = (dateStr: string): string => {
    if (!dateStr || dateStr === 'No date') return 'No date';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return dateStr;
  };

  // Chronologically sorted milestones (earliest to latest)
  const sortedMoments = [...moments].sort((a, b) => {
    if (!a.date || a.date === 'No date') return 1;
    if (!b.date || b.date === 'No date') return -1;
    const timeA = new Date(a.date).getTime() || 0;
    const timeB = new Date(b.date).getTime() || 0;
    return timeA - timeB;
  });

  return (
    <PageShell>
      {/* ─── 3D MEMORIES SHOWCASE ─── */}
      <section className="px-3 sm:px-6 pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-5xl text-center mb-4 sm:mb-6">
          <SectionTitle
            eyebrow="Memories"
            title={
              <>
                Us, in <span className="text-gradient-rose">motion & moments</span>
              </>
            }
            subtitle="Swipe or click through our top 10 memories. Tap any card for full resolution."
          />
        </div>

        <div className="mx-auto max-w-5xl">
          <ThreeDCarousel
            items={memories}
            onOpenLightbox={(index) => setActive(index)}
          />

          <div className="reveal mx-auto mt-10 max-w-xl text-center">
            <p className="font-body text-sm text-wine-500/80">
              These are our top 10 moments. My favorite ones don't have reels —
              they're just you, being you, when you didn't know I was paying attention.
            </p>
            <button onClick={() => navigate('/timeline')} className="btn-primary mt-6">
              See how we got here
            </button>
          </div>
        </div>
      </section>

      {/* ─── LIVING ARCHIVE DASHBOARD ─── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mx-auto mb-14 max-w-2xl text-center">
            <span className="chip bg-gold-100 text-gold-700">Living archive</span>
            <h3 className="mt-4 font-display text-3xl font-semibold text-wine-700 sm:text-4xl">
              Our shared <span className="text-gradient-rose">memory board</span>
            </h3>
            <p className="mt-3 font-body text-wine-500/80">
              This is our space. Post notes, share drives, and log milestones. Everything syncs instantly in real time.
            </p>
            {loading && (
              <p className="mt-2 font-body text-xs text-rose-500 animate-pulse">Syncing changes...</p>
            )}
          </div>

          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            {/* Column 1: 📝 Notes & Thoughts */}
            <div className="reveal lg:col-span-2 flex flex-col justify-between card-premium border-t-4 border-t-amber-400/80">
              <div>
                <div className="flex items-center gap-3 pb-5 mb-6 border-b border-rose-100/50">
                  <span className="p-3 rounded-2xl bg-amber-50 text-amber-500 shadow-sm shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-xl font-bold text-wine-800 truncate">Our Shared Notes & Thoughts</h4>
                    <p className="text-xs text-wine-500/60 truncate">Pin little letters, cute moments, and memories.</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                    {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                  </span>
                </div>

                {notes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-cream-50/50 border border-dashed border-rose-200">
                    <span className="text-3xl opacity-50">📝</span>
                    <p className="mt-3 font-body text-sm font-medium text-wine-600">No notes pinned yet.</p>
                    <p className="mt-1 font-body text-xs text-wine-400/80">Write your first note below to pin it to our memory board!</p>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 max-h-[460px] overflow-y-auto pr-2 no-scrollbar">
                    {notes.map((n, i) => {
                      const stickyColors = [
                        'bg-amber-50/70 border-amber-200/50',
                        'bg-rose-50/70 border-rose-200/50',
                        'bg-cream-50/70 border-cream-200/60',
                      ];
                      const stickyColor = stickyColors[i % stickyColors.length];
                      const rot = i % 2 === 0 ? 'sm:-rotate-1' : 'sm:rotate-1';
                      return (
                        <div
                          key={n.id || i}
                          className={[
                            'relative p-5 rounded-2xl border shadow-soft transition-all duration-300 hover:rotate-0 hover:scale-102 flex flex-col justify-between min-h-[130px]',
                            stickyColor,
                            rot,
                          ].join(' ')}
                        >
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/50 backdrop-blur-[1px] border border-white/20 rotate-2 shadow-sm" />
                          <p className="font-handwriting text-xl text-wine-800 leading-relaxed whitespace-pre-wrap flex-1">
                            {n.text}
                          </p>
                          <div className="flex justify-end mt-2 pt-2 border-t border-wine-500/10">
                            <button
                              onClick={() => deleteNote(n.id, i)}
                              className="text-wine-400 hover:text-rose-600 transition-colors hover:scale-110"
                              title="Delete note"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-8 border-t border-rose-100/50 pt-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-wine-600 mb-2">Pin a new note</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <textarea
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Write a sweet memory or note..."
                    rows={2}
                    className="flex-1 rounded-2xl border border-rose-200 bg-cream-50/40 px-4 py-3 font-body text-sm text-wine-800 placeholder:text-wine-400/40 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400 resize-none transition-all"
                  />
                  <button
                    onClick={addNote}
                    className="btn-primary shrink-0 self-end sm:self-center px-6 py-3.5 h-[50px] text-xs uppercase tracking-wider gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Pin Note
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: 📷 Links & 📍 Moments */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              {/* 📷 Digital Photo Album */}
              <div className="reveal flex flex-col justify-between card-premium border-t-4 border-t-rose-400/80 min-h-[320px]">
                <div>
                  <div className="flex items-center gap-3 pb-4 mb-4 border-b border-rose-100/50">
                    <span className="p-2.5 rounded-2xl bg-rose-50 text-rose-500 shadow-sm shrink-0">
                      <Camera className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-lg font-bold text-wine-800 truncate">Digital Photo Album</h4>
                      <p className="text-xs text-wine-500/60 truncate font-body">Share Drive/Google Photos links.</p>
                    </div>
                    <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                      {links.length} {links.length === 1 ? 'link' : 'links'}
                    </span>
                  </div>

                  {links.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl bg-cream-50/50 border border-dashed border-rose-200 px-3">
                      <p className="font-body text-xs font-medium text-wine-600">No album links saved yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1 no-scrollbar">
                      {links.map((l, i) => (
                        <div key={l.id || i} className="flex items-center gap-2.5 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                          <Link className="h-4 w-4 shrink-0 text-rose-400" />
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 truncate font-body text-xs font-semibold text-rose-700 hover:text-rose-800 underline"
                          >
                            {l.label || l.url}
                          </a>
                          <button
                            onClick={() => deleteLink(l.id, i)}
                            className="shrink-0 text-wine-400 hover:text-rose-600 transition-colors hover:scale-110"
                            title="Delete link"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-rose-100/50 pt-4 space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-wine-600">Add album link</label>
                  <input
                    value={newLinkLabel}
                    onChange={e => setNewLinkLabel(e.target.value)}
                    placeholder="Label (e.g. Our Maldives Trip)"
                    className="w-full rounded-xl border border-rose-100 bg-cream-50/40 px-3.5 py-2 font-body text-xs text-wine-800 placeholder:text-wine-400/40 focus:border-rose-400 focus:outline-none transition-all"
                  />
                  <div className="flex gap-2">
                    <input
                      value={newLinkUrl}
                      onChange={e => setNewLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 rounded-xl border border-rose-100 bg-cream-50/40 px-3.5 py-2 font-body text-xs text-wine-800 placeholder:text-wine-400/40 focus:border-rose-400 focus:outline-none transition-all"
                    />
                    <button
                      onClick={addLink}
                      className="btn-primary shrink-0 px-3 py-2 text-xs"
                      title="Save link"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 📍 Milestone Moments */}
              <div className="reveal flex flex-col justify-between card-premium border-t-4 border-t-gold-400/80 min-h-[320px]">
                <div>
                  <div className="flex items-center gap-3 pb-4 mb-4 border-b border-rose-100/50">
                    <span className="p-2.5 rounded-2xl bg-gold-50 text-gold-600 shadow-sm shrink-0">
                      <Milestone className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-lg font-bold text-wine-800 truncate">Milestone Moments</h4>
                      <p className="text-xs text-wine-500/60 truncate font-body">Our timeline milestones.</p>
                    </div>
                    <span className="bg-gold-100 text-gold-800 text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                      {sortedMoments.length} {sortedMoments.length === 1 ? 'moment' : 'moments'}
                    </span>
                  </div>

                  {sortedMoments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl bg-cream-50/50 border border-dashed border-rose-200 px-3">
                      <p className="font-body text-xs font-medium text-wine-600">No milestones logged yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                      {sortedMoments.map((m, i) => (
                        <div
                          key={m.id || i}
                          className="relative flex items-center bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-soft p-3 gap-3 hover:shadow-md transition-shadow"
                        >
                          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cream-100 border-r border-rose-100" />
                          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cream-100 border-l border-rose-100" />
                          <div className="pl-2 pr-1 flex items-center justify-between w-full gap-2">
                            <div className="flex flex-col">
                              <span className="font-body text-[11px] font-bold text-rose-500 uppercase tracking-wider">
                                {formatMilestoneDate(m.date)}
                              </span>
                              <span className="font-handwriting text-base text-wine-800 font-semibold leading-tight mt-0.5">
                                {m.title}
                              </span>
                            </div>
                            <button
                              onClick={() => deleteMoment(m.id, i)}
                              className="text-wine-400 hover:text-rose-600 transition-colors ml-auto hover:scale-110 cursor-pointer"
                              title="Delete moment"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-rose-100/50 pt-4 space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-wine-600">Log milestone</label>
                  <input
                    value={newMomentTitle}
                    onChange={e => setNewMomentTitle(e.target.value)}
                    placeholder="What happened?"
                    className="w-full rounded-xl border border-rose-100 bg-cream-50/40 px-3.5 py-2 font-body text-xs text-wine-800 placeholder:text-wine-400/40 focus:border-rose-400 focus:outline-none transition-all"
                  />
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={newMomentDate}
                      onChange={e => setNewMomentDate(e.target.value)}
                      className="flex-1 rounded-xl border border-rose-100 bg-cream-50/40 px-3 py-2 font-body text-xs text-wine-800 focus:border-rose-400 focus:outline-none transition-all"
                    />
                    <button
                      onClick={addMoment}
                      className="btn-primary shrink-0 px-3 py-2 text-xs"
                      title="Save moment"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal mt-12 rounded-3xl bg-gradient-to-br from-wine-700 to-rose-600 p-8 text-center text-white shadow-card">
            <p className="font-display text-xl text-white sm:text-2xl">
              One day, our kids can open this and see how it all started.
            </p>
            <p className="mt-3 font-body text-sm text-cream-200/80">
              This archive isn't finished — it never will be. And that's the whole point.
            </p>
          </div>
        </div>
      </section>

      {/* ─── MULTIMEDIA LIGHTBOX (PHOTOS & VIDEOS) ─── */}
      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-wine-950/95 p-4 sm:p-6 backdrop-blur-2xl animate-fade-in select-none"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar with High-Visibility Close Button & Counter */}
          <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between z-30 pointer-events-none">
            <span className="pointer-events-auto rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20 shadow-md">
              {active + 1} / {memories.length}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-wine-900 shadow-2xl transition-all hover:bg-rose-500 hover:text-white hover:scale-105 active:scale-95 ring-2 ring-white/50 cursor-pointer"
              aria-label="Close photo"
            >
              <X className="h-4 w-4 stroke-[2.5]" />
              <span>Close</span>
            </button>
          </div>

          {/* Previous Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 sm:left-6 z-30 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-white/20 text-white shadow-lg transition-all hover:bg-white hover:text-wine-900 hover:scale-110 active:scale-95 backdrop-blur-md border border-white/20 cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 sm:right-6 z-30 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-white/20 text-white shadow-lg transition-all hover:bg-white hover:text-wine-900 hover:scale-110 active:scale-95 backdrop-blur-md border border-white/20 cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          {/* Media Frame */}
          <div
            className="max-h-[85vh] max-w-4xl w-full animate-bounce-in flex flex-col items-center justify-center my-auto px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black/60 ring-1 ring-white/20 max-h-[68vh] flex items-center justify-center">
              {memories[active].type === 'video' ? (
                <video
                  key={memories[active].src}
                  src={memories[active].src}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[68vh] max-w-full rounded-2xl object-contain"
                />
              ) : (
                <img
                  key={memories[active].src}
                  src={memories[active].src}
                  alt={memories[active].alt}
                  className="max-h-[68vh] max-w-full rounded-2xl object-contain"
                />
              )}
            </div>

            {/* Bottom Caption & Extra Close Button for Mobile */}
            <div className="mt-3.5 text-center max-w-xl px-4 flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold-300 backdrop-blur-sm">
                <Calendar className="h-3 w-3" />
                {memories[active].date}
              </span>
              <p className="mt-1.5 font-display text-base sm:text-lg text-white font-medium drop-shadow-md">
                {memories[active].caption}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-cream-100 hover:bg-white hover:text-wine-900 transition-all border border-white/20 shadow-md cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Tap to close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
