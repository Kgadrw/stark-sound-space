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
    name: "ARTIST HOODIE",
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
    <section id="shop" className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter">SHOP</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-card border border-border hover:border-foreground transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden bg-gray-light">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-gray-medium">{product.price}</p>
                </div>
                <Button className="w-full" variant="outline">
                  ADD TO CART
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" className="text-lg px-8">
            VIEW ALL MERCH
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
