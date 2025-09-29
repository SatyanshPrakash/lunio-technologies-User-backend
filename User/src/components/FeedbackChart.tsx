const feedbackData = [
  { stars: 5, percent: 79 },
  { stars: 4, percent: 15 },
  { stars: 3, percent: 4 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 0 },
];

const FeedbackChart = () => {
  return (
    <div className="space-y-3">
      {feedbackData.map((item) => (
        <div key={item.stars} className="flex items-center">
          <span className="w-10 text-sm">{item.stars} ★</span>
          <div className="flex-1 h-3 mx-2 bg-gray-200 rounded">
            <div
              className="h-3 bg-yellow-400 rounded"
              style={{ width: `${item.percent}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">{item.percent}%</span>
        </div>
      ))}
    </div>
  );
};

export default FeedbackChart;
