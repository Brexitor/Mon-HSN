# GSHN — Gestion des Sportifs de Haut Niveau

**Logiciel institutionnel officiel de la Direction du Sport de Haut Niveau (DSHN)**  
Ministère de la Jeunesse, des Sports et de la Culture — République du Niger

---

## 🇳🇪 Présentation

Le logiciel **GSHN** est une application web 100 % locale permettant la gestion et le suivi complet des sportifs de haut niveau reconnus par l'État nigérien, conformément à la législation nationale en matière de sport de haut niveau.

Il a été développé par la **Direction des Archives, de la Documentation, des Relations Publiques, de l'Informatique et de la Numérisation (DAID/RP/IN)** du MJSC.

---

## ✅ Fonctionnalités

| Module | Description |
|---|---|
| **Tableau de bord** | Vue synthétique : statistiques, répartitions par catégorie et fédération |
| **Sportifs** | Fiches individuelles complètes (identité, discipline, fédération, catégorie, statut, palmarès) |
| **Performances** | Enregistrement et suivi des résultats de compétition et records |
| **Suivi médical** | Visites d'aptitude, contrôles antidopage, bilans physiques |
| **Financement / Bourses** | Bourses, primes de performance, aides à la préparation |
| **Fédérations** | Gestion des fédérations sportives nationales avec discipline associée |
| **Sauvegarde / Restauration** | Export/import JSON ; export CSV de la liste des sportifs |

---

## 🚀 Déploiement GitHub Pages

Ce dossier est configuré pour un affichage immédiat via **GitHub Pages** :

1. Pousser ce dossier sur un dépôt GitHub
2. Aller dans **Settings → Pages**
3. Sélectionner la branche `main` et le dossier `/ (root)`
4. Accéder à l'URL fournie par GitHub Pages

> L'application fonctionne entièrement **sans serveur** ni connexion internet après chargement initial.

---

## 📁 Structure du projet

```
gshn/
├── index.html                  ← Page principale (point d'entrée)
├── README.md                   ← Ce fichier
├── .nojekyll                   ← Désactive Jekyll pour GitHub Pages
├── assets/
│   ├── css/
│   │   └── gshn.css            ← Feuille de style principale
│   ├── js/
│   │   └── gshn.js             ← Logique applicative complète
│   └── icons/
│       ├── favicon.svg         ← Favicon vectoriel (couleurs Niger)
│       └── logo-gshn.svg       ← Logo institutionnel GSHN
└── docs/
    └── GUIDE_UTILISATION.md    ← Guide d'utilisation
```

---

## 💾 Stockage des données

- Les données sont stockées dans le **localStorage** du navigateur (`gshn_niger_data_v1`)
- Elles sont persistantes sur le même poste et navigateur
- L'export JSON permet de les transférer ou sauvegarder en dehors du navigateur
- **Aucune donnée n'est envoyée vers un serveur externe**

---

## 🎨 Charte graphique

Les couleurs utilisées sont celles du drapeau national de la République du Niger :

| Couleur | Rôle |
|---|---|
| `#E05206` Orange | Bandes drapeau, accents |
| `#0DA651` Vert | Bandes drapeau, boutons principaux |
| `#0B6B3A` Vert foncé | En-tête navigation, titres |
| `#F2C200` Or | Badges Elite, boutons secondaires |

---

## 📋 Catégories de sportifs

Conformément à la réglementation nigérienne sur le sport de haut niveau :

- **Elite** — Sportifs de très haut niveau international
- **Espoir** — Sportifs à fort potentiel en développement
- **Relève** — Jeunes sportifs en phase de détection et formation

---

## 🔒 Mentions légales

Logiciel à usage strictement institutionnel.  
Propriété du Ministère de la Jeunesse, des Sports et de la Culture — République du Niger.  
Développé par la DAID/RP/IN.
