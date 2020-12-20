import React from 'react';
import { TouchableWithoutFeedback, View, TouchableOpacity, StyleSheet, TextInput, Dimensions, ScrollView, Image, ImageBackground, Platform } from 'react-native';
import { Button, Block, Text, Icon, theme } from 'galio-framework';
import { Select } from '../components/';
import ModalDropdown from 'react-native-modal-dropdown';
import * as SecureStore from 'expo-secure-store';

import { Images, materialTheme } from '../constants';
import { HeaderHeight } from "../constants/utils";
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hourValue: 1,
      selectedStartDate: null,
      selectedTime: new Date(),
      timePicker: true,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
      timePicker: true,
    });
  }
  onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    this.setState({
      selectedTime: selectedDate,
    });
    // const start_time = moment(currentDate).format('hh:mm A');
    // const end_time = moment(currentDate).add(2, 'hours').format('hh:mm A');
    // console.log(start_time + ' - ' + end_time);
    // setShow(Platform.OS === 'ios');
    // setDate(currentDate);
  };

  handleOnSelect = (index, value) => {
    const { onSelect } = this.props;

    this.setState({ hourValue: value });
    onSelect && onSelect(index, value);
  }

  renderWelcome = (user) => {
    return (
      <Block flex>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Block row='horizontal' card flex style={[styles.product, styles.shadow]}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Item', { user_id: 43 })}>
              <Block flex style={[styles.imageContainer, styles.shadow]}>
                <Image source={require('./../assets/images/ios.png')} style='full' />
              </Block>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Item', { user_id: 43 })}>
              <Block flex space="between" style={styles.productDescription}>
                <Text size={15} style={styles.productTitle}>Welcome {user.first_name}</Text>
                <Text size={14}>MBM Headquarters</Text>
                <Text size={12} muted={!materialTheme.COLORS.PRIMARY} color={materialTheme.COLORS.PRIMARY}>Professional Recording Studio</Text>
              </Block>
            </TouchableWithoutFeedback>
          </Block>
        </Block>
      </Block>
    )
  }

  renderTabs = () => {
    return (
      <Block flex>
        <Block row space="between" style={{ padding: theme.SIZES.BASE, }}>
          <Block middle>
            <Text bold size={12} style={{ marginBottom: 8 }}>0</Text>
            <Text muted size={12}>Sessions</Text>
          </Block>
          <Block middle>
            <Text bold size={12} style={{ marginBottom: 8 }}>0</Text>
            <Text muted size={12}>Orders</Text>
          </Block>
          <Block middle>
            <Text bold size={12} style={{ marginBottom: 8 }}>0</Text>
            <Text muted size={12}>Messages</Text>
          </Block>
        </Block>
      </Block>
    )
  }

  renderButtons = () => {
    return (
      <Block flex style={styles.group}>
        <Block style={styles.container}>
          <Block center>
            <Button shadowless style={[styles.button, styles.shadow]}>
              Book Session
                </Button>
          </Block>
          <Block center>
            <Button shadowless color="info" style={[styles.button, styles.shadow]}>
              View Services
                </Button>
          </Block>
          <Block center>
            <Button shadowless color="success" style={[styles.button, styles.shadow]}>
              View Messages
                </Button>
          </Block>
        </Block>
      </Block>
    )
  }

  renderBooking = () => {
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? moment(selectedStartDate.toString()).format('MM/DD/YYYY') : '';
    // const time = selectedStartDate ? moment(selectedStartDate.toString()).format("YYYY-MM-DD'T'HH:mm:ss") : '';
    const date = new Date();
    // console.log(selectedStartDate);

    return (
      <Block flex style={styles.group}>
        <Block flex center>
          <Text h4 style={{ marginBottom: theme.SIZES.BASE / 2 }}>Book Studio Time</Text>
          <Text muted>Select a date on the calendar to book a session</Text>
        </Block>
        <Block style={styles.title}>
          <CalendarPicker
            onDateChange={this.onDateChange}
          />
        </Block>
        {this.state.timePicker && (
        <View>
          <Block flex center>
          <Text style={{ marginBottom: theme.SIZES.BASE / 2 }}>
            Select the time you want to start your session on {startDate}
          </Text>
          </Block>
          <DateTimePicker
            testID="dateTimePicker"
            value={this.state.selectedTime}
            mode='time'
            onChange={this.onTimeChange}
            is24Hour={false}
            display="default"
          />
          <Block row space="evenly">
            <Block flex left style={{marginTop: 8, marginLeft: 15}}>
              <Text style={{ marginBottom: theme.SIZES.BASE / 2 }}>
                How many studio hours?
              </Text>
              <ModalDropdown
                options={[1, 2, 3, 4, 5]}
                style={[styles.qty, styles.shadow]}
                onSelect={this.handleOnSelect}
                dropdownStyle={styles.dropdown}
                dropdownTextStyle={{paddingLeft:16, fontSize:12}}>
                <Block flex row middle space="between">
                  <Text size={12}>{this.state.hourValue}</Text>
                  <Icon name="angle-down" family="font-awesome" size={11} />
                </Block>
              </ModalDropdown>
            </Block>
            <Block flex={1.25} right>
              <Button onPress={this.__submitBookingForm}
                center
                shadowless
                color={materialTheme.COLORS.PRIMARY}
                textStyle={styles.optionsText}
                style={[styles.optionsButton, styles.shadow]}>
                  BOOK SESSION
              </Button>
            </Block>
          </Block>
        </View>
        )}
      </Block>
    )
  }

  renderSocial = () => {
    return (
      <Block flex style={styles.group}>
        <Text bold size={16} style={styles.title}>
          Connect With Us
        </Text>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          <Block row center space="between">
            <Block flex middle right>
              <Button
                round
                onlyIcon
                shadowless
                icon="instagram"
                iconFamily="font-awesome"
                iconColor={theme.COLORS.WHITE}
                iconSize={theme.SIZES.BASE * 1.625}
                color={theme.COLORS.INSTAGRAM}
                style={[styles.social, styles.shadow]}
              />
            </Block>
            <Block flex middle left>
              <TouchableOpacity
                style={styles.button}
              >
              <Button
                round
                onlyIcon
                shadowless
                icon="youtube"
                iconFamily="font-awesome"
                iconColor={theme.COLORS.WHITE}
                iconSize={theme.SIZES.BASE * 1.625}
                color={theme.COLORS.YOUTUBE}
                style={[styles.social, styles.shadow]}
              />
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </Block>
    )
  }

  __submitBookingForm = async () => {
    let user = this.props.route.params.userData;
    let hour = this.state.hourValue;
    let booking_date = moment(this.state.selectedStartDate).format('MM/DD/YYYY');
    let booking_time_start = moment(this.state.selectedTime).format('hh:mm A');
    let booking_time_end = moment(this.state.selectedTime).add(hour, 'hours').format('hh:mm A');
    let subject = 'Booking request from MBM app';
    let description = 'Booking request from MBM app...';
    var id = user.id
    var token = user.token
    console.log('token: '+token);
    fetch("http://www.mbmheadquarters.com/admin/api/booking.php", {
      method: 'POST',
      headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
      body: "id="+id+"&token=" +token+"&subject=" +subject+"&start_date=" +booking_date+"&end_date=" +booking_date+"&start_time=" +booking_time_start+"&end_time="+booking_time_end+"&description="+description
    })
    .then((response) => response.text())
    .then((responseJson) => {
      if(responseJson){
        alert("Your session has been booked!");
        // this.setState({
        //   loginModal: true,
        //   isLoading: false,
        // });
      }else{
        alert("Please login to your account to continue.")
        const credentials = SecureStore.deleteItemAsync('kwagu_key');
      }
    })
    .catch((error) => {
        console.error(error);
    });

  }
  render() {

    let userData = this.props.route.params.userData;
    return (
      <Block flex center>
        <ScrollView
          style={styles.components}
          showsVerticalScrollIndicator={false}>
          {this.renderWelcome(userData)}
          {this.renderBooking(userData)}
          {/* {this.renderTabs()} */}
          {/* {this.renderButtons()} */}
          {/* {this.renderSocial()} */}
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  components: {
    width: width
  },
  title: {
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
  },
  group: {
    paddingTop: theme.SIZES.BASE * 1.75,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    marginBottom: -HeaderHeight * 2,
  },
  profileImage: {
    width: width * 1.1,
    height: 'auto',
  },
  profileContainer: {
    width: width,
    height: height / 2,
  },
  profileDetails: {
    paddingTop: theme.SIZES.BASE * 4,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  profileTexts: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    zIndex: 2
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2,
  },
  options: {
    position: 'relative',
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE * 7,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    position: 'absolute',
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
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - (theme.SIZES.BASE * 2),
  },
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  productTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 3,
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: -16,
  },
  horizontalImage: {
    height: 122,
    width: 'auto',
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  qty: {
    width: 100,
    backgroundColor: '#DCDCDC',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom:9.5,
    borderRadius: 3,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  dropdown: {
    marginTop: 8,
    marginLeft: -16,
    width: 100,
  },
});
