import React, {Component} from 'react';
import './Select.css';
import Input from '../Input/Input';
import Scrollbar from 'react-scrollbars-custom';

function isInvalid({valid, touched, shouldValidate}) {
  return !valid && shouldValidate && touched;
}

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      term: ''
    };

    this.onClickSelectHandler = this.onClickSelectHandler.bind(this);
    this.onClickItemHandler = this.onClickItemHandler.bind(this);
  }

  onClickSelectHandler(event) {
    this.props.onChange(event);

    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onClickItemHandler(event) {
    this.props.onChange(event);

    this.setState({
      value: event.target.dataset.value,
      label: event.target.innerHTML,
      isOpen: !this.state.isOpen
    });
  }

  onChangeHandler(event) {
    this.setState({
      term: event.target.value,
    });
  }

  searchItems() {
    const visibleItems = this.props.items;
    if (this.state.term.length === 0) {
      return visibleItems;
    }
    return visibleItems.filter((item, index) => {
      return item.NAME.toLowerCase().indexOf(this.state.term.toLowerCase()) > -1;
    });
  }

  showNameById() {
    return this.props.items.map((item) => {
      if (this.props.value === item.ID) {
        return item.NAME;
      }
    });
  }


  render() {
    const classes = ['Select'];

    if (this.state.isOpen) {
      classes.push('open');
    }

    return (
      <div className={classes.join(' ')}>
        <div className="Select__container">
          <div className="Select__selection" onClick={this.onClickSelectHandler}>
            <span className="Select__label">
              {this.props.value === '' ? this.props.label : this.showNameById()}
            </span>
          </div>
          <ul className="Select__dropdown-wrapper">
            <Scrollbar>
              {this.props.view === 'has-search' ?
                        <Input
                          value={this.state.term}
                          searchIcon="true"
                          onChange={event => this.onChangeHandler(event)}
                        /> :
                        null}
              {this.searchItems().map((item, index) => {
                return (
                  <li
                    key={index}
                    className={item.ID !== this.props.value ? 'Select__item' : 'Select__item selected'}
                    data-value={item.ID}
                    onClick={this.onClickItemHandler}
                  >
                    {item.NAME}
                  </li>
                );
              })}
              {this.searchItems().length === 0 ? <li className="Select__item">{this.props.notFoundmMsg}</li> : null}
            </Scrollbar>
          </ul>
        </div>
        {
                isInvalid(this.props) ?
                <span className="Select__label--error">{this.props.errorMessage || 'Неккоректное значение'}</span> :
                null
        }
      </div>
    );
  }
}

export default Select;
