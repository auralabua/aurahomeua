const PublicOffer = () => (
  <div className="container py-14 max-w-3xl">
    <p className="aura-kicker mb-4">юридична інформація</p>
    <h1 className="text-4xl md:text-5xl font-light mb-3">Публічний договір (оферта)</h1>
    <p className="text-muted-foreground font-light mb-10">Остання редакція: травень 2026 року</p>

    <div className="space-y-8 font-light text-foreground/80 leading-relaxed text-sm">
      <section>
        <h2 className="text-xl font-light text-foreground mb-3">1. Загальні положення</h2>
        <p>Цей документ є публічною офертою інтернет-магазину <strong className="font-medium">BodyHumm</strong> (далі — Продавець) та визначає умови продажу товарів через сайт bodyhumm.com.ua.</p>
        <p className="mt-2">Оформлення замовлення на сайті означає повне та беззастережне прийняття покупцем умов цього договору відповідно до ст. 642 Цивільного кодексу України.</p>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">2. Предмет договору</h2>
        <p>Продавець зобов'язується передати у власність Покупця товари, представлені на сайті, а Покупець зобов'язується прийняти та оплатити їх на умовах цього договору.</p>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">3. Оформлення замовлення</h2>
        <ul className="space-y-2 list-none">
          {[
            "Покупець обирає товар на сайті та додає його до кошика",
            "Заповнює форму замовлення: ім'я, телефон, email, адреса доставки",
            "Підтверджує замовлення — після чого менеджер зв'язується для підтвердження",
            "Замовлення вважається прийнятим після підтвердження менеджером",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">4. Ціни та оплата</h2>
        <ul className="space-y-2 list-none">
          {[
            "Ціни на сайті вказані в гривнях (UAH) з урахуванням ПДВ",
            "Продавець залишає за собою право змінювати ціни без попереднього повідомлення",
            "Ціна замовлення фіксується на момент підтвердження менеджером",
            "Оплата: накладений платіж або онлайн через WayForPay (Visa/Mastercard)",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">5. Доставка</h2>
        <ul className="space-y-2 list-none">
          {[
            "Доставка здійснюється по всій Україні службами Нова Пошта, Meest, Укрпошта",
            "Вартість доставки оплачується покупцем за тарифами перевізника",
            "Термін доставки: 1–5 робочих днів залежно від служби та регіону",
            "Ризик випадкового пошкодження переходить до покупця з моменту передачі перевізнику",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">6. Повернення та обмін</h2>
        <ul className="space-y-2 list-none">
          {[
            "Повернення товару належної якості — протягом 14 днів з дня отримання",
            "Товар повертається у первісному вигляді з оригінальною упаковкою та етикетками",
            "Товари особистої гігієни поверненню не підлягають (відповідно до Постанови КМУ №172)",
            "При виявленні браку — обмін або повернення коштів за рахунок Продавця",
            "Для повернення необхідно звернутися до менеджера протягом 14 днів",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">7. Права та обов'язки сторін</h2>
        <p className="font-medium text-foreground mb-2">Продавець зобов'язується:</p>
        <ul className="space-y-1.5 list-none mb-4">
          {[
            "Своєчасно обробляти та відправляти замовлення",
            "Надавати достовірну інформацію про товари",
            "Захищати персональні дані покупця",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
        <p className="font-medium text-foreground mb-2">Покупець зобов'язується:</p>
        <ul className="space-y-1.5 list-none">
          {[
            "Надавати достовірні контактні дані",
            "Своєчасно приймати та оплачувати замовлення",
            "Ознайомитись з умовами договору перед оформленням",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">8. Вирішення спорів</h2>
        <p>Всі спори вирішуються шляхом переговорів. У разі неможливості досягти згоди — відповідно до чинного законодавства України.</p>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">9. Контактна інформація</h2>
        <ul className="space-y-1 list-none">
          <li>Назва: BodyHumm</li>
          <li>Email: <a href="mailto:bodyhumm@gmail.com" className="text-primary hover:underline">bodyhumm@gmail.com</a></li>
          <li>Телефон: <a href="tel:+380956981124" className="text-primary hover:underline">+380956981124</a></li>
          <li>Telegram: <a href="https://t.me/aurahomeua" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">@aurahomeua</a></li>
        </ul>
      </section>
    </div>
  </div>
);

export default PublicOffer;
