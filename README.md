# Journaliers

Application mobile pour la gestion des travailleurs journaliers (BTP, chantiers...) en Côte d'Ivoire.

L'idée de départ : beaucoup d'entreprises qui emploient des journaliers n'ont aucune trace fiable de qui a travaillé, où, et si la personne a bien été payée. Journaliers sert à ça   un journalier s'inscrit, se fait valider, reçoit des missions, pointe sa présence, et reçoit une vraie fiche de paie téléchargeable pour chaque jour travaillé. Ce qui donne à l'entreprise (et à l'administration, en cas de contrôle) une preuve concrète des paiements effectués.

Ce dépôt contient **uniquement l'app mobile côté journalier**. Le dashboard web pour les admins/managers (validation des comptes, création des chantiers, appel de présence...) n'existe pas encore   c'est la prochaine grosse brique à construire.

## Où on en est

Concrètement, aujourd'hui :

- Toutes les données (missions, paiements, collègues, notifications...) sont **mockées** dans `src/lib/mock-data.ts`. Il n'y a pas de backend, pas de base de données, pas de vraie authentification.
- La connexion par téléphone/mot de passe ne vérifie rien   tape n'importe quoi et ça te connecte. Pareil pour "Continuer avec Google/Facebook" : ça simule une connexion réussie, mais rien n'est réellement branché à Google ou Meta (il faudrait créer nos propres apps OAuth chez eux, puis un backend pour valider les tokens).
- Le flux "proposition de mission → notification → accepter/refuser" fonctionne réellement dans l'app, mais l'état vit en mémoire côté client. Si tu rafraîchis la page, tout repart de zéro.
- Les fiches de paie, elles, sont un vrai PDF généré à la volée (voir plus bas), pas un stub.

Donc : c'est une maquette interactive très poussée, pas encore un produit connecté à un vrai backend. L'objectif de cette phase était de figer l'expérience et le design avant d'attaquer la partie serveur.

## Stack

- **React 19** + **TanStack Start** (routing file-based, SSR) + **Vite**
- **Tailwind CSS v4**, thème clair/sombre custom (voir `src/styles.css`) inspiré des codes visuels de Facebook   bleu... pardon, orange (`#EA580C`), cartes plates, police système
- **TypeScript** partout
- **Capacitor** pour empaqueter l'app en vraie appli Android installable (voir plus bas)
- **jsPDF** pour générer les fiches de paie en PDF côté client

## Lancer le projet en local

Prérequis : Node 20+ (le projet a été testé avec Node 22).

```bash
git clone https://github.com/arnlyse26/journaliers-mobile-app.git
cd journaliers-mobile-app
npm install
npm run dev
```

Ça démarre un serveur de dev sur `http://localhost:8080` (ou le premier port libre au-dessus si occupé   regarde la sortie du terminal). Ouvre cette URL, idéalement avec les outils dev de ton navigateur en mode mobile (Chrome/Edge : F12 → icône téléphone) pour voir l'app dans son format prévu   elle est pensée pour un écran de téléphone (max 480px de large), pas pour du desktop.

Autres commandes utiles :

```bash
npm run build      # build de production
npm run lint        # eslint
npm run format       # prettier
```

## Comment tester le flux complet

