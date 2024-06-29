import "./App.css";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
// import { response } from "express";

const API_URL = import.meta.env.VITE_API_URL;

defaults.plugins.title.display = true;
defaults.plugins.title.align = 'center';
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = 'black';

function Dashboard() {
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    end_year:'',
    topic: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    country: '',
  });

  useEffect(() => {
    applyFilters(); // Initial fetch on component mount
  }, [filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/data`);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const applyFilters = async () => {
    try {
      const data = await fetchData();

      let updatedData = data;

      // Apply filters based on current state
      if (filters.end_year) {
        updatedData = updatedData.filter(item => item.end_year.includes(filters.end_year));
      }
      if (filters.topic) {
        updatedData = updatedData.filter(item => item.topic.includes(filters.topic));
      }
      if (filters.sector) {
        updatedData = updatedData.filter(item => item.sector.includes(filters.sector));
      }
      if (filters.region) {
        updatedData = updatedData.filter(item => item.region.includes(filters.region));
      }
      if (filters.pestle) {
        updatedData = updatedData.filter(item => item.pestle.includes(filters.pestle));
      }
      if (filters.source) {
        updatedData = updatedData.filter(item => item.source.includes(filters.source));
      }
      if (filters.country) {
        updatedData = updatedData.filter(item => item.country.includes(filters.country));
      }

      setFilteredData(updatedData);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(filters => ({
      ...filters,
      [name]: value
    }));
  };

  const chartData = {
    labels: filteredData.map(item => item.country),
    datasets: [
      {
        label: 'Intensity',
        data: filteredData.map(item => item.intensity),
        backgroundColor: '#03045e'
      },
      {
        label: 'Likelihood',
        data: filteredData.map(item => item.likelihood),
        backgroundColor: '#fca311'
      },
      {
        label: 'Relevance',
        data: filteredData.map(item => item.relevance),
        backgroundColor: '#7209b7'
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="filters">
        <div className="filter-label">
          End Year:
          <input type='text' name="end_year" value={filters.end_year} onChange={handleFilterChange} />
        </div>
        <div className="filter-label">
          Topic:
          <input type="text" placeholder="e.g oil/market/gas" name="topic" value={filters.topic} onChange={handleFilterChange} />
        </div>
        <div className="filter-label">
          Sector:
          <input type="text" placeholder="e.g Environment/Energy" name="sector" value={filters.sector} onChange={handleFilterChange} />
        </div>
        <div className="filter-label">
          Region:
          <input type="text" placeholder="e.g World/Central America" name="region" value={filters.region} onChange={handleFilterChange} />
        </div>
        <div className="filter-label">
          Pestle:
          <input type="text" placeholder="e.g Industries/Economic" name="pestle" value={filters.pestle} onChange={handleFilterChange} />
        </div>
        <div className="filter-label">
          Source:
          <input type="text" placeholder="e.g SBWire/EIA" name="source" value={filters.source} onChange={handleFilterChange} />
        </div>
        <div className="filter-label">
          Country:
          <input type="text" placeholder="e.g United States of America" name="country" value={filters.country} onChange={handleFilterChange} />
        </div>
      </div>
      <div className="chart-container">
        <Bar 
          data={chartData}
          options={{
            plugins: {
              title: {
                text: 'Intensity, Likelihood & Relevance',
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard
