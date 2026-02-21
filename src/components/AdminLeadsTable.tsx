import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Lead {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  problematique: string | null;
  form_variant: string;
  source_page: string | null;
  status: string;
  notes: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

interface FormStart {
  id: string;
  created_at: string;
  first_name: string;
  email: string;
  form_variant: string;
  source_page: string | null;
  converted: boolean;
}

type Tab = 'leads' | 'form_starts';

const variantLabels: Record<string, string> = {
  A: 'Decouverte',
  B: 'Consultation',
  C: 'Direct',
};

const problematiqeLabels: Record<string, string> = {
  anorexie: 'Anorexie mentale',
  boulimie: 'Boulimie',
  hyperphagie: 'Hyperphagie boulimique',
  autre_tca: 'Autre trouble alimentaire',
  ne_sais_pas: 'Ne sait pas encore',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---- Lead Detail Modal ----
function LeadDetailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-5 rounded-t-2xl ${
          lead.form_variant === 'A' ? 'bg-gradient-to-r from-peach-500 to-peach-400' :
          lead.form_variant === 'B' ? 'bg-gradient-to-r from-sky-500 to-sky-400' :
          'bg-gradient-to-r from-sage-500 to-sage-400'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-lg font-bold">
                {lead.first_name} {lead.last_name}
              </h2>
              <p className="text-white/80 text-sm mt-0.5">{formatFullDate(lead.created_at)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="px-2.5 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
              Variante {lead.form_variant} — {variantLabels[lead.form_variant] || lead.form_variant}
            </span>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              lead.status === 'new' ? 'bg-white/90 text-peach-600' :
              lead.status === 'contacted' ? 'bg-white/90 text-sky-600' :
              'bg-white/90 text-sage-600'
            }`}>
              {lead.status === 'new' ? 'Nouveau' : lead.status === 'contacted' ? 'Contacte' : lead.status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Contact info */}
          <div>
            <h3 className="text-xs font-semibold text-warm-400 uppercase tracking-wider mb-3">Contact</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-peach-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-peach-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-warm-700 text-sm font-medium">{lead.email || '-'}</p>
                  <p className="text-warm-400 text-xs">Email</p>
                </div>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-warm-700 text-sm font-medium">{lead.phone}</p>
                    <p className="text-warm-400 text-xs">Telephone</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Problematique */}
          {lead.problematique && (
            <div>
              <h3 className="text-xs font-semibold text-warm-400 uppercase tracking-wider mb-2">Problematique</h3>
              <div className="bg-warm-50 rounded-xl px-4 py-3">
                <p className="text-warm-700 text-sm">
                  {problematiqeLabels[lead.problematique] || lead.problematique}
                </p>
              </div>
            </div>
          )}

          {/* Message */}
          {lead.message && (
            <div>
              <h3 className="text-xs font-semibold text-warm-400 uppercase tracking-wider mb-2">Message</h3>
              <div className="bg-warm-50 rounded-xl px-4 py-3">
                <p className="text-warm-700 text-sm leading-relaxed whitespace-pre-wrap">{lead.message}</p>
              </div>
            </div>
          )}

          {/* Meta info */}
          <div>
            <h3 className="text-xs font-semibold text-warm-400 uppercase tracking-wider mb-3">Informations</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-cream-50 rounded-xl px-3 py-2.5">
                <p className="text-warm-400 text-xs">Page source</p>
                <p className="text-warm-700 text-sm font-medium mt-0.5">{lead.source_page || '-'}</p>
              </div>
              <div className="bg-cream-50 rounded-xl px-3 py-2.5">
                <p className="text-warm-400 text-xs">UTM Source</p>
                <p className="text-warm-700 text-sm font-medium mt-0.5">{lead.utm_source || '-'}</p>
              </div>
              {lead.utm_medium && (
                <div className="bg-cream-50 rounded-xl px-3 py-2.5">
                  <p className="text-warm-400 text-xs">UTM Medium</p>
                  <p className="text-warm-700 text-sm font-medium mt-0.5">{lead.utm_medium}</p>
                </div>
              )}
              {lead.utm_campaign && (
                <div className="bg-cream-50 rounded-xl px-3 py-2.5">
                  <p className="text-warm-400 text-xs">UTM Campaign</p>
                  <p className="text-warm-700 text-sm font-medium mt-0.5">{lead.utm_campaign}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div>
              <h3 className="text-xs font-semibold text-warm-400 uppercase tracking-wider mb-2">Notes</h3>
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <p className="text-warm-700 text-sm leading-relaxed whitespace-pre-wrap">{lead.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-cream-100 flex gap-3">
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="flex-1 py-2.5 bg-sage-500 text-white text-sm font-semibold rounded-xl text-center hover:bg-sage-600 transition-colors"
            >
              Appeler
            </a>
          )}
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="flex-1 py-2.5 bg-peach-500 text-white text-sm font-semibold rounded-xl text-center hover:bg-peach-600 transition-colors"
            >
              Envoyer un email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- FormStart Detail Modal ----
function FormStartDetailModal({ fs, onClose }: { fs: FormStart; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 rounded-t-2xl bg-gradient-to-r from-amber-500 to-amber-400">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-lg font-bold">{fs.first_name}</h2>
              <p className="text-white/80 text-sm mt-0.5">{formatFullDate(fs.created_at)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="px-2.5 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
              Variante {fs.form_variant} — {variantLabels[fs.form_variant] || fs.form_variant}
            </span>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              fs.converted ? 'bg-white/90 text-sage-600' : 'bg-white/90 text-amber-600'
            }`}>
              {fs.converted ? 'Converti' : 'Non converti'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-peach-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-peach-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-warm-700 text-sm font-medium">{fs.email}</p>
              <p className="text-warm-400 text-xs">Email</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cream-50 rounded-xl px-3 py-2.5">
              <p className="text-warm-400 text-xs">Page source</p>
              <p className="text-warm-700 text-sm font-medium mt-0.5">{fs.source_page || '-'}</p>
            </div>
            <div className="bg-cream-50 rounded-xl px-3 py-2.5">
              <p className="text-warm-400 text-xs">Statut</p>
              <p className={`text-sm font-medium mt-0.5 ${fs.converted ? 'text-sage-600' : 'text-amber-600'}`}>
                {fs.converted ? 'A soumis le formulaire' : 'Abandon'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-cream-100">
          <a
            href={`mailto:${fs.email}`}
            className="block w-full py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl text-center hover:bg-amber-600 transition-colors"
          >
            Envoyer un email de relance
          </a>
        </div>
      </div>
    </div>
  );
}

// ---- Main Component ----
export default function AdminLeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [formStarts, setFormStarts] = useState<FormStart[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [tab, setTab] = useState<Tab>('leads');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedFormStart, setSelectedFormStart] = useState<FormStart | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const [leadsRes, formStartsRes] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('form_starts').select('*').order('created_at', { ascending: false }),
    ]);

    if (leadsRes.error) console.error('Error fetching leads:', leadsRes.error);
    else setLeads(leadsRes.data || []);

    if (formStartsRes.error) console.error('Error fetching form_starts:', formStartsRes.error);
    else setFormStarts(formStartsRes.data || []);

    setLoading(false);
  }

  const filteredLeads = filter === 'all'
    ? leads
    : leads.filter((l) => l.form_variant === filter);

  const filteredFormStarts = filter === 'all'
    ? formStarts
    : formStarts.filter((f) => f.form_variant === filter);

  const leadsStats = {
    total: leads.length,
    A: leads.filter((l) => l.form_variant === 'A').length,
    B: leads.filter((l) => l.form_variant === 'B').length,
    C: leads.filter((l) => l.form_variant === 'C').length,
  };

  const formStartsTotal = formStarts.length;
  const formStartsConverted = formStarts.filter((f) => f.converted).length;
  const conversionRate = formStartsTotal > 0
    ? Math.round((formStartsConverted / formStartsTotal) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-peach-200 border-t-peach-500 rounded-full animate-spin" />
          <span className="text-warm-400 text-sm">Chargement des donnees...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Modals */}
      {selectedLead && (
        <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
      {selectedFormStart && (
        <FormStartDetailModal fs={selectedFormStart} onClose={() => setSelectedFormStart(null)} />
      )}

      {/* Conversion Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <p className="text-sm text-warm-400">Leads soumis</p>
          <p className="text-2xl font-bold text-warm-700">{leadsStats.total}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <p className="text-sm text-warm-400">Formulaires commences</p>
          <p className="text-2xl font-bold text-amber-600">{formStartsTotal}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-sage-400 p-4">
          <p className="text-sm text-warm-400">Convertis</p>
          <p className="text-2xl font-bold text-sage-600">{formStartsConverted}</p>
        </div>
        <div className="bg-sky-50 rounded-xl border border-sky-200 p-4">
          <p className="text-sm text-warm-400">Taux conversion</p>
          <p className="text-2xl font-bold text-sky-600">{conversionRate}%</p>
        </div>
      </div>

      {/* Variant Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-peach-50 rounded-xl border border-peach-200 p-4">
          <p className="text-sm text-warm-400">A (Decouverte)</p>
          <p className="text-2xl font-bold text-peach-600">{leadsStats.A}</p>
        </div>
        <div className="bg-sky-50 rounded-xl border border-sky-200 p-4">
          <p className="text-sm text-warm-400">B (Consultation)</p>
          <p className="text-2xl font-bold text-sky-600">{leadsStats.B}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-sage-400 p-4">
          <p className="text-sm text-warm-400">C (Direct)</p>
          <p className="text-2xl font-bold text-sage-600">{leadsStats.C}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6 border-b border-cream-200">
        <button
          onClick={() => setTab('leads')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            tab === 'leads'
              ? 'border-peach-500 text-peach-600'
              : 'border-transparent text-warm-400 hover:text-warm-600'
          }`}
        >
          Leads soumis ({leads.length})
        </button>
        <button
          onClick={() => setTab('form_starts')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            tab === 'form_starts'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-warm-400 hover:text-warm-600'
          }`}
        >
          Formulaires commences ({formStarts.length})
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-warm-500">Filtrer :</span>
        {(['all', 'A', 'B', 'C'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === v
                ? 'bg-warm-700 text-white'
                : 'bg-cream-100 text-warm-500 hover:bg-cream-200'
            }`}
          >
            {v === 'all' ? 'Tous' : `Variante ${v}`}
          </button>
        ))}
        <button
          onClick={fetchAll}
          className="ml-auto px-3 py-1 text-sm bg-cream-100 text-warm-500 rounded-full hover:bg-cream-200 transition-colors"
        >
          Actualiser
        </button>
      </div>

      {/* Leads Table */}
      {tab === 'leads' && (
        <>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-warm-400">
              Aucun lead pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-200">
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Nom</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Contact</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Variante</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Statut</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="border-b border-cream-100 hover:bg-peach-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 text-warm-600 whitespace-nowrap">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="py-3 px-4 text-warm-700 font-medium group-hover:text-peach-600 transition-colors">
                        {lead.first_name} {lead.last_name}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-warm-600">{lead.email}</div>
                        {lead.phone && <div className="text-warm-400 text-xs">{lead.phone}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          lead.form_variant === 'A' ? 'bg-peach-100 text-peach-700' :
                          lead.form_variant === 'B' ? 'bg-sky-100 text-sky-700' :
                          'bg-green-100 text-sage-700'
                        }`}>
                          {lead.form_variant}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          lead.status === 'new' ? 'bg-peach-100 text-peach-700' :
                          lead.status === 'contacted' ? 'bg-sky-100 text-sky-700' :
                          'bg-green-100 text-sage-700'
                        }`}>
                          {lead.status === 'new' ? 'Nouveau' : lead.status === 'contacted' ? 'Contacte' : lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-warm-500 max-w-48 truncate">
                        {lead.message || lead.problematique || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Form Starts Table */}
      {tab === 'form_starts' && (
        <>
          {filteredFormStarts.length === 0 ? (
            <div className="text-center py-12 text-warm-400">
              Aucun formulaire commence pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-200">
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Prenom</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Variante</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Page source</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Converti</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFormStarts.map((fs) => (
                    <tr
                      key={fs.id}
                      onClick={() => setSelectedFormStart(fs)}
                      className="border-b border-cream-100 hover:bg-amber-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 text-warm-600 whitespace-nowrap">
                        {formatDate(fs.created_at)}
                      </td>
                      <td className="py-3 px-4 text-warm-700 font-medium group-hover:text-amber-600 transition-colors">
                        {fs.first_name}
                      </td>
                      <td className="py-3 px-4 text-warm-600">{fs.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          fs.form_variant === 'A' ? 'bg-peach-100 text-peach-700' :
                          fs.form_variant === 'B' ? 'bg-sky-100 text-sky-700' :
                          'bg-green-100 text-sage-700'
                        }`}>
                          {fs.form_variant}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-warm-500">{fs.source_page || '-'}</td>
                      <td className="py-3 px-4">
                        {fs.converted ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-sage-700">
                            Oui
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            Non
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
