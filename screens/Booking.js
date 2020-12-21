import React from 'react';
import { TouchableWithoutFeedback, View, TouchableOpacity, StyleSheet, TextInput, Dimensions, ScrollView, Image, ImageBackground, Platform } from 'react-native';
import { Button, Block, Text, Icon, theme } from 'galio-framework';
import { Select } from '../components/';
import ModalDropdown from 'react-native-modal-dropdown';
import * as SecureStore from 'expo-secure-store';
import { FancyAlert, LoadingIndicator } from 'react-native-expo-fancy-alerts';

import { Images, materialTheme } from '../constants';
import { HeaderHeight } from "../constants/utils";
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;
const date = new Date();

export default class Booking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hourValue: 1,
      selectedStartDate: date,
      selectedTime: date,
      bookingModal: false,
      isLoading: false,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }
  onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    this.setState({
      selectedTime: selectedDate,
    });
  };

  handleOnSelect = (index, value) => {
    const { onSelect } = this.props;

    this.setState({ hourValue: value });
    onSelect && onSelect(index, value);
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
          <Text h4 style={{ marginBottom: theme.SIZES.BASE / 2 }}>Book Studio Session</Text>
          <Text muted>Select date &amp; time on the calendar below.</Text>
        </Block>
        <Block style={styles.title}>
          <CalendarPicker
            onDateChange={this.onDateChange}
          />
        </Block>
        <View>
          <Block flex center>
          <Text style={{ marginBottom: theme.SIZES.BASE }}>
            Select the time you want to start your session
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
    this.setState({
      isLoading: true,
    });
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
      console.log(responseJson);
      if(responseJson){
        // alert("Your session has been booked!");
        this.setState({
          isLoading: false,
          bookingModal: true,
        });
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
    let start_date = moment(this.state.selectedStartDate).format('MM/DD/YYYY');
    let start_time = moment(this.state.selectedTime).format('hh:mm A');
    let hour_amount = this.state.hourValue;
    let hourFrame = 'hours';
    if(hour_amount == 1){
      hourFrame = 'hour';
    }
    // console.log(bookingDate);
    return (
      <Block flex center style={{ marginBottom: 60 }}>
        <ScrollView
          style={styles.components}
          showsVerticalScrollIndicator={false}>
          {this.renderBooking(userData)}
          <FancyAlert
            visible={this.state.bookingModal}
            icon={<View style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'green',
            borderRadius: 50,
            width: '100%',
          }}><Text>👍</Text></View>}
          style={{ backgroundColor: 'white' }}
        >
          <Text style={{ marginTop: -16, marginBottom: 32 }}>
            You have booked a session on {start_date} at {start_time} for {hour_amount} {hourFrame}
            </Text>
                <TouchableOpacity
                  style={styles.buttonModal}
                >
                  <Text style={styles.buttonText} onPress={(bookingModal) => this.setState({ bookingModal: false })}> 💯 </Text>
                </TouchableOpacity>
          </FancyAlert>
          <LoadingIndicator visible={this.state.isLoading} />
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
  buttonText: {
    fontFamily: 'Baskerville',
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonModal: {
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
});
