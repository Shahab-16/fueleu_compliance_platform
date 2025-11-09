import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RouteData {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
}

const AdminPage = () => {
  const [routes, setRoutes] = useState<RouteData[]>([
    // ✅ Initial dummy data loaded immediately
    { routeId: "R001", vesselType: "Container", fuelType: "HFO", year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500 },
    { routeId: "R002", vesselType: "BulkCarrier", fuelType: "LNG", year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200 },
    { routeId: "R003", vesselType: "Tanker", fuelType: "MGO", year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700 },
  ]);

  const [newRoute, setNewRoute] = useState<RouteData>({
    routeId: "",
    vesselType: "",
    fuelType: "",
    year: 2025,
    ghgIntensity: 0,
    fuelConsumption: 0,
    distance: 0,
    totalEmissions: 0,
  });

  // ✅ Persist data in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("routesData");
    if (saved) setRoutes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("routesData", JSON.stringify(routes));
  }, [routes]);

  // ✅ Add route with toast validation
  const handleAdd = () => {
    if (!newRoute.routeId || !newRoute.vesselType || !newRoute.fuelType) {
      toast.error("Please fill all required fields before adding!", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }

    setRoutes([...routes, newRoute]);
    setNewRoute({
      routeId: "",
      vesselType: "",
      fuelType: "",
      year: 2025,
      ghgIntensity: 0,
      fuelConsumption: 0,
      distance: 0,
      totalEmissions: 0,
    });

    toast.success("Route added successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // ✅ Delete route with toast
  const handleDelete = (id: string) => {
    setRoutes(routes.filter((r) => r.routeId !== id));
    toast.info("Route deleted", { position: "bottom-right", autoClose: 2000 });
  };

  return (
    <div className="space-y-8 font-[Inter] relative">
      <ToastContainer /> {/* ✅ Toast notifications */}

      <h1 className="text-3xl font-semibold text-gray-800 font-[Poppins]">Admin Panel</h1>
      <p className="text-gray-600">
        Manage dummy route data directly from the dashboard — no backend needed.
      </p>

      {/* Add Route Form */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold font-[Poppins] text-gray-800 mb-2">Add New Route</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "routeId", placeholder: "Route ID" },
            { name: "vesselType", placeholder: "Vessel Type" },
            { name: "fuelType", placeholder: "Fuel Type" },
            { name: "year", placeholder: "Year", type: "number" },
            { name: "ghgIntensity", placeholder: "GHG Intensity", type: "number" },
            { name: "fuelConsumption", placeholder: "Fuel (t)", type: "number" },
            { name: "distance", placeholder: "Distance (km)", type: "number" },
            { name: "totalEmissions", placeholder: "Emissions (t)", type: "number" },
          ].map((f) => (
            <input
              key={f.name}
              type={f.type || "text"}
              placeholder={f.placeholder}
              value={(newRoute as any)[f.name]}
              onChange={(e) =>
                setNewRoute({
                  ...newRoute,
                  [f.name]: f.type ? Number(e.target.value) : e.target.value,
                })
              }
              className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Add Route
        </button>
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="px-4 py-3">Route ID</th>
              <th className="px-4 py-3">Vessel Type</th>
              <th className="px-4 py-3">Fuel Type</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">GHG</th>
              <th className="px-4 py-3">Fuel</th>
              <th className="px-4 py-3">Distance</th>
              <th className="px-4 py-3">Emissions</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.routeId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{r.routeId}</td>
                <td className="px-4 py-2">{r.vesselType}</td>
                <td className="px-4 py-2">{r.fuelType}</td>
                <td className="px-4 py-2">{r.year}</td>
                <td className="px-4 py-2">{r.ghgIntensity}</td>
                <td className="px-4 py-2">{r.fuelConsumption}</td>
                <td className="px-4 py-2">{r.distance}</td>
                <td className="px-4 py-2">{r.totalEmissions}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(r.routeId)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
