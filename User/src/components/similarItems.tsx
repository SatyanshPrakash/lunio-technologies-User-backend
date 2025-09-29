type Product = {
  id: number;
  title: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
};
import ClashImage from "../assets/clash.png"; 

const similarProducts: Product[] = [
  {
    id: 1,
    title: "TDK Sinton",
    price: "₹750.00",
    image: ClashImage,
    rating: 4.7,
    reviews: 1121,
  },
  {
    id: 2,
    title: "TDK Sinton",
    price: "₹675.00",
    image: ClashImage,
    rating: 4.5,
    reviews: 932,
  },
  {
    id: 3,
    title: "TDK Sinton",
    price: "₹699.00",
    image: ClashImage,
    rating: 4.8,
    reviews: 1334,
  },
  {
    id: 4,
    title: "TDK Sinton",
    price: "₹705.00",
    image: ClashImage,
    rating: 4.6,
    reviews: 874,
  },
  {
    id: 5,
    title: "TDK Sinton",
    price: "₹730.00",
    image: ClashImage,
    rating: 4.9,
    reviews: 1023,
  },
];

const SimilarItems = () => {
  return (
    <section className="max-w-6xl mx-auto mt-12 p-4">
      <h3 className="text-xl font-bold mb-6">Similar Items You Might Also Like</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {similarProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow hover:shadow-md transition-all"
          >
            <img
              src={product.image}
              alt={product.title}
              className="rounded-t-lg w-full object-cover"
            />
            <div className="p-3">
              <h4 className="font-semibold text-sm">{product.title}</h4>
              <p className="text-sm text-blue-600 font-medium">{product.price}</p>
              <div className="text-yellow-500 text-sm mt-1">
                {"★".repeat(Math.round(product.rating))}
                {"☆".repeat(5 - Math.round(product.rating))}
              </div>
              <p className="text-gray-500 text-xs">{product.reviews} reviews</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SimilarItems;
