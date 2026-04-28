import { ShieldCheck, Heart, Users, Award } from "lucide-react";

const About = () => (
  <div>
    <section className="gradient-hero py-16">
      <div className="container text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl mb-4">Про OLVI</h1>
        <p className="text-lg text-muted-foreground">
          Ми — команда, яка вірить, що здоров'я починається з турботи про себе щодня. OLVI допомагає українським родинам обирати якісні ортопедичні та медичні товари вже понад 8 років.
        </p>
      </div>
    </section>

    <section className="container py-14 grid md:grid-cols-2 gap-10 items-center">
      <div className="space-y-4">
        <h2 className="text-3xl">Наша місія</h2>
        <p className="text-muted-foreground leading-relaxed">
          Зробити якісні медичні та ортопедичні товари доступними для кожної української сім'ї. Ми ретельно обираємо постачальників, перевіряємо сертифікати та гарантуємо: усе, що продається в OLVI — безпечне і працює.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Від подушки для здорового сну до розвиваючих іграшок для малюків — ми поруч на кожному етапі життя вашої родини.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { value: "8+", label: "років на ринку" },
          { value: "50K+", label: "задоволених клієнтів" },
          { value: "200+", label: "товарів у каталозі" },
          { value: "100%", label: "сертифікованих товарів" },
        ].map((s, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border/60 shadow-soft text-center">
            <div className="text-3xl font-bold text-primary">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="container py-14">
      <h2 className="text-3xl text-center mb-10">Наші цінності</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: ShieldCheck, title: "Якість", desc: "Лише перевірені та сертифіковані товари" },
          { icon: Heart, title: "Турбота", desc: "Ставимось до клієнтів як до родини" },
          { icon: Users, title: "Експертність", desc: "Консультуємо як справжні фахівці" },
          { icon: Award, title: "Довіра", desc: "Тисячі позитивних відгуків з усієї України" },
        ].map((v, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border/60 shadow-soft text-center">
            <div className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-primary-soft text-primary mb-4">
              <v.icon className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold mb-2">{v.title}</h3>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default About;
