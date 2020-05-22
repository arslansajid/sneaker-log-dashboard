import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import {Pagination, Modal, Button} from 'react-bootstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {getAdmins} from "../backend/services/adminService"

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('sneakerlog_access_token');

export default class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      admins: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Admins...',
      showModal: false,
      inviteEmail: "",
    }
  }

  componentWillMount() {
    this.fetchMember();
    let adminsResult =  getAdmins();
    console.log("adminsResult", adminsResult)
  }

  fetchMember = () => {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/v1/admin`)
      .then(response => {
        this.setState({
          admins: response.data.data,
          loading: false,
          responseMessage: 'No Admins Found'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Admins Found...'
        })
      })
  }

  deleteMember(memberId, index) {
    if (confirm("Are you sure you want to delete this admin?")) {
      axios.delete(`${API_END_POINT}/api/v1/admin/${memberId}`)
        .then(response => {
          const admins = this.state.admins.slice();
          admins.splice(index, 1);
          this.setState({ admins });
          window.alert(response.data.message);
        });
    }
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page - 1) * 10}`)
      .then(response => {
        this.setState({
          areas: response.data.items,
          activePage: page
        })
      })
  }

  handleInputChange = (event) => {
    this.setState({ inviteEmail: event.target.value });
  }

  handleSearch() {
    const { q } = this.state;
    if (q.length) {
      this.setState({ loading: true, admins: [], responseMessage: 'Loading Admin...' })
      // if(q === "") {
      //   this.fetchMember();
      // } else {
      axios.get(`${API_END_POINT}/api/items/admin/search`, { params: { "searchWord": this.state.q }, headers: { "auth-token": token } })
        .then((response) => {
          this.setState({
            admins: response.data.searchedItems,
            loading: false,
            responseMessage: 'No Admins Found...'
          })
        })
        .catch(() => {
          this.setState({
            loading: false,
            responseMessage: 'No Admins Found...'
          })
        })
    }
  }

  toggleModal = (value) => {
    this.setState({
      showModal: !this.state.showModal
    }, () => {
      if(value === "send" && this.state.inviteEmail.length) {
        window.alert("Email Sent")
      }
    })
  }

  render() {
    // console.log(this.state);
    const { loading, admins, responseMessage, showModal, inviteEmail } = this.state;
    return (
      <Fragment>
        <div className="row animated fadeIn">
          <div className="col-12">
            <div className="row space-1">
              <div className="col-sm-4">
                <h3>List of Admins</h3>
              </div>
              <div className="col-sm-4">
                {/* <div className='input-group'>
                <input
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchMember();
                    }
                  })}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.handleSearch();
                    }
                  }}
                />
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div> */}
              </div>

              <div className="col-sm-4 pull-right mobile-space">
                <a>
                <button type="button" onClick={() => this.toggleModal()} className="btn btn-info mr-2">Invite Admin</button>
                </a>
                <Link to="/admin/admin-form">
                  <button type="button" className="btn btn-success">Add New Admin</button>
                </Link>
              </div>

            </div>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.admins && this.state.admins.length >= 1 ?
                    this.state.admins.map((admin, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{admin.name}</td>
                        <td>{admin.email}</td>
                        {/* <td>
                          <Link to={`/admin/edit-admin/${admin.id}`}>
                            <span className="fa fa-edit" aria-hidden="true"></span>
                          </Link>
                        </td>
                        <td>
                          <span className="fa fa-trash" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.deleteMember(admin.id, index)}></span>
                        </td> */}
                      </tr>
                    )) :
                    (
                      <tr>
                        <td colSpan="15" className="text-center">{responseMessage}</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </div>
            {/* <div className="text-center">
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
          </div>
        </div>
        {showModal && (
          <Modal size="md" isOpen={showModal} toggle={() => this.toggleModal()} className={"operator-modal"}>
            <ModalHeader toggle={() => this.toggleModal()}>Invite Admin</ModalHeader>
            <ModalBody>
              <input
                required
                type="email"
                name="email"
                className="form-control"
                value={inviteEmail}
                onChange={this.handleInputChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button type="reset" color="success" size="md" onClick={() => this.toggleModal("send")}>Invite</Button>
            </ModalFooter>
          </Modal>
        )}
      </Fragment>
    );
  }
}
