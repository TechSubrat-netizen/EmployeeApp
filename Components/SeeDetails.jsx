import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';
import { useNavigation } from '@react-navigation/native';

function SeeDetails() {
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [qrValue, setQRvalue] = useState('');
  const qrRef = useRef();
  const navigation=useNavigation()
  const fetchAllDetails = async () => {
    const storedCity = await AsyncStorage.getItem('city');
    const storedName = await AsyncStorage.getItem('name');
    const storedQR = await AsyncStorage.getItem('qrvalue');
    setCity(storedCity || '');
    setName(storedName || '');
    setQRvalue(storedQR || '');
  };

  useEffect(() => {
    fetchAllDetails();
  }, []);

  const isDataAvailable = () => {
    return qrValue !== '' || city !== '' || name !== '';
  };

  const captureQR = async () => {
    if (qrRef.current) {
      const uri = await qrRef.current.capture();
      const base64 = await RNFS.readFile(uri, 'base64');
      return base64;
    }
    return '';
  };  

  const printPDF = async () => {
    if (!isDataAvailable()) {
      Alert.alert('No Data', 'No data available to generate PDF.');
      return;
    }
  
    const qrBase64 = await captureQR();
  
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <img src="https://i.ibb.co/TqpMh2DM/ciya.jpg" alt="ciya" style="height: 100px; width: 100px;" />
          <img src="data:image/png;base64,${qrBase64}" style="height: 100px; width: 100px;" />
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; margin-top: 20px;">
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Name:</strong> ${name}</p>
        </div>
        <div style="margin-top: 80px; text-align: right;">
          <p><strong>Signature</strong></p>
          <p>not required</p>
        </div>
      </div>
    `;
  
    try {
      const results = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: 'user_details',
        directory: 'Documents',
        base64: true,
      });
  
      if (results.filePath) {
        await RNPrint.print({ filePath: results.filePath });
       
      } else {
        Alert.alert('Error', 'Failed to generate PDF.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'An error occurred while generating PDF.');
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.textView}>
          {isDataAvailable() ? (
            <>
              <Text style={styles.text}>
                QR Code Value: <Text style={styles.innerText}>{qrValue}</Text>
              </Text>
              <Text style={styles.text}>
                City: <Text style={styles.innerText}>{city}</Text>
              </Text>
              <Text style={styles.text}>
                Name: <Text style={styles.innerText}>{name}</Text>
              </Text>
            </>
          ) : (
            <Text style={styles.noDataText}>No data available</Text>
          )}
        </View>

    
        <View style={{ position: 'absolute', left: -9999 }}>
          <ViewShot ref={qrRef} options={{ format: 'png', result: 'tmpfile' }}>
            <QRCode value={qrValue || 'default'} size={100} />
          </ViewShot>
        </View>

        <TouchableOpacity
          style={[
            styles.buttonStyle,
            !isDataAvailable() && { backgroundColor: '#aaa' },
          ]}
          onPress={printPDF}
          disabled={!isDataAvailable()}
        >
          <Text style={styles.buttonText}>Print PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textView: {
    width: '95%',
    alignSelf: 'center',
    gap: 10,
    marginBottom: 20,
  },
  text: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  innerText: {
    color: 'gray',
    fontSize: 15,
  },
  noDataText: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#4682B4',
    padding: 12,
    width: 300,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SeeDetails;
