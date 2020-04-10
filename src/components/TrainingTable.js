import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import Moment from "react-moment";

export default function TrainingTable() {
    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        getTrainings();
    }, [])

    const getTrainings = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
            .then(response => response.json())
            .then(data => setTrainings(data))
            .catch(err => console.error(err))
    }

    const columns = [
        {
            title: 'Activity',
            field: 'activity'
        },
        {
            title: 'Date',
            field: 'date',
            render: rowData => {return (<Moment format='Do MMMM YYYY - HH:mm'>{rowData.date}</Moment>)}
        },
        {
            title: 'Duration',
            field: 'duration'
        },
        {
            title: 'Customer',
            field: 'customer',
            render: rowData => {
                if (rowData.customer != null) {
                    return (rowData.customer.firstname + " " + rowData.customer.lastname)
                } else { return ("null") }
            },
            customSort: (a,b) => b.customer.firstname < a.customer.firstname
        }
    ]

    return (
        <div>
            <MaterialTable
                title="Trainings"
                columns={columns}
                data={trainings}
            />    
        </div>
    )
}   