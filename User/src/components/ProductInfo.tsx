import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import ClashImage from '../assets/UC.jpg';
import { Heart, ExternalLink } from 'lucide-react';
import { Star } from 'lucide-react'

const ProductInfo = () => {
  const [selectedPack, setSelectedPack] = useState<string>('$12');
  const packs = ['$12', '$20', '$25', '$40', '$60'];

//   const navigate = useNavigate(); // ✅ Added
  const handleBuyNow = () => {
    // navigate('/checkout');
  };

  return (
    <section className="max-w-6xl mx-auto p-4 mt-6">

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <img
      src={ClashImage}
      alt="Clash of Clans"
      className="rounded-xl shadow-lg w-full object-cover max-h-[400px] sm:max-h-[500px]"
    />

    <div className="flex flex-col justify-between">
      <div>
        {/************************* Title + actions */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Clash of clan</h2>
            <p className="text-gray-500 text-sm">Supercell</p>
          </div>

          <div className="flex items-center gap-3 text-gray-500 text-lg">
            <div className="flex items-center gap-1">
              <Heart className="text-pink-500" />
              <span className="text-sm">109</span>
            </div>
            <ExternalLink className="cursor-pointer hover:text-blue-500" />
          </div>
        </div>

        {/************************************ Price,rating */}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            $12 <span className="text-gray-400 line-through text-base sm:text-lg ml-1">$71.56</span>
          </div>

          <div className="flex items-center gap-1 text-yellow-500">
            <Star color='yellow' fill=''/>
            <span className="text-sm font-semibold text-black">4.8</span>
            <button className="text-blue-600 text-sm underline ml-1">67 Reviews</button>
          </div>
        </div>

        <p className="mt-1 text-green-600 text-sm font-medium">93% of buyers have recommended this.</p>

        {/****************************************** Choose a Pack */}
        <div className="my-4">
          <p className="text-gray-700 font-medium mb-2">Choose a Pack</p>

          <div className="flex flex-wrap gap-2 items-center">
            {packs.map((pack) => (
              <label
                key={pack}
                className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm cursor-pointer transition-all duration-150
                  ${selectedPack === pack ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border'}
                  shadow-sm`}
                style={{ borderWidth: selectedPack === pack ? 1 : 1 }}
              >
                <input
                  type="radio"
                  name="pack"
                  value={pack}
                  checked={selectedPack === pack}
                  onChange={() => setSelectedPack(pack)}
                  className="sr-only"
                />
                <span className="text-sm">{pack}</span>
              </label>
            ))}
          </div>
        </div>

        
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={handleBuyNow}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 w-full sm:w-auto"
          >
            Add To Cart
          </button>
          <button 
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-100 w-full sm:w-auto"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default ProductInfo;
