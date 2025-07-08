import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [breweries, setBreweries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filteredBreweries, setFilteredBreweries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://api.openbrewerydb.org/v1/breweries?per_page=50"
        );

        const data = await res.json();
        setBreweries(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let result = breweries;
    if (searchQuery) {
      result = result.filter((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterType !== "All") {
      result = result.filter((b) => b.brewery_type === filterType);
    }
    setFilteredBreweries(result);
  }, [searchQuery, filterType, breweries]);

  // Summary statistics
  const totalBreweries = filteredBreweries.length;
  const averageNameLength =
    filteredBreweries.reduce((sum, b) => sum + b.name.length, 0) /
    (filteredBreweries.length || 1);

  const cityCounts = filteredBreweries.reduce((acc, b) => {
    acc[b.city] = (acc[b.city] || 0) + 1;
    return acc;
  }, {});
  const mostCommonCity =
    Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return (
    <div className="app-container">
      <h1> 🍺 Brewery Dashboard 🍺</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="micro">Micro</option>
          <option value="regional">Regional</option>
          <option value="brewpub">Brewpub</option>
          <option value="contract">Contract</option>
        </select>
      </div>

      <div className="summary">
        <h3>Total Breweries: {totalBreweries}</h3>
        <h3>Average Name Length: {averageNameLength.toFixed(2)}</h3>
        <h3>Most Common City: {mostCommonCity}</h3>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>City</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {filteredBreweries.slice(0, 10).map((brewery) => (
            <tr key={brewery.id}>
              <td>{brewery.name}</td>
              <td>{brewery.brewery_type}</td>
              <td>{brewery.city}</td>
              <td>{brewery.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
