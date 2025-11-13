import merch1 from "@/assets/merch-1.jpg";
import merch2 from "@/assets/merch-2.jpg";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "SIGNATURE TEE",
    price: "$35",
    image: merch1,
  },
  {
    id: 2,
    name: "NEL NGABO HOODIE",
    price: "$65",
    image: merch2,
  },
  {
    id: 3,
    name: "ALBUM VINYL",
    price: "$45",
    image: merch1,
  },
  {
    id: 4,
    name: "TOUR TEE",
    price: "$40",
    image: merch2,
  },
];

const ShopSection = () => {
  return (
    <section id="shop" className="py-24 bg-muted relative overflow-hidden">
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground rounded-full"
            style={{
              top: `${(i % 10) * 10}%`,
              left: `${Math.floor(i / 10) * 10}%`,
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter">SHOP</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-card border-2 border-border hover:border-foreground transition-all duration-500 relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="aspect-square overflow-hidden bg-gray-light relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Scan line effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground to-transparent h-20 opacity-0 group-hover:opacity-20 transform -translate-y-full group-hover:translate-y-[400%] transition-all duration-1000" />
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg group-hover:tracking-wide transition-all duration-300">{product.name}</h3>
                  <p className="text-gray-medium font-mono">{product.price}</p>
                </div>
                <Button className="w-full group-hover:bg-foreground group-hover:text-background transition-colors duration-300" variant="outline">
                  ADD TO CART
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" className="text-lg px-8 relative group overflow-hidden">
            <span className="relative z-10">VIEW ALL MERCH</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
