# SmartShop Client - React Dashboard

Dashboard d'administration pour SmartShop développé avec React, TypeScript, Redux Toolkit, et Tailwind CSS.

## 🚀 Technologies utilisées

- **React 19** avec TypeScript
- **Redux Toolkit** pour la gestion d'état
- **React Router** pour le routing
- **Axios** pour les appels API
- **Tailwind CSS** pour le styling
- **Vite** comme build tool

## 📁 Structure du projet

```
/src
  /assets                 # Images et ressources statiques
  /components
    /Common              # Composants réutilisables (Button, Input, Table, Modal, etc.)
  /hooks                 # Custom hooks (useRedux)
  /pages                 # Pages de l'application
    /Clients            # Gestion des clients
    /Products           # Gestion des produits
    /Orders             # Gestion des commandes
    /Payments           # Gestion des paiements
  /redux
    /slices             # Redux slices (clientSlice, productSlice, etc.)
    /store              # Configuration du store Redux
  /routes                # Configuration du routing
  /services              # Services API (ClientService, ProductService, etc.)
  /types                 # Types TypeScript
  App.tsx
  main.tsx
```

## 🎯 Fonctionnalités

### ✅ CRUD Complet pour :

- **Clients** : Créer, modifier, supprimer et rechercher des clients
- **Produits** : Gérer l'inventaire des produits
- **Commandes** : Créer des commandes, confirmer ou annuler
- **Paiements** : Enregistrer et gérer les paiements

### 🎨 Interface utilisateur

- Dashboard avec sidebar de navigation
- Tables paginées avec tri
- Modals pour les formulaires
- Notifications d'état (loading, erreurs)
- Design responsive avec Tailwind CSS

## ⚙️ Installation et démarrage

1. **Installer les dépendances** :

```bash
npm install
```

2. **Configurer les variables d'environnement** :
   Créez un fichier `.env` à la racine du projet :

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

3. **Démarrer le serveur backend** :
   Assurez-vous que le serveur Spring Boot est lancé sur le port 8080.

4. **Démarrer l'application React** :

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📋 Scripts disponibles

- `npm run dev` : Démarre le serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Prévisualiser le build de production
- `npm run lint` : Linter le code

## 🔌 API Endpoints utilisés

L'application consomme les endpoints suivants :

### Clients

- `GET /api/v1/clients/allActiveClients` - Liste des clients
- `POST /api/v1/clients` - Créer un client
- `PUT /api/v1/clients/{id}` - Modifier un client
- `PUT /api/v1/clients/{id}/delete` - Supprimer un client

### Produits

- `GET /api/v1/products/allActiveProducts` - Liste des produits
- `POST /api/v1/products` - Créer un produit
- `PUT /api/v1/products/{id}` - Modifier un produit
- `PUT /api/v1/products/{id}/delete` - Supprimer un produit

### Commandes

- `GET /api/v1/orders/allOrders` - Liste des commandes
- `POST /api/v1/orders` - Créer une commande
- `PUT /api/v1/orders/{id}/confirm` - Confirmer une commande
- `PUT /api/v1/orders/{id}/cancel` - Annuler une commande

### Paiements

- `GET /api/v1/paiements` - Liste des paiements
- `POST /api/v1/paiements` - Créer un paiement
- `PUT /api/v1/paiements/{numero}/confirmer` - Confirmer un paiement
- `PUT /api/v1/paiements/{numero}/annuler` - Annuler un paiement

## 🎨 Personnalisation Tailwind

Le thème Tailwind est configuré dans [tailwind.config.js](tailwind.config.js) avec des couleurs personnalisées pour le projet.

## 📝 Notes importantes

- L'authentification n'est pas implémentée (comme demandé)
- Tous les composants utilisent TypeScript pour le type-safety
- Redux Toolkit gère l'état global de l'application
- Les appels API incluent la gestion des erreurs
- Pagination côté serveur pour toutes les listes

## 🐛 Dépannage

Si vous rencontrez des problèmes de CORS, assurez-vous que votre backend Spring Boot autorise les requêtes depuis `http://localhost:5173`.

## 📄 License

Ce projet est développé dans le cadre de SmartShop.
