# ANGANCARE Web Prototype

A responsive React + Vite prototype based on the supplied ANGANCARE module/app design.

## Included modules

1. User/Login
2. Dashboard & statistics
3. Child Management
4. Growth Monitoring
5. Nutrition Management
6. Health & Vaccination
7. Alerts & Notifications
8. Attendance Management
9. Reports & Dashboard
10. Data Sync & Offline Support
11. Settings & Master Data

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL in your browser.

The login is currently a prototype: any non-empty mobile and password will enter the app.

## Important architecture note

This is a frontend prototype. Child data is persisted in browser `localStorage` so the UI can be demonstrated without a backend.

For the real project, replace the prototype login/localStorage with:
- Supabase Auth for individual Sevika/Supervisor/Admin accounts
- Supabase/Postgres for cloud data
- Room/IndexedDB/local storage strategy for offline support as appropriate
- Role-based access and `centerId` filtering so a Sevika sees only her assigned center's data

## Capacitor

After the web version is finalized, Capacitor can wrap this React/Vite build into Android:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm run build
npx cap add android
npx cap sync
npx cap open android
```

The resulting Android project can then be opened in Android Studio.
