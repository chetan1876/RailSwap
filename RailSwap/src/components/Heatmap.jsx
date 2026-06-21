<div className="relative bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">

  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <div>
      <p className="text-sm font-medium text-gray-500">
        Coach Heatmap
      </p>
      <h2 className="text-2xl font-bold text-gray-900">
        Crowd Density
      </h2>
    </div>

    <div className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold">
      Live
    </div>
  </div>

  {/* Heatmap Grid */}
  <div className="grid grid-cols-4 gap-3">

    <div className="h-16 rounded-2xl bg-green-200 flex items-center justify-center font-semibold">
      A1
    </div>

    <div className="h-16 rounded-2xl bg-yellow-200 flex items-center justify-center font-semibold">
      A2
    </div>

    <div className="h-16 rounded-2xl bg-orange-300 flex items-center justify-center font-semibold">
      A3
    </div>

    <div className="h-16 rounded-2xl bg-red-400 text-white flex items-center justify-center font-semibold">
      A4
    </div>

    <div className="h-16 rounded-2xl bg-green-300 flex items-center justify-center font-semibold">
      B1
    </div>

    <div className="h-16 rounded-2xl bg-yellow-300 flex items-center justify-center font-semibold">
      B2
    </div>

    <div className="h-16 rounded-2xl bg-orange-400 flex items-center justify-center font-semibold">
      B3
    </div>

    <div className="h-16 rounded-2xl bg-red-500 text-white flex items-center justify-center font-semibold">
      B4
    </div>

  </div>

  {/* Legend */}
  <div className="flex items-center gap-4 mt-6 text-sm">
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-green-300"></span>
      Low
    </div>

    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-yellow-300"></span>
      Medium
    </div>

    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-orange-400"></span>
      High
    </div>

    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-red-500"></span>
      Full
    </div>
  </div>

  {/* Bottom Line */}
  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"></div>

</div>