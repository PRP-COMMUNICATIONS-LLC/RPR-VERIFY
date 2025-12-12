# RPR-VERIFY (Angular Frontend)

**Documentation:** [DOCS/INDEX.md](DOCS/INDEX.md)

## Project Status

- **Frontend:** Angular 21+ (Standalone)
- **Backend:** Firebase Cloud Functions (Genkit)
- **Database:** Firestore

## Quick Start

```bash
npm install
ng serve
```

## Deployment

```bash
ng build --configuration production && firebase deploy
```

## Project Structure

```
RPR-VERIFY-ANGULAR/
├── src/                          # Angular source code
├── functions/                    # Firebase Cloud Functions
├── DOCS/                         # Documentation
├── angular.json                  # Angular build config
├── package.json                  # Dependencies
├── firebase.json                 # Firebase config
├── firestore.rules               # Security rules
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind CSS config
├── eslint.config.js              # ESLint config
└── README.md                     # This file
```

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI

### Setup
```bash
npm install
ng serve
# App runs at http://localhost:4200
```

### Build
```bash
ng build --configuration production
```

## Deployment

### To Firebase Hosting
```bash
firebase deploy --only hosting,firestore:rules
```

### Verify Deployment
```bash
# Visit https://rpr-verify.web.app
firebase hosting:channel:list
```

## Documentation

For complete documentation, see [DOCS/INDEX.md](DOCS/INDEX.md)

## Status

- ✅ Frontend ready for deployment
- 🔴 Resolve `functions/` TypeScript errors before deploy
- ⚠️ Fix `header.component.ts` linting warnings
- ✅ UI color scheme verified as brand-compliant
