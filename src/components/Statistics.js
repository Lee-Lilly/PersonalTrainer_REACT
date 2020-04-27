import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Chart } from "react-google-charts";

export default function Statistics() {
    const [trainings, setTrainings] = useState([]);

    const getTrainings = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
            .then(response => response.json())
            .then(data => setTrainings(data))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        getTrainings();
    }, [])

    //triming data
    let activityArray = _.compact(trainings).map(item => {
        //each item is put into an Object container
        const container = {};
        // only valid trainings are counted into statistics
        if (item.activity !== '' && item.customer != null && item.duration > 0 && item.duration !== '') {
            container.activity = item.activity;
            container.customer = item.customer.firstname + " " + item.customer.lastname;
            container.time_spent = item.duration;
        }
        return container;
    })
    //     console.log(activityArray);

    //prepare pieChartData
    //use lodash chain, groupBy, map and sumBy for data aggregation
    let activity_by_time_spent = _.chain(activityArray)
        .groupBy('activity')
        .map((element, id) => ({
            activity: id,
            time_spent: _.sumBy(element, 'time_spent'),
        })).value();

    //    console.log(activity_by_time_spent);  

    //coerce the aggregated data with google chart data format {[],[], ...} 
    let pieChartData = (activity_by_time_spent).map(item => {
        //put each item into an anray
        const container = [item.activity, item.time_spent];
        return container;
    })
    const pieChartHeaders = ["Activity types", "Time Spent"];
    pieChartData.unshift(pieChartHeaders);

    //prepare barChartData
    let time_spent_by_customer = _.chain(activityArray).groupBy('customer').map((element, id) => ({
        customer: id,
        time_spent: _.sumBy(element, 'time_spent'),
    })).value();

    let barChartData = (time_spent_by_customer).map(item => {
        //put each item into an anray
        const container = [item.customer, item.time_spent];
        return container;
    })
    const barChartHeader = ["Customers", "Time Spent"];
    barChartData.unshift(barChartHeader);

    //  render charts: pie chart and bar chart 
    return (
        <div>
            <Chart
                chartType="PieChart"
                data={pieChartData}
                width="80%"
                height="400px"
                options={{ title: 'Total Minutes Spent in Trainings' }}
                legendToggle
            />
            <Chart
                chartType="BarChart"
                data={barChartData}
                width="80%"
                height="400px"
                options={{
                    title: 'Active Customers',
                    hAxis: {
                        title: 'Total Minutes',
                        minValue: 0,
                    },
                    legend: { position: 'none' },
                }}
            />
        </div>
    )
}
