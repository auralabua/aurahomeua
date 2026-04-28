import {
  type LucideIcon,
  BedDouble,
  Footprints,
  Activity,
  Zap,
  Sparkles,
  Blocks,
  Shield,
} from "lucide-react";

export type CategoryId =
  | "pillows"
  | "mats"
  | "braces"
  | "massagers"
  | "beauty"
  | "toys"
  | "insoles";

export interface Category {
  id: CategoryId;
  name: string;
  icon: LucideIcon;
  description: string;
}

export const categories: Category[] = [
  { id: "pillows", name: "Ортопедичні подушки", icon: BedDouble, description: "Здоровий сон і підтримка шиї" },
  { id: "mats", name: "Масажні килимки", icon: Activity, description: "Аплікатори та акупунктурні килимки" },
  { id: "braces", name: "Ортези і бандажі", icon: Shield, description: "Підтримка суглобів та спини" },
  { id: "massagers", name: "Масажери", icon: Zap, description: "Електричні та ручні масажери" },
  { id: "beauty", name: "Товари для краси", icon: Sparkles, description: "Догляд за обличчям і тілом" },
  { id: "toys", name: "Розвиваючі іграшки", icon: Blocks, description: "Для гармонійного розвитку дітей" },
  { id: "insoles", name: "Ортопедичні устілки", icon: Footprints, description: "Комфорт для ваших ніг" },
];

export interface Product {
  id: string;
  name: string;
  price: number;
  category: CategoryId;
  rating: number;
  reviews: number;
  badge?: "Хіт продажів" | "Новинка";
  description: string;
  emoji: string;
}

export const products: Product[] = [
  // Подушки
  { id: "p1", name: "Подушка ортопедична з ефектом пам'яті", price: 1299, category: "pillows", rating: 4.8, reviews: 124, badge: "Хіт продажів", emoji: "🛏️", description: "Подушка з пам'яттю форми, що ідеально підлаштовується під контури шиї та голови. Забезпечує здоровий сон і знімає напругу з шийних м'язів." },
  { id: "p2", name: "Подушка для сну з виїмкою для плеча", price: 1099, category: "pillows", rating: 4.6, reviews: 87, emoji: "🛌", description: "Анатомічна форма з виїмкою для плеча — ідеально для сну на боці." },
  { id: "p3", name: "Дитяча ортопедична подушка", price: 849, category: "pillows", rating: 4.9, reviews: 56, badge: "Новинка", emoji: "👶", description: "Спеціальна форма для правильного розвитку шийного відділу дитини." },
  // Килимки
  { id: "m1", name: "Масажний килимок аплікатор Кузнєцова", price: 399, category: "mats", rating: 4.7, reviews: 203, badge: "Хіт продажів", emoji: "🟦", description: "Класичний голчастий аплікатор для покращення кровообігу та зняття болю." },
  { id: "m2", name: "Килимок з масажною подушечкою (набір)", price: 649, category: "mats", rating: 4.5, reviews: 98, emoji: "🧘", description: "Набір килимок + подушка для повного релаксу спини та шиї." },
  { id: "m3", name: "Акупунктурний килимок для спини", price: 549, category: "mats", rating: 4.6, reviews: 142, emoji: "🟪", description: "Тисячі акупунктурних точок для глибокого розслаблення м'язів." },
  // Ортези
  { id: "b1", name: "Бандаж на колінний суглоб", price: 599, category: "braces", rating: 4.7, reviews: 76, emoji: "🦵", description: "Еластичний бандаж для фіксації коліна під час навантажень і реабілітації." },
  { id: "b2", name: "Ортез на гомілковостопний суглоб", price: 749, category: "braces", rating: 4.8, reviews: 64, emoji: "🦶", description: "Жорстка фіксація гомілковостопу при травмах і розтягненнях." },
  { id: "b3", name: "Бандаж для підтримки спини (поперековий)", price: 899, category: "braces", rating: 4.6, reviews: 112, badge: "Хіт продажів", emoji: "🧍", description: "Підтримує поперек, знімає навантаження зі спини при сидячій роботі." },
  // Масажери
  { id: "ms1", name: "Масажер для шиї та плечей електричний", price: 1499, category: "massagers", rating: 4.8, reviews: 188, badge: "Хіт продажів", emoji: "💆", description: "Шіацу-масаж із підігрівом для шиї та плечей. Працює від мережі та авто." },
  { id: "ms2", name: "Ручний роликовий масажер для ніг", price: 349, category: "massagers", rating: 4.4, reviews: 52, emoji: "🦵", description: "Простий і ефективний роликовий масажер для стоп і литок." },
  { id: "ms3", name: "Вібраційний масажер для спини", price: 1199, category: "massagers", rating: 4.6, reviews: 91, emoji: "🔋", description: "Кілька режимів вібрації для глибокого опрацювання м'язів." },
  // Краса
  { id: "be1", name: "Масажер для обличчя гуаша", price: 299, category: "beauty", rating: 4.7, reviews: 215, emoji: "💎", description: "Натуральний нефритовий скребок для лімфодренажного масажу обличчя." },
  { id: "be2", name: "Роликовий масажер з нефриту", price: 449, category: "beauty", rating: 4.8, reviews: 178, badge: "Хіт продажів", emoji: "🪨", description: "Подвійний ролик із натурального нефриту для тонусу шкіри." },
  { id: "be3", name: "Антицелюлітний масажер", price: 699, category: "beauty", rating: 4.5, reviews: 88, emoji: "✨", description: "Вакуумно-роликовий масажер для боротьби з целюлітом." },
  // Іграшки
  { id: "t1", name: "Сенсорний килимок для малюків", price: 799, category: "toys", rating: 4.9, reviews: 67, badge: "Новинка", emoji: "🧸", description: "Розвиває тактильну чутливість та координацію руху малюків." },
  { id: "t2", name: "Дерев'яний сортер-геометрія", price: 499, category: "toys", rating: 4.8, reviews: 102, emoji: "🔷", description: "Класичний сортер з натурального дерева. Розвиває логіку та моторику." },
  { id: "t3", name: "Розвиваючий куб Монтессорі", price: 649, category: "toys", rating: 4.9, reviews: 134, badge: "Хіт продажів", emoji: "🎲", description: "Багатофункціональний куб з активностями за методикою Монтессорі." },
  // Устілки
  { id: "i1", name: "Устілки ортопедичні від плоскостопості", price: 349, category: "insoles", rating: 4.6, reviews: 156, emoji: "👟", description: "Підтримують склепіння стопи, коригують поставу при ходьбі." },
  { id: "i2", name: "Гелеві устілки для спорту", price: 249, category: "insoles", rating: 4.5, reviews: 211, badge: "Хіт продажів", emoji: "⚽", description: "Амортизують удари при бігу та інтенсивних тренуваннях." },
  { id: "i3", name: "Дитячі ортопедичні устілки", price: 299, category: "insoles", rating: 4.8, reviews: 73, emoji: "👶", description: "Формують правильну стопу під час росту дитини." },
];

export const formatUAH = (price: number) =>
  new Intl.NumberFormat("uk-UA").format(price) + " ₴";
