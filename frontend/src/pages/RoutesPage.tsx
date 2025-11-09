const routesData = [
  { routeId: "R001", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500 },
  { routeId: "R002", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200 },
  { routeId: "R003", vesselType: "Tanker", fuelType: "MGO", year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700 },
  { routeId: "R004", vesselType: "RoRo", fuelType: "HFO", year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300 },
  { routeId: "R005", vesselType: "Container", fuelType: "LNG", year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400 },
];

const RoutesPage = () => {
  return (
    <div className="space-y-8 font-[Inter]">
      <h1 className="text-3xl font-semibold text-gray-800 font-[Poppins]">Routes Overview</h1>
      <p className="text-gray-600">All available vessel routes and emission metrics.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="px-4 py-3">Route ID</th>
              <th className="px-4 py-3">Vessel Type</th>
              <th className="px-4 py-3">Fuel Type</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">GHG Intensity</th>
              <th className="px-4 py-3">Fuel (t)</th>
              <th className="px-4 py-3">Distance (km)</th>
              <th className="px-4 py-3">Total Emissions (t)</th>
            </tr>
          </thead>
          <tbody>
            {routesData.map((r) => (
              <tr key={r.routeId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{r.routeId}</td>
                <td className="px-4 py-2">{r.vesselType}</td>
                <td className="px-4 py-2">{r.fuelType}</td>
                <td className="px-4 py-2">{r.year}</td>
                <td className="px-4 py-2">{r.ghgIntensity}</td>
                <td className="px-4 py-2">{r.fuelConsumption}</td>
                <td className="px-4 py-2">{r.distance}</td>
                <td className="px-4 py-2">{r.totalEmissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoutesPage;
