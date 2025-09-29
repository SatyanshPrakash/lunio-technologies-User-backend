import { useState } from 'react';
import FeedbackChart from './FeedbackChart';
import type { Review as ReviewType } from '../types';

const reviews: ReviewType[] = [
  {
    id: 1,
    name: 'Nicolas Cage',
    rating: 5,
    comment:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.',
    timeAgo: '1 hour ago',
  },
  {
    id: 2,
    name: 'Robert Downey Jr.',
    rating: 4,
    comment:
      'To take a trivial example, which of us ever undertakes laborious physical exercise...',
    timeAgo: '5 days ago',
  },
];

const Review = () => {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  return (
    <section className="max-w-6xl mx-auto mt-12 p-4">

      <div className="flex space-x-8 border-b">
        <button
          onClick={() => setActiveTab('description')}
          className={`pb-2 border-b-2 transition duration-300 ${
            activeTab === 'description'
              ? 'border-blue-500 text-blue-500 font-medium'
              : 'border-transparent hover:border-blue-500 hover:text-blue-500'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-2 border-b-2 transition duration-300 ${
            activeTab === 'reviews'
              ? 'border-blue-500 text-blue-500 font-medium'
              : 'border-transparent hover:border-blue-500 hover:text-blue-500'
          }`}
        >
          Reviews
        </button>
      </div>


      <div className="mt-6">
        {activeTab === 'description' ? (
          <p className="text-sm text-gray-700">
            This is a detailed description of the product. It includes features, usage
            instructions, and everything you need to know before purchasing.
          </p>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-4">Customers Feedback</h3>

            <div className="flex flex-col md:flex-row gap-6">

              {/**************************** Left: Average Score */}
              <div className="md:w-1/3 text-center border rounded p-4 shadow">
                <p className="text-5xl font-bold text-blue-600">4.8</p>
                <p className="text-sm text-gray-500 mt-1">Product Rating</p>
              </div>

              <div className="md:w-2/3">
                <FeedbackChart />
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Review</h3>
            <div className="space-y-6">
              {reviews.map((r) => (
                <div key={r.id} className="border rounded p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{r.name}</h4>
                    <span className="text-sm text-gray-400">{r.timeAgo}</span>
                  </div>
                  <div className="text-yellow-500 mt-2">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{r.comment}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button className="text-blue-600 hover:underline">View all reviews</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Review;
