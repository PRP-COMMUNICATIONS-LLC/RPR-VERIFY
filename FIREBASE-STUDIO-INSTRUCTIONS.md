# RPR-VERIFY-V1 Angular UI Integration Instructions for Firebase Studio

**Project:** RPR-VERIFY-V1  
**Target:** Firebase Studio Angular Frontend  
**Date:** December 4, 2025  
**Deployment:** gen-lang-client-0313233462.web.app  

---

## EXECUTIVE SUMMARY

This document provides complete instructions for integrating the Stitch-designed UI components into the existing RPR-VERIFY-V1 Angular application deployed on Firebase. The new UI implements a dark-mode dashboard with the RPR Communications brand identity.

**CRITICAL:** All components use Angular 20+ standalone architecture, Signals for state management, and Tailwind CSS with RPR brand colors.

---

## 1. RPR COMMUNICATIONS BRAND IDENTITY & DESIGN SYSTEM

### 1.1 Brand Colors (MANDATORY)

All UI elements MUST use these exact color values:

```css
/* Primary Brand Colors */
--charcoal: #2B2F33        /* Main dark background */
--slate-gray: #3A4045      /* Secondary surfaces */
--cyan-brand: #00D9FF      /* Primary accent/CTA */
--teal-brand: #008B8B      /* Secondary accent */

/* Supporting Colors */
--slate-800: #1e293b       /* Card backgrounds */
--slate-700: #334155       /* Hover states, borders */
--slate-600: #475569       /* Input borders */
--gray-100: #f3f4f6        /* Primary text */
--gray-200: #e5e7eb        /* Secondary text */
--gray-300: #d1d5db        /* Tertiary text */
--gray-400: #9ca3af        /* Disabled text */
```

### 1.2 Typography

**Primary Font:** Inter (Google Fonts)  
**Font Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)  

**Import in `index.html` or `styles.css`:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
```

**Font Classes:**
```css
font-inter          /* Apply Inter font family */
text-sm             /* 14px */
text-base           /* 16px */
text-lg             /* 18px */
text-xl             /* 20px */
text-2xl            /* 24px */
text-3xl            /* 30px */
text-4xl            /* 36px */
```

### 1.3 Spacing System

```
space-1:  4px
space-2:  8px
space-3:  12px
space-4:  16px
space-6:  24px
space-8:  32px
space-10: 40px
```

### 1.4 Border Radius

```
rounded-sm:   4px
rounded-md:   6px
rounded-lg:   8px
rounded-full: 9999px
```

### 1.5 Shadows

```
shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05)
shadow-md:  0 4px 6px rgba(0, 0, 0, 0.1)
shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.15)
```

---

## 2. PROJECT STRUCTURE

The new UI components should be organized as follows:

```
/src
  /app
    app.component.ts                           # Main shell with sidebar + header
    app.routes.ts                              # Routing configuration
    /components
      /header
        header.component.ts                    # Fixed top header with logo
      /sidebar
        sidebar.component.ts                   # Left navigation sidebar
      /dashboard
        dashboard.component.ts                 # Main dashboard with KPIs + charts
        dashboard.component.html
      /cases-list
        cases-list.component.ts                # Cases data grid with filters
        cases-list.component.html
      /case-detail
        case-detail.component.ts               # Case detail with tabbed interface
        case-detail.component.html
      /settings
        settings.component.ts                  # Settings placeholder
      /help
        help.component.ts                      # Help placeholder
  styles.css                                   # Global Tailwind imports
tailwind.config.js                             # Tailwind configuration with RPR colors
```

---

## 3. IMPLEMENTATION STEPS

### Step 1: Install Dependencies

Run these commands in the Firebase Studio terminal:

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install D3.js for charts
npm install d3
npm install --save-dev @types/d3
```

### Step 2: Configure Tailwind

**File: `tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // RPR Brand Colors
        'charcoal': '#2B2F33',
        'slate-gray': '#3A4045',
        'cyan-brand': '#00D9FF',
        'teal-brand': '#008B8B',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**File: `src/styles.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}
