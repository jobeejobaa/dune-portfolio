# Dune Carle Cros — Portfolio

Landing page de présentation pour Dune Carle Cros, artiste muraliste, en vue d'une présentation client (projet de peinture sur vitrines pour une maison de joaillerie de luxe).

## Stack

Site statique — un seul fichier `index.html` (HTML + CSS + JS inline). Aucune dépendance, aucun build.

## Structure

```
.
├── index.html          # Landing page complète
├── portfolio/          # Visuels des œuvres (1.png → 16.png)
│   └── artiste.jpg     # Portrait de l'artiste (à ajouter)
├── README.md
└── .gitignore
```

## Lancer en local

Double-clic sur `index.html` ou :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Déploiement

Hébergé sur Vercel — chaque push sur `main` déclenche un re-déploiement automatique.
