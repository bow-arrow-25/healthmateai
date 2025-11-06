const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET /api/weather/current
// @desc    Get current weather and health recommendations
// @access  Public
router.get('/current', async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    if (!lat && !lon && !city) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide latitude and longitude or city name' 
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    
    // If no API key or invalid key, return mock data
    if (!apiKey || apiKey === 'demo' || apiKey === 'your_openweathermap_api_key') {
      return res.json({
        success: true,
        weather: {
          temperature: 25,
          humidity: 65,
          condition: 'Partly Cloudy',
          feelsLike: 27,
          windSpeed: 12,
          uvIndex: 6
        },
        healthRecommendations: getHealthRecommendations(25, 65, 'Partly Cloudy', 6),
        note: 'Using demo weather data. Add WEATHER_API_KEY to .env for real data.'
      });
    }

    let weatherUrl;
    if (city) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    } else {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    }

    const response = await axios.get(weatherUrl);
    const data = response.data;

    const weather = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      feelsLike: data.main.feels_like,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure
    };

    // Get UV index if available
    let uvIndex = 5; // default moderate
    try {
      const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`;
      const uvResponse = await axios.get(uvUrl);
      uvIndex = uvResponse.data.value;
    } catch (err) {
      console.log('UV index not available');
    }

    const healthRecommendations = getHealthRecommendations(
      weather.temperature,
      weather.humidity,
      weather.condition,
      uvIndex
    );

    res.json({
      success: true,
      weather: { ...weather, uvIndex },
      healthRecommendations
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    
    // Return mock data on error instead of failing
    return res.json({
      success: true,
      weather: {
        temperature: 25,
        humidity: 65,
        condition: 'Partly Cloudy',
        feelsLike: 27,
        windSpeed: 12,
        uvIndex: 6
      },
      healthRecommendations: getHealthRecommendations(25, 65, 'Partly Cloudy', 6),
      note: 'Using demo weather data due to API error. Please check your WEATHER_API_KEY.'
    });
  }
});

// Generate health recommendations based on weather
function getHealthRecommendations(temperature, humidity, condition, uvIndex) {
  const recommendations = [];

  // Temperature-based recommendations
  if (temperature > 35) {
    recommendations.push({
      type: 'warning',
      title: 'Extreme Heat Alert',
      message: 'Stay hydrated and avoid prolonged sun exposure. Risk of heat stroke is high.',
      icon: '🌡️'
    });
  } else if (temperature > 30) {
    recommendations.push({
      type: 'caution',
      title: 'Hot Weather',
      message: 'Drink plenty of water and wear light clothing. Limit outdoor activities during peak hours.',
      icon: '☀️'
    });
  } else if (temperature < 10) {
    recommendations.push({
      type: 'caution',
      title: 'Cold Weather',
      message: 'Dress warmly in layers. Cold weather can trigger asthma and worsen joint pain.',
      icon: '❄️'
    });
  } else if (temperature < 0) {
    recommendations.push({
      type: 'warning',
      title: 'Freezing Conditions',
      message: 'Risk of hypothermia and frostbite. Minimize outdoor exposure.',
      icon: '🥶'
    });
  }

  // Humidity-based recommendations
  if (humidity > 80) {
    recommendations.push({
      type: 'info',
      title: 'High Humidity',
      message: 'High humidity can worsen respiratory conditions. Use dehumidifier if needed.',
      icon: '💧'
    });
  } else if (humidity < 30) {
    recommendations.push({
      type: 'info',
      title: 'Low Humidity',
      message: 'Dry air can irritate airways. Stay hydrated and consider using a humidifier.',
      icon: '🏜️'
    });
  }

  // UV Index recommendations
  if (uvIndex >= 8) {
    recommendations.push({
      type: 'warning',
      title: 'Very High UV Index',
      message: 'Wear sunscreen (SPF 30+), sunglasses, and protective clothing. Seek shade during midday.',
      icon: '🕶️'
    });
  } else if (uvIndex >= 6) {
    recommendations.push({
      type: 'caution',
      title: 'High UV Index',
      message: 'Apply sunscreen and wear a hat if going outside for extended periods.',
      icon: '🧴'
    });
  }

  // Condition-based recommendations
  if (condition.toLowerCase().includes('rain')) {
    recommendations.push({
      type: 'info',
      title: 'Rainy Weather',
      message: 'Wet weather can increase joint pain for arthritis patients. Stay dry and warm.',
      icon: '🌧️'
    });
  }

  if (condition.toLowerCase().includes('snow')) {
    recommendations.push({
      type: 'caution',
      title: 'Snowy Conditions',
      message: 'Be careful of slips and falls. Cold air can trigger asthma attacks.',
      icon: '🌨️'
    });
  }

  // General recommendations
  recommendations.push({
    type: 'success',
    title: 'Stay Healthy',
    message: 'Maintain a balanced diet rich in vitamins C and D to boost your immune system.',
    icon: '🥗'
  });

  return recommendations;
}

// @route   GET /api/weather/air-quality
// @desc    Get air quality data and health recommendations
// @access  Public
router.get('/air-quality', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide latitude and longitude' 
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    
    // If no API key, return mock data
    if (!apiKey || apiKey === 'demo' || apiKey === 'your_openweathermap_api_key') {
      return res.json({
        success: true,
        airQuality: {
          aqi: 3,
          category: 'Moderate',
          pm25: 35,
          pm10: 45,
          no2: 25,
          o3: 60
        },
        healthRecommendations: getAirQualityRecommendations(3),
        note: 'Using demo air quality data. Add WEATHER_API_KEY to .env for real data.'
      });
    }

    const airQualityUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await axios.get(airQualityUrl);
    const data = response.data;

    const airQuality = {
      aqi: data.list[0].main.aqi,
      category: getAQICategory(data.list[0].main.aqi),
      pm25: data.list[0].components.pm2_5,
      pm10: data.list[0].components.pm10,
      no2: data.list[0].components.no2,
      o3: data.list[0].components.o3,
      co: data.list[0].components.co
    };

    const healthRecommendations = getAirQualityRecommendations(airQuality.aqi);

    res.json({
      success: true,
      airQuality,
      healthRecommendations
    });
  } catch (error) {
    console.error('Air quality API error:', error.message);
    
    // Return mock data on error
    return res.json({
      success: true,
      airQuality: {
        aqi: 2,
        category: 'Good',
        pm25: 15,
        pm10: 25,
        no2: 15,
        o3: 40
      },
      healthRecommendations: getAirQualityRecommendations(2),
      note: 'Using demo air quality data due to API error.'
    });
  }
});

// Get AQI category
function getAQICategory(aqi) {
  switch(aqi) {
    case 1: return 'Good';
    case 2: return 'Fair';
    case 3: return 'Moderate';
    case 4: return 'Poor';
    case 5: return 'Very Poor';
    default: return 'Unknown';
  }
}

// Generate air quality health recommendations
function getAirQualityRecommendations(aqi) {
  const recommendations = [];

  if (aqi === 1) {
    recommendations.push({
      type: 'success',
      title: 'Excellent Air Quality',
      message: 'Air quality is excellent. Perfect for outdoor activities!',
      icon: '🌿'
    });
  } else if (aqi === 2) {
    recommendations.push({
      type: 'success',
      title: 'Good Air Quality',
      message: 'Air quality is good. Enjoy your outdoor activities.',
      icon: '✅'
    });
  } else if (aqi === 3) {
    recommendations.push({
      type: 'caution',
      title: 'Moderate Air Quality',
      message: 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exposure.',
      icon: '⚠️'
    });
  } else if (aqi === 4) {
    recommendations.push({
      type: 'warning',
      title: 'Poor Air Quality',
      message: 'Air pollution is high. Everyone should reduce prolonged outdoor exertion. Wear a mask if going outside.',
      icon: '😷'
    });
  } else if (aqi === 5) {
    recommendations.push({
      type: 'danger',
      title: 'Very Poor Air Quality',
      message: 'Air quality is hazardous. Avoid outdoor activities. Keep windows closed and use air purifiers.',
      icon: '🚨'
    });
  }

  return recommendations;
}

module.exports = router;
