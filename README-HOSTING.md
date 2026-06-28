# Nubia Site - Hosting Package

Ce dossier contient le site Nubia complet, prêt à être hébergé.

## Option recommandée

GitHub + Netlify

Pourquoi:
- lien public stable
- pas d'expiration
- pas de mot de passe temporaire
- futures mises à jour plus simples

## Ce qu'il faut publier

Publier le contenu de ce dossier comme racine du repo / du site.

Ce dossier contient déjà:
- toutes les pages statiques
- `public/` avec les médias utilisés
- `src/` avec CSS + JS du site
- `data.products.bootstrap.json`
- `netlify.toml`
- `vercel.json`

## Flow le plus simple

### Option A - Netlify avec compte connecté

1. Créer un repo GitHub dédié, par exemple `nubia-site`
2. Mettre tout le contenu de ce dossier à la racine du repo
3. Dans Netlify:
   - Add new site
   - Import an existing project
   - GitHub
   - sélectionner le repo
4. Laisser les réglages par défaut si Netlify détecte un site statique
5. Si Netlify demande un publish directory, mettre `.`
6. Déployer

### Option B - Vercel

1. Créer un repo GitHub dédié
2. Mettre tout le contenu de ce dossier à la racine du repo
3. Importer le repo dans Vercel
4. Déployer comme site statique

## Important

- ne pas utiliser `Offline-Nubia-Website.html` comme livrable principal
- ne pas utiliser `nubia-complete-offline.zip` pour montrer le site final
- le bon package live est ce dossier `nubia-site-static`

## Chemin local

`C:\Users\TEST\Downloads\robinx-marketing-workspace\deliverables\nubia-site-demo\output\robinx-delivery-offline\nubia-site-static`
