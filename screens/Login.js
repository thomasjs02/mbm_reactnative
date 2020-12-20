import React from 'react';
import { StyleSheet, ImageBackground, TextInput, TouchableOpacity, Text, Dimensions, ScrollView } from 'react-native';
import { Button, Block, Input, theme } from 'galio-framework';
// import { SecureStore } from 'expo';
import * as SecureStore from 'expo-secure-store';
import index from "./../src/js/index";
import { dataUser } from './../src/js/actions';

import { Icon, Product } from '../components';

const { height, width } = Dimensions.get('screen');
import products from '../constants/products';

const setToken = (token) => {
  return SecureStore.setItemAsync('secure_token', token);
};

export default class Login extends React.Component {

  state = {
    token: '',
    email: '',
    password: '',
  }

  storeData = async (credentials) => {
    try {
      await SecureStore.setItemAsync(
        'kwagu_key',
        JSON.stringify(credentials)
      );
      // this.setState({ email: '', password: '' });
    } catch (e) {
      console.log(e);
    }
  }

  __submitLoginForm = async (navigation) => {
    var token = this.state.token;
    var email = this.state.email;
    var password = this.state.password;
    fetch("http://www.mbmheadquarters.com/admin/json/user-auth.php", {
      method: 'POST',
      headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
      body: "email="+email+"&password=" + password // <-- Post parameters
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson){
        console.log(responseJson);
        const id = responseJson.id;
        const token = responseJson.token;
        const first_name = responseJson.first_name;
        const last_name = responseJson.last_name;
        const phone = responseJson.phone;
        const credentials = { id, token, email, password, first_name, last_name, phone };
        this.storeData(credentials);
        navigation.navigate('MBM');

      }else{
        alert('Incorrect login')
      }
    })
    .catch((error) => {
        console.error(error);
    });

  }

  render() {
        const { navigation } = this.props;
    return (
      <Block style={styles.container}>
        <Text style={styles.titleText}>MBM</Text>
        <Text style={styles.titleText}>Login</Text>
        <TextInput
          value={this.state.email}
          keyboardType='email-address'
          onChangeText={(email) => this.setState({ email })}
          placeholder='email'
          placeholderTextColor='#333333'
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          placeholder={'password'}
          secureTextEntry={true}
          placeholderTextColor='#333333'
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.button}
        >
          <Text style={styles.buttonText} onPress={this.__submitLoginForm(navigation)}> Login </Text>
        </TouchableOpacity>

      </Block>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffcc',
  },
  titleText: {
    fontFamily: 'Baskerville',
    fontSize: 50,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#333333'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: 'Baskerville',
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200,
    fontFamily: 'Baskerville',
    fontSize: 20,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: '#333333',
    marginVertical: 10,
  },
});