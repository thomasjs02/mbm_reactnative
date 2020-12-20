import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import { AppLoading } from 'expo';

import { Icon, Product } from '../components';

const { width } = Dimensions.get('screen');
import products from '../constants/products';

export default class Register extends React.Component {

  state = {
    isLoadingDone: false,
    myData: []
  }
  // apiData = props.mydata.data;
  renderSearch = () => {
    const { navigation } = this.props;
    const iconCamera = <Icon size={16} color={theme.COLORS.MUTED} name="zoom-in" family="material" />

    return (
      <Input
        right
        color="black"
        style={styles.search}
        iconContent={iconCamera}
        placeholder="What are you looking for?"
        onFocus={() => navigation.navigate('Pro')}
      />
    )
  }

  renderTabs = () => {
    const { navigation } = this.props;

    return (
      <Block row style={styles.tabs}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon name="grid" family="feather" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Booking</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon size={16} name="camera-18" family="GalioExtra" style={{ paddingRight: 8 }} />
            <Text size={16} style={styles.tabTitle}>Contact</Text>
          </Block>
        </Button>
      </Block>
    )
  }

  renderContainer = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        {this.renderProducts()}
      </ScrollView>
    )
  }

  renderProducts() {
    // console.log(this.state.myData);
    var items = [];
    var i = 0;
    var newData = this.state.myData;
    return newData.map(function (itemdata) {
      items[i] = {
        key: itemdata.id,
        title: itemdata.name,
        description: itemdata.description,
        image: "http://mbmheadquarters.com/assets/images/shop/" + itemdata.image,
        price: itemdata.price
      }
      return (
        <Block flex>
          <Product product={items[i]} horizontal />
        </Block>
      )
      i++;
    });
    // console.log('help');
  }

  render() {
    // console.log(this.context);
    if (!this.state.isLoadingDone) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Block style={styles.container}>
          <Text style={styles.titleText}>Register Page</Text>
          <Text style={styles.titleText}>Momento</Text>
          <TextInput
            value={this.state.email}
            keyboardType='email-address'
            onChangeText={(email) => this.setState({ email })}
            placeholder='email'
            placeholderTextColor='white'
            style={styles.input}
          />
          <TextInput
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            placeholder={'password'}
            secureTextEntry={true}
            placeholderTextColor='white'
            style={styles.input}
          />


          <TouchableOpacity
            style={styles.button}
            onPress={this.onLogin.bind(this)}
          >
            <Text style={styles.buttonText}> Sign Up / Login </Text>
          </TouchableOpacity>

        </Block>
      );
    }
  }

  _loadResourcesAsync = async () => {
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    fetch('http://www.mbmheadquarters.com/admin/json/shop-all.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then((data) => {
        this.setState({ isLoadingDone: true });
        this.setState({ myData: data });
        // console.log(this.state.myData);
        // console.log('we good');
      })
      .catch(console.log)
  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'salmon',
  },
  titleText:{
    fontFamily: 'Baskerville',
    fontSize: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'powderblue',
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText:{
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
    borderColor: 'white',
    marginVertical: 10,
  },
});