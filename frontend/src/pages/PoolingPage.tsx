const poolingData = [
  { ship: "Vessel A", cb_before: 10000, cb_after: 8000 },
  { ship: "Vessel B", cb_before: -3000, cb_after: 0 },
  { ship: "Vessel C", cb_before: -7000, cb_after: -2000 },
];

const total = poolingData.reduce((acc, s) => acc + s.cb_after, 0);

const PoolingPage = () => {
  return (
    <div className="space-y-8 font-[Inter]">
      <h1 className="text-3xl font-semibold text-gray-800 font-[Poppins]">Pooling Overview</h1>
      <p className="text-gray-600">Simulated pool allocations and compliance adjustments.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="px-4 py-3">Ship</th>
              <th className="px-4 py-3">CB Before</th>
              <th className="px-4 py-3">CB After</th>
            </tr>
          </thead>
          <tbody>
            {poolingData.map((s) => (
              <tr key={s.ship} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{s.ship}</td>
                <td className="px-4 py-2">{s.cb_before}</td>
                <td className={`px-4 py-2 ${s.cb_after >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {s.cb_after}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={`mt-4 p-4 rounded-lg font-semibold text-center ${
          total >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}
      >
        Pool Total: {total >= 0 ? "✅ Positive Balance" : "❌ Deficit"}
      </div>
    </div>
  );
};

export default PoolingPage;
