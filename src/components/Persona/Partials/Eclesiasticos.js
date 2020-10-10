import React, { Component } from 'react';
import Bautismo from './Bautismo';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class Eclesiasticos extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="tab-pane fade" id="eclesiasticos" role="tabpanel" aria-labelledby="eclesiasticos-tab">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3">
                                <label>Bautizado</label>
                            </div>
                            <div className="col-sm-2">
                                <input type="checkbox" name="per_Bautizado" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <Bautismo />

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Fecha recibio Espiritu Santo</label>
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
                                <label>Bajo imposicion de manos</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Bajo_Imposicion_De_Manos" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Cambios de domicilio</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="per_Cambios_De_Domicilio" className="form-control" />
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

export default Eclesiasticos;