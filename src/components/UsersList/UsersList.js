import React, {useEffect, useState} from 'react';
import './UsersList.css';
import {NavLink} from 'react-router-dom';
import Loader from '../../components/UI/Loader/Loader';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {fetchUsers, fetchWorkHours} from './actions';
import WorkHours from '../../components/WorkHours/WorkHours';
import {call, uniqid, batch} from '../../utils/fetchDataBitrix24';

const UsersList = (props) => {
  useEffect(() => {
    props.fetchUsers();
    props.fetchWorkHours();
  }, []);

  const renderUsers = () => {
    return props.users.map(user => {
      // eslint-disable-next-line max-len
      let photo = 'data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20111%20124%22%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M230.509731%2C178.396362%20C230.509731%2C173.353762%20223.976787%2C167.593687%20211.111912%2C164.237023%20C206.753338%2C163.010398%20202.609991%2C161.108272%20198.829977%2C158.59864%20C198.003309%2C158.122014%20198.128942%2C153.718295%20198.128942%2C153.718295%20L193.985548%2C153.081948%20C193.985548%2C152.724479%20193.631262%2C147.443565%20193.631262%2C147.443565%20C198.588761%2C145.762698%20198.078689%2C135.847358%20198.078689%2C135.847358%20C201.227065%2C137.609352%20203.277405%2C129.762771%20203.277405%2C129.762771%20C207.001183%2C118.861221%20201.423054%2C119.520385%20201.423054%2C119.520385%20C202.398925%2C112.865252%20202.398925%2C106.101453%20201.423054%2C99.4463204%20C198.943048%2C77.3694133%20161.60476%2C83.3627307%20166.032086%2C90.5729655%20C155.119557%2C88.54477%20157.609613%2C113.598054%20157.609613%2C113.598054%20L159.976549%2C120.085744%20C155.328108%2C123.128037%20158.559403%2C126.806677%20158.720214%2C131.040535%20C158.948867%2C137.292447%20162.740487%2C135.996937%20162.740487%2C135.996937%20C162.974165%2C146.315381%20168.017096%2C147.659061%20168.017096%2C147.659061%20C168.964373%2C154.139145%20168.373895%2C153.036314%20168.373895%2C153.036314%20L163.886265%2C153.583927%20C163.947015%2C155.057567%20163.828027%2C156.533155%20163.531978%2C157.977505%20C158.25537%2C160.350494%20157.119642%2C161.742343%20151.875699%2C164.062091%20C141.74461%2C168.541868%20130.734087%2C174.367859%20128.776716%2C182.211905%20C126.819346%2C190.055951%20125%2C207.138672%20125%2C207.138672%20L236%2C207.138672%20L230.509731%2C178.396362%20Z%22%20transform%3D%22translate%28-125%20-84%29%22/%3E%3C/svg%3E';
      if (user.photo) {
        photo = user.photo;
      }

      return (
        <div className="card item" key={user.id} data-id={user.id}>
          <div className="card-body__photo">
            {/* eslint-disable-next-line max-len*/}
            <img src={photo} className="card-body__img" alt={user.name} />
          </div>
          <h6 className="card-title ml-3"> {user.name}</h6>
          <p className="card-text ml-3">{user.email}</p>
          <p className="card-text ml-3">{user.position}</p>
          {
            props.hours.length == 0 ?
              <Loader /> :
              <WorkHours
                userId={user.id}
                hours={props.hours}
              />
          }
        </div>
      );
    });
  };

  return (
    <div className="container">
      <div className="Userslist">
        <h1 className="py-3">???????? ?? ?????????? ???? ??????????????????????</h1>
        {
            props.loading || !props.users.length != 0 ?
              <Loader /> :
              renderUsers()
        }
      </div>
    </div>
  );
};


function mapStateToProps(state) {
  return {
    hours: state.hours.hours,
    users: state.users.users,
    loading: state.users.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: () => dispatch(fetchUsers()),
    fetchWorkHours: () => dispatch(fetchWorkHours())
  };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withConnect
)(UsersList);