Il n'y a pas de "compte de test" à créer   l'app affiche toujours le même utilisateur mocké (**Kouadio N'Guessan**, compte déjà validé) une fois que tu es sur `/home`. Pour parcourir tout le parcours :

1. **Écran d'accueil (`/`)**   les 3 lignes en haut ("Suivez vos présences...") et les boutons "Créer mon compte" / "J'ai déjà un compte" mènent vers l'inscription ou la connexion.
2. **Connexion (`/login`)**   remplis n'importe quoi dans téléphone/mot de passe, ou clique directement sur "Google" / "Facebook" (ça simule la connexion et t'envoie sur `/home`).
3. **Inscription (`/register`)**   parcours en 4 étapes : identité (ou raccourci Google/Facebook, qui pré-remplit et saute à l'étape suivante), adresse (avec un vrai bouton "Utiliser ma position actuelle"   accepte la demande de géolocalisation du navigateur, il fait un vrai reverse-geocoding via OpenStreetMap), pièce d'identité (upload photo), récapitulatif. À la fin, direction `/pending`.
4. **Accueil (`/home`)**   total perçu, mission en cours, dernier paiement. Le logo Journaliers est en haut à gauche, la cloche de notifications et l'avatar (cliquable → profil) à droite.
5. **Notifications (cloche en haut)**   il y a une proposition de mission en attente ("Extension Voirie   Bingerville"). Clique dessus : tu vois le détail complet (chantier, prix, chef de chantier, **collègues sur la mission**), avec deux boutons Accepter / Refuser. Si tu acceptes, la mission apparaît immédiatement dans l'onglet Missions.
6. **Missions (`/missions`)**   liste filtrable (Toutes / En cours / À venir / Terminées), avec détail par mission (historique de présence, collègues).
7. **Paiements (`/payments`)**   liste des fiches de paie, avec un vrai bouton téléchargement PDF sur chaque ligne. Clique sur une fiche pour voir le détail (mise en page façon vrai bulletin de paie, avec en-tête "entreprise", cotisation sociale détaillée) puis "Télécharger PDF" en bas   un vrai fichier PDF se télécharge.
8. **Profil (`/profile`)**   infos personnelles, pièce d'identité, et le sélecteur clair/sombre (le choix est mémorisé, même après rafraîchissement).

## Tester sur téléphone via Capacitor (Android)

Le projet est déjà scaffoldé avec Capacitor (dossier `android/`). Pour le lancer sur un vrai téléphone ou un émulateur pendant le développement :

1. Lance le serveur de dev (`npm run dev`) et note l'IP locale de ta machine (`ipconfig` sous Windows, cherche "Adresse IPv4").
2. Dans `capacitor.config.ts`, remplace `DEV_SERVER_LAN_URL` par `http://TON_IP:LE_PORT` (le port affiché par `npm run dev`).
3. `npm run cap:sync` puis `npm run android:open` (ouvre Android Studio) ou `npm run android:run` (build + lance direct sur un appareil/émulateur connecté).

Ton téléphone et ta machine doivent être sur le même réseau Wi-Fi. Il te faut Android Studio + le SDK Android installés pour que ça marche   si `android:run` ne trouve pas d'appareil, c'est probablement ça qui manque.

Attention : cette config pointe vers le serveur de dev pour l'instant (live-reload), pas vers un vrai build statique embarqué   normal vu qu'il n'y a pas encore de backend ni de stratégie de build figée pour la prod mobile. On revisitera ça une fois le backend en place.

## Déploiement web

Le dépôt est connecté à Vercel   chaque push sur `main` redéploie automatiquement. Nitro (le bundler serveur utilisé par TanStack Start) détecte tout seul qu'il tourne sur Vercel et adapte son preset ; aucune config manuelle nécessaire de ce côté.

## Où regarder dans le code

- `src/routes/`   une route par écran (fichier-based routing TanStack, voir `src/routes/README.md` pour les conventions). Le point d'entrée du layout global est `__root.tsx`.
- `src/lib/mock-data.ts`   toutes les données factices (travailleur, missions, fiches de paie, invitations, notifications). C'est le premier fichier à modifier si tu veux tester un autre scénario.
- `src/lib/payslip-pdf.ts`   génération du PDF de fiche de paie.
- `src/hooks/useNotifications.ts` / `src/lib/notifications-store.ts`   le petit store réactif (sans dépendance externe) qui gère les notifications et le statut des invitations de mission.
- `src/styles.css`   tous les tokens de couleur (thème clair + sombre) et les utilitaires d'animation.

## Prochaines étapes

Dans l'ordre où ça nous semble le plus utile :

1. **Backend réel**   auth, base de données, upload de pièce d'identité, remplacement du mock data.
2. **Dashboard admin/manager**   validation des comptes, création de chantiers/missions, appel de présence quotidien, génération des fiches de paie côté entreprise.
3. **Vraie authentification Google/Facebook**   nécessite de créer des apps OAuth chez Google Cloud Console et Meta for Developers, puis de brancher ça au backend.
4. Paiement mobile money (Orange Money / MTN / Wave), notifications push réelles, mode hors-ligne.

Si tu bloques sur un point en local, regarde d'abord le terminal du serveur de dev (`npm run dev`)   la plupart des soucis viennent d'une dépendance manquante (`npm install`) ou d'un port déjà occupé par un autre projet.
