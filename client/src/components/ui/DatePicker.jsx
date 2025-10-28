import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ElegantDatePicker = ({ selected, onSelect }) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onSelect}
      inline 
    />
  );
};

export default ElegantDatePicker;