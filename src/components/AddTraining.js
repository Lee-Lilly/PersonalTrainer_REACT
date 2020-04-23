import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';

export default function AddTraining(props) {
    const [open, setOpen] = useState(false);
    const [training, setTraining] = useState({date : new Date(), activity: '', duration: '', customer:''})
    
  //  console.log(props.customer.links);

    const handleClickOpen = () => {
        setTraining({
            activity: '',
            date: new Date(),
            duration: '',
            customer: props.customer.links[1].href
        });
        setOpen(true);
    };

    const handleClose = () => {
        props.addTraining(training);
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const inputChanged = (event) => {
        setTraining({ ...training, [event.target.name]: event.target.value });
    }

    const dateChanged = date => {
        setTraining({ ...training, date: date });
    }


    return (
        <div>
            <Button color='primary' onClick={handleClickOpen}>Add Training</Button>          
            <Dialog open={open} onClose={handleClose} disableBackdropClick={true} disableEscapeKeyDown={true} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add a new training</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="activity"
                        className="form-control"
                        label="Activity"
                        type="text"
                        value={training.activity}
                        onChange={inputChanged}
                        required
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">  
                            <KeyboardDateTimePicker
                                autoOk
                                id="date"
                                margin="normal"
                                label="Date"
                                className="form-control"
                                value={training.date}
                                onChange={dateChanged}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                required
                            />
                        </Grid>
                    </MuiPickersUtilsProvider> 
                    <TextField
                        margin="dense"
                        name="duration"
                        className="form-control"
                        label="Duration"
                        type="text"
                        value={training.duration}
                        onChange={inputChanged}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}