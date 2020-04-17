import React, { useState, useEffect } from 'react';
import MaterialTable from "material-table";

export default function CustomerTable() {
    const [customers, setCustomers] = useState([]);
    
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
   
    const columns = [
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
    
    const [state, setState] = useState({columns, customers});
    console.log(state.columns);
   // Strange! "customers" becomes an empty array when pass to a new const state.
    console.log(state.customers);

    return(
        <MaterialTable 
            title="Customers"
            columns={columns}
            data={customers}
            editable={{
                onRowAdd: newData =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            {
                                const data =  customers;
                                data.push(newData);
                                setState({...state, data}); 
                            }
                            resolve()
                        }, 1000)
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            {
                                const data = customers;
                                const index = data.indexOf(oldData);
                                data[index] = newData;
                                setState({...state, data}); 
                            }
                            resolve()
                        }, 1000)
                    }),
                onRowDelete: oldData =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            {
                                let data = customers;
                                const index = data.indexOf(oldData);
                                data.splice(index, 1);
                                setState({...state, data});
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
    )    
}