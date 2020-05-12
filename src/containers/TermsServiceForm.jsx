import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import {toolbarConfig} from "../static/_textEditor";
import Cookie from 'js-cookie';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class TermsServiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      termsService: {
        name: '',
      },
      description: RichTextEditor.createEmptyValue(),
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postTermsService = this.postTermsService.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.termsServiceId) {
      axios.get(`${API_END_POINT}/api/v1/termsService/${match.params.termsServiceId}`)
      .then((response) => {
        let data  = response.data.termsService;
        data["video_files"] = [];
        this.setState({
          termsService: data,
        }, () => {
          const {termsService} = this.state;
          this.getWorkoutDayById(termsService.workout_day_id);
          if(termsService.videos_url === null) {
            termsService.video_files = [];
            this.setState({ termsService })
          } else {
            this.setState({videoInputCount: termsService.videos_url.length })
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
      termsService: {
        ...prevState.termsService,
        workout_day_id: !!selectedWorkoutDay ? selectedWorkoutDay.id : "",
      },
    }));
  }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      termsService: {
        ...prevState.termsService,
        city_id: selectedCity.ID,
      },
    }));
  }

  setDescription(description) {
    const { termsService } = this.state;
    termsService.description = description.toString('html');
    this.setState({
      termsService,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { termsService } = this.state;
    termsService[name] = value;
    this.setState({ termsService });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { termsService } = this.state;
    termsService[name][index] = event.target.files[0];
    this.setState({ termsService });
  }

  postTermsService(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, termsService } = this.state;
    if (!loading) {
      const fd = new FormData();

      // let videosArray = [];
      // for (let index = 0; index < termsService.video_files.length; index += 1) {
      //   videosArray.push(termsService.video_files[index]);
      // }
      if(!!termsService.video_files && termsService.video_files.length > 0) {
        termsService.video_files.forEach((video, index) => {
          fd.append(`video_files[${index}]`, video);
        });
        delete termsService["video_files"];
      }

      Object.keys(termsService).forEach((eachState) => {
        fd.append(`${eachState}`, termsService[eachState]);
      })

      

      this.setState({ loading: true });
      if (match.params.termsServiceId) {
        axios.put(`${API_END_POINT}/api/v1/termsService/${match.params.termsServiceId}`, fd)
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
        axios.post(`${API_END_POINT}/api/v1/termsService`, fd)
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
      termsService,
      description
    } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">

            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Terms of Service Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postTermsService}
                  >

                    <div className="col-md-12 col-sm-12">
                      <RichTextEditor
                        value={description}
                        toolbarConfig={toolbarConfig}
                        onChange={(e) => {
                          this.setDescription(e);
                        }}
                      />
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

