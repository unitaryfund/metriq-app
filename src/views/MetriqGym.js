import React from 'react';
import BarChartPanel from '../components/BarChartPanel';
import ViewHeader from '../components/ViewHeader'

const MetriqGym = () => {
  return (
    <div id='metriq-main-content' className='container'>
        <ViewHeader align='center'>Metriq Gym</ViewHeader>
        <BarChartPanel
          title={'Quantum Volume'}
          description={'Test description'}
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 72],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
    </div>
  );
};

export default MetriqGym;