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
            .then(data => setCustomers(data.content))
            .catch(err => console.error(err))
    }

    const columns = [
        {
            title: 'First Name',
            field: 'firstname',
        },
        {
            title: 'Last Name',
            field: 'lastname'
        },
        {
            title: 'Email',
            field: 'email'
        },
        {
            title: 'City',
            field: 'city'
        },
        {
            title: 'Post Code',
            field: 'postcode'
        },
        {
            title: 'Street Address',
            field: 'streetaddress'
        },
        {
            title: 'Phone',
            field: 'phone'
        }
    ]

    return(
        <MaterialTable 
            title="Customers"
            columns={columns}
            data={customers}
        />
    )    
}