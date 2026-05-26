import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "./blogData";

const BlogList = () => {
  useSEO({
    title: "Корисні статті про здоров'я та ортопедію",
    description: "Блог BodyHome — практичні поради щодо вибору ортопедичних товарів, догляду за тілом, здорового сну та відновлення. Читайте статті українською.",
    keywords: "ортопедія статті, як вибрати масажер, ортопедична подушка вибір, здоров'я спини, блог",
    url: "/blog",
  });
  return (
  <div className="min-h-screen bg-background">
    <div className="container py-10 sm:py-16">
      <div className="mb-10">
        <p className="aura-kicker mb-3">блог</p>
        <h1 className="text-4xl sm:text-5xl font-light">Корисні статті</h1>
        <p className="mt-3 text-muted-foreground font-light max-w-xl">
          Поради щодо здоров'я, догляду за тілом і вибору ортопедичних товарів
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map(post => (
          <Link key={post.slug} to={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl border border-border/40 bg-white overflow-hidden hover:-translate-y-1 hover:shadow-card transition-all duration-300">
            <div className="flex-1 p-6">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: post.tagColor }}>
                {post.tag}
              </span>
              <h2 className="mt-2 text-lg font-medium leading-snug text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed line-clamp-3">
                {post.intro}
              </p>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-secondary/30">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{post.readTime}</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                Читати <ArrowRight className="h-3 w-3"/>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
  );
};

export default BlogList;
