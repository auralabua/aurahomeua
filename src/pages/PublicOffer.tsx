import { useSEO } from "@/hooks/useSEO";

const PublicOffer = () => {
  useSEO({
    title: "Публічний договір (оферта) — BodyHome",
    description: "Публічний договір інтернет-магазину BodyHome: умови замовлення, оплати, доставки та повернення товарів.",
    url: "/public-offer",
    noindex: true,
  });

  return (
  <div className="container py-14 max-w-3xl">
    <p className="aura-kicker mb-4">юридична інформація</p>
    <h1 className="text-4xl md:text-5xl font-light mb-3">Публічний договір (оферта)</h1>
    <p className="text-muted-foreground font-light mb-10">Остання редакція: липень 2026 року</p>

    <div className="space-y-8 font-light text-foreground/80 leading-relaxed text-sm">

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">1. Загальні положення</h2>
        <p>
          Фізична особа-підприємець <strong className="font-medium">Поручинський Ігор Олегович</strong>, що здійснює діяльність під торговою маркою <strong className="font-medium">BodyHome</strong> (далі — Продавець), діючи на підставі виписки з Єдиного державного реєстру юридичних осіб, фізичних осіб-підприємців та громадських формувань, пропонує необмеженому колу осіб (далі — Покупець) укласти цей Договір купівлі-продажу товарів дистанційним способом.
        </p>
        <p className="mt-2">
          Публікація (розміщення) тексту цього Договору на сайті <strong className="font-medium">www.bodyhome.com.ua</strong> є публічною пропозицією (офертою) відповідно до ст. 633, 641 Цивільного кодексу України та ст. 11 Закону України «Про електронну комерцію».
        </p>
        <p className="mt-2">
          Оформлення замовлення Покупцем є акцептом цієї оферти та означає повне та беззастережне прийняття умов цього Договору відповідно до ст. 642 Цивільного кодексу України.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">2. Предмет договору</h2>
        <p>
          Продавець зобов'язується передати у власність Покупця товари, представлені на сайті www.bodyhome.com.ua, а Покупець зобов'язується прийняти та оплатити їх на умовах цього договору.
        </p>
        <p className="mt-2">
          Цей договір регулюється Цивільним кодексом України, Законом України «Про захист прав споживачів», Законом України «Про електронну комерцію», Постановою КМУ №224 від 19.03.1994 та іншими актами чинного законодавства.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">3. Оформлення замовлення</h2>
        <ul className="space-y-2 list-none">
          {[
            "Покупець обирає товар на сайті та додає його до кошика",
            "Заповнює форму замовлення: ім'я, телефон, email, адреса доставки",
            "Підтверджує замовлення — після чого отримує підтвердження на email або по телефону",
            "Замовлення вважається прийнятим з моменту підтвердження Продавцем",
            "Продавець залишає за собою право відмовити у виконанні замовлення без пояснення причин",
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
            "Ціни на сайті вказані в гривнях (UAH) та є остаточними для Покупця",
            "Продавець не є платником ПДВ (ФОП на єдиному податку 2-ї групи)",
            "Продавець залишає за собою право змінювати ціни без попереднього повідомлення; ціна фіксується на момент підтвердження замовлення",
            "Оплата накладеним платежем: кошти сплачуються при отриманні на відділенні перевізника",
            "Онлайн-оплата через платіжну систему LiqPay: Visa/Mastercard, Google Pay, Apple Pay",
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
            "Вартість доставки оплачується Покупцем за тарифами перевізника",
            "Термін доставки: 1–5 робочих днів залежно від служби та регіону",
            "Право власності та ризик випадкового пошкодження переходять до Покупця з моменту передачі товару перевізнику",
            "При отриманні Покупець зобов'язаний перевірити цілісність упаковки та відповідність замовленню у присутності кур'єра або на відділенні",
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
        <p className="mb-2">
          Відповідно до ст. 9 Закону України «Про захист прав споживачів» та ст. 13 Закону «Про електронну комерцію»:
        </p>
        <ul className="space-y-2 list-none">
          {[
            "Покупець має право відмовитися від товару належної якості протягом 14 днів з дня отримання, не вказуючи причин",
            "Товар повертається у первісному вигляді, у незміненому стані, з оригінальною упаковкою та всіма етикетками",
            "Витрати на доставку при поверненні товару належної якості несе Покупець",
            "Повернення коштів здійснюється протягом 14 днів після отримання поверненого товару",
            "Товари, що входять до Переліку КМУ №172 (вироби особистої гігієни, медичні вироби тощо), поверненню та обміну не підлягають",
            "При виявленні дефекту або невідповідності — обмін або повернення коштів за рахунок Продавця протягом гарантійного строку",
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
            "Своєчасно обробляти та відправляти підтверджені замовлення",
            "Надавати достовірну інформацію про товари, їх характеристики та наявність",
            "Захищати персональні дані Покупця відповідно до Закону України «Про захист персональних даних»",
            "Надавати розрахункові документи (чек / видаткова накладна) при оплаті",
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
            "Надавати достовірні контактні дані при оформленні замовлення",
            "Своєчасно приймати та оплачувати замовлення",
            "Ознайомитись з умовами цього договору перед оформленням замовлення",
            "При отриманні перевірити товар на цілісність та відповідність",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">8. Персональні дані</h2>
        <p>
          Оформлюючи замовлення, Покупець надає згоду на обробку своїх персональних даних (ім'я, телефон, адреса, email) виключно з метою виконання цього договору та інформування про статус замовлення, відповідно до Закону України «Про захист персональних даних» №2297-VI.
        </p>
        <p className="mt-2">
          Персональні дані не передаються третім особам, крім служб доставки, необхідних для виконання замовлення.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">9. Відповідальність та вирішення спорів</h2>
        <p>
          Сторони несуть відповідальність за невиконання умов цього договору відповідно до чинного законодавства України. Всі спори вирішуються шляхом переговорів. У разі неможливості досягти згоди — у судовому порядку за місцем знаходження Продавця або за вибором Покупця-споживача відповідно до ст. 17 Закону «Про захист прав споживачів».
        </p>
      </section>

      <section>
        <h2 className="text-xl font-light text-foreground mb-3">10. Реквізити Продавця</h2>
        <div className="bg-secondary/40 rounded-xl p-5 space-y-2">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <span className="text-muted-foreground shrink-0">Продавець</span>
            <span className="font-medium text-foreground">ФОП Поручинський Ігор Олегович</span>

            <span className="text-muted-foreground shrink-0">РНОКПП</span>
            <span>3462606330</span>

            <span className="text-muted-foreground shrink-0">Адреса</span>
            <span>Україна, 79024, м. Львів, вул. Драгана, 15б/15</span>

            <span className="text-muted-foreground shrink-0">Банк</span>
            <span>АТ «А-БАНК»</span>

            <span className="text-muted-foreground shrink-0">IBAN (р/р)</span>
            <span className="font-mono tracking-wide">UA40 3077 7000 0002 6004 5111 4802 0</span>

            <span className="text-muted-foreground shrink-0">Email</span>
            <span><a href="mailto:bodyhome@gmail.com" className="text-primary hover:underline">bodyhome@gmail.com</a></span>

            <span className="text-muted-foreground shrink-0">Телефон</span>
            <span><a href="tel:+380956981124" className="text-primary hover:underline">+38 095 698 11 24</a></span>

            <span className="text-muted-foreground shrink-0">Telegram</span>
            <span><a href="https://t.me/BodyHome1" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">@BodyHome1</a></span>

            <span className="text-muted-foreground shrink-0">Сайт</span>
            <span><a href="https://www.bodyhome.com.ua" className="text-primary hover:underline">www.bodyhome.com.ua</a></span>
          </div>
        </div>
      </section>

    </div>
  </div>
  );
};

export default PublicOffer;
