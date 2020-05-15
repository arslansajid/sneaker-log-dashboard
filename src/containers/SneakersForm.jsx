import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { SingleDatePicker } from 'react-dates';

const today = new Date();
export default class SneakersForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      sneakers: {
        name: '',
        image: "",
        releasedDate: "",
      },
      startDate: null,
      endDate: null,
      focusedInput: null,
      description: RichTextEditor.createEmptyValue(),
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postSneakers = this.postSneakers.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.sneakersId) {
      axios.get(`${API_END_POINT}/api/v1/sneakers/${match.params.sneakersId}`)
      .then((response) => {
        let data  = response.data.sneakers;
        data["video_files"] = [];
        this.setState({
          sneakers: data,
        }, () => {
          const {sneakers} = this.state;
          this.getWorkoutDayById(sneakers.workout_day_id);
          if(sneakers.videos_url === null) {
            sneakers.video_files = [];
            this.setState({ sneakers })
          } else {
            this.setState({videoInputCount: sneakers.videos_url.length })
          }
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
      sneakers: {
        ...prevState.sneakers,
        workout_day_id: !!selectedWorkoutDay ? selectedWorkoutDay.id : "",
      },
    }));
  }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      sneakers: {
        ...prevState.sneakers,
        city_id: selectedCity.ID,
      },
    }));
  }

  setDescription(description) {
    const { sneakers } = this.state;
    sneakers.description = description.toString('html');
    this.setState({
      sneakers,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { sneakers } = this.state;
    sneakers[name] = value;
    this.setState({ sneakers });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { sneakers } = this.state;
    sneakers[name][index] = event.target.files[0];
    this.setState({ sneakers });
  }

  postSneakers(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, sneakers } = this.state;
    if (!loading) {
      const fd = new FormData();

      // let videosArray = [];
      // for (let index = 0; index < sneakers.video_files.length; index += 1) {
      //   videosArray.push(sneakers.video_files[index]);
      // }
      if(!!sneakers.video_files && sneakers.video_files.length > 0) {
        sneakers.video_files.forEach((video, index) => {
          fd.append(`video_files[${index}]`, video);
        });
        delete sneakers["video_files"];
      }

      Object.keys(sneakers).forEach((eachState) => {
        fd.append(`${eachState}`, sneakers[eachState]);
      })

      

      this.setState({ loading: true });
      if (match.params.sneakersId) {
        axios.put(`${API_END_POINT}/api/v1/sneakers/${match.params.sneakersId}`, fd)
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
        axios.post(`${API_END_POINT}/api/v1/sneakers`, fd)
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

  handleImages = (event) => {
    const { name } = event.target;
    const { sneakers } = this.state;
    sneakers[name] = event.target.files[0];
    this.setState({ sneakers });
  }

  render() {
    console.log(this.state);
    const {
      loading,
      sneakers,
      description,
      workoutDay,
      workoutDays,
      videoInputCount
    } = this.state;
    const workoutDaySelected = this.props.match.params.dayId ? true : false
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">

            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Sneakers Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postSneakers}
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
                          value={sneakers.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Release Date</label>
                      <div className="col-md-6 col-sm-6">
                        <SingleDatePicker
                          date={this.state.startDate} // momentPropTypes.momentObj or null
                          onDateChange={date => this.setState({ startDate: date })} // PropTypes.func.isRequired
                          focused={this.state.focused} // PropTypes.bool
                          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                          id="date-picker" // PropTypes.string.isRequired,
                          minDate={today}
                          placeholder="Select date"
                        />
                      </div>
                    </div>

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
                          onChange={this.handleImages}
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

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Timer Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="timer_type"
                          value={sneakers.timer_type}
                          className="form-control"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="sneakers">Sneakers</option>
                          <option value="rest">Rest</option>
                        </select>
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

