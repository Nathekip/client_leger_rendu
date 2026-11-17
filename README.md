# The Met — explorer la collection

Application Angular en français pour explorer la collection du Metropolitan Museum of Art. Elle utilise l’API publique du musée pour rechercher des œuvres, consulter leurs notices et visualiser la répartition des résultats affichés par département.

## Démarrage rapide

Prérequis : Node.js compatible avec Angular CLI 22 et npm.

```bash
npm ci
npm start
```

Ouvrir ensuite [http://localhost:4200](http://localhost:4200). L’application ne nécessite ni clé API ni serveur intermédiaire : les requêtes partent du navigateur vers l’API publique du Met.

## Fonctionnalités

- Recherche par mot-clé, filtrable par département.
- Liste paginée de 12 œuvres, avec image, artiste, date et département quand ces informations sont disponibles.
- Fiche détaillée par œuvre : image, artiste, date, matériaux, dimensions, culture, période, numéro d’inventaire et lien vers la notice du musée.
- Graphique en barres de la répartition par département des œuvres actuellement chargées (et non de toute la collection).
- Mise en page responsive, états de chargement, retours d’erreur et textes de remplacement lorsque le musée ne fournit pas d’image.

## Architecture

```text
src/
├── app/
│   ├── core/
│   │   ├── models/               # Types de l’API et départements
│   │   └── services/             # Client HTTP du Met
│   ├── features/
│   │   ├── artwork/              # Page de détail d’une œuvre
│   │   └── gallery/              # Recherche, liste et graphique
│   ├── app.config.ts             # Routage, HTTP et défilement d’ancre
│   └── app.routes.ts             # Routes galerie et fiche
├── index.html
└── styles.scss
```

Les composants sont standalone. `MetApiService` centralise les appels réseau ; la galerie récupère une page d’identifiants de la recherche, puis les détails de chaque œuvre.

## API et points de vigilance

- Source : [Met Collection API](https://metmuseum.github.io/).
- Les départements et notices utilisent `https://collectionapi.metmuseum.org/public/collection/v1`.
- L’ancien endpoint de recherche `/public/collection/v1/search` a été retiré le 1er octobre 2026. La recherche utilise donc le nouvel endpoint paginé `/public/collection/v1.1/search` avec `limit` et `offset`.
- Une recherche renvoie d’abord des identifiants ; des requêtes supplémentaires sont nécessaires pour charger les notices. La pagination limite ce chargement à 12 œuvres à la fois.
- Le filtre `hasImages=true` n’assure pas que chaque notice contienne encore une URL d’image exploitable. L’interface prévoit un emplacement de remplacement dans ce cas.
- Les noms de départements et certaines métadonnées sont affichés tels que fournis par le musée, souvent en anglais.

## Tests et build

```bash
npm test -- --watch=false
npm run build
```

Les tests Vitest couvrent les paramètres et routes de l’API, le graphique accessible et le parcours de chargement de la galerie à partir de réponses HTTP simulées.

## Utilisation de l’IA

Un assistant IA a été utilisé pour élaborer la structure Angular, rédiger les composants et styles, mettre en place le client de l’API et préparer les tests et cette documentation. Les choix fonctionnels et visuels ont été vérifiés dans le navigateur ; l’endpoint de recherche a été confronté à l’API réelle, et le build de production ainsi que les tests ont été exécutés localement. Aucune clé ni donnée privée n’a été fournie à l’API.
