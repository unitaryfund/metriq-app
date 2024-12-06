import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChartPanel = (props) => {
  return (
    <div>
      <h5>{props.title}</h5>
      <p>{props.description}</p>
      <Bar
        data={props.data}
        options={props.options}
      />
    </div>
  );
};

export default BarChartPanel;