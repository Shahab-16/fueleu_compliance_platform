const compareData = [
  { routeId: "R001", baseline: 91.0, comparison: 89.2 },
  { routeId: "R002", baseline: 91.0, comparison: 88.0 },
  { routeId: "R003", baseline: 91.0, comparison: 93.5 },
];

const ComparePage = () => {
  const target = 89.3368;

  return (
    <div className="space-y-8 font-[Inter]">
      <h1 className="text-3xl font-semibold font-[Poppins] text-gray-800">Compare Routes</h1>
      <p className="text-gray-600">Baseline vs comparison GHG intensities and compliance check.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="px-4 py-3">Route ID</th>
              <th className="px-4 py-3">Baseline (gCO₂e/MJ)</th>
              <th className="px-4 py-3">Comparison</th>
              <th className="px-4 py-3">% Difference</th>
              <th className="px-4 py-3">Compliant</th>
            </tr>
          </thead>
          <tbody>
            {compareData.map((d) => {
              const percentDiff = ((d.comparison / d.baseline - 1) * 100).toFixed(2);
              const compliant = d.comparison <= target;
              return (
                <tr key={d.routeId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{d.routeId}</td>
                  <td className="px-4 py-2">{d.baseline}</td>
                  <td className="px-4 py-2">{d.comparison}</td>
                  <td className="px-4 py-2">{percentDiff}%</td>
                  <td className={`px-4 py-2 font-semibold ${compliant ? "text-green-600" : "text-red-600"}`}>
                    {compliant ? "✅ Yes" : "❌ No"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
