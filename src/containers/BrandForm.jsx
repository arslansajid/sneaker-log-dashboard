import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class BrandForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      brand: {
        name: '',
        total_days: 0,
        sets: 0,
        reps: 0,
        intensity: 0,
        timer_type: '',
        duration: 0,
        rest_duration: 0,
        position: 0,
        video_files: [],
        workout_day_id: this.props.match.params.dayId ? this.props.match.params.dayId : "",
      },
      workoutDays: [],
      workoutDay: '',
      brandId: '',
      profile_picture: '',
      videoInputCount: 1,
      description: RichTextEditor.createEmptyValue(),
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postBrand = this.postBrand.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.brandId) {
      axios.get(`${API_END_POINT}/api/v1/brand/${match.params.brandId}`)
      .then((response) => {
        let data  = response.data.brand;
        data["video_files"] = [];
        this.setState({
          brand: data,
        }, () => {
          const {brand} = this.state;
          this.getWorkoutDayById(brand.workout_day_id);
          if(brand.videos_url === null) {
            brand.video_files = [];
            this.setState({ brand })
          } else {
            this.setState({videoInputCount: brand.videos_url.length })
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
      brand: {
        ...prevState.brand,
        workout_day_id: !!selectedWorkoutDay ? selectedWorkoutDay.id : "",
      },
    }));
  }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      brand: {
        ...prevState.brand,
        city_id: selectedCity.ID,
      },
    }));
  }

  setDescription(description) {
    const { brand } = this.state;
    brand.description = description.toString('html');
    this.setState({
      brand,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { brand } = this.state;
    brand[name] = value;
    this.setState({ brand });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { brand } = this.state;
    brand[name][index] = event.target.files[0];
    this.setState({ brand });
  }

  postBrand(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, brand } = this.state;
    if (!loading) {
      const fd = new FormData();

      // let videosArray = [];
      // for (let index = 0; index < brand.video_files.length; index += 1) {
      //   videosArray.push(brand.video_files[index]);
      // }
      if(!!brand.video_files && brand.video_files.length > 0) {
        brand.video_files.forEach((video, index) => {
          fd.append(`video_files[${index}]`, video);
        });
        delete brand["video_files"];
      }

      Object.keys(brand).forEach((eachState) => {
        fd.append(`${eachState}`, brand[eachState]);
      })

      

      this.setState({ loading: true });
      if (match.params.brandId) {
        axios.put(`${API_END_POINT}/api/v1/brand/${match.params.brandId}`, fd)
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
        axios.post(`${API_END_POINT}/api/v1/brand`, fd)
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
      loading,
      brand,
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
                  <h2>Enter Brand Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postBrand}
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
                          value={brand.name}
                          onChange={this.handleInputChange}
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

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Timer Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="timer_type"
                          value={brand.timer_type}
                          className="form-control"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="brand">Brand</option>
                          <option value="rest">Rest</option>
                        </select>
                      </div>
                    </div>

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

