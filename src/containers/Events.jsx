import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {getEvents, deleteEvent} from "../backend/services/eventService";
// import {Pagination} from 'react-bootstrap';
import SnackBar from "../components/SnackBar";

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
import moment from 'moment';
const token = Cookie.get('sneakerlog_access_token');

export default class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Events...',
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success"
    }
  }

  componentWillMount() {
    this.fetchEvent();
  }

  fetchEvent = () => {
    this.setState({ loading: true })
    getEvents()
    .then(response => {
      this.setState({
        events: response,
        loading: false,
        responseMessage: 'No Events Found'
      })
    })
    .catch(() => {
      this.setState({
        loading: false,
        responseMessage: 'No Events Found...'
      })
    })
  }
  
  deleteEvent(eventId, index) {
    if(confirm("Are you sure you want to delete this event?")) {
      deleteEvent(eventId)
        .then(response => {
          const events = this.state.events.slice();
          events.splice(index, 1);
          this.setState({
            events,
            showSnackBar: true,
            snackBarMessage: "Event deleted successfully",
            snackBarVariant: "success",
          });
        })
        .catch(() => {
          this.setState({
            showSnackBar: true,
            snackBarMessage: "Error deleting event",
            snackBarVariant: "error",
          });
        })
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
    this.setState({loading: true, events: [], responseMessage: 'Loading Event...'})
    // if(q === "") {
    //   this.fetchEvent();
    // } else {
      axios.get(`${API_END_POINT}/api/items/event/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          events: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Events Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Events Found...'
        })
      })
    }
  }

  closeSnackBar = () => {
    this.setState({ showSnackBar: false })
  }

  render() {
    // console.log(this.state);
    const {loading, events, responseMessage,
      showSnackBar,
      snackBarMessage,
      snackBarVariant
    } = this.state; 
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
              <h3>List of Events</h3>
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
                      this.fetchEvent();
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
              <Link to="/events/event-form">
                <button type="button" className="btn btn-success">Add New Event</button>
              </Link>
          </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Title</th>
                  <th>Image</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>About</th>
                </tr>
              </thead>
              <tbody>
                {this.state.events && this.state.events.length >= 1 ?
                this.state.events.map((event, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{event.name}</td>
                  <td>{<img style={{height: '50px', width: '50px'}} src={event.image} />}</td> 
                  <td>{event.location}</td>
                  <td>{moment(new Date(event.date.seconds*1000)).format("DD MMM YYYY")}</td>
                  <td>{moment(new Date(event.time.startTime.seconds*1000)).format("hh:mm A")} - {moment(new Date(event.time.endTime.seconds*1000)).format("hh:mm A")}</td>
                  <td dangerouslySetInnerHTML={{__html: event.about}}></td>
                  <td>
                    <Link to={`/events/edit-event/${event.uuid}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteEvent(event.uuid, index)}></span>
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
