import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import moment from "moment";
import Snackbar from '@material-ui/core/Snackbar';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export default function TrainingTable() {
    const [trainings, setTrainings] = useState([]);
    const [msg, setMsg] = useState('blabla');
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState();

    useEffect(() => {
        getTrainings();
    }, [])

    const getTrainings = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
            .then(response => response.json())
            .then(data => setTrainings(data))
            .catch(err => console.error(err))
    }

    const updateTraining = (link, training) => {
        fetch(link,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(training)
            })
            .then(console.log(training))
            .then(_ => getTrainings())
            .then(_ => {
                setMsg("Training is updated");
                setOpen(true);
            }
            ).catch(err => console.error(err))
    }

    const deleteTraining = (link) => {
        fetch(link, { method: 'Delete' })
            .then(_ => getTrainings())
            .then(_ => setMsg("Training is removed."))
            .then(response => getTrainings()) //refresh the table
            .then(_ => setOpen(true)) //message sent after deletion
            .catch(err => console.error(err))

    }

    const handelClose = () => {
        setOpen(false);
    }

    const columns = [
        {
            title: 'Activity',
            field: 'activity'
        },
        {
            title: 'Date',
            field: 'date',
            render: rowData => {
                return (moment(rowData.date).format('MMMM Do YYYY, h:mm a'))
            },
            editComponent: ({ value, onChange }) => (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDateTimePicker
                        id="dateTime"
                        margin="normal"
                        label="Date & Time"
                        value={value}
                        onChange={onChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date & time',
                        }}
                    />
                </MuiPickersUtilsProvider>
            )
        },
        {
            title: 'Duration',
            field: 'duration'
        },
        {
            title: 'Customer',
            field: 'customer',
            editable: 'never',
            render: rowData => {
                if (rowData.customer != null) {
                    return (rowData.customer.firstname + " " + rowData.customer.lastname)
                } else { return ("null") }
            },
            customSort: (a, b) => b.customer.firstname < a.customer.firstname
        }
    ]
    //create a current table state for testing or fast refresh
    const [state, setState] = useState({ columns, trainings });

    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handelClose} message={msg}></Snackbar>
            <MaterialTable
                title="Trainings"
                columns={columns}
                data={trainings}
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                {
                                    //update to the current state (fast refresh)
                                    let data = trainings;
                                    let index = data.indexOf(oldData);
                                    let training_id = oldData.id;
                                    const link = 'https://customerrest.herokuapp.com/api/trainings/' + training_id;

                                    if (newData.activity !== '' && newData.duration > 0 && newData.duration !== '') {
                                        data[index] = newData;
                                        setState({ ...state, data });
                                        //update to database 
                                        updateTraining(link, newData);
                                    } else { //give feedback through current table state
                                        alert("Activity name is required and duration > 0");
                                    }
                                }
                                resolve()
                            }, 1000)
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                {
                                    //delete from current state (fast refresh)
                                    let data = trainings;
                                    let index = data.indexOf(oldData);
                                    data.splice(index, 1);
                                    setState({ ...state, data });

                                    //delete from database
                                    let training_id = oldData.id;
                                    const link = 'https://customerrest.herokuapp.com/api/trainings/' + training_id;
                                    deleteTraining(link);
                                }
                                resolve()
                            }, 1000)
                        }),
                }}
                onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow))}
                options={{
                    rowStyle: rowData => ({
                        backgroundColor: (selectedRow &&
                            selectedRow.tableData.id === rowData.tableData.id) ? '#f2f2f2' : '#ffffff'
                    }),

                    headerStyle: {
                        backgroundColor: '#f0f8ff',
                    }
                }}
            />
        </div>
    )
}   