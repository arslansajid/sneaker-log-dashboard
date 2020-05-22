import React from 'react';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import moment from 'moment';
import { addSneakersReleaseDate, updateSneakersReleaseDate, getSneakersReleaseDateById } from "../backend/services/sneakerReleaseService";
import {firebase} from "../backend/firebase";
import {imageResizeFileUri} from "../static/_imageUtils";
import { v4 as uuidv4 } from 'uuid';

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
        releaseDate: "",
      },
      startDate: null,
      endDate: null,
      focusedInput: null,
      image: "",
      description: RichTextEditor.createEmptyValue(),
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postSneakers = this.postSneakers.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.sneakersId) {
      getSneakersReleaseDateById(match.params.sneakersId)
      .then((response) => {
        this.setState({
          sneakers: response,
          startDate: moment(new Date(response.releaseDate.seconds*1000)),
        });
      });
    }
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

  postSneakers = async(event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, sneakers, image } = this.state;
    if (!loading) {
      const fd = new FormData();

      this.setState({ loading: true });

      let imageFile = image;

      let downloadUrl;
      let imageUri;

      if (imageFile) {
          imageUri = (await imageResizeFileUri({ file: imageFile }));

          const storageRef = firebase
              .storage()
              .ref()
              .child('Sneakers')
              .child(`${uuidv4()}.jpeg`);

          if (imageUri) {
              await storageRef.putString(imageUri, 'data_url');
              downloadUrl = await storageRef.getDownloadURL();
          }
          sneakers.image = downloadUrl;
      }

      if (match.params.sneakersId) {
        let cloneObject = Object.assign({}, sneakers)
        updateSneakersReleaseDate(match.params.sneakersId, cloneObject)
          .then((response) => {
              window.alert("Updated successfully.");
              history.goBack();
              this.setState({ loading: false });
          })
          .catch((err) => {
            window.alert('Error updating.')
            this.setState({ loading: false });
          })
      }
      else {
        addSneakersReleaseDate(sneakers)
          .then((response) => {
              window.alert("Created suuccessfully !");
              history.goBack();
              this.setState({ loading: false });
          })
          .catch((err) => {
            window.alert('Error creating !')
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
    const {sneakers} = this.state;
    sneakers.releaseDate = new Date(date);
    this.setState({
      startDate: date,
      sneakers
    })
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
                  <h2>Enter Sneaker Release Details</h2>
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
                          onDateChange={date => this.handleDateChange(date)} // PropTypes.func.isRequired
                          focused={this.state.focused} // PropTypes.bool
                          onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                          id="date-picker" // PropTypes.string.isRequired,
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
                          onChange={this.handleImage}
                        />
                      </div>
                    </div>

                    {sneakers.image
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                            style={{marginRight: '5px'}}
                            width="100"
                            className="img-fluid"
                            src={`${sneakers.image}`}
                            alt="profileImage"
                          />
                        </div>
                      </div>
                      ) : null
                    }

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