```

### Step 3: Create Component Files

Copy the provided component files into their respective directories:

1. **App Shell:**
   - `app.component.ts` - Main application wrapper
   - `app.routes.ts` - Route definitions

2. **Layout Components:**
   - `components/header/header.component.ts` - Top navigation bar
   - `components/sidebar/sidebar.component.ts` - Left sidebar navigation

3. **Feature Components:**
   - `components/dashboard/dashboard.component.ts` + `.html` - Dashboard with KPIs
   - `components/cases-list/cases-list.component.ts` + `.html` - Cases grid
   - `components/case-detail/case-detail.component.ts` + `.html` - Case details

4. **Utility Components:**
   - `components/settings/settings.component.ts` - Settings page
   - `components/help/help.component.ts` - Help page

### Step 4: Update Main Configuration

**File: `src/main.ts`**

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
```

---

## 4. COMPONENT USAGE GUIDELINES

### 4.1 App Shell (AppComponent)

The main application shell provides:
- Fixed header at top (64px height)
- Fixed sidebar on left (256px width)
- Scrollable main content area
- Dark charcoal background (#2B2F33)

**Key Classes:**
```html
<div class="flex h-screen bg-charcoal text-gray-100 font-inter">
  <app-header></app-header>
  <div class="flex flex-1 pt-16">
    <app-sidebar></app-sidebar>
    <main class="flex-1 overflow-y-auto p-6 lg:p-8 bg-charcoal">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>
```

### 4.2 Header Component

Fixed top header with:
- RPR Communications logo (SVG)
- User profile menu (right-aligned)
- Cyan brand border at bottom

**Styling:**
```css
bg-slate-800                  /* Background */
border-b border-cyan-brand    /* Bottom border accent */
h-16                          /* Fixed height 64px */
```

### 4.3 Sidebar Component

Left navigation sidebar with:
- Active route highlighting (cyan-brand accent)
- Hover states
- Icon + label layout
- Help/Logout section at bottom

**Active State:**
```css
bg-slate-700 border-l-4 border-cyan-brand text-cyan-brand font-semibold
```

**Hover State:**
```css
hover:bg-slate-700 hover:text-cyan-brand
```

### 4.4 Dashboard Component

Main dashboard featuring:
- Filter bar (date range, case type, analyst)
- 4 KPI cards with trend indicators
- D3.js charts (line, donut, bar)
- Vulnerable customer metrics

**KPI Card Structure:**
```html
<div class="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
  <h3 class="text-lg font-semibold text-gray-200">{{ title }}</h3>
  <p class="text-4xl font-bold text-cyan-brand">{{ value }}</p>
  <span class="text-green-400">↑ {{ trend }}%</span>
</div>
```

### 4.5 Cases List Component

Data grid with:
- Type/Status/Risk filters
- Sortable table columns
- Status chips (color-coded)
- Risk badges (Low/Medium/High)
- Row hover effects

**Status Chip Classes:**
```css
/* Resolved */
bg-teal-brand/20 text-teal-brand

/* Pending */
bg-amber-400/20 text-amber-300

/* Open */
bg-sky-400/20 text-sky-300

/* Closed */
bg-gray-500/20 text-gray-300
```

**Risk Badge Classes:**
```css
/* Low */
bg-green-500/20 text-green-400

/* Medium */
bg-yellow-500/20 text-yellow-300

/* High */
bg-red-500/20 text-red-400
```

### 4.6 Case Detail Component

Tabbed interface with:
- Overview (summary + tags)
- Documents (file list)
- Notes (timeline + add note)
- History (activity log)
- Disputes (linked disputes)

**Tab Navigation:**
```css
/* Active Tab */
bg-slate-700 text-cyan-brand font-semibold

/* Inactive Tab */
text-gray-300 hover:bg-slate-700 hover:text-cyan-brand
```

---

## 5. STATE MANAGEMENT WITH SIGNALS

All components use Angular Signals for reactive state:

```typescript
import { signal, computed } from '@angular/core';

// Writable signal
const selectedFilter = signal<string>('All');

// Computed signal (derived state)
const filteredCases = computed(() => {
  return allCases().filter(c => c.type === selectedFilter());
});

// Update signal
selectedFilter.set('Fraud');
```

**Key Patterns:**
- Use `signal()` for mutable state
- Use `computed()` for derived values
- Update with `.set()` or `.update()`
- Read value with `signal()` call

---

## 6. D3.JS CHART INTEGRATION

### 6.1 Line Chart (SLA Adherence)

```typescript
import * as d3 from 'd3';

drawSlaChart() {
  const data = this.slaData();
  const element = this.slaChart.nativeElement;
  
  // Clear previous chart
  d3.select(element).select('svg').remove();
  
  // Create SVG
  const svg = d3.select(element).append('svg')
    .attr('width', width)
    .attr('height', height);
    
  // Draw line
  const line = d3.line<ChartDataPoint>()
    .x(d => x(d.date)!)
    .y(d => y(d.value));
    
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#00D9FF')  // cyan-brand
    .attr('stroke-width', 2)
    .attr('d', line);
}
```

### 6.2 Donut Chart (Dispute Outcomes)

```typescript
drawDonutChart() {
  const pie = d3.pie<DonutData>().value(d => d.value);
  
  const arc = d3.arc<d3.PieArcDatum<DonutData>>()
    .innerRadius(radius * 0.6)    // Donut hole
    .outerRadius(radius);
    
  arcs.append('path')
    .attr('d', arc)
    .attr('fill', d => d.data.color)
    .attr('stroke', '#2B2F33')    // charcoal border
    .style('stroke-width', '2px');
}
```

### 6.3 Bar Chart (Fraud Detection)

```typescript
drawBarChart() {
  const x = d3.scaleBand()
    .domain(data.map(d => d.category))
    .range([0, width])
    .padding(0.3);
    
  svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('x', d => x(d.category)!)
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('fill', '#00D9FF');     // cyan-brand
}
```

---

## 7. ROUTING CONFIGURATION

**File: `app.routes.ts`**

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cases', component: CasesListComponent },
  { path: 'cases/:id', component: CaseDetailComponent },
  { path: 'disputes', component: CasesListComponent },
  { path: 'reports', component: DashboardComponent },
  { path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent) },
  { path: 'help', loadComponent: () => import('./components/help/help.component').then(m => m.HelpComponent) },
  { path: '**', redirectTo: '/dashboard' }
];
```

**Navigation Pattern:**
```typescript
// In sidebar component
<a
  [routerLink]="'/dashboard'"
  routerLinkActive="bg-slate-700 border-l-4 border-cyan-brand text-cyan-brand font-semibold"
  [routerLinkActiveOptions]="{ exact: true }"
