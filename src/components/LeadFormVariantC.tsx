import { useState, type FormEvent } from 'react';

interface Props {
  sourcePage: string;
}

export default function LeadFormVariantC({ sourcePage }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      problematique: formData.get('problematique') as string,
      message: formData.get('message') as string,
      form_variant: 'C',
      source_page: sourcePage,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Erreur lors de l\'envoi');
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Une erreur est survenue. Veuillez reessayer.');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-sage-400 rounded-2xl p-8 sm:p-10 text-center">
        <div className="w-16 h-16 bg-sage-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl font-bold text-warm-700 mb-2">Rendez-vous demande !</h3>
        <p className="text-warm-500">
          Je vous recontacterai dans les 24h pour confirmer la date et l'heure de votre rendez-vous au cabinet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-sage-400 rounded-2xl p-8 sm:p-10">
      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-warm-700 mb-2">
          Prenez rendez-vous maintenant
        </h3>
        <p className="text-warm-500">
          Remplissez vos coordonnees et je vous rappelle pour confirmer votre creneau.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name_c" className="block text-sm font-medium text-warm-600 mb-1">
              Prenom *
            </label>
            <input
              type="text"
              id="first_name_c"
              name="first_name"
              required
              className="w-full px-4 py-3 bg-white border border-sage-400/30 rounded-xl text-warm-700 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              placeholder="Votre prenom"
            />
          </div>
          <div>
            <label htmlFor="last_name_c" className="block text-sm font-medium text-warm-600 mb-1">
              Nom *
            </label>
            <input
              type="text"
              id="last_name_c"
              name="last_name"
              required
              className="w-full px-4 py-3 bg-white border border-sage-400/30 rounded-xl text-warm-700 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              placeholder="Votre nom"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email_c" className="block text-sm font-medium text-warm-600 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email_c"
            name="email"
            required
            className="w-full px-4 py-3 bg-white border border-sage-400/30 rounded-xl text-warm-700 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone_c" className="block text-sm font-medium text-warm-600 mb-1">
            Telephone *
          </label>
          <input
            type="tel"
            id="phone_c"
            name="phone"
            required
            className="w-full px-4 py-3 bg-white border border-sage-400/30 rounded-xl text-warm-700 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="06 XX XX XX XX"
          />
        </div>

        <div>
          <label htmlFor="problematique_c" className="block text-sm font-medium text-warm-600 mb-1">
            Motif de consultation
          </label>
          <select
            id="problematique_c"
            name="problematique"
            className="w-full px-4 py-3 bg-white border border-sage-400/30 rounded-xl text-warm-700 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          >
            <option value="">Selectionnez...</option>
            <option value="anorexie">Anorexie mentale</option>
            <option value="boulimie">Boulimie</option>
            <option value="hyperphagie">Hyperphagie boulimique</option>
            <option value="autre_tca">Autre trouble alimentaire</option>
            <option value="ne_sais_pas">Je ne sais pas encore</option>
          </select>
        </div>

        <div>
          <label htmlFor="message_c" className="block text-sm font-medium text-warm-600 mb-1">
            Precisions (optionnel)
          </label>
          <textarea
            id="message_c"
            name="message"
            rows={3}
            className="w-full px-4 py-3 bg-white border border-sage-400/30 rounded-xl text-warm-700 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
            placeholder="Disponibilites, questions..."
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="rgpd_c"
            name="rgpd"
            required
            className="mt-1 w-4 h-4 rounded border-sage-400/30 text-sage-500 focus:ring-sage-500"
          />
          <label htmlFor="rgpd_c" className="text-xs text-warm-400">
            J'accepte que mes donnees soient traitees dans le cadre de ma demande de rendez-vous.
            Conformement au RGPD, vous pouvez demander la suppression de vos donnees a tout moment.
          </label>
        </div>

        {status === 'error' && (
          <p className="text-red-500 text-sm">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-4 bg-sage-500 text-white font-semibold rounded-full hover:bg-sage-600 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Envoi en cours...' : 'Prendre rendez-vous'}
        </button>

        <p className="text-center text-xs text-warm-400">
          Au cabinet - 15 Rue de la Republique, 69002 Lyon
        </p>
      </form>
    </div>
  );
}
