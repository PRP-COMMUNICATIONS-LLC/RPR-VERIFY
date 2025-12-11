# RPR-VERIFY UI Development Guide

---
**Version:** 1.0  
**Status:** COMPLETE  
**Last Updated:** Saturday, December 6, 2025, 3:42 PM +08  
**Author:** AI Operations Assistant  
**Approver:** Puvan Sivanasan (Founder)  
**Next Review:** December 13, 2025  
**Classification:** INTERNAL — Operations (Confidential)  
**Source:** Extracted from `RPR-VERIFY-OPERATIONS-MASTER.md` Sections 2.1, 3, 5.1, 7, 9
---

## 1. Design System Quick Reference

### Colors

**CSS Variables (Copy from MASTER Section 3.1):**
```css
:root {
  /* Primary Colors */
  --color-primary: #0066CC;
  --color-primary-dark: #0052A3;
  --color-primary-light: #3385D6;
  
  /* Secondary Colors */
  --color-secondary: #00A86B;
  --color-secondary-dark: #008556;
  --color-secondary-light: #33B988;
  
  /* Accent Colors */
  --color-accent: #FF6B35;
  --color-accent-dark: #CC5529;
  --color-accent-light: #FF8C5C;
  
  /* Neutral Palette */
  --color-background: #FFFFFF;
  --color-background-alt: #F8F9FA;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #6C757D;
  --color-border: #E0E0E0;
  --color-border-light: #F0F0F0;
  
  /* Status Colors */
  --color-success: #28A745;
  --color-success-light: #D4EDDA;
  --color-warning: #FFC107;
  --color-warning-light: #FFF3CD;
  --color-error: #DC3545;
  --color-error-light: #F8D7DA;
  --color-info: #17A2B8;
  --color-info-light: #D1ECF1;
}
```

**Usage Guidelines:**
- Always use CSS variables, never hardcode colors
- Use semantic color names (e.g., `--color-success` not `--color-green`)
- Test color contrast ratios (WCAG 2.1 AA minimum)
- Use status colors consistently (success/warning/error/info)

---

### Typography

**CSS Variables (Copy from MASTER Section 3.3):**
```css
:root {
  /* Font Families */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
  
  /* Font Sizes */
  --font-size-h1: 2.5rem;      /* 40px */
  --font-size-h2: 2rem;        /* 32px */
  --font-size-h3: 1.5rem;      /* 24px */
  --font-size-h4: 1.25rem;     /* 20px */
  --font-size-body: 1rem;      /* 16px */
  --font-size-small: 0.875rem; /* 14px */
  --font-size-caption: 0.75rem; /* 12px */
  
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

**Type Scale Usage:**
- **H1:** Page titles, hero headlines
- **H2:** Section headers, major headings
- **H3:** Subsection headers, card titles
- **H4:** Component titles, form labels
- **Body:** Default text, paragraphs
- **Small:** Secondary text, captions
- **Caption:** Timestamps, metadata

---

### Spacing & Sizing

**CSS Variables:**
```css
:root {
  /* Spacing Scale (8px base) */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 1rem;       /* 16px */
  --radius-full: 9999px;   /* Full circle */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

**Spacing Guidelines:**
- Use spacing scale consistently (multiples of 4px/8px)
- Maintain visual rhythm with consistent spacing
- Use larger spacing for section separation
- Use smaller spacing for related elements

---

## 2. Component Structure

### Repository Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/
│   │   │   ├── header.js
│   │   │   ├── header.css
│   │   │   └── header.test.js
│   │   ├── case-list/
│   │   │   ├── case-list.js
│   │   │   ├── case-list.css
│   │   │   └── case-list.test.js
│   │   ├── verification-form/
│   │   │   ├── verification-form.js
│   │   │   ├── verification-form.css
│   │   │   └── verification-form.test.js
│   │   ├── status-badge/
│   │   │   ├── status-badge.js
│   │   │   ├── status-badge.css
│   │   │   └── status-badge.test.js
│   │   └── loading-spinner/
│   │       ├── loading-spinner.js
│   │       ├── loading-spinner.css
│   │       └── loading-spinner.test.js
│   ├── services/
│   │   ├── api.js          # API client
│   │   ├── auth.js         # Authentication
│   │   └── storage.js       # Local storage utilities
│   ├── models/
│   │   ├── case.js         # Case data model
│   │   └── verification.js # Verification data model
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── dashboard.js
│   │   │   └── dashboard.css
│   │   ├── verification/
│   │   │   ├── verification.js
│   │   │   └── verification.css
│   │   └── settings/
│   │       ├── settings.js
│   │       └── settings.css
│   └── utils/
│       ├── validation.js   # Input validation
│       ├── formatting.js   # Data formatting
│       └── errors.js       # Error handling
├── assets/
│   ├── branding/
│   │   ├── rpr-verify-logo.svg
│   │   ├── rpr-verify-logo-dark.svg
│   │   └── favicon.ico
│   └── images/
│       └── placeholder.svg
├── styles/
│   ├── reset.css           # CSS reset
│   ├── variables.css       # CSS variables (design system)
│   ├── base.css            # Base styles
│   └── utilities.css       # Utility classes
├── index.html
└── main.js                 # Application entry point
```

### Component Naming Convention

- **Components:** PascalCase (e.g., `CaseList`, `VerificationForm`)
- **Files:** kebab-case (e.g., `case-list.js`, `verification-form.css`)
- **CSS Classes:** kebab-case (e.g., `.case-list`, `.verification-form`)
- **CSS Variables:** kebab-case with `--` prefix (e.g., `--color-primary`)

---

## 3. Development Workflow

### Clone & Setup

```bash
# Clone repository
git clone <repository-url>
cd rpr-verify-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev:frontend
```

**Environment Variables:**
```bash
VITE_API_BASE_URL=https://api.rpr-verify.com
VITE_API_KEY=your-api-key-here
VITE_ENVIRONMENT=development
```

### Local Development

```bash
# Start development server (with hot reload)
npm run dev:frontend

# Run linter
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview
```

**Development Server:**
- URL: `http://localhost:5173` (Vite default)
- Hot Module Replacement (HMR) enabled
- Source maps enabled
- Auto-reload on file changes

### Git Workflow

**Branch Naming:**
- Feature: `feature/component-name` (e.g., `feature/case-list`)
- Bugfix: `bugfix/issue-description` (e.g., `bugfix/abn-validation-error`)
- Hotfix: `hotfix/critical-issue` (e.g., `hotfix/security-patch`)

**Commit Format:**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(verification): add ABN validation form

- Implement ABN input field with validation
- Add real-time format checking
- Display validation errors

Closes #123
```

**Workflow:**
1. Create feature branch from `main`
2. Make changes and commit with proper format
3. Push branch and create pull request
4. Code review by GEM-FB or GEM-AI
5. Merge to `main` after approval
6. Deploy to staging for testing

---

## 4. CSS Variables & Theming

### Using CSS Variables

**Always use CSS variables for colors, spacing, and typography:**

```css
/* ✅ Good - Uses CSS variables */
.button {
  background-color: var(--color-primary);
  color: var(--color-background);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-body);
}

