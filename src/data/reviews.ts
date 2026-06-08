export interface Review {
  id: string;
  name: string;
  city: string;
  avatar: string;
  avatarBg: string;
  rating: number;
  date: string;
  text: string;
  product: string;
  productCategory: string;
  imageUrl?: string;
  verified: boolean;
  helpful: number;
  tags?: string[];
}

export const siteReviews: Review[] = [
  {
    id: "r1",
    name: "Олена Ткаченко",
    city: "Київ",
    avatar: "ОТ",
    avatarBg: "#E8D5C0",
    rating: 5,
    date: "12 травня 2025",
    text: "Замовила ортопедичну подушку після того як місяць не могла нормально спати через дискомфорт у шиї. Вже після першого тижня різниця помітна! Шия не болить зранку, сплю глибше. Доставка була на наступний день — дуже приємно здивували.",
    product: "Ортопедична подушка з ефектом пам'яті",
    productCategory: "Подушки",
    imageUrl: "https://images.prom.ua/6735125980_ortopedicheskaya-podushka-dlya.jpg",
    verified: true,
    helpful: 24,
    tags: ["Швидка доставка", "Відповідає опису"],
  },
  {
    id: "r2",
    name: "Андрій Мельник",
    city: "Львів",
    avatar: "АМ",
    avatarBg: "#D5DEEA",
    rating: 5,
    date: "28 квітня 2025",
    text: "Купив масажний пістолет для відновлення після тренувань. Якість на рівень вище ніж очікував за таку ціну. Три насадки, тихий режим — все як треба. Вже тиждень користуюсь щодня після пробіжок.",
    product: "Масажний пістолет перкусійний",
    productCategory: "Масажери",
    imageUrl: "https://images.prom.ua/6733890179_massazhnyj-pistolet--.jpg",
    verified: true,
    helpful: 18,
    tags: ["Хороша якість", "Рекомендую"],
  },
  {
    id: "r3",
    name: "Марія Коваль",
    city: "Харків",
    avatar: "МК",
    avatarBg: "#D8EAD5",
    rating: 5,
    date: "5 травня 2025",
    text: "Брала устілки дитині за рекомендацією ортопеда — шукала саме шкіряні із супінатором. Якість чудова, дитина носить вже другий місяць і жодного дискомфорту. Буду рекомендувати знайомим.",
    product: "Дитячі шкіряні устілки-супінатор",
    productCategory: "Устілки",
    imageUrl: "https://images.prom.ua/6725198253_detskie-kozhanye-stelki-supinator.jpg",
    verified: true,
    helpful: 31,
    tags: ["Дитячий товар", "Якість шкіри"],
  },
  {
    id: "r4",
    name: "Василь Гончаренко",
    city: "Дніпро",
    avatar: "ВГ",
    avatarBg: "#EDD8C0",
    rating: 4,
    date: "19 квітня 2025",
    text: "Масажний килимок купив для дружини — після 15 хвилин на килимку ноги стають легшими. Єдиний мінус — перші дні трохи болісно поки не звикнеш, але це нормально для аплікатора. Якість матеріалу на висоті.",
    product: "Килимок-аплікатор Кузнєцова",
    productCategory: "Килимки",
    imageUrl: "https://images.prom.ua/6735130039_akupunkturnyj-kovrik-ortek.jpg",
    verified: true,
    helpful: 15,
    tags: ["Для здоров'я", "Ефект є"],
  },
  {
    id: "r5",
    name: "Ірина Бондаренко",
    city: "Одеса",
    avatar: "ІБ",
    avatarBg: "#E5D5E5",
    rating: 5,
    date: "2 травня 2025",
    text: "Замовила бандаж для фіксації — потрібен був якісний, не аптечний ширпотреб. Тут знайшла саме те що треба. Матеріал приємний, не натирає, тримає добре. Консультант у чаті допоміг вибрати правильний розмір.",
    product: "Бандаж для фіксації (абдомінальний)",
    productCategory: "Ортези",
    imageUrl: "https://images.prom.ua/6735126618_bandazh-abdominalnyj-posleoperatsionnyj.jpg",
    verified: true,
    helpful: 22,
    tags: ["Медичний рівень", "Гарна підтримка"],
  },
  {
    id: "r6",
    name: "Тетяна Савченко",
    city: "Запоріжжя",
    avatar: "ТС",
    avatarBg: "#EAE5CC",
    rating: 5,
    date: "8 травня 2025",
    text: "Масажний килимок-пазл для дочки 3 роки — чудова покупка! Вона від нього в захваті, ходить сама по ньому щодня. Педіатр сказала що це найкраща профілактика порушення постави. Якість матеріалу відмінна, без запаху.",
    product: "Масажний килимок Пазли Мікс",
    productCategory: "Іграшки",
    imageUrl: "https://images.prom.ua/6339693937_kovrik-massazhnyj-pazly.jpg",
    verified: true,
    helpful: 28,
    tags: ["Для дітей", "Безпечний матеріал"],
  },
];

export const trustStats = [
  { number: "2 400+", label: "задоволених клієнтів" },
  { number: "4.8", label: "середній рейтинг" },
  { number: "97%", label: "рекомендують нас" },
  { number: "14 днів", label: "на повернення" },
];
