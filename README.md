# JetLay ✈️

JetLay is a [Next.js](https://nextjs.org/) + [Supabase](https://supabase.com/) + [Capacitor](https://capacitorjs.com/) project.  
Built for CPE334 Software Engineering final project, KMUTT.

---

## 🚀 Tech Stack
- **Frontend:** Next.js 14 (App Router, TypeScript)
- **Backend / DB:** Supabase (Postgres + Auth + Storage)
- **Mobile:** Capacitor (Android/iOS build support)
- **UI Components:** shadcn/ui
- **Deployment:** Vercel (Web), App Stores (Mobile) (Theoretically)

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone git@github.com:Slozzzzy/JetLay.git
cd JetLay
```

### 2. Install dependencies

```bash
pnpm install
# or yarn install
# or npm install
```
### 3. Setup Supabase
- Copy the Project URL and anon/public key from Project Settings → API.
- Add them into .env.local:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```
### 4. Run the dev server
```bash
npm run dev
# or pnpm dev
```

### 📱 Mobile (Capacitor)
```bash
pnpm build
npx cap sync
npx cap run android
# or
npx cap run ios
```
### 🤝 Contributing

1. Create a new branch:
```git
git checkout -b feature/your-feature-name
```
2. Commit changes:
```git
git commit -m "Add your feature"
```
3. Push and open a PR.

(You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.)
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### To Pull
```git
git fetch
git pull
```
## 📝 Notes

Make sure Node.js v18+ is installed.

If deploying to Vercel, link your Supabase project in Environment Variables.

For mobile, you’ll need Android Studio or Xcode installed.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
