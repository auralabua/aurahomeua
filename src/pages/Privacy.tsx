import { useSEO } from "@/hooks/useSEO";

const Privacy = () => {
  useSEO({
    title: "Політика конфіденційності — BodyHome",
    description: "Політика конфіденційності інтернет-магазину BodyHome. Як ми збираємо, використовуємо та захищаємо ваші персональні дані.",
    url: "/privacy",
    noindex: true,
  });

  return (
  <div className="container py-14 max-w-3xl">
    <p className="aura-kicker mb-4">юридична інформація</p>
    <h1 className="text-4xl md:text-5xl font-light mb-3">Політика конфіденційності</h1>
    <p className="text-muted-foreground font-light mb-10">Останнє оновлення: червень 2026 року</p>

    <div className="prose prose-sm max-w-none space-y-8 font-light text-foreground/80 leading-relaxed">
      <section>
        <h2 className="text-xl font-light text-foreground mb-3">1. Загальні положення</h2>
        <p>Ця Політика конфіденційності регулює порядок збору, використання та захисту персональних даних користувачів інтернет-магазину BodyHome (www.bodyhome.com.ua).</p>
        <p className="mt-2">Використовуючи наш сайт, ви погоджуєтесь з умовами цієї політики. Якщо ви не погоджуєтесь — будь ласка, не використовуйте наш сайт.</p>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">2. Які дані ми збираємо</h2>
        <ul className="space-y-2 list-none">
          {[
            "Ім'я та прізвище — для оформлення та доставки замовлення",
            "Номер телефону — для зв'язку щодо замовлення",
            "Email-адреса — для надсилання підтвердження замовлення",
            "Адреса доставки (місто, відділення) — для відправки товару",
            "Дані про замовлення — для обробки та виконання",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">3. Мета використання даних</h2>
        <ul className="space-y-2 list-none">
          {[
            "Обробка та виконання замовлень",
            "Зв'язок з покупцем щодо статусу замовлення",
            "Надання інформації про акції та нові товари (лише за згодою)",
            "Покращення роботи сайту та сервісу",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">4. Захист даних</h2>
        <p>Ми застосовуємо технічні та організаційні заходи для захисту ваших персональних даних від несанкціонованого доступу, втрати або розголошення:</p>
        <ul className="mt-2 space-y-2 list-none">
          {[
            "Шифрування даних за протоколом SSL/TLS",
            "Зберігання даних на захищених серверах Supabase (ЄС)",
            "Обмежений доступ співробітників до персональних даних",
            "Дані платіжних карток не зберігаються на нашому сайті",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">5. Передача даних третім особам</h2>
        <p>Ми не продаємо і не передаємо ваші персональні дані третім особам, за винятком:</p>
        <ul className="mt-2 space-y-2 list-none">
          {[
            "Служби доставки (Нова Пошта, Meest) — для відправки замовлення",
            "Платіжна система LiqPay — для обробки онлайн-платежів",
            "Державні органи — лише за вимогою закону",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">6. Ваші права</h2>
        <p>Ви маєте право:</p>
        <ul className="mt-2 space-y-2 list-none">
          {[
            "Отримати інформацію про свої персональні дані, які ми зберігаємо",
            "Вимагати виправлення або видалення ваших даних",
            "Відкликати згоду на обробку даних у будь-який момент",
            "Подати скаргу до відповідного органу захисту даних",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">Для реалізації ваших прав зверніться до нас: <a href="mailto:bodyhome@gmail.com" className="text-primary hover:underline">bodyhome@gmail.com</a></p>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">7. Cookies</h2>
        <p>Наш сайт використовує файли cookie для покращення роботи. Ви можете відключити cookie у налаштуваннях браузера, однак це може вплинути на функціональність сайту.</p>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">8. Контакти</h2>
        <p>З питань конфіденційності звертайтесь:</p>
        <ul className="mt-2 space-y-1 text-sm list-none">
          <li>Email: <a href="mailto:bodyhome@gmail.com" className="text-primary hover:underline">bodyhome@gmail.com</a></li>
          <li>Телефон: <a href="tel:+380956981124" className="text-primary hover:underline">+380956981124</a></li>
          <li>Telegram: <a href="https://t.me/BodyHome1" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">@bodyhomeua</a></li>
        </ul>
      </section>
    </div>
  </div>
  );
};

export default Privacy;
