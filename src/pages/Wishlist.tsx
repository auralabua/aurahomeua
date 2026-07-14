import { Link } from "react-router-dom";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useProductsAsLegacy } from "@/hooks/useShopData";
import { ProductCard } from "@/components/ProductCard";
import { useSEO } from "@/hooks/useSEO";

const Wishlist = () => {
  const { wishlist, clear } = useWishlist();
  const { products, isLoading } = useProductsAsLegacy();

  useSEO({ title: "Вибране", url: "/wishlist", noindex: true });

  const wishlisted = products.filter(p => wishlist.includes(p.id));

  if (!isLoading && wishlist.length === 0) {
    return (
      <div className="container py-16 flex flex-col items-center gap-6 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
          <Heart className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
        </div>
        <div>
          <h1 className="text-2xl font-light mb-2">Список вибраного порожній</h1>
          <p className="text-muted-foreground text-sm">Натисніть ♡ на товарі, щоб зберегти його тут</p>
        </div>
        <Button asChild className="btn-aura rounded-full border-0">
          <Link to="/catalog">Перейти до каталогу</Link>
        </Button>
      </div>
    );
  }

  const count = wishlisted.length;
  const suffix = count === 1 ? "" : count < 5 ? "и" : "ів";

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light">Вибране</h1>
          {!isLoading && (
            <p className="text-sm text-muted-foreground mt-1">{count} товар{suffix}</p>
          )}
        </div>
        {wishlist.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground gap-2">
            <Trash2 className="h-4 w-4" />
            Очистити список
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {wishlisted.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline" className="rounded-full gap-2">
          <Link to="/catalog"><ArrowLeft className="h-4 w-4" />До каталогу</Link>
        </Button>
      </div>
    </div>
  );
};

export default Wishlist;
