import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class Matrimonio extends Component {

    //eci_Fecha_Boda_CivilRef = React.createRef();
    eci_Num_Acta_Boda_CivilRef = React.createRef();
    eci_Libro_Acta_Boda_CivilRef = React.createRef();
    eci_Oficialia_Boda_CivilRef = React.createRef();
    //eci_Fecha_Boda_EclesiasticaRef = React.createRef();
    eci_Lugar_Boda_EclesiasticaRef = React.createRef();
    eci_Nombre_ConyugeRef = React.createRef();
    eci_Cantidad_HijosRef = React.createRef();
    eci_Nombre_HijosRef = React.createRef();

    MatrimonioDatos = () => {
        this.props.MatrimonioDatos({
            //eci_Fecha_Boda_Civil : this.eci_Fecha_Boda_CivilRef.current.value,
            eci_Num_Acta_Boda_Civil : this.eci_Fecha_Boda_CivilRef.current.value,
            eci_Libro_Acta_Boda_Civil : this.eci_Fecha_Boda_CivilRef.current.value,
            eci_Oficialia_Boda_Civil : this.eci_Fecha_Boda_CivilRef.current.value,
            //eci_Fecha_Boda_Eclesiastica : this.eci_Fecha_Boda_CivilRef.current.value,
            eci_Lugar_Boda_Eclesiastica : this.eci_Fecha_Boda_CivilRef.current.value,
            eci_Nombre_Conyuge : this.eci_Fecha_Boda_CivilRef.current.value,
            eci_Cantidad_Hijos : this.eci_Fecha_Boda_CivilRef.current.value,
            eci_Nombre_Hijos : this.eci_Fecha_Boda_CivilRef.current.value
        });
    }

    render() {
        return (
            <React.Fragment>
                <div id="PersonalConMatrimonio">

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Fecha boda civil</label>
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
                                <label>Num acta boda civil</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="eci_Num_Acta_Boda_Civil" ref={this.eci_Num_Acta_Boda_CivilRef} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Libro acta boda civil</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="eci_Libro_Acta_Boda_Civil" ref={this.eci_Libro_Acta_Boda_Civil} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Oficialia boda civil</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="eci_Oficialia_Boda_Civil" ref={this.eci_Oficialia_Boda_CivilRef} className="form-control" />
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
                                <label>Lugar boda eclesiastica</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="eci_Lugar_Boda_Eclesiastica" ref={this.eci_Lugar_Boda_EclesiasticaRef} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Nombre conyuge</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="text" name="eci_Nombre_Conyuge" ref={this.eci_Nombre_ConyugeRef} className="form-control" />
                            </div>
                        </div>
                    </div>

                </div>

                <div id="hijos">
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Cantidad hijos</label>
                            </div>
                            <div className="col-sm-4">
                                <input type="number" for="eci_Cantidad_Hijos" ref={this.eci_Cantidad_HijosRef} className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-2">
                                <label>Nombre de los hijos</label>
                            </div>
                            <div className="col-sm-4">
                                <textarea name="eci_Lugar_Boda_Eclesiastica" ref={this.eci_Nombre_HijosRef} className="form-control" ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}

export default Matrimonio;