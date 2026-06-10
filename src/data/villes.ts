export type Ville = {
  slug: string;
  nom: string;
  region: string;
  codePostal: string;
  latitude: number;
  longitude: number;
  /** Phrase de contexte locale, unique par ville (anti thin-content) */
  contexte: string;
};

export const VILLES: Ville[] = [
  { slug: 'paris', nom: 'Paris', region: 'Île-de-France', codePostal: '75000', latitude: 48.8566, longitude: 2.3522, contexte: "Premier bassin hospitalier de France avec l'AP-HP, des centaines d'officines et une forte demande de remplaçants toute l'année." },
  { slug: 'marseille', nom: 'Marseille', region: "Provence-Alpes-Côte d'Azur", codePostal: '13000', latitude: 43.2965, longitude: 5.3698, contexte: "Deuxième ville de France, l'AP-HM et un dense réseau de cliniques et de pharmacies génèrent un besoin constant de remplacements." },
  { slug: 'lyon', nom: 'Lyon', region: 'Auvergne-Rhône-Alpes', codePostal: '69000', latitude: 45.764, longitude: 4.8357, contexte: "Pôle santé majeur avec les Hospices Civils de Lyon, de nombreux EHPAD et officines en quête de professionnels remplaçants." },
  { slug: 'toulouse', nom: 'Toulouse', region: 'Occitanie', codePostal: '31000', latitude: 43.6047, longitude: 1.4442, contexte: "Le CHU de Toulouse et un tissu dense de cabinets et pharmacies font de la ville rose un marché actif du remplacement médical." },
  { slug: 'nice', nom: 'Nice', region: "Provence-Alpes-Côte d'Azur", codePostal: '06000', latitude: 43.7102, longitude: 7.262, contexte: "Entre CHU, cliniques privées et nombreux EHPAD, la Côte d'Azur recherche régulièrement médecins, infirmiers et pharmaciens remplaçants." },
  { slug: 'nantes', nom: 'Nantes', region: 'Pays de la Loire', codePostal: '44000', latitude: 47.2184, longitude: -1.5536, contexte: "Métropole en forte croissance, le CHU de Nantes et son réseau d'officines offrent de nombreuses missions de remplacement." },
  { slug: 'montpellier', nom: 'Montpellier', region: 'Occitanie', codePostal: '34000', latitude: 43.6108, longitude: 3.8767, contexte: "Ville universitaire et médicale, le CHU de Montpellier attire de nombreux professionnels de santé en quête de remplacements." },
  { slug: 'strasbourg', nom: 'Strasbourg', region: 'Grand Est', codePostal: '67000', latitude: 48.5734, longitude: 7.7521, contexte: "Les Hôpitaux Universitaires de Strasbourg et un réseau dense de pharmacies génèrent un besoin régulier de remplaçants." },
  { slug: 'bordeaux', nom: 'Bordeaux', region: 'Nouvelle-Aquitaine', codePostal: '33000', latitude: 44.8378, longitude: -0.5792, contexte: "Le CHU de Bordeaux, ses cliniques et ses officines recherchent fréquemment médecins, infirmiers et pharmaciens remplaçants." },
  { slug: 'lille', nom: 'Lille', region: 'Hauts-de-France', codePostal: '59000', latitude: 50.6292, longitude: 3.0573, contexte: "Le CHU de Lille, l'un des plus grands d'Europe, et un fort maillage d'EHPAD soutiennent une demande continue de remplacements." },
  { slug: 'rennes', nom: 'Rennes', region: 'Bretagne', codePostal: '35000', latitude: 48.1173, longitude: -1.6778, contexte: "Capitale bretonne dynamique, le CHU de Rennes et ses officines offrent de nombreuses opportunités de remplacement." },
  { slug: 'reims', nom: 'Reims', region: 'Grand Est', codePostal: '51100', latitude: 49.2583, longitude: 4.0317, contexte: "Le CHU de Reims et un réseau d'établissements de santé font de la cité des sacres un marché actif du remplacement." },
  { slug: 'saint-etienne', nom: 'Saint-Étienne', region: 'Auvergne-Rhône-Alpes', codePostal: '42000', latitude: 45.4397, longitude: 4.3872, contexte: "Le CHU de Saint-Étienne, ses cliniques et ses pharmacies recherchent régulièrement des professionnels remplaçants." },
  { slug: 'toulon', nom: 'Toulon', region: "Provence-Alpes-Côte d'Azur", codePostal: '83000', latitude: 43.1242, longitude: 5.928, contexte: "Entre hôpitaux, cliniques et nombreux EHPAD, l'aire toulonnaise a un besoin soutenu de remplaçants en santé." },
  { slug: 'grenoble', nom: 'Grenoble', region: 'Auvergne-Rhône-Alpes', codePostal: '38000', latitude: 45.1885, longitude: 5.7245, contexte: "Le CHU Grenoble Alpes et son écosystème d'officines et de cabinets offrent de fréquentes missions de remplacement." },
  { slug: 'dijon', nom: 'Dijon', region: 'Bourgogne-Franche-Comté', codePostal: '21000', latitude: 47.322, longitude: 5.0415, contexte: "Le CHU de Dijon et un réseau d'EHPAD et de pharmacies génèrent une demande régulière de professionnels remplaçants." },
  { slug: 'angers', nom: 'Angers', region: 'Pays de la Loire', codePostal: '49000', latitude: 47.4784, longitude: -0.5632, contexte: "Le CHU d'Angers et ses officines recherchent régulièrement médecins, infirmiers et pharmaciens en remplacement." },
  { slug: 'clermont-ferrand', nom: 'Clermont-Ferrand', region: 'Auvergne-Rhône-Alpes', codePostal: '63000', latitude: 45.7772, longitude: 3.087, contexte: "Le CHU de Clermont-Ferrand et un large bassin d'établissements de santé offrent de nombreuses missions de remplacement." },
];

export function getVille(slug: string): Ville | undefined {
  return VILLES.find((v) => v.slug === slug);
}