>
  Dashboard
</a>
```

---

## 8. RESPONSIVE DESIGN

All components are mobile-responsive using Tailwind breakpoints:

```css
/* Mobile-first approach */
class="grid grid-cols-1"           /* 1 column on mobile */
class="md:grid-cols-2"             /* 2 columns on tablet */
class="lg:grid-cols-4"             /* 4 columns on desktop */

/* Breakpoints */
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

**Common Responsive Patterns:**
```html
<!-- Hidden on mobile, visible on desktop -->
<span class="hidden md:block">Desktop Content</span>

<!-- Full width on mobile, auto on desktop -->
<div class="w-full lg:w-auto">Content</div>

<!-- Flex column on mobile, row on desktop -->
<div class="flex flex-col lg:flex-row">Items</div>
```

---

## 9. ACCESSIBILITY REQUIREMENTS

### 9.1 Semantic HTML

Use proper semantic elements:
```html
<header>   <!-- Page header -->
<nav>      <!-- Navigation -->
<main>     <!-- Main content -->
<aside>    <!-- Sidebar -->
<section>  <!-- Content sections -->
<article>  <!-- Independent content -->
```

### 9.2 ARIA Labels

Add labels for screen readers:
```html
<button aria-label="Close dialog">×</button>
<nav aria-label="Primary navigation">...</nav>
<span class="sr-only">Hidden from visual users</span>
```

