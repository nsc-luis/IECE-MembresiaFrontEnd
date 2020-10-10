import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class Matrimonio extends Component {
    render() {
        return (
            <React.Fragment>
                <div id="PersonalConMatrimonio">

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="eci_Fecha_Boda_Civil">Fecha boda civil</label>
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
                                <label for="eci_Num_Acta_Boda_Civil">Num acta boda civil</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="eci_Num_Acta_Boda_Civil" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="eci_Libro_Acta_Boda_Civil">Libro acta boda civil</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="eci_Libro_Acta_Boda_Civil" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="eci_Oficialia_Boda_Civil">Oficialia boda civil</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="eci_Oficialia_Boda_Civil" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="eci_Fecha_Boda_Eclesiastica">Fecha boda eclesiastica</label>
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
                                <label for="eci_Lugar_Boda_Eclesiastica">Lugar boda eclesiastica</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="eci_Lugar_Boda_Eclesiastica" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="eci_Nombre_Conyuge">Nombre conyuge</label>
                            </div>
                            <div className="col-sm-4">
                                <input for="eci_Nombre_Conyuge" className="form-control" />
                            </div>
                        </div>
                    </div>

                </div>

                <div id="hijos">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="eci_Cantidad_Hijos">Cantidad hijos</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="number" for="eci_Cantidad_Hijos" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label for="eci_Nombre_Hijos">Nombre de los hijos</label>
                            </div>
                            <div className="col-sm-4">
                                <textarea for="eci_Lugar_Boda_Eclesiastica" className="form-control" ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}

export default Matrimonio;