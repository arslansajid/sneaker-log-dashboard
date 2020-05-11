import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
import {toolbarConfig} from "../static/_textEditor";

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class PrivacyPolicyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      privacyPolicy: {
        name: '',
      },
      description: RichTextEditor.createEmptyValue(),
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postPrivacyPolicy = this.postPrivacyPolicy.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.newsId) {
      axios.get(`${API_END_POINT}/api/v1/privacyPolicy/${match.params.newsId}`)
      .then((response) => {
        let data  = response.data.privacyPolicy;
        data["video_files"] = [];
        this.setState({
          privacyPolicy: data,
        }, () => {
          const {privacyPolicy} = this.state;
          this.getWorkoutDayById(privacyPolicy.workout_day_id);
          if(privacyPolicy.videos_url === null) {
            privacyPolicy.video_files = [];
            this.setState({ privacyPolicy })
          } else {
            this.setState({videoInputCount: privacyPolicy.videos_url.length })
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
      privacyPolicy: {
        ...prevState.privacyPolicy,
        workout_day_id: !!selectedWorkoutDay ? selectedWorkoutDay.id : "",
      },
    }));
  }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      privacyPolicy: {
        ...prevState.privacyPolicy,
        city_id: selectedCity.ID,
      },
    }));
  }

  setDescription(description) {
    const { privacyPolicy } = this.state;
    privacyPolicy.description = description.toString('html');
    this.setState({
      privacyPolicy,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { privacyPolicy } = this.state;
    privacyPolicy[name] = value;
    this.setState({ privacyPolicy });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { privacyPolicy } = this.state;
    privacyPolicy[name][index] = event.target.files[0];
    this.setState({ privacyPolicy });
  }

  postPrivacyPolicy(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, privacyPolicy } = this.state;
    if (!loading) {
      const fd = new FormData();

      // let videosArray = [];
      // for (let index = 0; index < privacyPolicy.video_files.length; index += 1) {
      //   videosArray.push(privacyPolicy.video_files[index]);
      // }
      if(!!privacyPolicy.video_files && privacyPolicy.video_files.length > 0) {
        privacyPolicy.video_files.forEach((video, index) => {
          fd.append(`video_files[${index}]`, video);
        });
        delete privacyPolicy["video_files"];
      }

      Object.keys(privacyPolicy).forEach((eachState) => {
        fd.append(`${eachState}`, privacyPolicy[eachState]);
      })

      

      this.setState({ loading: true });
      if (match.params.newsId) {
        axios.put(`${API_END_POINT}/api/v1/privacyPolicy/${match.params.newsId}`, fd)
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
        axios.post(`${API_END_POINT}/api/v1/privacyPolicy`, fd)
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
      description,
      privacyPolicy,
    } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">

            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Privacy Policy Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postPrivacyPolicy}
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
                          value={privacyPolicy.name}
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

