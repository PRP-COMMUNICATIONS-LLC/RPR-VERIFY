# RprClientPortal

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.2.

## Cursor Setup & Run Instructions

### 1. Clone the repo

In Cursor's integrated terminal:

```bash
git clone https://github.com/Butterdime/rpr-verify.git
cd rpr-verify
```

### 2. Use a compatible Node version

Use Node that satisfies Angular 21's requirement (`^20.19.0 || ^22.12.0 || >=24.0.0`).

If you have `nvm`:

```bash
nvm install 22.12.0
nvm use 22.12.0
node --version    # confirm >= 22.12.0
```

If not using `nvm`, install Node 22.x from nodejs.org and ensure `node --version` matches.

### 3. Install dependencies

From the project root:

```bash
npm install
```

You may see `EBADENGINE` warnings on older Node versions; on 22.12.0 they should disappear.

### 4. Run the dev server

The dev server is configured to run on port 4300 by default. Simply run:

```bash
npx ng serve
```

or:

```bash
npm start
```

Then open in your browser:

- `http://localhost:4300`

You can also use Cursor's built-in "Open in Browser" / port forwarding if available.

The server is configured to bind to `0.0.0.0` on port 4300 (configured in `angular.json`).

### 5. Build for deployment

When deploying (e.g. Vercel, Netlify, Firebase Hosting), use:

- **Build command:**
  ```bash
  npm run build
  ```

- **Output directory:**
  `dist/rpr-client-portal/browser`  
  (Angular 21's application builder outputs files in a `browser` subdirectory)

## Vercel Deployment

### Step 1: Verify Local Build

Before deploying to Vercel, ensure your build works locally:

```bash
npm install
npm run build
```

Confirm that `dist/rpr-client-portal/browser/index.html` exists. You can test it by right-clicking the file in WebStorm and selecting "Open in Browser".

> **Note:** Angular 21's new `@angular/build:application` builder outputs publicly accessible files in a `browser` subdirectory. This is why Vercel must point to `dist/rpr-client-portal/browser`.

### Step 2: Verify Repository Configuration

Ensure these files are correctly configured (they should already be):

**`package.json`** - scripts section:
```json
"scripts": {
  "start": "ng serve",
  "build": "ng build",
  ...
}
```

**`angular.json`** - build options:
```json
"build": {
  "options": {
    "outputPath": "dist/rpr-client-portal",
    ...
  }
}
```

**`vercel.json`** - deployment config (already present in repo):
```json
{
  "version": 2,
  "framework": "angular",
  "buildCommand": "npm run build",
  "outputDirectory": "dist/rpr-client-portal/browser",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Step 3: Configure Vercel Project Settings

In your Vercel dashboard:

1. Go to **Settings → Build & Development Settings**
2. Set the following:
   - **Framework Preset:** `Angular`
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install` (default)
   - **Output Directory:** `dist/rpr-client-portal/browser`
3. Click **Save**

### Step 4: Deploy

After pushing your changes to the `main` branch:

```bash
git add .
git commit -m "Configure Vercel build settings"
git push
```

Vercel will automatically trigger a new deployment. You can also manually redeploy:

1. In Vercel → **Deployments**, open the latest one
2. Click **Redeploy**
3. Wait for the build to complete
4. Open your project URL (e.g., `https://<project>.vercel.app`)

### Troubleshooting Vercel 404 Errors

If you get `404: NOT_FOUND` errors:

1. **Check Build Logs:** Review the deployment logs in Vercel to ensure the build succeeded
2. **Verify Output Directory:** Confirm `dist/rpr-client-portal/browser/index.html` was created during the build (note the `/browser` subdirectory)
3. **Check Rewrites:** The `vercel.json` rewrites ensure Angular routing works (client-side navigation won't 404)
4. **Framework Preset:** Make sure "Angular" is selected in Vercel settings
5. **Output Directory Setting:** Ensure Vercel is configured to use `dist/rpr-client-portal/browser` (not just `dist/rpr-client-portal`)

If issues persist after following all steps above, check:
- The exact Vercel project URL
- Screenshot of your Vercel Build & Development Settings
- The build logs from the deployment

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Troubleshooting

### Deployment shows Angular starter screen instead of CIS UI

If your deployed app shows the Angular welcome page with "Hello, rpr-client-portal" instead of the dashboard:

1. **Check `app.html`**: Ensure it contains only your application shell (header + `<router-outlet>`) and not the Angular starter template
2. **Verify standalone components**: All feature components must have `standalone: true` in their `@Component` decorator
3. **Check routes**: Confirm `app.routes.ts` maps the default path (`''`) to `DashboardComponent`
4. **Inspect browser console**: Open DevTools → Console and check for errors related to missing imports or standalone configuration
5. **Verify build output**: After running `npm run build`, check that `dist/rpr-client-portal/browser/index.html` exists and contains your actual app code

### Deployment shows blank or old page

1. **Confirm build output path**: Ensure hosting configuration points to the correct `dist` folder
2. **For Firebase Hosting**: Check `firebase.json` has `"public": "dist/rpr-client-portal/browser"`
3. **For Vercel**: Ensure "Output Directory" in project settings is `dist/rpr-client-portal/browser`
4. **Clear browser cache**: Hard-refresh with Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
5. **Redeploy**: After fixing configuration, trigger a new deployment

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Antigravity Usage

Antigravity must treat `ANTIGRAVITY-RPR-VERIFY-IDE-RULES.md` as its source of truth for workspace hygiene, brand tokens, logo asset, and prompting discipline.

All AG commands should follow the AG-COMMAND template and must not introduce unapproved UI design. 

**Mandatory Output Format:**
Antigravity must follow the "Copy-to-Clipboard" format (Section 3.4 of the rules doc), returning all implementation code and reasoning in a single fenced code block.
