import React from 'react';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { addEvent, updateEvent, getEventById } from "../backend/services/eventService";
import { toolbarConfig } from "../static/_textEditor";
import {firebase} from "../backend/firebase";
import {imageResizeFileUri} from "../static/_imageUtils";
import { v4 as uuidv4 } from 'uuid';

import { SingleDatePicker } from 'react-dates';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import moment from 'moment';

export default class EventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      appEvent: {
        name: '',
        date: '',
        time: '',
        location: '',
        about: '',
        image: '',
      },
      description: RichTextEditor.createEmptyValue(),
      startDate: null,
      endDate: null,
      focusedInput: null,
      time: ['', ''],
      image: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postEvent = this.postEvent.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.eventId) {
      getEventById(match.params.eventId)
        .then((response) => {
          this.setState({
            appEvent: response,
            startDate: moment(new Date(response.date.seconds*1000)),
            time: response.time,
            description: RichTextEditor.createValueFromString(response.about, 'html'),
          });
        });
    }
  }

  getWorkoutDays = () => {
    axios.get(`${API_END_POINT}/api/v1/workout_days`)
      .then(response => {
        this.setState({
          workoutDays: response.data.data,
          responseMessage: 'No Workout Days Found...'
        })
      })
  }

  setDescription(description) {
    const { appEvent } = this.state;
    appEvent.about = description.toString('html');
    this.setState({
      appEvent,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { appEvent } = this.state;
    appEvent[name] = value;
    this.setState({ appEvent });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { appEvent } = this.state;
    appEvent[name][index] = event.target.files[0];
    this.setState({ appEvent });
  }

  handleImages = (event) => {
    const { name } = event.target;
    const { appEvent } = this.state;
    appEvent[name] = event.target.files[0];
    this.setState({ appEvent });
  }

  postEvent = async (event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, appEvent, image } = this.state;
    if (!loading) {
      this.setState({ loading: true });

      let imageFile = image;

      let downloadUrl;
      let imageUri;

      if (imageFile) {
          imageUri = (await imageResizeFileUri({ file: imageFile }));

          const storageRef = firebase
              .storage()
              .ref()
              .child('Events')
              .child(`${uuidv4()}.jpeg`);

          if (imageUri) {
              await storageRef.putString(imageUri, 'data_url');
              downloadUrl = await storageRef.getDownloadURL();
          }
          appEvent.image = downloadUrl;
      }

      if (match.params.eventId) {
        let cloneObject = Object.assign({}, appEvent)
        updateEvent(match.params.eventId, cloneObject)
          .then((response) => {
              window.alert('Event updated successfully.')
              history.goBack();
              this.setState({ loading: false });
          })
          .catch((err) => {
            window.alert('Error updating event.')
            history.goBack();
            this.setState({ loading: false });
          })
      }
      else {
        addEvent(appEvent)
          .then((response) => {
              window.alert('Event created successfully.')
              this.setState({ loading: false });
          })
          .catch((err) => {
            console.log(err)
            window.alert('Error creating event.')
            this.setState({ loading: false });
          })
      }
    }
  }

  handleImage = (event) => {
    this.setState({
      image: event.target.files[0]
    });
  }

  handleDateChange = (date) => {
    const {appEvent} = this.state;
    appEvent["date"] = new Date(date);
    this.setState({
      startDate: date,
      appEvent
    })
  }

  handleTimeChange = (value) => {
    const {appEvent} = this.state;
    appEvent["time"] = value;
    this.setState({
      time: value,
      appEvent
    })
  }


  render() {
    console.log(this.state);
    const {
      appEvent,
      description,
      startDate,
      endDate,
      focusedInput,
      selectedDate
    } = this.state;
    const workoutDaySelected = this.props.match.params.dayId ? true : false
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">

            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Event Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postEvent}
                  >

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Image
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="image"
                          className="form-control"
                          onChange={this.handleImage}
                        // multiple
                        // required
                        />
                      </div>
                    </div>

                    {appEvent.image
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                            style={{marginRight: '5px'}}
                            width="100"
                            className="img-fluid"
                            src={`${appEvent.image}`}
                            alt="profileImage"
                          />
                        </div>
                      </div>
                      ) : null
                    }

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Name of Event
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={appEvent.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Date</label>
                      <div className="col-md-6 col-sm-6">
                        <SingleDatePicker
                          date={this.state.startDate} // momentPropTypes.momentObj or null
                          onDateChange={date => this.handleDateChange(date)} // PropTypes.func.isRequired
                          focused={this.state.focused} // PropTypes.bool
                          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                          id="date-picker" // PropTypes.string.isRequired,
                          displayFormat={"DD-MMM-YYYY"}
                          placeholder="Select date"
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Time
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <TimeRangePicker
                          onChange={(value) => this.handleTimeChange(value)}
                          value={this.state.time}
                          disableClock={true}
                          maxDetail={"minute"}
                          minutePlaceholder={"mm"}
                          hourPlaceholder={"hh"}
                          amPmAriaLabel={"Select AM/PM"}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Location
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="location"
                          className="form-control"
                          value={appEvent.location}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">About</label>
                      <div className="col-md-6 col-sm-6">
                        <RichTextEditor
                          className="text-editor"
                          value={description}
                          toolbarConfig={toolbarConfig}
                          onChange={(e) => {
                            this.setDescription(e);
                          }}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Workout Day</label>
                      <div className="col-md-6 col-sm-6">
                      <Select
                        onChange={(val) => this.setWorkoutDay(val)}
                        options={workoutDays}
                        placeholder="Select workout day"
                        value={workoutDay}
                        valueKey="id"
                        labelKey="name"
                        isClearable={false}
                        disabled={workoutDaySelected}
                      />
                      </div>
                    </div> */}

                    <div className="ln_solid" />
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button className={`btn btn-success btn-lg ${this.state.loading ? 'disabled' : ''}`}>
                          <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`} /> Submit
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

