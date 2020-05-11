import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('sneakerlog_access_token');

export default class Member extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Members...'
    }
  }

  componentWillMount() {
    this.fetchMember();
  }

  fetchMember = () => {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/v1/member`)
    .then(response => {
      this.setState({
        members: response.data.data,
        loading: false,
        responseMessage: 'No Members Found'
      })
    })
    .catch(() => {
      this.setState({
        loading: false,
        responseMessage: 'No Members Found...'
      })
    })
  }
  
  deleteMember(memberId, index) {
    if(confirm("Are you sure you want to delete this member?")) {
      axios.delete(`${API_END_POINT}/api/v1/member/${memberId}`)
        .then(response => {
          const members = this.state.members.slice();
          members.splice(index, 1);
          this.setState({ members });
          window.alert(response.data.message);
        });
    }
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.items,
          activePage: page
        })
      })
  }

  handleSearch() {
    const { q } = this.state;
    if(q.length) {
    this.setState({loading: true, members: [], responseMessage: 'Loading Member...'})
    // if(q === "") {
    //   this.fetchMember();
    // } else {
      axios.get(`${API_END_POINT}/api/items/member/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          members: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Members Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Members Found...'
        })
      })
    }
  }

  render() {
    // console.log(this.state);
    const {loading, members, responseMessage} = this.state; 
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Members</h3>
            </div>
            <div  className="col-sm-4">
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
              <Link to="/members/member-form">
                <button type="button" className="btn btn-success">Add New Member</button>
              </Link>
          </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Name</th>
                  <th>Program</th>
                  <th>Day</th>
                </tr>
              </thead>
              <tbody>
                {this.state.members && this.state.members.length >= 1 ?
                this.state.members.map((member, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{member.name}</td>
                  <td>{member.program_name}</td>
                  <td>{member.day_name}</td>
                  <td>
                    <Link to={`/members/edit-member/${member.id}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteMember(member.id, index)}></span>
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
