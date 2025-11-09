const bankingData = {
  year: 2025,
  cb_before: 25000,
  applied: 5000,
  cb_after: 20000,
};

const BankingPage = () => {
  return (
    <div className="space-y-8 font-[Inter]">
      <h1 className="text-3xl font-semibold text-gray-800 font-[Poppins]">Banking Compliance Balance</h1>
      <p className="text-gray-600">
        Manage surplus and deficit balances according to Article 20 – Banking.
      </p>

      <div className="bg-white shadow-sm rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 font-[Poppins]">Year: {bankingData.year}</h2>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="p-4 border rounded-lg bg-blue-50">
            <p className="text-gray-600">CB Before</p>
            <p className="text-2xl font-semibold text-blue-700">{bankingData.cb_before.toLocaleString()}</p>
          </div>

          <div className="p-4 border rounded-lg bg-green-50">
            <p className="text-gray-600">Applied</p>
            <p className="text-2xl font-semibold text-green-700">{bankingData.applied.toLocaleString()}</p>
          </div>

          <div className="p-4 border rounded-lg bg-purple-50">
            <p className="text-gray-600">CB After</p>
            <p className="text-2xl font-semibold text-purple-700">{bankingData.cb_after.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingPage;
