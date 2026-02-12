# CRYPTO SENTINEL PRO - Documentation Technique

## Vue d'ensemble

**Crypto Sentinel Pro** est un dashboard de sentiment crypto tout-en-un, livr en tant qu'application single-page (SPA) dans un seul fichier HTML. Il affiche un Fear & Greed Index, un Indice d'Opportunit composite, et des cartes de sentiment pour les 50 principales cryptomonnaies.

---

## Architecture

```
crypto-sentinel-pro/
  index.html          # Application complte (HTML + CSS + React/JSX)
  README.md           # Description du projet
  DOCUMENTATION.md    # Ce fichier
```

### Stack technique

| Technologie        | Version | Rle                          | Source     |
|--------------------|---------|-------------------------------|------------|
| React              | 18.2.0  | Librairie UI                  | CDN        |
| ReactDOM           | 18.2.0  | Rendu DOM                     | CDN        |
| Babel Standalone   | 7.23.5  | Transpilation JSX en browser  | CDN        |
| Tailwind CSS       | latest  | Framework CSS utilitaire      | CDN        |

- **Pas de backend** : toutes les donnes sont gnres ct client
- **Pas de build** : fonctionne directement dans le navigateur
- **Langue de l'interface** : Franais

---

## Composants React

### 1. `App` (composant principal)
- **Fichier** : `index.html:271-303`
- **tat** : `isLive`, `time`, `cryptos`, `filter`, `search`, `sort`, `showDet`, `fgHist`, `btcHist`
- **Logique** : rafrachit les donnes toutes les 5 secondes (`CONFIG.REFRESH_RATE`)
- **Rendu** : Header  FearGreedIndex  OpportunityIndex  Filters  CryptoCards  Footer

### 2. `Header`
- **Fichier** : `index.html:256-261`
- **Props** : `isLive`, `time`, `stats`
- **Affiche** : titre, indicateur LIVE/OFFLINE (pulse anim), horodatage, compteurs BULL/NEUT/BEAR

### 3. `FearGreedIndex`
- **Fichier** : `index.html:116-183`
- **Props** : `value`, `history`, `btcHistory`
- **tat local** : `range` (30d / 1y / All)
- **Affiche** :
  - Gauge SVG semi-circulaire avec aiguille anime (gradient 5 couleurs)
  - Classification avec emoji et description
  - Valeurs historiques (hier, semaine, mois)
  - Highs/Lows annuels
  - Graphique linaire Fear/Greed + overlay prix BTC
  - Slecteur de plage temporelle
  - Citation de Warren Buffett

### 4. `OpportunityIndex`
- **Fichier** : `index.html:185-230`
- **Props** : `score`, `prevScore`, `indicators`, `showDetails`, `setShowDetails`
- **tat local** : `anim` (animation du score)
- **Affiche** :
  - Gauge SVG avec aiguille + ligne pointille du score prcdent
  - Score composite, classification, delta 30 jours
  - Dcomposition en barres des 5 facteurs (avec marqueur valeur prcdente)
  - Section mthodologie dployable (5 cartes dtailles)

### 5. `CryptoCard`
- **Fichier** : `index.html:232-253`
- **Props** : `crypto`, `rank`
- **tat local** : `exp` (dploy/repli)
- **Affiche** :
  - Rang, icne, symbole, nom, prix, variation 24h
  - Barre de sentiment + label + delta
  - Exchange flow (Accumulation/Distribution)
  - Dtails dployables : 24H / 7J / 30J / vs BTC + sparkline historique

### 6. `Filters`
- **Fichier** : `index.html:263-268`
- **Props** : `filter`, `setFilter`, `search`, `setSearch`, `sort`, `setSort`
- **Affiche** : champ de recherche, boutons filtre sentiment, slecteur tri

---

## Systme de classification

### Fear & Greed Index (`getFearGreedClass`)
| Plage   | Label          | Couleur   | Emoji | Description                    |
|---------|----------------|-----------|-------|--------------------------------|
| 0-24    | Extreme Fear   | `#ea3943` |   | Capitulation - Opportunit contrarian |
| 25-44   | Fear           | `#ea8c00` |   | Sentiment ngatif              |
| 45-55   | Neutral        | `#c9b003` |   | March indcis               |
| 56-74   | Greed          | `#93d900` |   | Optimisme - FOMO               |
| 75-100  | Extreme Greed  | `#16c784` |   | Euphorie - Correction probable |

### Indice d'Opportunit (`getOppClass`)
| Plage   | Label      | Couleur   | Emoji |
|---------|------------|-----------|-------|
| 0-20    | VITER     | `#ea3943` |    |
| 21-40   | PRUDENCE   | `#ea8c00` |    |
| 41-60   | NEUTRE     | `#c9b003` |   |
| 61-80   | FAVORABLE  | `#93d900` |    |
| 81-100  | EXCELLENT  | `#16c784` |    |

