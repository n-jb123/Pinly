import React, { useState } from 'react';
import { useApp } from '../../data/context';
import { TableSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { Search, FolderKanban, Users, MessageSquare, Layers, ArrowRight } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { client, navigateTo, qaLoading, qaError } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({ projects: [], clients: [], works: [], comments: [] });
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults({ projects: [], clients: [], works: [], comments: [] });
      setHasSearched(false);
      return;
    }
    setSearching(true);
    try {
      const res = await client.search(q.trim());
      setResults(res);
      setHasSearched(true);
    } finally {
      setSearching(false);
    }
  };

  if (qaLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-8 w-44 bg-[var(--border)]/50 rounded-xl animate-pulse" />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  if (qaError) {
    return <ErrorState onRetry={() => handleSearch(query)} />;
  }

  const totalCount =
    results.projects.length + results.clients.length + results.works.length + results.comments.length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">Global Workspace Search</h1>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Instantly look up projects, clients, deliverable names, and specific feedback comments.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-[var(--muted)] absolute start-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by keywords (e.g. 'button', 'Apex', 'Tariq', 'logo')..."
          className="w-full text-sm ps-12 pe-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] focus:outline-none focus:border-[#FF5A3C] shadow-xs"
        />
      </div>

      {hasSearched && (
        <div className="space-y-6">
          <p className="text-xs text-[var(--muted)]">
            Found <strong>{totalCount}</strong> match(es) for &quot;{query}&quot;
          </p>

          {/* Group 1: Projects */}
          {results.projects.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-[#FF5A3C]" />
                Projects ({results.projects.length})
              </h2>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
                {results.projects.map((p: any) => (
                  <div
                    key={p.id}
                    onClick={() => navigateTo(`/app/projects/${p.id}`)}
                    className="p-4 flex justify-between items-center hover:bg-[var(--canvas)] cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-bold text-[var(--text)] block">{p.name}</span>
                      <span className="text-[11px] text-[var(--muted)]">{p.description}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] rtl:rotate-180" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 2: Deliverable Works */}
          {results.works.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF5A3C]" />
                Deliverables ({results.works.length})
              </h2>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
                {results.works.map((w: any) => (
                  <div
                    key={w.id}
                    onClick={() => navigateTo(`/app/projects/${w.projectId}/works/${w.id}`)}
                    className="p-4 flex justify-between items-center hover:bg-[var(--canvas)] cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-bold text-[var(--text)] block">{w.title}</span>
                      <span className="text-[11px] text-[var(--muted)] capitalize">{w.type} Deliverable</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] rtl:rotate-180" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 3: Comments & Annotations */}
          {results.comments.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#FF5A3C]" />
                Feedback Comments ({results.comments.length})
              </h2>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
                {results.comments.map((c: any) => (
                  <div
                    key={c.id}
                    onClick={() => navigateTo('/app/projects/proj_website_redesign/works/work_landing_page')}
                    className="p-4 flex justify-between items-center hover:bg-[var(--canvas)] cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[var(--text)] block">&ldquo;{c.body}&rdquo;</span>
                      <span className="text-[11px] text-[var(--muted)]">By {c.authorName}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] rtl:rotate-180" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group 4: Clients */}
          {results.clients.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#FF5A3C]" />
                Clients ({results.clients.length})
              </h2>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
                {results.clients.map((cl: any) => (
                  <div
                    key={cl.id}
                    onClick={() => navigateTo('/app/clients')}
                    className="p-4 flex justify-between items-center hover:bg-[var(--canvas)] cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-bold text-[var(--text)] block">{cl.name}</span>
                      <span className="text-[11px] text-[var(--muted)]">{cl.company} • {cl.email}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] rtl:rotate-180" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
