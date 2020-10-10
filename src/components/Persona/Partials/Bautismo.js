import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class Bautismo extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Lugar bautismo</label>
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="bau_Lugar_Bautismo" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Fecha bautismo</label>
                        </div>
                        <div className="col-sm-4">
                        <DayPickerInput
                                    dayPickerProps={{
                                        showWeekNumbers: true,
                                        todayButton: 'Today',
                                    }}
                                />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-2">
                            <label>Ministro que bautizo</label>
                        </div>
                        <div className="col-sm-4">
                            <input type="text" name="bau_Ministro_Que_Bautizo" className="form-control" />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Bautismo;