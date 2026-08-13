import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar, Plus, Trash2, Link, PenLine } from 'lucide-react';
import { memories } from '@/content';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';

export function MemoriesPage() {
  const { navigate } = useRouter();
  const [active, setActive] = useState<number | null>(null);

  // --- archive state ---
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
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
    if (!supabase) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
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

  return (
    <PageShell>
      <section className="px-6 pt-32 pb-10 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow="Memories"
            title={
              <>
                Us, in <span className="text-gradient-rose">moments</span>
              </>
            }
            subtitle="A few moments I keep going back to. Tap any photo to see it up close."
          />
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
          {memories.map((m, i) => (
            <button
              key={m.src}
              onClick={() => setActive(i)}
              className={[
                'reveal group relative overflow-hidden rounded-3xl bg-wine-700 shadow-soft transition-all duration-500 hover:shadow-card',
                m.span ? 'col-span-2 lg:row-span-2' : '',
              ].join(' ')}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <img
                src={m.src}
                alt={m.alt}
                loading="lazy"
                className={[
                  'w-full object-cover transition-transform duration-700 group-hover:scale-105',
                  m.span ? 'aspect-[16/10] lg:aspect-square' : 'aspect-square',
                ].join(' ')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-900/85 via-wine-900/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-cream-100 backdrop-blur-sm">
                  <Calendar className="h-3 w-3" />
                  {m.date}
                </span>
                <p className="mt-2 font-display text-base font-medium text-white drop-shadow sm:text-lg">
                  {m.caption}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="reveal mx-auto mt-14 max-w-xl text-center">
          <p className="font-body text-wine-500/80">
            These are just the ones we stopped to share. My favorite ones don't have
            reels — they're just you, being you, when you didn't know I was paying
            attention.
          </p>
          <button onClick={() => navigate('/timeline')} className="btn-primary mt-8">
            See how we got here
          </button>
        </div>
      </section>

      {/* Memory Archive — interactive with localStorage fallback */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="reveal mx-auto mb-10 max-w-2xl text-center">
            <span className="chip bg-gold-100 text-gold-700">Living archive</span>
            <h3 className="mt-4 font-display text-3xl font-semibold text-wine-700 sm:text-4xl">
              Our <span className="text-gradient-rose">memory archive</span>
            </h3>
            <p className="mt-3 font-body text-wine-500/80">
              This will keep growing. Every photo, every note, every milestone — added over time, never deleted.
            </p>
            {loading && (
              <p className="mt-2 font-body text-xs text-rose-500 animate-pulse">Syncing with database...</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* 📷 Digital Photo Album — add links */}
            <div className="reveal group relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft transition-all duration-500 hover:shadow-card">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-100/50 blur-2xl opacity-60" />
              <button onClick={() => setExpandedCard(expandedCard === 'links' ? null : 'links')} className="relative w-full text-left">
                <span className="text-3xl">📷</span>
                <h4 className="mt-4 font-display text-lg font-semibold text-wine-700">Digital Photo Album</h4>
                <p className="mt-2 font-body text-sm text-wine-500/80">
                  {links.length === 0 ? 'Add album links — Google Drive, Google Photos, etc.' : `${links.length} link${links.length === 1 ? '' : 's'} saved`}
                </p>
              </button>
              {expandedCard === 'links' && (
                <div className="relative mt-4 space-y-3 border-t border-rose-100 pt-4">
                  {links.map((l, i) => (
                    <div key={l.id || i} className="flex items-center gap-2">
                      <Link className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate font-body text-sm text-rose-600 underline">{l.label || l.url}</a>
                      <button onClick={() => deleteLink(l.id, i)} className="shrink-0 text-wine-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} placeholder="Label (e.g. Our Drive)" className="flex-1 rounded-xl border border-rose-200 bg-cream-100 px-3 py-2 font-body text-sm text-wine-700 placeholder:text-wine-400/50 focus:border-rose-400 focus:outline-none" />
                    <input value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} placeholder="https://..." className="flex-1 rounded-xl border border-rose-200 bg-cream-100 px-3 py-2 font-body text-sm text-wine-700 placeholder:text-wine-400/50 focus:border-rose-400 focus:outline-none" />
                    <button onClick={addLink} className="shrink-0 rounded-xl bg-rose-500 px-4 py-2 font-body text-sm font-medium text-white shadow-soft hover:bg-rose-600">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 📝 Our Shared Notes — write & save */}
            <div className="reveal group relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft transition-all duration-500 hover:shadow-card">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-100/50 blur-2xl opacity-60" />
              <button onClick={() => setExpandedCard(expandedCard === 'notes' ? null : 'notes')} className="relative w-full text-left">
                <span className="text-3xl">📝</span>
                <h4 className="mt-4 font-display text-lg font-semibold text-wine-700">Our Shared Notes & Thoughts</h4>
                <p className="mt-2 font-body text-sm text-wine-500/80">
                  {notes.length === 0 ? 'Write little things we want to remember.' : `${notes.length} note${notes.length === 1 ? '' : 's'} saved`}
                </p>
              </button>
              {expandedCard === 'notes' && (
                <div className="relative mt-4 space-y-3 border-t border-rose-100 pt-4">
                  {notes.map((n, i) => (
                    <div key={n.id || i} className="flex items-start gap-2">
                      <PenLine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                      <p className="flex-1 font-body text-sm text-wine-600 whitespace-pre-wrap">{n.text}</p>
                      <button onClick={() => deleteNote(n.id, i)} className="shrink-0 text-wine-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Write a note..." rows={2} className="flex-1 rounded-xl border border-rose-200 bg-cream-100 px-3 py-2 font-body text-sm text-wine-700 placeholder:text-wine-400/50 focus:border-rose-400 focus:outline-none resize-none" />
                    <button onClick={addNote} className="shrink-0 self-end rounded-xl bg-rose-500 px-4 py-2 font-body text-sm font-medium text-white shadow-soft hover:bg-rose-600">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 📍 Milestone Moments — add title + date */}
            <div className="reveal group relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft transition-all duration-500 hover:shadow-card">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-100/50 blur-2xl opacity-60" />
              <button onClick={() => setExpandedCard(expandedCard === 'moments' ? null : 'moments')} className="relative w-full text-left">
                <span className="text-3xl">📍</span>
                <h4 className="mt-4 font-display text-lg font-semibold text-wine-700">Milestone Moments</h4>
                <p className="mt-2 font-body text-sm text-wine-500/80">
                  {moments.length === 0 ? 'First call, first meet, first trip, first everything.' : `${moments.length} moment${moments.length === 1 ? '' : 's'} logged`}
                </p>
              </button>
              {expandedCard === 'moments' && (
                <div className="relative mt-4 space-y-3 border-t border-rose-100 pt-4">
                  {moments.map((m, i) => (
                    <div key={m.id || i} className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                      <span className="font-body text-sm font-medium text-wine-700">{m.title}</span>
                      <span className="font-body text-xs text-wine-400">{m.date}</span>
                      <button onClick={() => deleteMoment(m.id, i)} className="ml-auto shrink-0 text-wine-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input value={newMomentTitle} onChange={e => setNewMomentTitle(e.target.value)} placeholder="What happened?" className="flex-1 rounded-xl border border-rose-200 bg-cream-100 px-3 py-2 font-body text-sm text-wine-700 placeholder:text-wine-400/50 focus:border-rose-400 focus:outline-none" />
                    <input type="date" value={newMomentDate} onChange={e => setNewMomentDate(e.target.value)} className="rounded-xl border border-rose-200 bg-cream-100 px-3 py-2 font-body text-sm text-wine-700 focus:border-rose-400 focus:outline-none" />
                    <button onClick={addMoment} className="shrink-0 rounded-xl bg-rose-500 px-4 py-2 font-body text-sm font-medium text-white shadow-soft hover:bg-rose-600">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 🌟 Future Memories — static placeholder */}
            <div className="reveal group relative overflow-hidden rounded-3xl bg-white p-7 shadow-soft transition-all duration-500 hover:shadow-card">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-100/50 blur-2xl opacity-60" />
              <span className="relative text-3xl">🌟</span>
              <h4 className="relative mt-4 font-display text-lg font-semibold text-wine-700">Future Memories</h4>
              <p className="relative mt-2 font-body text-sm leading-relaxed text-wine-500/80">
                Waiting to be added. The best ones haven't happened yet.
              </p>
            </div>
          </div>

          <div className="reveal mt-10 rounded-3xl bg-gradient-to-br from-wine-700 to-rose-600 p-8 text-center text-white shadow-card">
            <p className="font-display text-xl text-white sm:text-2xl">
              One day, our kids can open this and see how it all started.
            </p>
            <p className="mt-3 font-body text-sm text-cream-200/80">
              This archive isn't finished — it never will be. And that's the whole point.
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-wine-900/90 p-4 backdrop-blur-md animate-fade-in"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 sm:left-6"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 sm:right-6"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <figure
            className="max-h-[85vh] max-w-4xl animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={memories[active].src}
              alt={memories[active].alt}
              className="mx-auto max-h-[72vh] rounded-2xl object-contain shadow-card"
            />
            <figcaption className="mt-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cream-200">
                <Calendar className="h-3 w-3" />
                {memories[active].date}
              </span>
              <p className="mt-2 font-display text-lg text-white">
                {memories[active].caption}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </PageShell>
  );
}
