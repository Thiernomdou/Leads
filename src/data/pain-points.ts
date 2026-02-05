export interface PainPoint {
  id: number;
  quote: string;
  description: string;
  relatedArticle?: string;
}

export const painPoints: PainPoint[] = [
  {
    id: 1,
    quote: 'Je me sens prisonnier(e) de mes comportements alimentaires',
    description:
      'Les TCA creent un sentiment d\'enfermement. La therapie vous aide a retrouver votre liberte et votre autonomie face a la nourriture.',
    relatedArticle: 'premier-pas-vers-la-guerison-tca',
  },
  {
    id: 2,
    quote: 'La honte m\'empeche d\'en parler',
    description:
      'La honte est l\'un des plus grands obstacles au soin. Dans un espace confidentiel et sans jugement, vous pouvez enfin poser des mots sur votre souffrance.',
    relatedArticle: 'tca-et-emotions-comprendre-le-lien',
  },
  {
    id: 3,
    quote: 'J\'ai deja essaye seul(e), sans y parvenir',
    description:
      'Les TCA sont des troubles complexes qui necessitent un accompagnement specialise. Ce n\'est pas un echec de demander de l\'aide.',
    relatedArticle: 'premier-pas-vers-la-guerison-tca',
  },
  {
    id: 4,
    quote: 'Mon rapport a la nourriture affecte toutes mes relations',
    description:
      'Les troubles alimentaires impactent la vie sociale, familiale et professionnelle. Ensemble, nous travaillons a restaurer ces liens.',
    relatedArticle: 'tca-et-emotions-comprendre-le-lien',
  },
  {
    id: 5,
    quote: 'Je ne me reconnais plus dans le miroir',
    description:
      'La dysmorphie corporelle est un symptome frequent des TCA. La therapie vous aide a reconstruire une image de soi plus juste et bienveillante.',
    relatedArticle: 'anorexie-mentale-signes-et-accompagnement',
  },
  {
    id: 6,
    quote: 'La nourriture occupe toutes mes pensees',
    description:
      'L\'obsession alimentaire est epuisante. La therapie vise a apaiser ces pensees pour retrouver de l\'espace mental.',
    relatedArticle: 'comprendre-la-boulimie',
  },
  {
    id: 7,
    quote: 'J\'ai peur des consequences sur ma sante',
    description:
      'Cette peur est legitime. Les TCA ont des consequences physiques reelles. Un accompagnement precoce limite ces risques et favorise la guerison.',
    relatedArticle: 'hyperphagie-boulimique-guide-complet',
  },
  {
    id: 8,
    quote: 'Je ne sais pas si ce que je vis est un TCA',
    description:
      'Les TCA prennent de nombreuses formes. Un professionnel peut vous aider a clarifier ce que vous vivez, sans etiquette ni jugement.',
    relatedArticle: 'comprendre-la-boulimie',
  },
  {
    id: 9,
    quote: 'J\'ai peur de grossir si je commence un suivi',
    description:
      'Cette crainte est tres frequente. L\'objectif de la therapie n\'est pas de modifier votre poids, mais de restaurer une relation apaisee avec la nourriture.',
    relatedArticle: 'anorexie-mentale-signes-et-accompagnement',
  },
  {
    id: 10,
    quote: 'Je veux m\'en sortir mais je ne sais pas par ou commencer',
    description:
      'Le premier pas est souvent le plus difficile. Un premier echange, sans engagement, peut tout changer.',
    relatedArticle: 'premier-pas-vers-la-guerison-tca',
  },
];
