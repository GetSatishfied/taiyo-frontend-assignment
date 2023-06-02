import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { useQuery } from 'react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Chart, { ChartConfiguration, ChartData, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js/auto';
import '../styles/ChartsAndMapsPage.css';
import "leaflet/dist/leaflet.css"
// import marker from "./marker.svg"
Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title);

const fetchWorldData = async () => {
  const response = await fetch('https://disease.sh/v3/covid-19/all');
  return response.json();
};

const fetchCountryData = async () => {
  const response = await fetch('https://disease.sh/v3/covid-19/countries');
  return response.json();
};

const fetchGraphData = async () => {
  const response = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all');
  return response.json();
};

const ChartsAndMapsPage: React.FC = () => {
  const { data: worldData } = useQuery('worldData', fetchWorldData);
  const { data: countryData } = useQuery('countryData', fetchCountryData);
  const { data: graphData } = useQuery('graphData', fetchGraphData);

  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (graphData) {
      const chartData: ChartData<'line', number[], string> = {
        labels: Object.keys(graphData.cases),
        datasets: [
          {
            label: 'COVID-19 Cases',
            data: Object.values(graphData.cases),
            backgroundColor: 'white',
          },
        ],
      };

      const canvas = document.getElementById('myChart') as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      if (context) {
        // Destroy the existing chart instance if it exists
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        // Create a new chart instance
        chartInstanceRef.current = new Chart(context, {
          type: 'line',
          data: chartData,
        });
      }
    }
  }, [graphData]);

  // const customIcon = L.icon({
  //   iconUrl: marker,
  //   iconSize: [20, 20],
  // });

  return (
    <div id='charts_page_div'>
      <Box>
      {/* <h1>Charts and Maps Page</h1> */}
        <Box>
          <h2>Worldwide Cases</h2>
          {worldData && (
            <div>
              <p>Total Cases: <strong>{worldData.cases}</strong></p>
              <p>Total Recovered: <strong>{worldData.recovered}</strong></p>
              <p>Total Deaths: <strong>{worldData.deaths}</strong></p> <br />
            </div>
          )}
          {window.innerWidth > 900 ? <canvas id="myChart" width="800" height="300"></canvas> : <canvas id="myChart" width="400" height="400"></canvas>}

        </Box>
        <br />
        <Box>
          <h2>Country-wise Cases</h2>
          <Box>
            <MapContainer center={[0, 0]} zoom={2}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {countryData &&
                countryData.map((country: any) => (
                  <Marker key={country.country} position={[country.countryInfo.lat, country.countryInfo.long]}>
                    <Popup>
                      <h4>Name: {country.country}</h4>
                      <p>Active Cases: {country.active}</p>
                      <p>Recovered Cases: {country.recovered}</p>
                      <p>Deaths: {country.deaths}</p>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </Box>
        </Box>

      </Box>



    </div>
  );
};

export default ChartsAndMapsPage;