/* ❌ Bad - Hardcoded values */
.button {
  background-color: #0066CC;
  color: #FFFFFF;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 16px;
}
```

### Theming Support

**Light Theme (Default):**
```css
:root {
  --color-background: #FFFFFF;
  --color-text-primary: #1A1A1A;
  --color-border: #E0E0E0;
}
```

**Dark Theme (Future):**
```css
[data-theme="dark"] {
  --color-background: #1A1A1A;
  --color-text-primary: #FFFFFF;
  --color-border: #404040;
}
```

**Implementation:**
- Use CSS variables for all themeable properties
- Test both light and dark themes (when implemented)
- Ensure contrast ratios meet WCAG 2.1 AA

---

## 5. Logo & Asset Usage

### Logo Files

**Location:** `src/assets/branding/`

- `rpr-verify-logo.svg` - Primary logo (light background)
- `rpr-verify-logo-dark.svg` - Logo for dark backgrounds
- `favicon.ico` - Browser favicon

### Logo Usage Guidelines

**Minimum Sizes:**
- Header logo: 120px width minimum
- Footer logo: 80px width minimum
- Favicon: 32x32px

**Spacing:**
- Maintain clear space around logo (equal to logo height)
- Do not distort or modify logo proportions
- Use SVG format for scalability

**Implementation:**
```html
<!-- Header logo -->
<img 
  src="/assets/branding/rpr-verify-logo.svg" 
  alt="RPR Verify Logo" 
  class="header-logo"
/>

<!-- Dark background logo -->
<img 
  src="/assets/branding/rpr-verify-logo-dark.svg" 
  alt="RPR Verify Logo" 
  class="footer-logo"
/>
```

### Asset Optimization

**Images:**
- Use SVG for logos and icons
- Optimize PNG/JPG images (use tools like ImageOptim)
- Lazy load images below the fold
- Use appropriate image formats (WebP when supported)

**Fonts:**
- Load fonts from Google Fonts (Inter, Fira Code)
- Use `font-display: swap` for better performance
- Preload critical fonts

---

## 6. Quality Gates

### Before Commit

**Pre-commit Checklist:**
- [ ] Code passes linter (`npm run lint`)
- [ ] All tests passing (`npm run test`)
- [ ] No hardcoded colors (use CSS variables)
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Accessibility tested (keyboard navigation, screen reader)
- [ ] Responsive design tested (mobile, tablet, desktop)

**Linter Rules:**
- ESLint configured with strict rules
- Prettier for code formatting
- No unused variables or imports
- Consistent code style

### Before Push

**Pre-push Checklist:**
- [ ] All tests passing
- [ ] No secrets or API keys exposed
- [ ] Git hygiene verified (no large files, proper .gitignore)
- [ ] Branch is up to date with `main`
- [ ] Commit messages follow format
- [ ] No merge conflicts

**Security Checks:**
- No API keys in code (use environment variables)
- No sensitive data in console logs
- No hardcoded credentials
- Dependencies scanned for vulnerabilities

### Pre-Deployment

**Deployment Checklist:**
- [ ] All quality gates passed
- [ ] Production build successful (`npm run build`)
- [ ] Build output verified (no errors in console)
- [ ] Environment variables configured
- [ ] Firebase hosting configured
- [ ] CDN cache cleared (if needed)
- [ ] Monitoring and error tracking enabled
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance audit passed (Lighthouse score > 90)
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)

---

## 7. Deployment to Firebase Hosting

### Build Process

```bash
# Build for production
npm run build

# Output directory: dist/
# Verify build output
ls -la dist/
```

**Build Output:**
- `index.html` - Main HTML file
- `assets/` - Compiled JS, CSS, and assets
- Optimized and minified code
- Source maps (for debugging)

### Firebase Configuration

**firebase.json:**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Deployment Steps

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init hosting

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy to specific project
firebase deploy --only hosting --project rpr-verify-prod
```

**Deployment Environments:**
- **Staging:** `firebase deploy --project rpr-verify-staging`
- **Production:** `firebase deploy --project rpr-verify-prod`

### Post-Deployment Verification

- [ ] Site loads correctly at production URL
- [ ] All routes accessible (no 404 errors)
- [ ] API calls working (check network tab)
- [ ] No console errors
- [ ] Performance metrics acceptable (Lighthouse)
- [ ] Mobile responsiveness verified
- [ ] Accessibility verified

---

## 8. Troubleshooting

### Common Issues

**Issue: CSS variables not working**
- **Solution:** Ensure variables are defined in `:root` and imported in `main.js`
- **Check:** Verify `styles/variables.css` is imported before component styles

**Issue: Build fails with module not found**
- **Solution:** Run `npm install` to ensure all dependencies are installed
- **Check:** Verify import paths are correct (case-sensitive)

**Issue: Hot reload not working**
- **Solution:** Restart dev server (`npm run dev:frontend`)
- **Check:** Verify Vite is running on correct port (5173)

**Issue: API calls failing in production**
- **Solution:** Verify environment variables are set in Firebase Hosting
- **Check:** Ensure API base URL is correct for production environment

**Issue: Logo not displaying**
- **Solution:** Verify logo path is correct (`/assets/branding/rpr-verify-logo.svg`)
- **Check:** Ensure logo file exists in `src/assets/branding/` directory

**Issue: Styles not applying**
- **Solution:** Check CSS import order in `main.js`
- **Check:** Verify CSS classes are correctly named (kebab-case)

### Debugging Tips

**Browser DevTools:**
- Use Network tab to check API calls
- Use Console tab for JavaScript errors
- Use Elements tab to inspect CSS
- Use Lighthouse for performance audit

**Vite DevTools:**
- Check Vite console for build errors
- Verify HMR (Hot Module Replacement) is working
- Check module graph for dependency issues

**Code Debugging:**
- Use `console.log` sparingly (remove before commit)
- Use browser breakpoints for complex logic
- Test components in isolation
- Use React DevTools (if using React) or Vue DevTools (if using Vue)

---

## 9. Testing Guidelines

### Unit Tests

**Location:** Co-located with components (e.g., `component.test.js`)

**Coverage Requirements:**
- Minimum 80% code coverage
- Test all user interactions
- Test error handling
- Test edge cases

**Example:**
```javascript
import { describe, it, expect } from 'vitest';
import { validateABN } from '../utils/validation';

describe('validateABN', () => {
  it('should validate correct ABN format', () => {
    expect(validateABN('12345678901')).toBe(true);
  });
  
  it('should reject invalid ABN format', () => {
    expect(validateABN('123')).toBe(false);
  });
});
```

### Integration Tests

**Location:** `tests/integration/`

**Test Scenarios:**
- Complete user flows
- API integration
- Form submissions
- Navigation

### E2E Tests (Future)

**Tools:** Playwright or Cypress

**Test Scenarios:**
- User registration flow
- Verification submission flow
- Dashboard navigation
- Error handling flows

---

## 10. Accessibility Requirements

### WCAG 2.1 AA Compliance

**Required:**
- Keyboard navigation for all interactive elements
- Screen reader support (ARIA labels)
- Color contrast ratios (4.5:1 for text, 3:1 for UI components)
- Focus indicators visible
- Alt text for images
- Form labels associated with inputs

### Implementation Checklist

- [ ] All buttons and links keyboard accessible
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Focus indicators visible and clear
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] ARIA labels for complex components
- [ ] Skip navigation links for main content
- [ ] Error messages associated with form fields

### Testing Tools

- **Browser:** Chrome DevTools Accessibility panel
- **Automated:** axe DevTools extension
- **Manual:** Keyboard navigation, screen reader testing

---

## Reference Documents

- **Master Operations Guide:** `../RPR-VERIFY-OPERATIONS-MASTER.md`
- **Strategy Brief:** `RPR-VERIFY-STRATEGY-BRIEF.md` (this folder)
- **Copy Guidelines:** `RPR-VERIFY-COPY-GUIDELINES.md` (this folder)
- **Repository:** GitHub repository (link to be added)

---

**Note:** This document is a derivative of `RPR-VERIFY-OPERATIONS-MASTER.md`. For complete technical specifications, refer to the master document in the parent directory.

