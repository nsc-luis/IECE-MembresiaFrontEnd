import React from 'react';
import Sidebar from './components/Partials/_Sidebar';
import Topbar from './components/Partials/_Topbar';
import Footer from './components/Partials/_Footer';
import './assets/css/App.css';
import Router from './Router';

function App() {

  return (
    <React.Fragment>
      {/* Page Wrapper */}
      <div id="wrapper">

        <Sidebar />

        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">

          {/* Main Content */}
          <div id="content">

            <Topbar />

            {/* Begin Page Content */}
            <div className="container-fluid">

              {/* Page Heading */}
              <Router />

            </div>
            {/* /.container-fluid */}

          </div>
          {/* End of Main Content */}

          <Footer />

        </div>
        {/* End of Content Wrapper */}

      </div>
      {/* End of Page Wrapper */}
    </React.Fragment>
  );
}

export default App;
