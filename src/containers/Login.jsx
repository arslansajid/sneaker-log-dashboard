import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import Cookie from "js-cookie";
import axios from "axios/index";
import Formsy from 'formsy-react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { API_END_POINT } from '../config';

const style = {
  logoWrapper: {
    width: '70%',
    margin: '15px auto 0',
    height: 100 + 'px',
  },
  svg: {
    width: '100%',
    fill: '#ffffff',
  },
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      username: '',
      password: '',
      loading: false
    }
  }

  componentDidMount() {
    let token = Cookie.get('sneakerlog_access_token');
    if (token) {
      this.props.history.push("/");
    }
  }

  submit() {
    const {username, password} = this.state;
    if (!this.state.loading) {
      this.setState({ loading: true });

      // untill the backend gets ready
      Cookie.set('sneakerlog_access_token', { expires: 14 })
      this.props.history.push("/");

      // axios.post(`${API_END_POINT}/api/v1/users/sign_in?email=${username}&password=${password}`)
      // .then(response => {
      //   if (response && response.status == 200) {
      //     const token = response.data.Authorization_Token;
      //     console.log('Token', token)
      //     axios.defaults.headers.common['Authorization'] = `${token}`;
      //     if (process.env.NODE_ENV === 'production') {
      //       Cookie.set('sneakerlog_access_token', `${token}`, { expires: 14 })
      //     }
      //     else {
      //       Cookie.set('sneakerlog_access_token', `${token}`, { expires: 14 })
      //     }
      //     this.props.history.push("/");
      //   }
      // })
      // .catch(error => {
      //   this.setState({ loading: false });
      //   window.alert("ERROR !!!");
      // });
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center animated fadeIn login">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <Formsy onValidSubmit={this.submit.bind(this)}>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="email" placeholder="Username" required
                               ref={(input) => (this.username = input)}
                               onChange={(e) => this.setState({ username: e.target.value })}/>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" required
                               ref={(input) => (this.password = input)}
                               onChange={(e) => this.setState({ password: e.target.value })}/>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="roomy-blue" className={`px-4 ${this.state.loading ? 'disabled' : ''}`}>
                            <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`}/> Login
                          </Button>
                        </Col>
                        {/*<Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>*/}
                      </Row>
                    </Formsy>
                  </CardBody>
                </Card>
                <Card className="text-white bg-roomy-blue py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                    <div style={style.logoWrapper} className={`svg-logo`}>
                      <img className={`companyLogo`} src={`${require('panzer.png')}`} />
                    </div>
                      <div className={`text-center`} style={{ fontSize: '20px', paddingTop: "10px", fontWeight: "bold" }}>SneakerLog Dashboard</div>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default withRouter(connect()(Login));
