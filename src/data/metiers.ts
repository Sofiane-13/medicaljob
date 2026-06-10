export type Faq = { q: string; a: string };

export type Metier = {
  /** slug d'URL : /metiers/[slug] */
  slug: string;
  /** Nom court (ex. "Médecin") */
  nom: string;
  /** Pluriel pour les listes (ex. "Médecins") */
  pluriel: string;
  /** Cadre d'exercice principal */
  cadre: 'hopital' | 'officine' | 'mixte';
  /** H1 de la page métier */
  h1: string;
  /** <title> SEO (≤ 60 car. conseillé) */
  metaTitle: string;
  /** Meta description (120-160 car.) */
  metaDescription: string;
  /** Mot-clé principal ciblé */
  targetKeyword: string;
  /** Phrase d'accroche affichée sous le H1 */
  intro: string;
  /** 3 à 5 paragraphes de contenu (HTML léger autorisé via set:html) */
  contenu: string[];
  /** Points clés (statut, rémunération…) affichés en encarts */
  pointsCles: { label: string; valeur: string }[];
  /** FAQ spécifique au métier (alimente le schema FAQPage) */
  faq: Faq[];
  /** Emoji/pictogramme simple pour les grilles */
  icone: string;
};

export const METIERS: Metier[] = [
  {
    slug: 'remplacement-medecin',
    nom: 'Médecin',
    pluriel: 'Médecins',
    cadre: 'hopital',
    icone: '🩺',
    h1: 'Remplacement de médecin : trouvez une mission ou un remplaçant',
    metaTitle: 'Remplacement médecin : missions & remplaçants | MedicalJob',
    metaDescription:
      'Remplacement de médecin en hôpital, clinique, EHPAD ou cabinet. Publiez votre besoin ou trouvez une mission de remplacement médical partout en France avec MedicalJob.',
    targetKeyword: 'remplacement médecin',
    intro:
      'Que vous soyez un établissement à court de praticien ou un médecin à la recherche de missions, MedicalJob vous met en relation rapidement.',
    contenu: [
      "Le remplacement médical permet à un établissement (hôpital, clinique, EHPAD, centre de santé) ou à un confrère installé d'assurer la continuité des soins pendant une absence : congé, formation, pic d'activité ou poste vacant. Pour le médecin remplaçant, c'est une façon souple d'exercer, de découvrir des structures et de compléter ses revenus.",
      "En France, le remplacement d'un médecin obéit à un cadre précis : le remplaçant doit être inscrit au tableau de l'Ordre ou titulaire d'une <strong>licence de remplacement</strong> (pour les internes remplissant les conditions). Un <strong>contrat de remplacement</strong> écrit est obligatoire et doit être transmis au Conseil départemental de l'Ordre des médecins.",
      "Sur le plan du statut, le médecin remplaçant en libéral relève le plus souvent du régime des <strong>BNC</strong> et cotise à l'URSSAF et à la CARMF. En milieu hospitalier, le remplacement peut prendre la forme d'un contrat de praticien contractuel ou d'une mission d'intérim médical encadrée par la réglementation sur les rémunérations.",
      "Avec MedicalJob, un établissement décrit son besoin (spécialité, dates, lieu, conditions) et reçoit des candidatures de remplaçants qualifiés. À l'inverse, un médecin précise ses disponibilités et ses zones géographiques pour être contacté dès qu'une mission correspond.",
    ],
    pointsCles: [
      { label: 'Cadre d’exercice', valeur: 'Hôpital, clinique, EHPAD, cabinet' },
      { label: 'Pièces requises', valeur: 'Inscription à l’Ordre ou licence de remplacement' },
      { label: 'Contrat', valeur: 'Contrat de remplacement écrit obligatoire' },
      { label: 'Statut fréquent', valeur: 'BNC (libéral) ou praticien contractuel' },
    ],
    faq: [
      {
        q: 'Qui peut effectuer un remplacement de médecin ?',
        a: "Un médecin inscrit au tableau de l'Ordre, ou un interne titulaire d'une licence de remplacement délivrée par le Conseil de l'Ordre, sous réserve d'avoir validé le nombre de semestres requis pour la spécialité concernée.",
      },
      {
        q: 'Le contrat de remplacement est-il obligatoire ?',
        a: "Oui. Un contrat de remplacement écrit doit être établi entre le médecin remplacé (ou l'établissement) et le remplaçant, puis communiqué au Conseil départemental de l'Ordre des médecins.",
      },
      {
        q: 'Combien est rémunéré un médecin remplaçant ?',
        a: "La rémunération varie selon la spécialité, le lieu et le mode d'exercice. En libéral, le remplaçant perçoit une rétrocession d'honoraires (souvent 70 à 90 % des honoraires) ; à l'hôpital, la rémunération est encadrée par la réglementation sur l'intérim médical.",
      },
      {
        q: 'Comment trouver rapidement un remplaçant ?',
        a: "Publiez votre besoin sur MedicalJob en précisant la spécialité, les dates et le lieu : les médecins remplaçants inscrits dont le profil correspond sont notifiés et peuvent vous contacter directement.",
      },
    ],
  },
  {
    slug: 'remplacement-infirmier',
    nom: 'Infirmier',
    pluriel: 'Infirmiers',
    cadre: 'hopital',
    icone: '💉',
    h1: 'Remplacement d’infirmier (IDE) : missions et remplaçants',
    metaTitle: 'Remplacement infirmier IDE : missions | MedicalJob',
    metaDescription:
      'Remplacement d’infirmier (IDE) en hôpital, clinique, EHPAD ou en libéral. Publiez un besoin ou trouvez une mission de remplacement infirmier partout en France.',
    targetKeyword: 'remplacement infirmier',
    intro:
      'Hôpitaux, cliniques, EHPAD et cabinets libéraux : trouvez un infirmier remplaçant disponible, ou la mission qui vous correspond.',
    contenu: [
      "Le remplacement infirmier répond à un besoin permanent du secteur : absences, congés, fortes tensions sur les effectifs ou surcroît d'activité. Pour l'infirmier diplômé d'État (IDE), le remplacement offre une grande flexibilité, des terrains variés (hôpital, EHPAD, bloc, soins à domicile) et une rémunération attractive.",
      "Pour exercer, l'infirmier doit être <strong>diplômé d'État</strong> et inscrit à l'Ordre national des infirmiers, avec un numéro RPPS. En libéral, le remplacement d'un IDE installé se formalise par un <strong>contrat de remplacement</strong> respectant les règles du Code de la santé publique et de la convention.",
      "En établissement, le remplacement prend la forme d'un contrat à durée déterminée, d'une vacation ou d'une mission d'intérim. Le statut social dépend du mode d'exercice : salarié pour l'hospitalier, travailleur indépendant (BNC) pour le libéral.",
      "Sur MedicalJob, un service de soins décrit le poste (unité, horaires, dates, compétences attendues) et reçoit les candidatures d'IDE disponibles. Les infirmiers, eux, renseignent leurs zones et créneaux pour ne manquer aucune mission pertinente.",
    ],
    pointsCles: [
      { label: 'Cadre d’exercice', valeur: 'Hôpital, clinique, EHPAD, libéral' },
      { label: 'Pièces requises', valeur: 'Diplôme d’État + inscription à l’Ordre (RPPS)' },
      { label: 'Contrat', valeur: 'CDD / vacation / contrat de remplacement libéral' },
      { label: 'Statut fréquent', valeur: 'Salarié ou indépendant (BNC)' },
    ],
    faq: [
      {
        q: 'Quel diplôme faut-il pour faire des remplacements infirmiers ?',
        a: "Le diplôme d'État d'infirmier (DEI) et l'inscription à l'Ordre national des infirmiers sont requis. Un numéro RPPS valide est nécessaire pour exercer.",
      },
      {
        q: 'Peut-on remplacer un infirmier libéral ?',
        a: "Oui, via un contrat de remplacement écrit conforme au Code de la santé publique. Le remplaçant exerce sous le numéro du titulaire et lui reverse une partie des honoraires (rétrocession).",
      },
      {
        q: 'Quelle rémunération pour un remplacement infirmier ?',
        a: "En établissement, la rémunération suit la grille du contrat ou de l'intérim. En libéral, elle dépend de la rétrocession convenue avec le titulaire, généralement comprise entre 70 et 90 % des honoraires.",
      },
    ],
  },
  {
    slug: 'remplacement-pharmacien',
    nom: 'Pharmacien',
    pluriel: 'Pharmaciens',
    cadre: 'officine',
    icone: '⚕️',
    h1: 'Remplacement de pharmacien en officine : missions et remplaçants',
    metaTitle: 'Remplacement pharmacien officine : missions | MedicalJob',
    metaDescription:
      'Remplacement de pharmacien titulaire ou adjoint en officine et en PUI. Publiez votre besoin ou trouvez une mission de remplacement en pharmacie partout en France.',
    targetKeyword: 'remplacement pharmacien officine',
    intro:
      'Officines et pharmacies à usage intérieur : trouvez un pharmacien remplaçant inscrit à l’Ordre, ou la mission qui vous convient.',
    contenu: [
      "Le remplacement en pharmacie permet au titulaire d'une officine de s'absenter (congés, formation, maladie) tout en garantissant la présence pharmaceutique obligatoire. Pour le pharmacien remplaçant, c'est une activité souple et recherchée, en officine de ville comme en pharmacie à usage intérieur (PUI) d'établissement de santé.",
      "Le pharmacien remplaçant doit être <strong>inscrit à l'Ordre national des pharmaciens</strong> (section adaptée) et détenir une <strong>carte de remplacement</strong> pour exercer en officine. Le remplacement d'un titulaire au-delà d'une certaine durée est encadré par le Code de la santé publique et doit être déclaré.",
      "Côté statut, le pharmacien remplaçant peut exercer comme salarié (adjoint en CDD) ou en libéral selon la mission. La rémunération dépend de la durée, du type d'officine et des responsabilités assumées pendant le remplacement.",
      "Avec MedicalJob, une officine publie son besoin (dates, amplitude horaire, logiciel utilisé, missions confiées) et reçoit des candidatures de pharmaciens disponibles. Les remplaçants indiquent leurs zones et disponibilités pour être contactés dès qu'une officine cherche.",
    ],
    pointsCles: [
      { label: 'Cadre d’exercice', valeur: 'Officine de ville, PUI' },
      { label: 'Pièces requises', valeur: 'Inscription à l’Ordre + carte de remplacement' },
      { label: 'Contrat', valeur: 'CDD adjoint ou remplacement déclaré du titulaire' },
      { label: 'Statut fréquent', valeur: 'Salarié (adjoint) ou libéral' },
    ],
    faq: [
      {
        q: 'Faut-il une carte de remplacement pour exercer en officine ?',
        a: "Oui. Pour effectuer des remplacements en officine, le pharmacien doit être inscrit à l'Ordre national des pharmaciens et obtenir une carte de remplacement auprès de la section compétente.",
      },
      {
        q: 'Un titulaire peut-il se faire remplacer pendant ses congés ?',
        a: "Oui. Le titulaire doit assurer la continuité pharmaceutique : il peut être remplacé par un pharmacien inscrit à l'Ordre. Au-delà de la durée prévue par la réglementation, le remplacement doit être déclaré.",
      },
      {
        q: 'Comment trouver un pharmacien remplaçant rapidement ?',
        a: "Publiez votre besoin sur MedicalJob en précisant les dates, l'amplitude horaire et le logiciel de l'officine : les pharmaciens remplaçants dont le profil correspond sont notifiés.",
      },
    ],
  },
  {
    slug: 'remplacement-preparateur-pharmacie',
    nom: 'Préparateur en pharmacie',
    pluriel: 'Préparateurs en pharmacie',
    cadre: 'officine',
    icone: '🧪',
    h1: 'Remplacement de préparateur en pharmacie : missions et profils',
    metaTitle: 'Remplacement préparateur en pharmacie | MedicalJob',
    metaDescription:
      'Remplacement de préparateur en pharmacie en officine ou en PUI. Publiez un besoin ou trouvez une mission de remplacement de préparateur partout en France.',
    targetKeyword: 'remplacement préparateur en pharmacie',
    intro:
      'Besoin d’un préparateur diplômé en renfort ou en remplacement ? MedicalJob met les officines et les préparateurs en relation.',
    contenu: [
      "Le préparateur en pharmacie est le seul collaborateur autorisé à seconder le pharmacien dans la délivrance des médicaments, sous sa responsabilité. Les remplacements et renforts de préparateurs sont fréquents : congés, surcroît d'activité saisonnier, arrêts ou postes à pourvoir.",
      "Pour exercer, le préparateur doit être titulaire du <strong>brevet professionnel de préparateur en pharmacie</strong> (ou du DEUST en PUI). Le remplacement se fait généralement par un <strong>contrat à durée déterminée</strong>, l'activité étant salariée.",
      "La rémunération suit la convention collective de la pharmacie d'officine, avec des majorations possibles selon l'expérience, les horaires et l'urgence du besoin.",
      "Sur MedicalJob, l'officine décrit le poste (dates, horaires, logiciel, missions) et reçoit des candidatures de préparateurs disponibles dans la zone. Les préparateurs renseignent leurs disponibilités pour être contactés dès qu'un besoin se présente.",
    ],
    pointsCles: [
      { label: 'Cadre d’exercice', valeur: 'Officine, PUI' },
      { label: 'Pièces requises', valeur: 'Brevet professionnel (ou DEUST en PUI)' },
      { label: 'Contrat', valeur: 'CDD (activité salariée)' },
      { label: 'Convention', valeur: 'Pharmacie d’officine' },
    ],
    faq: [
      {
        q: 'Quel diplôme pour remplacer un préparateur en pharmacie ?',
        a: "Le brevet professionnel de préparateur en pharmacie est requis en officine. En pharmacie à usage intérieur (PUI), le DEUST de préparateur en pharmacie hospitalière est demandé.",
      },
      {
        q: 'Le remplacement de préparateur est-il salarié ?',
        a: "Oui, le préparateur exerce comme salarié. Le remplacement prend la forme d'un contrat à durée déterminée encadré par la convention collective de la pharmacie d'officine.",
      },
    ],
  },
  {
    slug: 'remplacement-sage-femme',
    nom: 'Sage-femme',
    pluriel: 'Sages-femmes',
    cadre: 'hopital',
    icone: '🤱',
    h1: 'Remplacement de sage-femme : missions et remplaçantes',
    metaTitle: 'Remplacement sage-femme : missions | MedicalJob',
    metaDescription:
      'Remplacement de sage-femme en maternité, hôpital, clinique ou en libéral. Publiez un besoin ou trouvez une mission de remplacement de sage-femme en France.',
    targetKeyword: 'remplacement sage-femme',
    intro:
      'Maternités, services hospitaliers et cabinets libéraux : trouvez une sage-femme remplaçante, ou la mission qui vous correspond.',
    contenu: [
      "Le remplacement de sage-femme assure la continuité du suivi de grossesse, des accouchements et du suivi gynécologique pendant l'absence d'une professionnelle. Il concerne aussi bien les maternités et services hospitaliers que les cabinets de sages-femmes libérales.",
      "La sage-femme remplaçante doit être <strong>inscrite à l'Ordre des sages-femmes</strong> et disposer d'un numéro RPPS. En libéral, le remplacement se formalise par un <strong>contrat de remplacement</strong> conforme à la réglementation et à la convention.",
      "Le statut dépend du cadre : salariée en établissement (CDD, vacation), travailleuse indépendante en libéral. La rémunération varie selon le lieu, les actes réalisés et, en libéral, la rétrocession convenue avec la titulaire.",
      "Avec MedicalJob, l'établissement ou la sage-femme installée décrit son besoin (dates, type d'actes, lieu) et reçoit des candidatures. Les remplaçantes renseignent leurs disponibilités et zones pour être mises en relation rapidement.",
    ],
    pointsCles: [
      { label: 'Cadre d’exercice', valeur: 'Maternité, hôpital, clinique, libéral' },
      { label: 'Pièces requises', valeur: 'Inscription à l’Ordre des sages-femmes (RPPS)' },
      { label: 'Contrat', valeur: 'CDD / vacation ou contrat de remplacement libéral' },
      { label: 'Statut fréquent', valeur: 'Salariée ou indépendante (BNC)' },
    ],
    faq: [
      {
        q: 'Qui peut remplacer une sage-femme ?',
        a: "Une sage-femme diplômée et inscrite à l'Ordre des sages-femmes, disposant d'un numéro RPPS valide. En libéral, un contrat de remplacement écrit est établi avec la titulaire.",
      },
      {
        q: 'Le remplacement de sage-femme en libéral nécessite-t-il un contrat ?',
        a: "Oui, un contrat de remplacement écrit est nécessaire. La remplaçante exerce sous le numéro de la titulaire et lui reverse une rétrocession d'honoraires convenue.",
      },
    ],
  },
];

export function getMetier(slug: string): Metier | undefined {
  return METIERS.find((m) => m.slug === slug);
}
