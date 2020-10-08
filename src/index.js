import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Footer from './components/Footer';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    {/* Page Wrapper */}
    <div id="wrapper">

      <Sidebar />

      {/* Content Wrapper */}
      <div id="content-wrapper" class="d-flex flex-column">

        {/* Main Content */}
        <div id="content">

          <Topbar />

          {/* Begin Page Content */}
          <div class="container-fluid">

            {/* Page Heading */}
            <h1 class="h3 mb-4 text-gray-800">Blank Page</h1>

          </div>
          {/* /.container-fluid */}

        </div>
      {/* End of Main Content */}

      <Footer />
      
      </div>
      {/* End of Content Wrapper */}

      {/* <App /> */}

    </div>
    {/* End of Page Wrapper */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
