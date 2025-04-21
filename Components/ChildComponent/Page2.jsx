import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
function Page2() {
  let [city, setCity] = useState('');
  let [name, setName] = useState('');
  const navigation = useNavigation();
  function subMit() {
    if (city && name && city !== 'Select') {
      AsyncStorage.setItem('city', city);
      AsyncStorage.setItem('name', name);
      navigation.navigate('Dashboard');
      setName('');
    } else {
      Alert.alert('Please fill all the field');
    }
  }
  return (
    <>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={city}
          onValueChange={text => setCity(text)}
          style={styles.picker}>
          <Picker.Item label="Select a city" value="Select" />
          <Picker.Item label="Bhubaneswar" value="Bhubaneswar" />
          <Picker.Item label="Mumbai" value="Mumbai" />
          <Picker.Item label="Bangalore" value="Bangalore" />
          <Picker.Item label="Hyderabad" value="Hyderbad" />
        </Picker>
      </View>
      <View style={styles.textContainer}>
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor={'gray'}
          style={styles.textInput}
          value={name}
          onChangeText={text => setName(text)}
        />
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text style={styles.white10}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={subMit}>
          <Text style={styles.white10}>Submit</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    fontSize: 16,
    height: 53,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    width: '95%',
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  textContainer: {width: '95%', alignSelf: 'center'},
  picker: {
    color: 'black',
    height: 53,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    marginTop: 10,
  },
  button: {
    width: '48%',
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  white10: {fontSize: 15, color: 'white'},
});

export default Page2;
