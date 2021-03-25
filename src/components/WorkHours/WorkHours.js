import React, {useState, useEffect} from 'react';
import {call} from '../../utils/fetchDataBitrix24';

const WorkHours = props => {
  const oldValue = props.hours[props.userId] ? props.hours[props.userId] : 0;
  const [count, setCount] = useState(oldValue);

  const handleChange = (event) => {
    setCount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const params = {
      'IBLOCK_TYPE_ID': 'lists',
      'IBLOCK_ID': '45',
      'ELEMENT_CODE': 'element' + props.userId,
      'FIELDS': {
        'NAME': props.userId,
        'PROPERTY_267': count
      }
    };
    if (props.hours[props.userId] === undefined) {
      await call('lists.element.add', params);
    } else {
      await call('lists.element.update', params);
    }
  };

  return (
    <form className="input-group" onSubmit={handleSubmit}>
      <input type="number"
        className="form-control"
        value={count}
        onChange={handleChange}
      />
      <div className="input-group-append">
        <input
          className="btn btn-primary"
          value="Установить"
          type="submit" />
      </div>
    </form>
  );
};

export default WorkHours;

