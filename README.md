# Shopping Angular (Local-Storage Demo)

This project is a minimal Angular shopping web app demo that uses localStorage for the cart and sample product data. It's intended as a starting point you can expand.

## Quick start

1. Open PowerShell in the project folder:

```powershell
cd 'C:\Users\dell\Desktop\final year project\shopping-angular'
```

2. Install dependencies:

```powershell
npm install
```

3. Serve the app (recommended using `npx` so the project-local CLI runs):

```powershell
npx ng serve --poll=2000
# or
npm start
```

4. Open http://localhost:4200 in your browser.

## Notes
- The app uses localStorage to save the cart so items persist across reloads.
- If you want `ng` globally available, install the Angular CLI globally (requires admin):

```powershell
npm install -g @angular/cli
```

## What is included
- Simple product list, product detail, cart and checkout pages.
- `CartService` that persists to `localStorage`.
- Clean, responsive CSS in `src/styles.scss`.

If you want, I can:
- Improve the UI with a component library (Bootstrap/Material) and responsive breakpoints.
- Add forms for checkout, order history storage, or connect to a real backend API later.
# shopping-_web_be
# shopping-_web_be
