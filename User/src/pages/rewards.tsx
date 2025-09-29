import { useState } from "react";
// import { FaGift, FaWallet, FaStar, FaShoppingCart } from "react-icons/fa";
import { ShoppingCart, Star, Gift, Wallet } from 'lucide-react';

export default function RewardsPage() {
  const [points] = useState(88);

  return (
    <div className="w-full min-h-screen font-sans">
      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500 text-white">
        <h1 className="text-4xl font-bold mb-4">Earn While You Order!</h1>
        <p className="mb-6 text-lg">
          Get exciting rewards and discounts on every purchase.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-8 mb-6">
          <div>
            <p className="font-bold text-3xl">50K+</p>
            <span className="text-sm">Happy Customers</span>
          </div>
          <div>
            <p className="font-bold text-3xl">₹2M+</p>
            <span className="text-sm">Rewards Earned</span>
          </div>
          <div>
            <p className="font-bold text-3xl">95%</p>
            <span className="text-sm">Satisfaction Rate</span>
          </div>
        </div>
        <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600">
          Explore Offers
        </button>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6 text-gray-800">
        <h2 className="text-center text-3xl font-bold mb-10">
          How Rewards Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-center">
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <ShoppingCart size={40} className="text-gray-700 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Order Online</h3>
            <p className="text-sm text-gray-600">
              Place an order on our platform and start your rewards journey.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <Star size={40} className="text-gray-700 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Earn Points</h3>
            <p className="text-sm text-gray-600">
              Earn reward points with every purchase you make.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <Gift size={40} className="text-gray-700 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Redeem & Save</h3>
            <p className="text-sm text-gray-600">
              Redeem points for discounts or amazing gifts.
            </p>
          </div>
        </div>
      </section>

      {/* Rewards Tiers */}
      <section className="py-16 px-6 bg-white text-gray-800">
        <h2 className="text-center text-3xl font-bold mb-10">
          Rewards Tiers
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-center">
          <div className="p-8 rounded-2xl border-t-4 border-orange-400 bg-white shadow-md">
            <h3 className="font-bold text-lg mb-2">Bronze</h3>
            <p className="text-sm text-gray-600">
              1 point per ₹100 spent <br /> Start earning rewards today!
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
  <div className="bg-orange-400 h-2 rounded-full" style={{ width: "60%" }}></div>
</div>
<p className="text-xs text-gray-500 mt-2">₹6,000 / ₹10,000 to Silver</p>

</div>
          <div className="p-8 rounded-2xl border-t-4 border-gray-500 bg-white shadow-md">
            <h3 className="font-bold text-lg mb-2">Silver</h3>
            <p className="text-sm text-gray-600">
              2 points per ₹100 spent <br /> Double your rewards!
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
  <div className="bg-orange-400 h-2 rounded-full" style={{ width: "0%" }}></div>
</div>
<p className="text-xs text-gray-500 mt-2">₹0 / ₹25,000 to Gold</p>

          </div>
          <div className="p-8 rounded-2xl border-t-4 border-yellow-500 bg-white shadow-md">
            <h3 className="font-bold text-lg mb-2">Gold</h3>
            <p className="text-sm text-gray-600">
              3 points per ₹100 spent <br /> + Free delivery on all orders!
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
  <div className="bg-orange-400 h-2 rounded-full" style={{ width: "0%" }}></div>
</div>
<p className="text-xs text-gray-500 mt-2">₹0 / ₹25,000 spent</p>

          </div>
        </div>
      </section>

      {/* Limited-Time Discounts */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white">
        <h2 className="text-center text-3xl font-bold mb-10">
          Limited-Time Discounts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-center">
          <div className="relative bg-transparent border border-white p-8 rounded-2xl shadow text-white">
  <span className="absolute top-2 right-2 bg-red-500 text-xs font-bold px-2 py-1 rounded-full">
    NEW
  </span>
  <ShoppingCart size={30} className="mx-auto mb-4" />
  <h3 className="font-bold mb-2">10% Off on First Order</h3>
  <p className="text-sm mb-4">New customers get instant 10% discount on their first</p>
  <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg">
    Claim Offer
  </button>
</div>

          <div className="relative bg-transparent border border-white p-8 rounded-2xl shadow text-white">
  <span className="absolute top-2 right-2 bg-red-500 text-xs font-bold px-2 py-1 rounded-full">
    HOT
  </span>
  <ShoppingCart size={30} className="mx-auto mb-4" />
  <h3 className="font-bold mb-2">Flat ₹50 off on Order Above ₹499</h3>
  <p className="text-sm mb-4">Save big on your favorite meals with our bulk order discount!</p>
  <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg">
    Claim Offer
  </button>
</div>

          <div className="relative bg-transparent border border-white p-8 rounded-2xl shadow text-white">
  <span className="absolute top-2 right-2 bg-red-500 text-xs font-bold px-2 py-1 rounded-full">
    POPULAR
  </span>
  <ShoppingCart size={30} className="mx-auto mb-4" />
  <h3 className="font-bold mb-2">Refer & Earn - Get ₹100 for Every Friend!</h3>
  <p className="text-sm mb-4">Share the love and earn rewards for each friend who joins!</p>
  <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg">
   Share Now
  </button>
</div>

        </div>
      </section>

      {/* Rewards Wallet */}
      <section className="py-16 px-6 bg-white text-gray-800">
        <h2 className="text-center text-3xl font-bold mb-10">
          Your Rewards Wallet
        </h2>
        <div className="max-w-sm mx-auto bg-gray-50 p-10 rounded-2xl shadow text-center">
          <Wallet size={50} className="text-indigo-600 mx-auto mb-4" />
          <p className="text-4xl font-bold mb-2 text-yellow-500">{points}</p>
          <p className="text-sm mb-6">Points Available</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-bold text-lg">150</p>
              <span className="text-gray-600">Earned This Month</span>
            </div>
            <div>
              <p className="font-bold text-lg">70</p>
              <span className="text-gray-600">From Referrals</span>
            </div>
            <div>
              <p className="font-bold text-lg">₹22</p>
              <span className="text-gray-600">Cash Value</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-gray-50 text-gray-800">
        <h2 className="text-center text-3xl font-bold mb-10">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "How can I earn points?",
              a: "You earn points by placing online orders.",
            },
            {
              q: "Can I combine discount codes?",
              a: "No, only one discount code can be applied at a time.",
            },
            {
              q: "How long are points valid?",
              a: "Points are valid for 12 months from the date of earning.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg overflow-hidden"
            >
              <button className="w-full text-left px-6 py-4 font-semibold flex justify-between items-center">
                {faq.q} <span className="font-bold text-xl">+</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
