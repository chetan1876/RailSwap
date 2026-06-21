<div className="relative bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">

  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <div>
      <p className="text-sm font-medium text-gray-500">
        Reward Badges
      </p>
      <h2 className="text-2xl font-bold text-gray-900">
        Achievements
      </h2>
    </div>

    <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-2xl">
      🏆
    </div>
  </div>

  {/* Badges */}
  <div className="grid grid-cols-3 gap-4">

    <div className="flex flex-col items-center p-4 rounded-2xl bg-yellow-50 border border-yellow-100">
      <span className="text-3xl">🏆</span>
      <h4 className="mt-2 font-semibold text-gray-800">
        First Swap
      </h4>
      <p className="text-xs text-gray-500">
        1 Successful Swap
      </p>
    </div>

    <div className="flex flex-col items-center p-4 rounded-2xl bg-blue-50 border border-blue-100">
      <span className="text-3xl">🚆</span>
      <h4 className="mt-2 font-semibold text-gray-800">
        Traveler
      </h4>
      <p className="text-xs text-gray-500">
        20 Journeys
      </p>
    </div>

    <div className="flex flex-col items-center p-4 rounded-2xl bg-green-50 border border-green-100">
      <span className="text-3xl">🤝</span>
      <h4 className="mt-2 font-semibold text-gray-800">
        Helper
      </h4>
      <p className="text-xs text-gray-500">
        Helped Others
      </p>
    </div>

  </div>

  {/* Footer */}
  <div className="mt-6 flex items-center justify-between">
    <span className="text-sm text-gray-500">
      3 / 10 badges unlocked
    </span>

    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-semibold">
      30%
    </span>
  </div>

  {/* Bottom Gradient */}
  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>

</div>