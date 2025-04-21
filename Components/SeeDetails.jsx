import React, {useEffect, useState} from 'react';
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


function SeeDetails() {
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [qrValue, setQRvalue] = useState('');

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

  const printPDF = async () => {
    if (!isDataAvailable()) {
      Alert.alert('No Data', 'No data available to generate PDF.');
      return;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center;">User Details</h2>

        <p><strong>QR Code Value:</strong> ${qrValue}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Name:</strong> ${name}</p>

        <div style="margin-top: 80px; text-align: right;">
          <p><strong>Signature</strong></p>
          <p> not required</p>
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
        await RNPrint.print({filePath: results.filePath});
      } else {
        Alert.alert('Error', 'Failed to generate PDF.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'An error occurred while generating PDF.');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
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
        <View>
        <QRCode
      value="Just some string value"
      logo={{uri: qrValue}}
      logoSize={3}
     
    />
        </View>

        <TouchableOpacity
          style={[
            styles.buttonStyle,
            !isDataAvailable() && {backgroundColor: '#aaa'},
          ]}
          onPress={printPDF}
          disabled={!isDataAvailable()}>
          <Text style={styles.buttonText}>Download PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
