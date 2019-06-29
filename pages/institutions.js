
import Link from 'next/link'
import nextCookie from 'next-cookies'
import fetch from 'isomorphic-unfetch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import Layout from '../components/layout'
import { isLogged, withAuthSync } from "../utils/auth";
import Dashboard from "./dashboard";

function PeopleContent(props) {
  if(!props.institutionsList) {
    return (
      <div>Cargando...</div>
    )
  }
  return (
    props.institutionsList.map((institution) =>
      <div key={institution.idInstitucionG}>
        <div className="media text-muted pt-3 border-top border-gray">
          {/*<svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg"
               preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32">
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#007bff"></rect>
            <text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text>
          </svg> */}
          <div className="media-body pb-3 mb-0 small lh-125">
            <strong className="d-block text-gray-dark">{institution.nombreInstitucionG}</strong>'
            {/*<div className="float-right">
              <a href={ '/add_company?action=edit&id=' + institution.idInstitucionG} className="btn btn-link btn-sm">
                Editar
              </a>
              <a href="" className="btn btn-link btn-sm">
                Eliminar
              </a>
            </div>*/}
          </div>
        </div>
      </div>
    )
  )
}

const People = props => {
  // const { nombreCompleto, accion } = props.data
  const { institutionsList } = props
  console.log('institutionsList : ', institutionsList);

  return (
    <Layout isAuth={props.isAuth}>
      <div className="nav-scroller bg-white shadow-sm">
        <nav className="nav nav-underline">
          <Link href='/dashboard'>
            <a className="p-2 text-dark nav-link">
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Dashboard
            </a>
          </Link>
          <a className="p-2 nav-link active disabled" href="#">Nueva Institución</a>
        </nav>
      </div>
      <div className="d-flex align-items-center p-3 mb-3 text-white-50 bg-purple rounded shadow-sm">
        <img className="mr-3" src="https://getbootstrap.com/docs/4.3/assets/brand/bootstrap-outline.svg" alt="" width="48" height="48"/>
        <div className="lh-100">
          <h6 className="mb-0 text-white lh-100">Administrar Instituciones de Gobierno</h6>
        </div>
      </div>
      <div className="my-3 p-3 bg-white rounded shadow-sm">
        <h6 className="pb-2 mb-0 float-left">Todos las Intstituciones</h6>
        <a href='/add_institution' className="p-2 mb-2 btn btn-primary float-right">
          <FontAwesomeIcon icon={faPlus} />
          <span className="ml-2 ">Nueva Institucion</span>
        </a>
        <div className="clearfix"></div>
        <PeopleContent institutionsList={institutionsList}/>

        <small className="d-block text-right mt-3">
          <Link href='/dashboard'>
            <a className="p-2 text-dark nav-link">
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Regresar al Dashboard
            </a>
          </Link>
        </small>
      </div>

    </Layout>
  )
}

People.getInitialProps = async ctx => {
  const _isAuth = isLogged(ctx);
  const { token } = nextCookie(ctx)
  const url = `${process.env.API_URL}/InstitucionGubernamentals`
  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token ,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (response.ok) {
      let institutionsListObj = await response.json()
      return { institutionsList: institutionsListObj, isAuth: _isAuth}
    }
    return { error : 'Un error ocurrio.', isAuth: _isAuth, institutionsList: []}
  } catch (error) {
    return { error : error, isAuth: _isAuth , institutionsList: []}
  }
}

export default withAuthSync(People)