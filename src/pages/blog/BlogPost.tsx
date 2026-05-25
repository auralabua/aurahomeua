import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "./blogData";
import { useEffect } from "react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (!post) return;
    document.title = post.metaTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", post.metaDescription);
    // canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://aurahomeua.vercel.app/blog/${post.slug}`);
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  const others = blogPosts.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Головна</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-primary">Блог</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{post.title}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          {/* Article */}
          <article>
            <header className="mb-8">
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: post.tagColor }}>
                {post.tag}
              </span>
              <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-light leading-tight">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{post.date}</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5"/>
                  {post.readTime} читання
                </span>
              </div>
              <p className="mt-6 text-base sm:text-lg font-light leading-relaxed text-foreground/80 border-l-4 pl-5 border-primary/30">
                {post.intro}
              </p>
            </header>

            <div className="space-y-8">
              {post.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="text-xl sm:text-2xl font-medium mb-3">{section.heading}</h2>
                  <div className="space-y-3">
                    {section.content.split("\n\n").map((para, j) => (
                      <p key={j} className="text-base font-light leading-relaxed text-foreground/75">
                        {para}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-2xl bg-secondary/60 border border-border/40 p-6 sm:p-8">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Товари за темою</p>
              <h3 className="text-xl font-medium mb-4">{post.relatedLabel} в нашому каталозі</h3>
              <Link to={`/catalog?category=${post.relatedCategory}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
                Переглянути товари <ArrowRight className="h-4 w-4"/>
              </Link>
            </div>

            <div className="mt-8">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all">
                <ArrowLeft className="h-4 w-4"/> Всі статті
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-medium">Інші статті</h3>
              {others.map(p => (
                <Link key={p.slug} to={`/blog/${p.slug}`}
                  className="flex gap-3 group rounded-xl border border-border/40 bg-white p-4 hover:border-primary/30 transition-colors">
                  <div className="flex-1">
                    <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: p.tagColor }}>
                      {p.tag}
                    </span>
                    <p className="text-sm font-medium leading-snug mt-1 group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </p>
                    <span className="text-xs text-muted-foreground mt-1 block">{p.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
