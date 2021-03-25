import React, {useEffect, useState} from 'react';
import './UsersList.css';
// import Example from './range';
import {NavLink} from 'react-router-dom';
import Loader from '../UI/Loader/Loader';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {fetchUsers, fetchWorkHours, fetchTaskListByDate} from './actions';
import {TextField} from '@material-ui/core';
import WorkHours from '../WorkHours/WorkHours';
import SimpleTable from '../UI/Table/Table';
import {call, uniqid, batch, formatDate} from '../../utils/fetchDataBitrix24';

const Report = (props) => {
  const addMonths = (date, months) => {
    const d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  };

  const [dateFrom, setDateFrom] = useState(formatDate(addMonths(new Date(), -1), 'Y-m-d'));
  const [dateTo, setDateTo] = useState(formatDate(new Date(), 'Y-m-d'));
  const [tasks, setTasks] = useState([]);
  const [timeEstimate, setTimeEstimate] = useState({});
  const [timeSpentInLogs, setTimeSpentInLogs] = useState({});

  useEffect(() => {
    props.fetchUsers();
    props.fetchWorkHours();
    fetchTaskListByDate(dateFrom, dateTo);
  }, []);

  async function fetchTaskListByDate(from, to) {
    setDateTo(to);
    setDateFrom(from);
    try {
      const params = {
        'filter': {
          '>=CREATED_DATE': from,
          '<=CREATED_DATE': to
        }
      };
      const response = await call('tasks.task.list', params);
      const mapTasks = {};
      const timeEstimateByUserId = {};
      const timeSpentInLogsByUserId = {};
      let resData = [];
      if (response.result.tasks) {
        resData = response.result.tasks;
      } else {
        resData = response.result;
      }
      resData.map((item, index) => {
        if (mapTasks[item.responsibleId]) {
          mapTasks[item.responsibleId] += 1;
        } else {
          mapTasks[item.responsibleId] = 1;
        }
        if (timeEstimateByUserId[item.responsibleId]) {
          timeEstimateByUserId[item.responsibleId] += Number(item.timeEstimate);
        } else {
          timeEstimateByUserId[item.responsibleId] = Number(item.timeEstimate);
        }
        if (timeSpentInLogsByUserId[item.responsibleId]) {
          timeSpentInLogsByUserId[item.responsibleId] += Number(item.timeSpentInLogs);
        } else {
          timeSpentInLogsByUserId[item.responsibleId] = Number(item.timeSpentInLogs);
        }
      });
      setTasks(mapTasks);
      setTimeEstimate(timeEstimateByUserId);
      setTimeSpentInLogs(timeSpentInLogsByUserId);
    } catch (error) {
      setTasks(0);
      setTimeEstimate(0);
      setTimeSpentInLogs(0);
    }
  }

  const createData = () => {
    return props.users.map(user => {
      return {
        id: user.id,
        name: user.name,
        tasks: tasks[user.id] ? tasks[user.id] : 0,
        timeEstimate: timeEstimate[user.id] ? timeEstimate[user.id] : 0,
        timeSpentInLogs: timeSpentInLogs[user.id] ? timeSpentInLogs[user.id] : 0,
        hours: props.hours[user.id] ? props.hours[user.id] : 0,
      };
    });
  };

  return (
    <div className="container">
      <div className="Report">
        <p className="text">Фильтр по задачам</p>
        <TextField
          type="date"
          defaultValue={dateFrom}
          className="datepicker"
          onChange={(event) => fetchTaskListByDate(event.target.value, dateTo)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          type="date"
          defaultValue={dateTo}
          className="datepicker"
          onChange={(event) => fetchTaskListByDate(dateFrom, event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <SimpleTable rows={createData()} />
      </div>
    </div>
  );
};


function mapStateToProps(state) {
  return {
    hours: state.hours.hours,
    users: state.users.users,
    tasks: state.tasks.tasks,
    loading: state.users.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: () => dispatch(fetchUsers()),
    fetchWorkHours: () => dispatch(fetchWorkHours()),
  };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withConnect
)(Report);
