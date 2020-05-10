import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('sneakerlog_access_token');

export default class Brand extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Brands...'
    }
  }

  componentWillMount() {
    this.fetchBrand();
  }

  fetchBrand = () => {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/v1/brand`)
    .then(response => {
      this.setState({
        brands: response.data.data,
        loading: false,
        responseMessage: 'No Brands Found'
      })
    })
    .catch(() => {
      this.setState({
        loading: false,
        responseMessage: 'No Brands Found...'
      })
    })
  }
  
  deleteBrand(brandId, index) {
    if(confirm("Are you sure you want to delete this brand?")) {
      axios.delete(`${API_END_POINT}/api/v1/brand/${brandId}`)
        .then(response => {
          const brands = this.state.brands.slice();
          brands.splice(index, 1);
          this.setState({ brands });
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
    this.setState({loading: true, brands: [], responseMessage: 'Loading Brand...'})
    // if(q === "") {
    //   this.fetchBrand();
    // } else {
      axios.get(`${API_END_POINT}/api/items/brand/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          brands: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Brands Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Brands Found...'
        })
      })
    }
  }

  render() {
    // console.log(this.state);
    const {loading, brands, responseMessage} = this.state; 
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Brands</h3>
            </div>
            <div  className="col-sm-4">
              <div className='input-group'>
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
              </div>
            </div>

          <div className="col-sm-4 pull-right mobile-space">
              <Link to="/brands/brand-form">
                <button type="button" className="btn btn-success">Add New Brand</button>
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
                {this.state.brands && this.state.brands.length >= 1 ?
                this.state.brands.map((brand, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{brand.name}</td>
                  <td>{brand.program_name}</td>
                  <td>{brand.day_name}</td>
                  <td>
                    <Link to={`/brands/edit-brand/${brand.id}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteBrand(brand.id, index)}></span>
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
