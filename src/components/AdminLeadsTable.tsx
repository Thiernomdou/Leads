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

export default function AdminLeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [formStarts, setFormStarts] = useState<FormStart[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [tab, setTab] = useState<Tab>('leads');

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
        <span className="text-warm-400">Chargement des donnees...</span>
      </div>
    );
  }

  return (
    <div>
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
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Source</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Statut</th>
                    <th className="text-left py-3 px-4 text-warm-500 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-cream-100 hover:bg-cream-50">
                      <td className="py-3 px-4 text-warm-600 whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-warm-700 font-medium">
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
                      <td className="py-3 px-4 text-warm-500">{lead.source_page || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          lead.status === 'new' ? 'bg-peach-100 text-peach-700' :
                          lead.status === 'contacted' ? 'bg-sky-100 text-sky-700' :
                          'bg-green-100 text-sage-700'
                        }`}>
                          {lead.status}
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
                    <tr key={fs.id} className="border-b border-cream-100 hover:bg-cream-50">
                      <td className="py-3 px-4 text-warm-600 whitespace-nowrap">
                        {new Date(fs.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-warm-700 font-medium">{fs.first_name}</td>
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
