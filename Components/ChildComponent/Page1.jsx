import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

const HEIGHT = Dimensions.get('window').height;
function Page1() {
  const [isActive, setIsActive] = useState(false);
  const {hasPermission, requestPermission} = useCameraPermission();
  const [text, setText] = useState('');
  const navigation = useNavigation();
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      console.log(codes[0]?.value);
      setText(codes[0]?.value);
      setIsActive(false);
    },
  });

  const checkCameraPermission = async () => {
    console.log(hasPermission);

    if (hasPermission) {
      setIsActive(hasPermission);
    } else {
      const permission = await requestPermission();
      setIsActive(permission);
    }
  };

  useEffect(() => {
    checkCameraPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (device == null) {
    return (
      <View style={styles.cameraNotFoundContainer}>
        <Text style={styles.margin10}>Camera Not Found</Text>
      </View>
    );
  }

  const handleOnNextPress = async () => {
    if (text) {
      await AsyncStorage.setItem('qrvalue', text);
      navigation.navigate('Page2');
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        codeScanner={codeScanner}
        style={styles.scanner}
        device={device}
        isActive={isActive}
      />
      <View style={styles.buttonContainer}>
        <Text style={{fontWeight: 'bold'}}>QR Code Value</Text>
        <TextInput value={text} editable={false} style={styles.textInput} />
        <TouchableOpacity style={styles.button} onPress={handleOnNextPress}>
          <Text style={styles.white}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraNotFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  margin10: {
    margin: 10,
  },
  scanner: {height: HEIGHT * 0.5, width: '100%'},
  buttonContainer: {
    width: '95%',
    alignSelf: 'center',
    marginTop: HEIGHT * 0.02,
    gap: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    fontSize: 16,
  },
  white: {color: 'white'},
});
export default Page1;
