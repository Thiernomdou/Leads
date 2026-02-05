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

export default function AdminLeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  }

  const filteredLeads = filter === 'all'
    ? leads
    : leads.filter((l) => l.form_variant === filter);

  const stats = {
    total: leads.length,
    A: leads.filter((l) => l.form_variant === 'A').length,
    B: leads.filter((l) => l.form_variant === 'B').length,
    C: leads.filter((l) => l.form_variant === 'C').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-warm-400">Chargement des leads...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-cream-200 p-4">
          <p className="text-sm text-warm-400">Total</p>
          <p className="text-2xl font-bold text-warm-700">{stats.total}</p>
        </div>
        <div className="bg-peach-50 rounded-xl border border-peach-200 p-4">
          <p className="text-sm text-warm-400">A (Decouverte)</p>
          <p className="text-2xl font-bold text-peach-600">{stats.A}</p>
        </div>
        <div className="bg-sky-50 rounded-xl border border-sky-200 p-4">
          <p className="text-sm text-warm-400">B (Consultation)</p>
          <p className="text-2xl font-bold text-sky-600">{stats.B}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-sage-400 p-4">
          <p className="text-sm text-warm-400">C (Direct)</p>
          <p className="text-2xl font-bold text-sage-600">{stats.C}</p>
        </div>
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
          onClick={fetchLeads}
          className="ml-auto px-3 py-1 text-sm bg-cream-100 text-warm-500 rounded-full hover:bg-cream-200 transition-colors"
        >
          Actualiser
        </button>
      </div>

      {/* Table */}
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
    </div>
  );
}
