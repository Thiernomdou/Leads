import { useState, useEffect } from 'react';
import { getVariant, type FormVariant } from '../lib/ab-testing';
import LeadFormVariantA from './LeadFormVariantA';
import LeadFormVariantB from './LeadFormVariantB';
import LeadFormVariantC from './LeadFormVariantC';

export default function LeadFormClient({ sourcePage }: { sourcePage: string }) {
  const [variant, setVariant] = useState<FormVariant | null>(null);

  useEffect(() => {
    setVariant(getVariant());
  }, []);

  if (!variant) {
    return (
      <div className="animate-pulse bg-cream-100 rounded-2xl h-96 flex items-center justify-center">
        <span className="text-warm-400">Chargement...</span>
      </div>
    );
  }

  switch (variant) {
    case 'A':
      return <LeadFormVariantA sourcePage={sourcePage} />;
    case 'B':
      return <LeadFormVariantB sourcePage={sourcePage} />;
    case 'C':
      return <LeadFormVariantC sourcePage={sourcePage} />;
  }
}
