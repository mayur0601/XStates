import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { getJSDocTypeParameterTags } from "typescript";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [city, setCity] = useState([]);
  const [address, setAddress] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetch("https://crio-location-selector.onrender.com/countries")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCountries(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      getStates();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      getCities();
    }
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      setAddress(true);
    }
  }, [selectedCountry, selectedState, selectedCity]);

  const getCities = () => {
    fetch(
      `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("cities are", data);
        setCity(data);
      })
      .catch((error) => console.log(error));
  };

  const getStates = () => {
    fetch(
      `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`,
    )
      .then((response) => response.json())
      .then((data) => {
        setStates(data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="container">
      <h1>Select Location</h1>
      <form className="form">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="dropdown"
        >
          <option value="" disabled>
            Select Country
          </option>
          {countries?.map((country, index) => {
            return (
              <option key={index} value={country}>
                {country}
              </option>
            );
          })}
        </select>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="dropdown"
          disabled={selectedCountry === ""}
        >
          <option value="" disabled>
            Select State
          </option>
          {states?.map((state, index) => {
            return (
              <option key={index} value={state}>
                {state}
              </option>
            );
          })}
        </select>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="dropdown"
          disabled={selectedState === "" || selectedCountry === ""}
        >
          <option value="" disabled>
            Select City
          </option>
          {city?.map((city, index) => {
            return (
              <option key={index} value={city}>
                {city}
              </option>
            );
          })}
        </select>
      </form>

      {address && (
        <div className="result">
          <span>
            <b>
              You selected{" "}
              <span style={{ fontSize: "30px" }}>{selectedCity},</span>{" "}
            </b>
          </span>
          <span style={{ color: "gray" }}>{selectedState}, </span>
          <span style={{ color: "gray" }}>{selectedCountry}</span>
        </div>
      )}
    </div>
  );
}
