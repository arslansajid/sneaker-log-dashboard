import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
import {toolbarConfig} from "../static/_textEditor";

import { updatePolicy, getPolicy } from '../backend/services/policyService';

export default class PrivacyPolicyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      policy: [],
      loading: false,
      description: RichTextEditor.createEmptyValue(),
    };
    this.postPrivacyPolicy = this.postPrivacyPolicy.bind(this);
  }
  
  componentDidMount() {
      getPolicy()
      .then((response) => {
        console.log(response);
        this.setState({
          policy: response,
          description: RichTextEditor.createValueFromString(response[0].privacyPolicy, 'html'),
        });
      });
  }

  setDescription = (description) => {
    const { policy } = this.state;
    policy[0].privacyPolicy = description.toString('html');
    this.setState({
      policy,
      description,
    });
  }

  postPrivacyPolicy(event) {
    event.preventDefault();
    const { loading, description, policy } = this.state;
    if (!loading) {
      const fd = new FormData();

      this.setState({ loading: true });
        let cloneObject = Object.assign({}, policy[0])
        updatePolicy(policy[0].uuid, cloneObject)
          .then((response) => {
              window.alert("Updated !");
              this.setState({ loading: false });
          })
          .catch((err) => {
            console.log(err)
            window.alert('ERROR UPDATING !')
            this.setState({ loading: false });
          })
      }
  }

  render() {
    console.log(this.state);
    const {
      description,
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

                  <div className="col-md-12 col-sm-12">
                    <RichTextEditor
                      value={description}
                      toolbarConfig={toolbarConfig}
                      onChange={(e) => {
                        this.setDescription(e);
                      }}
                    />
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

