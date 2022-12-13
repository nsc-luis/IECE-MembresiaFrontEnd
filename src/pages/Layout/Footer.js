import React, {Component} from 'react';

class Footer extends Component {

    constructor(props){
        super(props);
    }
    render() {
        return(
            <React.Fragment>
                {/* Footer */}
                <footer className="sticky-footer bg-white">
                    <div className="container my-auto">
                        <div className="copyright text-center my-auto">
                            <span>Copyright &copy; IECE</span>
                        </div>
                    </div>
                </footer>

                {/* Scroll to Top Button*/}
                <a className="scroll-to-top rounded" href="#page-top">
                    <i className="fas fa-angle-up"></i>
                </a>
            </React.Fragment>
        );
    }
}
export default Footer;