const API_KEY = `326a4d24b8ea440c273a506be4fcac60`;

const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("city");
const statusE1 = document.getElementById("status");
const card = document.getElementById("card");

const placeEl = document.getElementById("place");
const descEl = document.getElementById("desc");
const tempEl = document.getElementById("temp");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const iconEl = document.getElementById("icon");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (!city) {
    statusE1.textContent = "Please enter a city name.";
    card.classList.add("card-hidden");
    return;
  }

  statusE1.textContent = "Loading...";
  card.classList.add("card-hidden");
  setDisabled(true);

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 404) throw new Error("city not found.");
      if (res.status === 401) throw new Error("Invalid API key.");
      if (res.status === 429)
        throw new Error("Rate limit exceeded. Try later.");
      throw new Error(`Request failed (${res.status}).`);
    }

    const data = await res.json();
    renderWeather(data);
    statusE1.textContent = "";
    card.classList.remove("card-hidden");
  } catch (err) {
    statusE1.textContent = `${err.message || "Network error"}`;
  } finally {
    setDisabled(false);
  }
});

function renderWeather(data) {
  const { name, sys, weather, main, wind } = data;

  placeEl.textContent = `${name}, ${sys?.country ?? ""}`;
  descEl.textContent = weather?.[0]?.description ?? "—";
  tempEl.textContent = `${Math.round(main?.temp)}°C`;
  humidityEl.textContent = main?.humidity ?? "—";
  windEl.textContent = wind?.speed ?? "—";

  const icon = weather?.[0]?.icon; // e.g., "10d"
  iconEl.src = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : "";
  iconEl.alt = weather?.[0]?.main ?? "Weather";
}

function setDisabled(disabled) {
    form.querySelector("button").disabled = disabled;
    cityInput.disabled = disabled;
}
