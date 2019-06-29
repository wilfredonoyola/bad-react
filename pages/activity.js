
import Link from 'next/link'
import nextCookie from 'next-cookies'
import fetch from 'isomorphic-unfetch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import Layout from '../components/layout'
import { isLogged, withAuthSync } from "../utils/auth";
import TimeAgo from 'react-timeago'
import spanishStrings from 'react-timeago/lib/language-strings/es'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

const formatter = buildFormatter(spanishStrings)

function ActivityContent(props) {
  if(!props.activityList) {
    return (
      <div>Cargando...</div>
    )
  }
  return (
    props.activityList.map((activity) =>
      <div key={activity.id}>
        <div className="media text-muted pt-3 border-top border-gray">
          <svg className="bd-placeholder-img mr-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg"
               preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32">
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#007bff"></rect>
            <text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text>
          </svg>
          <div className="media-body pb-3 mb-0 small lh-125">
            <strong className="d-block text-gray-dark">
              {activity.nombreCompleto}
              <small className="text-muted mt-2"> (<TimeAgo date={activity.fechaHora} formatter={formatter} />)</small>
            </strong>
            <div className="py-2">

              Accion Realizada: <strong>{activity.mantenimiento}</strong>
            </div>

            <div className="py-2"> {activity.accion}</div>
            <div className="py-2">  Fecha: {activity.fechaHora}</div>
          </div>
        </div>
      </div>
    )
  )
}

const Activity = props => {
  // const { nombreCompleto, accion } = props.data
  const { activityList } = props
  
  return (
    <Layout isAuth={props.isAuth}>
      <div className="nav-scroller bg-white shadow-sm">
        <nav className="nav nav-underline">
          <Link href='/dashboard'>
            <a className="p-2 text-dark nav-link">
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Dashboard
            </a>
          </Link>
          <a className="p-2 nav-link active disabled" href="#">Actividad</a>
        </nav>
      </div>
      <div className="d-flex align-items-center p-3 mb-3 text-white-50 bg-purple rounded shadow-sm">
        <img className="mr-3" src="https://getbootstrap.com/docs/4.3/assets/brand/bootstrap-outline.svg" alt="" width="48" height="48"/>
        <div className="lh-100">
          <h6 className="mb-0 text-white lh-100">Actividad</h6>
          <small>Desde el  2019</small>
        </div>
      </div>
      <div className="my-3 p-3 bg-white rounded shadow-sm">
        <div className="clearfix"></div>
        <ActivityContent activityList={activityList}/>

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

Activity.getInitialProps = async ctx => {
  console.log('INTRO activity.JS')
  const _isAuth = isLogged(ctx);
  const { token } = nextCookie(ctx)
  const url = `${process.env.API_URL}/Bitacoras`
  console.log('Token : ' , token);
  /*const redirectOnError = () =>
    process.browser
      ? Router.push('/login')
      : ctx.res.writeHead(302, { Location: '/login' }).end()
    */
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
      console.log('IS OK')
      // console.log('response' , response.json())
      let activityListObj = await response.json()
      return { activityList: activityListObj, isAuth: _isAuth}
    }
    console.log('ERROR 1, response :', response)
    return { error : 'error1'}
    return { error : 'Un error ocurrio.', isAuth: _isAuth}
    // https://github.com/developit/unfetch#caveats
    //return redirectOnError()
  } catch (error) {
    console.log('ERROR 2, Detail : ' , error)
    return { error : error, isAuth: _isAuth}

    // Implementation or Network error
    // return redirectOnError()
  }
}

export default withAuthSync(Activity)