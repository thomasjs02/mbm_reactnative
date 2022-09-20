import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native';
import {Button, Block, Text, Input, theme} from 'galio-framework';
// import { SecureStore } from 'expo';
import * as SecureStore from 'expo-secure-store';
import index from "./../src/js/index";

import {LinearGradient} from 'expo-linear-gradient';
import {materialTheme} from '../constants/';
import {HeaderHeight} from "../constants/utils";
import {addShop, dataUser} from "../src/js/actions";

const {width} = Dimensions.get('window');
// const { height, width } = Dimensions.get('screen');

export default class Login extends React.Component {

    state = {
        token: '',
        email: '',
        borderColor: '#ffffff',
        password: '',
        incorrectLogin: false,
    }

    handleFocus = () => {
        this.setState({ incorrectLogin: false })
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

    __submitLoginForm = async () => {
        let nav = this.props.navigation;
        var token = this.state.token;
        var email = this.state.email;
        var password = this.state.password;
        fetch("https://www.mbmheadquarters.com/admin/json/user-auth.php", {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
            }),
            body: "email=" + email + "&password=" + password // <-- Post parameters
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson) {
                    store.dispatch( dataUser(responseJson) );

                    const id = responseJson.id;
                    const token = responseJson.token;
                    const first_name = responseJson.first_name;
                    const last_name = responseJson.last_name;
                    const phone = responseJson.phone;
                    const read_mail = responseJson.read_mail;
                    const credentials = {id, token, email, password, first_name, last_name, phone, read_mail};
                    this.storeData(credentials);
                    nav.navigate('App');

                } else {
                    this.setState({ borderColor: '#ff0000' });
                    this.setState({ incorrectLogin: true });
                    // alert('Incorrect login')
                }
            })
            .catch((error) => {
                this.setState({ borderColor: '#ff0000' });
                this.setState({ incorrectLogin: true });
                // alert('Incorrect login')
                // console.error(error);
            });

    }

    render() {
        const {navigation} = this.props;
        return (
            <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 0.25, y: 1.1}}
                locations={[0.2, 1]}
                colors={[materialTheme.COLORS.GRADIENT_START, materialTheme.COLORS.GRADIENT_END]}
                style={[styles.signin, {flex: 1, paddingTop: theme.SIZES.BASE * 4}]}>
                <Block center style={{marginTop: 100, marginBottom: 40}}>
                    <Text style={styles.titleText}>MBM</Text>
                    <Text style={styles.titleText}>Login</Text>
                </Block>
                <Block flex middle>

                    <KeyboardAvoidingView behavior="padding" enabled>

                        {this.state.incorrectLogin ? (
                            <Block center>
                                <Text h4 style={{marginBottom: 20, marginTop: 20, color:'#ff0000'}}>
                                    Incorrect Login
                                </Text>
                            </Block>
                            ) :(
                            <Block center style={{paddingBottom: 20, paddingTop: 20, color:'#ffffff'}}>
                                <Text p style={{color:'#ffffff'}}>
                                    Login Below
                                </Text>
                            </Block>
                        )}
                        <Block middle>
                            <Block flex>
                                <Block center>

                                    <Input
                                        borderless
                                        color="white"
                                        placeholder="Email"
                                        type="email-address"
                                        autoCapitalize="none"
                                        bgColor='transparent'
                                        placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                                        value={this.state.email}
                                        keyboardType='email-address'
                                        onChangeText={(email) => this.setState({email})}
                                        onFocus={this.handleFocus}
                                        // placeholder='email'
                                        // placeholderTextColor='#ffffff'
                                        width={200}
                                        fontFamily='Baskerville'
                                        fontSize={20}
                                        height={44}
                                        padding={10}
                                        marginVertical={10}
                                        borderWidth={1}
                                        borderColor={this.state.borderColor}
                                    />
                                    <Input
                                        borderless
                                        color="white"
                                        type="default"
                                        autoCapitalize="none"
                                        onFocus={this.handleFocus}
                                        bgColor='transparent'
                                        placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                                        value={this.state.password}
                                        onChangeText={(password) => this.setState({password})}
                                        placeholder={'Password'}
                                        secureTextEntry={true}
                                        // placeholderTextColor='#ffffff'
                                        width={200}
                                        fontFamily='Baskerville'
                                        fontSize={20}
                                        height={44}
                                        padding={10}
                                        marginVertical={10}
                                        borderWidth={1}
                                        borderColor={this.state.borderColor}
                                    />
                                    <Text
                                        onPress={() => navigation.navigate('Password')}
                                        color={theme.COLORS.WHITE}
                                        size={theme.SIZES.FONT * 0.75}
                                        // onPress={() => Alert.alert('Not implemented')}
                                        style={{alignSelf: 'flex-end', lineHeight: theme.SIZES.FONT * 2}}
                                    >
                                        Forgot your password?
                                    </Text>
                                </Block>
                                <Block center flex>
                                    <Button size="large" color="transparent" shadowless
                                            onPress={this.__submitLoginForm}
                                        // style={styles.button}
                                    >
                                        <Text
                                            center
                                            color={theme.COLORS.WHITE}
                                            size={theme.SIZES.FONT * 0.75}
                                            // style={{marginTop: 20}}
                                            style={styles.buttonText}
                                        >
                                            Login
                                        </Text>
                                    </Button>
                                </Block>
                            </Block>
                        </Block>
                    </KeyboardAvoidingView>
                </Block>
                <Button size="large" color="transparent" shadowless onPress={() => navigation.navigate('Register')}>
                    <Text center color={theme.COLORS.WHITE} size={theme.SIZES.FONT * 0.75}>
                        Create an account? Register
                    </Text>
                </Button>
            </LinearGradient>
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
        color: '#fff'
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 25,
        marginBottom: 10,
    },
    buttonText: {
        fontFamily: 'Baskerville',
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    input: {
        width: 200,
        fontFamily: 'Baskerville',
        fontSize: 20,
        height: 44,
        padding: 10,
        color: '#ffffff',
        marginVertical: 10,
    },
});