import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import Snackbar from '@material-ui/core/Snackbar';
import AddTraining from './AddTraining';

export default function CustomerTable() {

    const [customers, setCustomers] = useState([]);
    const [msg, setMsg] = useState('blabla');
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState();

    useEffect(() => {
        getCustomers();
    }, [])

    const getCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
            .then(response => response.json())
            .then(data => {
                setCustomers(data.content);
            })
            .catch(err => console.error(err))
    }

    const addCustomer = (customer) => {
        fetch('https://customerrest.herokuapp.com/api/customers',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customer)
            })
            .then(_ => getCustomers()) //refresh from database
            .then(_ => {
                setMsg("New Customer is added"); //adding confirmed 
                setOpen(true);
            })
            .catch(err => console.error(err))
    }

    const updateCustomer = (link, customer) => {
        fetch(link,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customer)
            })
            .then(_ => getCustomers()) //refresh from database
            .then(_ => {
                setMsg("Customer is updated"); //updating confirmed 
                setOpen(true);
            }
            ).catch(err => console.error(err))
    }

    const deleteCustomer = (link) => {
        fetch(link, { method: 'Delete' })
            .then(_ => getCustomers()) //refresh from database
            .then(_ => setMsg("Customer is removed.")) //deletion confirmed
            .then(_ => setOpen(true))
            .catch(err => console.error(err))

    }

    const addTraining = (training) => {
        if (training.activity !== '' && training.duration > 0 && training.duration !== '') {
            fetch('https://customerrest.herokuapp.com/api/trainings',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(training)
                })
                .then(console.log(training))
                .then(_ => {
                    setMsg("New Training is added");
                    setOpen(true);
                }
                ).catch(err => console.error(err))
        } else {
            alert("Activity name is required and duration > 0")
        }

    }


    const handelClose = () => {
        setOpen(false);
    }

    const columns = [
        {
            title: '',
            editable: 'never',
            render: rowData => (<AddTraining addTraining={addTraining} customer={rowData} />)
        },
        {
            title: 'First Name',
            field: 'firstname',
            headerStyle: {
                backgroundColor: '#f0f8ff',
            }
        },
        {
            title: 'Last Name',
            field: 'lastname',
        },
        {
            title: 'Email',
            field: 'email',
        },
        {
            title: 'City',
            field: 'city',
        },
        {
            title: 'Post Code',
            field: 'postcode',
        },
        {
            title: 'Street Address',
            field: 'streetaddress',
        },
        {
            title: 'Phone',
            field: 'phone',
        }
    ]

    const [state, setState] = useState({ columns, customers });
    /* console.log(state.columns);
        Strange! "customers" becomes an empty array when pass to a new const state.
        onsole.log(state.customers); */

    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handelClose} message={msg}></Snackbar>
            <MaterialTable
                title="Customers"
                columns={columns}
                data={customers}
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                {
                                    //add to current state (fast refresh)
                                    let data = customers;
                                    if (newData.firstname !== '' && newData.lastname !== '' && newData.firstname != null && newData.lastname != null) {
                                        data.push(newData);
                                        setState({ ...state, data });
                                        //add to database
                                        addCustomer(newData);
                                    } else {
                                        alert("can not add empty customer");
                                    }

                                }
                                resolve()
                            }, 1000)
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                {
                                    //update to current state (fast refresh)
                                    let data = customers;
                                    let index = data.indexOf(oldData);
                                    let link_self = oldData.links[0].href;

                                    if (newData.firstname !== '' && newData.lastname !== '' && newData.firstname != null && newData.lastname != null) {
                                        data[index] = newData;
                                        setState({ ...state, data });
                                        //update to database                                      
                                        updateCustomer(link_self, newData);
                                    } else {
                                        alert("customer name is required")
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
                                    let data = customers;
                                    let index = data.indexOf(oldData);
                                    data.splice(index, 1);
                                    setState({ ...state, data });

                                    //delete from database
                                    let link_self = oldData.links[0].href;
                                    let link_training = oldData.links[2].href;
                                    deleteCustomer(link_self);
                                    deleteCustomer(link_training);

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