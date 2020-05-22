import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import {signUp} from "../backend/services/authService";

import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class MemberForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      admin: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      description: RichTextEditor.createEmptyValue(),
    };
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.memberId) {
      console.log("EDITING SCENARIO")
    }
  }

  setDescription(description) {
    const { admin } = this.state;
    admin.description = description.toString('html');
    this.setState({
      admin,
      description,
    });
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;

    const { admin } = this.state;
    admin[name] = value;
    this.setState({ admin });
  }

  postAdmin = async (event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, admin } = this.state;
    if (!loading ) {

      this.setState({ loading: true });
      if (match.params.memberId) {
        axios.put(`${API_END_POINT}/api/v1/admin/${match.params.memberId}`, fd)
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
        if(admin.password === admin.confirmPassword) {
        const signUpResult =  await signUp(admin.email, admin.password)

        if(!!signUpResult) {
          this.setState({ loading: false });
          history.goBack();
        } else {
          this.setState({ loading: false });
        }
      } else {
        window.alert('Password does not match!')
        this.setState({ loading: false });
      }
      
        // signUp(admin.email, admin.password)
        //   .then((response) => {
        //       window.alert("Admin created uccessfully!");
        //       this.setState({ loading: false });
        //   })
        //   .catch((err) => {
        //     window.alert('ERROR SAVING !')
        //     this.setState({ loading: false });
        //   })
      }
    }
  }

  render() {
    console.log(this.state);
    const {
      loading,
      admin,
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
                  <h2>Enter Admin Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postAdmin}
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
                          value={admin.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Email
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="email"
                          name="email"
                          className="form-control"
                          value={admin.email}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Password
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="password"
                          name="password"
                          className="form-control"
                          value={admin.password}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Confirm Password
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="password"
                          name="confirmPassword"
                          className="form-control"
                          value={admin.confirmPassword}
                          onChange={this.handleInputChange}
                        />
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

