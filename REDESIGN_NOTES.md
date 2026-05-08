# AURA HOME redesign

Змінено:
- dark premium tech дизайн-система в `src/index.css`;
- новий navbar/footer з glassmorphism;
- повністю перероблена головна сторінка;
- нові premium product cards;
- оновлена стилізація категорій;
- сторінки About / Contacts переписані під бренд;
- Cart / Checkout / Product / Catalog отримали темний premium UI через класи дизайн-системи.

Важливо:
- логіка кошика, роутів, Supabase та адмінки не видалена;
- локально `npm ci` не пройшов, бо `package-lock.json` не синхронізований з `package.json` у вихідному архіві. На GitHub/Vercel краще запустити `npm install`, щоб оновити lock-файл, потім `npm run build`.
