import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [breweries, setBreweries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filteredBreweries, setFilteredBreweries] = useState([]);
  const [selectedState, setSelectedState] = useState("All");

  const typeCounts = filteredBreweries.reduce((acc, b) => {
    const type = b.brewery_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
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

    if (selectedState !== "All") {
      result = result.filter((b) => b.state === selectedState);
    }

    setFilteredBreweries(result);
  }, [searchQuery, filterType, selectedState, breweries]);

  // Summary statistics
  const totalBreweries = filteredBreweries.length;
  const mostCommonType =
    Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

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
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="All">All States</option>
          <option value="California">California</option>
          <option value="Texas">Texas</option>
          <option value="New York">New York</option>
          <option value="Colorado">Colorado</option>
          <option value="Oregon">Oregon</option>
          <option value="Washington">Washington</option>
          <option value="Idaho">Idaho</option>
        </select>
      </div>

      <div className="summary">
        <div className="summary-box">
          <h3>Total Breweries</h3>
          <p>{totalBreweries}</p>
        </div>
        <div className="summary-box">
          <h3>Most Common Type</h3>
          <p>{mostCommonType}</p>
        </div>
        <div className="summary-box">
          <h3>Most Common City</h3>
          <p>{mostCommonCity}</p>
        </div>
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
