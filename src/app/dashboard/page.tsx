import Documents from "../../components/Documents"

export const dynamic = "force-dynamic";

function Dashboard() {
  return (
    <div className="h-full max-w-7xl mx-10">
      <h1 className="text-3xl p-5 bg-gray-100 font-extralight text-blue-600">
        My Documents
      </h1>

      <Documents />
    </div>
  );
}
export default Dashboard;