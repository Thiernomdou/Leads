export interface SEOKeyword {
  keyword: string;
  volume: 'high' | 'medium' | 'low';
  intent: 'informational' | 'transactional' | 'navigational';
  priority: number;
}

export const seoKeywords: SEOKeyword[] = [
  { keyword: 'psychologue tca lyon', volume: 'medium', intent: 'transactional', priority: 1 },
  { keyword: 'trouble alimentaire lyon', volume: 'medium', intent: 'transactional', priority: 2 },
  { keyword: 'psychologue boulimie lyon', volume: 'low', intent: 'transactional', priority: 3 },
  { keyword: 'psychologue anorexie lyon', volume: 'low', intent: 'transactional', priority: 4 },
  { keyword: 'hyperphagie boulimique traitement', volume: 'medium', intent: 'informational', priority: 5 },
  { keyword: 'therapie tca lyon', volume: 'low', intent: 'transactional', priority: 6 },
  { keyword: 'tcc trouble alimentaire', volume: 'low', intent: 'informational', priority: 7 },
  { keyword: 'guerir anorexie', volume: 'high', intent: 'informational', priority: 8 },
  { keyword: 'guerir boulimie', volume: 'high', intent: 'informational', priority: 9 },
  { keyword: 'symptomes anorexie mentale', volume: 'high', intent: 'informational', priority: 10 },
  { keyword: 'boulimie signes', volume: 'medium', intent: 'informational', priority: 11 },
  { keyword: 'hyperphagie symptomes', volume: 'medium', intent: 'informational', priority: 12 },
  { keyword: 'trouble comportement alimentaire aide', volume: 'medium', intent: 'transactional', priority: 13 },
  { keyword: 'tca et emotions', volume: 'low', intent: 'informational', priority: 14 },
  { keyword: 'premier rdv psychologue tca', volume: 'low', intent: 'informational', priority: 15 },
  { keyword: 'comment savoir si j ai un tca', volume: 'high', intent: 'informational', priority: 16 },
  { keyword: 'psychologue specialise tca', volume: 'medium', intent: 'transactional', priority: 17 },
  { keyword: 'accompagnement anorexie', volume: 'low', intent: 'informational', priority: 18 },
  { keyword: 'traitement boulimie psychologue', volume: 'low', intent: 'transactional', priority: 19 },
  { keyword: 'tca guerison temoignage', volume: 'medium', intent: 'informational', priority: 20 },
  { keyword: 'psychologue alimentaire', volume: 'medium', intent: 'transactional', priority: 21 },
  { keyword: 'trouble alimentaire adolescent lyon', volume: 'low', intent: 'transactional', priority: 22 },
  { keyword: 'binge eating disorder france', volume: 'low', intent: 'informational', priority: 23 },
  { keyword: 'orthorexie traitement', volume: 'low', intent: 'informational', priority: 24 },
  { keyword: 'prise en charge tca', volume: 'medium', intent: 'informational', priority: 25 },
  { keyword: 'cabinet psychologue lyon 2', volume: 'low', intent: 'navigational', priority: 26 },
  { keyword: 'consultation tca en ligne', volume: 'low', intent: 'transactional', priority: 27 },
  { keyword: 'manger ses emotions', volume: 'high', intent: 'informational', priority: 28 },
  { keyword: 'compulsion alimentaire aide', volume: 'medium', intent: 'transactional', priority: 29 },
  { keyword: 'psychologue trouble alimentaire remboursement', volume: 'low', intent: 'informational', priority: 30 },
];
