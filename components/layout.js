import Link from 'next/link'
import Head from 'next/head'
import Header from './header'

import '../styles/styles.scss';
import 'react-toastify/scss/main.scss';

export default ({ isAuth, children, title = 'Sistema de Gestión de equipos' }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"/>
     </Head>
    <header>
      <div
        className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
        <Link href='/dashboard'>
          <a className="my-0 mr-md-auto font-weight-normal">
            <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg"
                 preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32">
              <title>Placeholder</title>
              <rect width="100%" height="100%" fill="#007bff"></rect>
              <text x="50%" y="50%" fill="#007bff" dy=".3em">GE</text>
            </svg>
             Gestión de equipos</a>
        </Link>
        <Header  isAuth={isAuth}/>
      </div>
    </header>
    <div className="container">
      <div className="row">
        <div className="col-12">
          {children}
        </div>
      </div>
    </div>
    { /*<footer>Footer!!</footer> */}
  </div>
)