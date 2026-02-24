export default function ResortCard({ resort }: any) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold">{resort.name}</h2>
      <p>{resort.locationCountry} – {resort.locationRegion}</p>
      <p>Elevation: {resort.elevationTopM} m</p>
      <p>Slopes: {resort.numberOfSlopes}</p>
      <p>Average Rating: {resort.averageOverallRating?.toFixed(1) || "N/A"}</p>
    </div>
  );
}