import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('sneakerlog_access_token');

export default class Sneakers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sneakers: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Sneakers...'
    }
  }

  componentWillMount() {
    this.fetchBrand();
  }

  fetchBrand = () => {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/v1/sneaker`)
    .then(response => {
      this.setState({
        sneakers: response.data.data,
        loading: false,
        responseMessage: 'No Sneakers Found'
      })
    })
    .catch(() => {
      this.setState({
        loading: false,
        responseMessage: 'No Sneakers Found...'
      })
    })
  }
  
  deleteBrand(brandId, index) {
    if(confirm("Are you sure you want to delete this sneaker?")) {
      axios.delete(`${API_END_POINT}/api/v1/sneaker/${brandId}`)
        .then(response => {
          const sneakers = this.state.sneakers.slice();
          sneakers.splice(index, 1);
          this.setState({ sneakers });
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
    this.setState({loading: true, sneakers: [], responseMessage: 'Loading Sneakers...'})
    // if(q === "") {
    //   this.fetchBrand();
    // } else {
      axios.get(`${API_END_POINT}/api/items/sneaker/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          sneakers: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Sneakers Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Sneakers Found...'
        })
      })
    }
  }

  render() {
    // console.log(this.state);
    const {loading, sneakers, responseMessage} = this.state; 
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Sneakers</h3>
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
                      this.fetchBrand();
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
              <Link to="/sneakers/sneakers-form">
                <button type="button" className="btn btn-success">Add New Sneakers</button>
              </Link>
          </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Release Date</th>
                </tr>
              </thead>
              <tbody>
                {this.state.sneakers && this.state.sneakers.length >= 1 ?
                this.state.sneakers.map((sneaker, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{sneaker.name}</td>
                  <td>{sneaker.program_name}</td>
                  <td>{sneaker.day_name}</td>
                  <td>
                    <Link to={`/sneakers/edit-sneaker/${sneaker.id}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteBrand(sneaker.id, index)}></span>
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
