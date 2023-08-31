import React, {Component} from 'react';

class AgrupacionesMusicales extends Component {

    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount(){
       //Sube el cursor hasta la parte superior
    window.scrollTo(0, 0); 
    }
    
    render(){
        return(
            <>

            </>
        )
    }
}

export default AgrupacionesMusicales;