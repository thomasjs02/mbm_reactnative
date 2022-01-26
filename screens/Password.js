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
import CodeInput from 'react-native-confirmation-code-input';
import * as SecureStore from 'expo-secure-store';
import index from "./../src/js/index";

import {LinearGradient} from 'expo-linear-gradient';
import {materialTheme} from '../constants/';
import {HeaderHeight} from "../constants/utils";

const {width} = Dimensions.get('window');
// const { height, width } = Dimensions.get('screen');

export default class Password extends React.Component {

    state = {
        token: '',
        user_id: '',
        email: '',
        borderColor: '#ffffff',
        accessColor: "'rgba(255, 255, 255, 1)'",
        password: '',
        passcode: '',
        incorrectPassword: false,
        incorrectEmail: false,
        codeRight: true,
        incorrectCode: true,
    }

    handleFocus = () => {
        this.setState({incorrectPassword: false})
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

    Login = () => {

    }

    _submitCode = (code) => {
        console.log(code);
        this.setState({accessColor: "rgba(255, 0, 0, 1)"});
        this.setState({codeRight: false});
        this.refs.accessCode.clear();
    }

    __submitEmail = async () => {
        this.setState({incorrectEmail: true})
        return 1;
        let nav = this.props.navigation;
        var token = this.state.token;
        var email = this.state.email;
        var password = this.state.password;
        fetch("https://www.mbmheadquarters.com/admin/json/user-forgot.php", {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
            }),
            body: "email=" + email // <-- Post parameters
        })
            // .then((response) => response.json())
            .then((response) => response.text())
            .then((responseJson) => {
                if (responseJson == 'no-email' || responseJson == 'blank-email') {
                    this.setState({borderColor: '#ff0000'});
                    this.setState({incorrectPassword: true});
                } else {
                    // var data_json = JSON.parse(responseJson);
                    var data_json = responseJson;
                    const id = data_json.id;
                    const email = data_json.email;
                    this.setState({user_id: id, email: email, incorrectEmail: true})
                }
            })
            .catch((error) => {
                // this.setState({ borderColor: '#ff0000' });
                // this.setState({ incorrectPassword: true });
                // alert('Incorrect login')
                console.log('error');
                console.error(error);
            });

    }

    render() {
        const {navigation} = this.props;
        return (
            <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 0.25, y: 1.1}}
                locations={[0.2, 1]}
                colors={['#4B5320', '#15002B']}
                style={[styles.signin, {flex: 1, paddingTop: theme.SIZES.BASE * 4}]}>
                <Block center style={{marginTop: 100, marginBottom: 40}}>
                    <Text style={styles.titleText}>Reset</Text>
                    <Text style={styles.titleText}>Password</Text>
                </Block>
                <Block flex middle>

                    <KeyboardAvoidingView behavior="padding" enabled>

                        {this.state.incorrectPassword ? (
                            <Block center style={{paddingBottom: 20, paddingTop: 20, color: '#ffffff'}}>
                                <Text h4 style={{marginBottom: 20, marginTop: 20, color: '#ff0000'}}>
                                    Email doesn't exist
                                </Text>
                            </Block>
                        ) : (
                            <Block center style={{paddingBottom: 20, paddingTop: 20, color: '#ffffff'}}>
                                {this.state.codeRight ? (
                                    <Text p style={{color: '#ffffff'}}>
                                        Access code sent to your email. Enter code.
                                    </Text>
                                ) : (
                                    <Text p style={{color: '#ff0000'}}>
                                        Access code is incorrect
                                    </Text>
                                )}
                            </Block>
                        )}
                        {this.state.incorrectEmail ? (
                            <Block>
                                {this.state.incorrectCode ? (
                                    <Block center>
                                        <CodeInput
                                            secureTextEntry
                                            className={'border-b'}
                                            space={5}
                                            size={30}
                                            ref="accessCode"
                                            inputPosition='left'
                                            activeColor={this.state.accessColor}
                                            onFulfill={(code) => this._submitCode(code)}
                                        />
                                        <Button size="large" color="transparent" shadowless
                                                onPress={this.__submitEmail}>
                                            <Text
                                                center
                                                color={theme.COLORS.WHITE}
                                                size={theme.SIZES.FONT * 0.75}
                                                // style={{marginTop: 20}}
                                            >
                                                Submit
                                            </Text>
                                        </Button>
                                    </Block>
                                ) : (
                                    <Block>
                                        <Block center>
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
                                                placeholder={'New Password'}
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
                                            <Input
                                                borderless
                                                color="white"
                                                type="default"
                                                autoCapitalize="none"
                                                onFocus={this.handleFocus}
                                                bgColor='transparent'
                                                placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                                                value={this.state.confirm_password}
                                                onChangeText={(confirm_password) => this.setState({confirm_password})}
                                                placeholder={'Confirm Password'}
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
                                        </Block>
                                        <Block center flex>
                                            <Button size="large" color="transparent" shadowless
                                                    onPress={this.__changePasswordForm}
                                                // style={styles.button}
                                            >
                                                <Text
                                                    center
                                                    color={theme.COLORS.WHITE}
                                                    size={theme.SIZES.FONT * 0.75}
                                                    // style={{marginTop: 20}}
                                                    style={styles.buttonText}
                                                >
                                                    Submit
                                                </Text>
                                            </Button>
                                        </Block>
                                    </Block>
                                )}
                            </Block>
                        ) : (
                            // Enter email to reset password
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
                                            width={200}
                                            fontFamily='Baskerville'
                                            fontSize={20}
                                            height={44}
                                            padding={10}
                                            marginVertical={10}
                                            borderWidth={1}
                                            borderColor={this.state.borderColor}
                                        />
                                    </Block>
                                    <Block center flex>
                                        <Button size="large" color="transparent" shadowless
                                                onPress={this.__submitEmail}>
                                            <Text
                                                center
                                                color={theme.COLORS.WHITE}
                                                size={theme.SIZES.FONT * 0.75}
                                                // style={{marginTop: 20}}
                                                style={styles.buttonText}
                                            >
                                                Reset Password
                                            </Text>
                                        </Button>
                                    </Block>
                                </Block>
                            </Block>
                        )}
                    </KeyboardAvoidingView>
                </Block>
                <Button size="large" color="transparent" shadowless onPress={() => navigation.navigate('Login')}>
                    <Text center color={theme.COLORS.WHITE} size={theme.SIZES.FONT * 0.75}>
                        Click here to login
                    </Text>
                </Button>
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