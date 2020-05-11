import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
import { toolbarConfig } from "../static/_textEditor";

import { SingleDatePicker } from 'react-dates';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';

const today = new Date();
export default class EventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      appEvent: {
        name: '',
        start_date: null,
        end_date: null,
      },
      description: RichTextEditor.createEmptyValue(),
      startDate: null,
      endDate: null,
      focusedInput: null,
      time: ['', ''],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postEvent = this.postEvent.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.appEventId) {
      axios.get(`${API_END_POINT}/api/v1/appEvent/${match.params.appEventId}`)
        .then((response) => {
          let data = response.data.appEvent;
          data["video_files"] = [];
          this.setState({
            appEvent: data,
          }, () => {
            const { appEvent } = this.state;
            this.getWorkoutDayById(appEvent.workout_day_id);
            if (appEvent.videos_url === null) {
              appEvent.video_files = [];
              this.setState({ appEvent })
            } else {
              this.setState({ videoInputCount: appEvent.videos_url.length })
            }
          });
        });
    }
    if (match.params.dayId) {
      this.getWorkoutDayById(match.params.dayId)
    } else {
      this.getWorkoutDays();
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

  getWorkoutDayById = (workoutDayId) => {
    axios.get(`${API_END_POINT}/api/v1/workout_days/${workoutDayId}`)
      .then((response) => {
        this.setState({
          workoutDay: response.data.data,
        });
      });
  }

  setWorkoutDay(selectedWorkoutDay) {
    this.setState(prevState => ({
      workoutDay: selectedWorkoutDay,
      appEvent: {
        ...prevState.appEvent,
        workout_day_id: !!selectedWorkoutDay ? selectedWorkoutDay.id : "",
      },
    }));
  }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      appEvent: {
        ...prevState.appEvent,
        city_id: selectedCity.ID,
      },
    }));
  }

  setDescription(description) {
    const { appEvent } = this.state;
    appEvent.description = description.toString('html');
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

  postEvent(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, appEvent } = this.state;
    if (!loading) {
      const fd = new FormData();

      // let videosArray = [];
      // for (let index = 0; index < appEvent.video_files.length; index += 1) {
      //   videosArray.push(appEvent.video_files[index]);
      // }
      if (!!appEvent.video_files && appEvent.video_files.length > 0) {
        appEvent.video_files.forEach((video, index) => {
          fd.append(`video_files[${index}]`, video);
        });
        delete appEvent["video_files"];
      }

      Object.keys(appEvent).forEach((eachState) => {
        fd.append(`${eachState}`, appEvent[eachState]);
      })



      this.setState({ loading: true });
      if (match.params.appEventId) {
        axios.put(`${API_END_POINT}/api/v1/appEvent/${match.params.appEventId}`, fd)
          .then((response) => {
            if (response.data && response.data.status && response.status === 200) {
              window.alert("Updated !");
              this.setState({ loading: false });
            } else {
              window.alert('ERROR UPDATING !')
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR UPDATING !')
            this.setState({ loading: false });
          })
      }
      else {
        axios.post(`${API_END_POINT}/api/v1/appEvent`, fd)
          .then((response) => {
            if (response.data && response.data.status && response.status === 200) {
              window.alert("SUCCESS !");
              this.setState({ loading: false });
            } else {
              window.alert('ERROR SAVING !')
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR SAVING !')
            this.setState({ loading: false });
          })
      }
    }
  }

  handleFile = (event) => {
    this.setState({
      profile_picture: event.target.files.length ? event.target.files[0] : '',
    });
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
                      >Name
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
                      <label className="control-label col-md-3 col-sm-3">Description</label>
                      <div className="col-md-6 col-sm-6">
                        <RichTextEditor
                          value={description}
                          toolbarConfig={toolbarConfig}
                          onChange={(e) => {
                            this.setDescription(e);
                          }}
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
                          onChange={(value) => this.setState({ time: value })}
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
                      <label className="control-label col-md-3 col-sm-3">Date Range</label>
                      <div className="col-md-6 col-sm-6">
                        <SingleDatePicker
                          date={this.state.startDate} // momentPropTypes.momentObj or null
                          onDateChange={date => this.setState({ startDate: date })} // PropTypes.func.isRequired
                          focused={this.state.focused} // PropTypes.bool
                          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                          id="date-picker" // PropTypes.string.isRequired,
                          minDate={today}
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

