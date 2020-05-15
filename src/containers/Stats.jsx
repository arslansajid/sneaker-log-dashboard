import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'js-cookie';
import { API_END_POINT } from '../config';
const token = Cookie.get('sneakerlog_access_token');

// import {Pagination} from 'react-bootstrap';
// import LineChart from '../components/LineChart'
// import PieChart from '../components/PieChart'
// import BarChart from '../components/BarChart'
// import Doughnut from '../components/Doughnut'

export default class Area extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
      programs: [],
    }
  }

  // componentWillMount() {
  //     axios.get(`${API_END_POINT}/api/v1/exercise`)
  //     .then(response => {
  //       this.setState({
  //         exercises: response.data.data,
  //         loading: false,
  //         responseMessage: 'No Exercise Found'
  //       })
  //     })
  //     .catch(err => {
  //       console.log("error fetching data");
  //     })
  //     axios.get(`${API_END_POINT}/api/v1/program`)
  //     .then(response => {
  //       this.setState({
  //         programs: response.data.program_set,
  //         responseMessage: 'No Programs Found...'
  //       })
  //     })
  //     .catch(err => {
  //       console.log("error fetching data");
  //     })
  // }

  render() {
    const { exercises, programs } = this.state;
    return (
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-sm-4">
            </div>
            <div className="col-sm-4 pull-right mobile-space">
            </div>
          </div>
          <div className="text-center space-2">
          </div>
            <div className = 'row space-1'>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Members</h3>
                {/* <h5>{programs.length ? programs.length : "Fetching programs..."}</h5> */}
                <h5>0</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Brands</h3>
                <h5>0</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total News Articles</h3>
                <h5>0</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Events</h3>
                <h5>0</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Total Products</h3>
                <h5>0</h5>
              </div>
              <div className='col-sm-6 my-3'>
                <h3 className='space-1'>Sneaker Releases</h3>
                <h5>0</h5>
              </div>
            </div>
        </div>
      </div>
    );
  }
}
