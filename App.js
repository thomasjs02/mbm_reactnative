/*!

 =========================================================
 * Material Kit React Native - v1.4.0
 =========================================================
 * Product Page: https://demos.creative-tim.com/material-kit-react-native/
 * Copyright 2019 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-kit-react-native/blob/master/LICENSE)
 =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { Component } from 'react';
import { Platform, StatusBar, Image } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';

import { Images, products, materialTheme } from './constants/';

import { NavigationContainer } from '@react-navigation/native';
import Screens from './navigation/Screens';
import index from "./src/js/index";
// import { connect } from "react-redux";
// import { getData } from "./src/js/actions/index";

// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';
import { addShop } from './src/js/actions';
import * as SecureStore from 'expo-secure-store';
// import { getData } from "./src/js/actions/index";

enableScreens();

// cache app images
const assetImages = [
  Images.Pro,
  Images.Profile,
  Images.Avatar,
  Images.Onboarding,
];

// cache product images
products.map(product => assetImages.push(product.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {

  state = {
    isLoadingComplete: false,
    user:[]
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <NavigationContainer>
          <GalioProvider theme={materialTheme}>
            <Block flex>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <Screens mydata={this.state} />
            </Block>
          </GalioProvider>
        </NavigationContainer>
      );
    }
  }

  _loadResourcesAsync = async () => {
    try {
      const credentials = await SecureStore.getItemAsync('kwagu_key');
      // console.log('value of credentials: ', credentials);

      if (credentials && !this.state.first_name) {
        const myJson = JSON.parse(credentials);
        this.setState({
          user: myJson
        });
      }
      return Promise.all([
        ...cacheImages(assetImages),
        ]);
    } catch (e) {
      console.log(e);
    }
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
      // store.dispatch( getData() );
      // this.setState({ isLoadingComplete: true });
    fetch('http://www.mbmheadquarters.com/admin/json/shop-all.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then((data) => {
      store.dispatch( addShop(data) );
      this.setState({ isLoadingComplete: true });
    })
    .catch(console.log)
  };
}
