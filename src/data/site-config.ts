export const siteConfig = {
  name: 'Cabinet de Psychologie - TCA Lyon',
  shortName: 'Psychologue TCA Lyon',
  description:
    'Psychologue specialisee dans les troubles du comportement alimentaire (TCA) a Lyon. Accompagnement bienveillant pour l\'anorexie, la boulimie et l\'hyperphagie.',
  url: 'https://psychologue-tca-lyon.fr',
  phone: '04 78 00 00 00',
  email: 'contact.kivio@gmail.com',
  address: {
    street: '15 Rue de la Republique',
    city: 'Lyon',
    postalCode: '69002',
    country: 'FR',
  },
  therapist: {
    name: 'Dr. Sophie Martin',
    title: 'Psychologue Clinicienne',
    credentials: 'N° ADELI: 69 93 XXXXX X',
    specialties: [
      'Troubles du Comportement Alimentaire (TCA)',
      'Anorexie mentale',
      'Boulimie',
      'Hyperphagie boulimique',
      'Therapie Cognitivo-Comportementale (TCC)',
    ],
  },
  social: {
    linkedin: 'https://linkedin.com/in/psychologue-tca-lyon',
    doctolib: 'https://www.doctolib.fr/psychologue/lyon/sophie-martin',
  },
  openingHours: {
    days: 'Lundi - Vendredi',
    hours: '9h00 - 19h00',
    note: 'Sur rendez-vous uniquement',
  },
} as const;
