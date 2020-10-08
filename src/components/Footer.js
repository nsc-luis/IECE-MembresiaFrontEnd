import React from 'react';

class Footer extends React.Component {
    render() {
        return(
            <div>
                {/* Footer */}
                <footer class="sticky-footer bg-white">
                    <div class="container my-auto">
                        <div class="copyright text-center my-auto">
                            <span>Copyright &copy; IECE</span>
                        </div>
                    </div>
                </footer>

                {/* Scroll to Top Button*/}
                <a class="scroll-to-top rounded" href="#page-top">
                    <i class="fas fa-angle-up"></i>
                </a>

                {/* Bootstrap core JavaScript*/}
                <script src="~/lib/jquery/dist/jquery.js"></script>
                <script src="~/lib/bootstrap/dist/js/bootstrap.bundle.js"></script>

                {/* Core plugin JavaScript*/}
                <script src="~/vendor/jquery-easing/jquery.easing.min.js"></script>

                {/* Custom scripts for all pages*/}
                <script src="~/js/sb-admin-2.min.js"></script>
                {/* End of Footer */}
            </div>
        );
    }
}
export default Footer;