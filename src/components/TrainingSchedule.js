import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from 'moment';

// must manually import the stylesheets for each plugin
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

export default function CalendarView() {
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

    //reformat training objects: map each item into an object and return a new array
    const eventsArray = trainings.map(item => {
        //each item is put into an Object container
        const container ={};
        // only valid trainings are mapped to calendar
        if (item.activity !== '' && item.customer != null && item.date != null && item.duration !== 0 ){
            container.title = item.activity + " / " + item.customer.firstname + " " + item.customer.lastname ;
            container.start = moment(item.date).toDate();
            container.end = moment(item.date).add(item.duration, 'm').toDate();
        } // get object     
        return container;
    })

    console.log(eventsArray);
  
    return (
        <div>
            <FullCalendar 
                defaultView="dayGridMonth" 
                plugins={[dayGridPlugin, timeGridPlugin]} 
                header={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
                }}
                events= {eventsArray}
            />
        </div>
    );
 

}