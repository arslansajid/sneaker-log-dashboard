import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import { getUsers, deleteUser } from "../backend/services/usersService";
// import {signInWithEmail} from "../backend/services/authService";
import SnackBar from "../components/SnackBar";

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('sneakerlog_access_token');


export default class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Users...',
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success"
    }
  }
  componentWillMount() {
    // signInWithEmail('arslan@gmail.com', "123456")
    // .then((response) => {
    //   console.log("response", response)
    // })
    // .catch((error) => {
    //   console.log("error", error)
    // })
    this.fetchUsers();
  }

  fetchUsers = () => {
    getUsers()
      .then(response => {
        console.log("############", response)
        this.setState({
          users: response,
          // pages: Math.ceil(response.data.length/10),
          loading: false,
          responseMessage: 'No Users Found'
        })
      })
      .catch((err) => {
        console.log("#######err#####", err)
        this.setState({
          loading: false,
          responseMessage: 'No Users Found...'
        })
      })
  }

  removeUser(userId, index) {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId)
        .then(response => {
          const users = this.state.users.slice();
          users.splice(index, 1);
          this.setState({
            users,
            showSnackBar: true,
            snackBarMessage: "User deleted successfully",
            snackBarVariant: "success",
          });
        })
        .catch(() => {
          this.setState({
            showSnackBar: true,
            snackBarMessage: "Error deleting user",
            snackBarVariant: "error",
          });
        })
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

  handleSearch() {
    axios.get(`/api/area?q=${this.state.q}`)
      .then((response) => {
        this.setState({
          areas: response.data.items,
          activePage: 1,
          pages: Math.ceil(response.data.total / 10)
        })
      })
  }

  handleSearch() {
    const { q } = this.state;
    if (q.length) {
      this.setState({ loading: true, users: [], responseMessage: 'Loading Users...' })
      axios.get(`${API_END_POINT}/api/users/search`, { params: { "searchWord": this.state.q }, headers: { "auth-token": token } })
        .then((response) => {
          this.setState({
            users: response.data.searchedItems,
            loading: false,
            responseMessage: 'No Users Found...'
          })
        })
        .catch(() => {
          this.setState({
            loading: false,
            responseMessage: 'No Users Found...'
          })
        })
    }
  }

  closeSnackBar = () => {
    this.setState({ showSnackBar: false })
  }

  render() {
    // console.log(this.state);
    const { loading, users, responseMessage,
      showSnackBar,
      snackBarMessage,
      snackBarVariant } = this.state;
    return (
      <div className="row animated fadeIn">
        {showSnackBar && (
          <SnackBar
            open={showSnackBar}
            message={snackBarMessage}
            variant={snackBarVariant}
            onClose={() => this.closeSnackBar()}
          />
        )}
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Users</h3>
            </div>
            <div className="col-sm-4">
              {/* <div className='input-group'>
                <input
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchUsers();
                    }
                  })}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.handleSearch();
                    }
                  }}
                  className='form-control' type="text" name="search" placeholder="Enter search keyword"
                  value={this.state.q}
                  // onChange={(event) => this.setState({ q: event.target.value })}
                />
                <span className="input-group-btn">
                  <button type="button" onClick={() => this.handleSearch()}
                          className="btn btn-info search-btn">Search</button>
                </span>
              </div> */}
            </div>
            <div className="col-sm-4 pull-right mobile-space">
              <Link to='/users/user-form'>
                <button type="button" className="btn btn-success">Add new User</button>
              </Link>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Phone</th>
                  <th>No. of Collections</th>
                  <th>Size</th>
                  <th>Favorite Brands</th>
                  <th>Sneaker Count</th>
                  <th>Sneaker Scans</th>
                </tr>
              </thead>
              <tbody>
                {this.state.users && this.state.users.length >= 1 ?
                  this.state.users.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{<img style={{ height: '50px', width: '50px' }} src={user.profileImage} />}</td>
                      <td>{user.name}</td>
                      <td>{user.userName}</td>
                      <td>{user.phone}</td>
                      <td>{user.collections}</td>
                      <td>{user.sneakerSize}</td>
                      <td>{user.favoriteBrands}</td>
                      <td>{user.sneakerCount}</td>
                      <td>{user.sneakerScans}</td>
                      <td>
                        <Link to={`/users/edit-user/${user.uuid}`}>
                          <span className="fa fa-edit" aria-hidden="true"></span>
                        </Link>
                      </td>
                      <td>
                        <span className="fa fa-trash" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.removeUser(user.uuid, index)}></span>
                      </td>
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
    );
  }
}