### Sentiment Crypto (`getSentimentStyle`)
| Plage   | Label      | Couleur   |
|---------|------------|-----------|
| 0-30    | BEARISH    | `#ea3943` |
| 31-50   | NEUTRE     | `#ea8c00` |
| 51-70   | BULLISH    | `#93d900` |
| 71-100  | V.BULLISH  | `#16c784` |

---

## Gnration des donnes

### Fear & Greed History (`genFearGreedHistory`)
- **Priode** : 730 jours (2 ans)
- **Algorithme** : onde sinusodale + bruit alatoire + lissage exponentiel
- **Formule** : `v = v * 0.95 + (50 + sin(i/60)*20 + random*15) * 0.05`
- **Valeurs rcentes hardcodes** : `[26, 28, 25, 27, 30, 32, 35]`
- **Sortie** : `{ ts, value (0-100), date }`

### BTC Price History (`genBtcHistory`)
- **Driv de** : Fear & Greed Index
- **Plage de prix** : $20,000 - $150,000
- **Formule** : `60000 + (fgValue - 50) * 800 + random * 5000`

### Top 50 Cryptos (`genTop50`)
- **20 premires** : donnes hardcodes (prix, variations, sentiment, flow, etc.)
- **30 altcoins supplmentaires** : donnes hardcodes par tableaux indexs
- **Structure par crypto** :
  ```javascript
  {
    id: number,        // Rang (1-50)
    sym: string,       // Symbole (ex: "BTC")
    name: string,      // Nom complet
    icon: string,      // Emoji/symbole Unicode
    price: number,     // Prix actuel en USD
    c24: number,       // Variation 24h (%)
    c7: number,        // Variation 7 jours (%)
    c30: number,       // Variation 30 jours (%)
    sent: number,      // Sentiment actuel (0-100)
    sentP: number,     // Sentiment prcdent (0-100)
    sH: number[],      // Historique sentiment (5 points)
    flow: number,      // Exchange flow (% ; ngatif = accumulation)
    vsBtc: number      // Performance vs Bitcoin (%)
  }
  ```

### Indice d'Opportunit (5 facteurs)
| Facteur           | Poids | Description                                   |
|-------------------|-------|-----------------------------------------------|
| USDT Flow         | 20%   | Ratio flux USDT sur exchanges                 |
| Market Cap        | 25%   | Capitalisation vs ATH                          |
| Institutionnel    | 25%   | Pression d'achat institutionnelle (MSTR, BTC)  |
| Gold/BTC Ratio    | 15%   | Indicateur contrarian (ratio Or/BTC)            |
| Sentiment Social  | 15%   | Sentiment rseaux sociaux (contrarian)          |

---

## Mise  jour en temps rel

```javascript
CONFIG.REFRESH_RATE = 5000  // 5 secondes

// chaque tick :
price  = price * (1 + random * 0.002)     // 0.1% de variation
c24    = c24 + random * 0.05              // 0.05%
sent   = sent + random * 0.3              // born 0-100
```

---

## Palette de couleurs

| lment          | Hex       | Utilisation                      |
|------------------|-----------|----------------------------------|
| `#0a1628`        | Fond principal                          |
| `#0f2744`        | Fond des cartes                         |
| `#1e3a5f`        | Bordures, fonds secondaires             |
| `#2a4a6f`        | Hover bordures                          |
| `#ea3943`        | Rouge (bearish, fear, ngatif)          |
| `#ea8c00`        | Orange (prudence, neutre-bas)           |
| `#c9b003`        | Jaune (neutre)                          |
| `#93d900`        | Vert clair (bullish, greed)             |
| `#16c784`        | Vert (extreme greed, v.bullish)         |
| `#22c55e`        | Emeraude (positif, gains)               |
| `#ef4444`        | Rouge vif (ngatif, pertes)             |
| `#3b82f6`        | Bleu (USDT flow, boutons actifs)        |
| `#eab308`        | Jaune dor (institutionnel)             |
| `#f97316`        | Orange vif (Gold/BTC)                   |
| `#a855f7`        | Violet (Sentiment social)               |

---

## Responsive Design

| Breakpoint | Colonnes grille | Layout                  |
|------------|-----------------|-------------------------|
| Mobile     | 1               | Flex vertical           |
| sm (640px) | 2               | Grille 2 colonnes       |
| lg (1024px)| 3               | Flex horizontal, 3 cols |
| xl (1280px)| 4               | 4 colonnes              |
| 2xl (1536px)| 5              | 5 colonnes              |

---

## Animations & Transitions

- **Gauge needles** : CSS transform + transition 1-1.5s ease-out
- **Live indicator** : keyframe pulse 2s infini
- **Barres de progression** : transition width 1s
- **Hover cartes** : transition border-color
- **Score Opportunit** : animation via `setTimeout` + `useState`

---

## Amliorations futures prvues

1. **Donnes relles** : intgration d'APIs (CoinGecko, Alternative.me, etc.)
2. **Amlioration visuelle** : glassmorphism, animations avances, micro-interactions
3. **Prcision des variables** : calculs bass sur des donnes de march relles
4. **Alertes** : notifications de seuils de sentiment
5. **Historique persistant** : stockage local ou backend
