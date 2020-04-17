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
    
    console.log(trainings);

    const [state, setState] = useState({columns, trainings});
    console.log(state.columns);
    // Strange! "trainings" becomes an empty array when pass to a new const state.
    console.log(state.trainings);

    return (
        <div>
            <MaterialTable
                title="Trainings"
                columns={columns}
                data={trainings}
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    const data = trainings ;
                                    data.push(newData);
                                    setState({...state, data });
                                }
                                resolve()
                            }, 1000)
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    const data = trainings ;
                                    const index = data.indexOf(oldData);
                                    data[index] = newData;
                                    setState({ ...state, data });
                                }
                                resolve()
                            }, 1000)
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    let data = trainings ;
                                    const index = data.indexOf(oldData);
                                    data.splice(index, 1);
                                    setState({ ...state, data });
                                }
                                resolve()
                            }, 1000)
                        }),
                }}
                options={{
                    rowStyle: {
                        backgroundColor: '#EEE',
                    },
                    headerStyle: {
                        backgroundColor: '#f0f8ff',
                    }
                }} 
            />    
        </div>
    )
}   