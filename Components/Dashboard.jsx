import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

function Dashboard() {
  const [data, setData] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  async function getCity() {
    try {
      const storedCity = await AsyncStorage.getItem('city');
      setCity(storedCity);
    } catch (error) {
      console.error('Error fetching city from AsyncStorage:', error);
    }
  }

  async function fetchWeather(city) {
    try {
      if (!city) return;
      setLoading(true);
      const API_KEY = '3eb1dca52d3838ef8fdac702ead19922';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.weather) {
        setData({
          weather: json.weather,
          city: json.name,
          temperature: json.main.temp,
        });
      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  return (
    <View style={styles.main}>
      <Text style={styles.heading}>🌦️ Weather Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cityText}>{city || 'No city selected'}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 10 }} />
        ) : data ? (
          <View style={styles.weatherContainer}>
            <Text style={styles.infoText}>City: {data.city}</Text>
            <Text style={styles.infoText}>Temp: {data.temperature}°C</Text>
            {data.weather.map((e, index) => (
              <Text key={index} style={styles.infoText}>
                {e.main} - {e.description}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No weather data found.</Text>
        )}
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Page1')}>
          <Text style={styles.buttonText}>➕ Add Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SeeDetails')}>
          <Text style={styles.buttonText}>📋 See Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#4a90e2',
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
  },
  cityText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 2,
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  weatherContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Dashboard;
