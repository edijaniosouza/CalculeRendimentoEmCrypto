import { Line } from 'react-chartjs-2';
import React, { Component } from 'react'

class Chart extends Component {

    componentWillUnmount() {
        
    }

    getClosedPrice(dataCoin) {
        console.log(dataCoin.close)
        return dataCoin.close
    }

    render() {
        return (
            <Line
                width={500}
                height={300}
                data={this.props.currencyData}
                options={{
                    responsive: true,
                    //maintainAspectRatio: false,
                    scales: {
                        yAxes: [
                          {
                            ticks: {
                              autoSkip: true,
                              maxTicksLimit: 10,
                              beginAtZero: false
                            },
                            gridLines: {
                              display: false
                            }
                          }
                        ],
                        xAxes: [
                          {
                            gridLines: {
                              display: false
                            }
                          }
                        ]
                      }
                }}
            />
        );
    }
}

export default Chart