### 9.3 Keyboard Navigation

Ensure all interactive elements are keyboard accessible:
```html
<button tabindex="0">Clickable</button>
<a href="#" @keydown.enter="handleClick">Link</a>
```

### 9.4 Color Contrast

All text meets WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text (18px+): 3:1 contrast ratio
- Interactive elements: 3:1 contrast ratio

**Verified Combinations:**
- `text-gray-100` on `bg-charcoal` ✓
- `text-cyan-brand` on `bg-slate-800` ✓
- `text-gray-200` on `bg-slate-700` ✓

---

## 10. TESTING & VALIDATION

### 10.1 Build Test

```bash
ng build --configuration production
```

**Expected output:**
- No compilation errors
- No unused imports warnings
- Bundle size < 2MB

### 10.2 Development Server

```bash
ng serve
```

**Verify:**
- App loads at `http://localhost:4200`
- All routes navigate correctly
- No console errors
- Charts render properly

### 10.3 Visual Regression Checks

**Checklist:**
- [ ] Header logo displays correctly
- [ ] Sidebar navigation highlights active route
- [ ] Dashboard KPI cards show data
- [ ] Charts render with correct colors
- [ ] Cases table filters work
- [ ] Case detail tabs switch correctly
- [ ] All text uses Inter font
- [ ] All colors match RPR brand guide
- [ ] Responsive layout works on mobile
- [ ] Hover states apply cyan-brand accent

---

## 11. DEPLOYMENT TO FIREBASE

### 11.1 Build for Production

```bash
ng build --configuration production
```

### 11.2 Firebase Deployment

```bash
firebase deploy --only hosting
```

**Target:** `gen-lang-client-0313233462.web.app`

### 11.3 Post-Deployment Verification

**URL:** https://gen-lang-client-0313233462.web.app

**Verify:**
1. Homepage loads dashboard
2. Navigation between routes works
3. Charts render properly
4. Filters apply correctly
5. Mobile responsive layout works
6. No 404 errors in console

---

## 12. TROUBLESHOOTING

### Issue: Tailwind classes not applying

**Solution:**
1. Ensure `tailwind.config.js` includes `"./src/**/*.{html,ts}"`
2. Check `styles.css` has Tailwind directives
3. Restart development server

### Issue: D3 charts not rendering

**Solution:**
1. Verify `@ViewChild` references match template
2. Check `ngAfterViewInit()` lifecycle hook
3. Ensure data signal is populated
4. Verify element has width/height

### Issue: Router not navigating

**Solution:**
1. Check `app.routes.ts` imported in `main.ts`
2. Verify `RouterOutlet` in `app.component.ts`
3. Ensure `RouterLink` imported in components

### Issue: Signals not updating UI

**Solution:**
1. Use `.set()` or `.update()` to modify
2. Call signal as function to read: `mySignal()`
3. Use `computed()` for derived values

---

## 13. NEXT STEPS

### Phase 1 Complete (Current)
✓ App shell with header + sidebar  
✓ Dashboard with KPIs + charts  
✓ Cases list with filters  
✓ Case detail with tabs  
✓ RPR brand colors applied  

### Phase 2 (Future)
- Dispute detail component
- Settings page implementation
- Help documentation
- User profile management

### Phase 3 (Backend Integration)
- Replace mock data with live API calls
- Implement authentication
- Add real-time data updates
- Connect to Cloud Run backend

---

## 14. SUPPORT & REFERENCES

### Documentation
- Angular Signals: https://angular.io/guide/signals
- Tailwind CSS: https://tailwindcss.com/docs
- D3.js: https://d3js.org/getting-started

### Project Files
- PRD: `THE-APP-PRD-V6.9.md`
- Blueprint: `blueprint.md`
- Design Tokens: Embedded in this document

### Contact
For questions or issues with this implementation, refer to the project documentation or consult the development team.

---

**END OF INSTRUCTIONS**
