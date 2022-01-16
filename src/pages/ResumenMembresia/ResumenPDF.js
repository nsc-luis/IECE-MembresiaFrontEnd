import React, { Component } from 'react';
import { jsPDF } from "jspdf";

// Default export is a4 paper, portrait, using millimeters for units
class ResumenEnPDF extends Component {
    
    render() {
        const doc = new jsPDF();
        doc.text("Hello world!", 10, 10);
        doc.save("a4.pdf");
        return ( <>Hi!</> )
    }
}

export default ResumenEnPDF;
