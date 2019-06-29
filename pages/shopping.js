
import Link from 'next/link'
import nextCookie from 'next-cookies'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import Layout from '../components/layout'
import { isLogged, withAuthSync } from "../utils/auth";
import agent from "../utils/agent";

function ShoppingContent(props) {
  if(!props.shopping) {
    return (
      <div>Cargando...</div>
    )
  }
  return (
    props.shopping.map((s) =>
      <div key={s.id}>
        <div className="media text-muted pt-1 border-top border-gray">
          <div className="media-body pb-1 mb-0 small lh-125">
            <div className="my-2">
              <strong>Identificador Compra : </strong> {s.idCompra}
            </div>
            <div className="my-2">
              <strong>Nombre Empresa : </strong> {s.nombreEmpresa}
            </div>
            <div className="my-1">
              <strong>Tipo de Contrato : </strong> {s.tipoContratacion}
            </div>
            <div className="my-2">
              <strong>Nombre de la Institución : </strong> {s.nombreInstitucionG}
            </div>
            <div className="my-2">
              <strong>Nombre del producto: </strong> {s.nombreProducto}
            </div>
            <div className="my-2">
              <strong>Total de la Compra : </strong> ${s.totalCompra}
            </div>

            {/*<div className="float-right">
              <a href={ '/add_people?action=edit&id=' + product.idProduct} className="btn btn-link btn-sm">
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

const Products = props => {
  const { shopping } = props;

  return (
    <Layout isAuth={props.isAuth}>
      <div className="nav-scroller bg-white shadow-sm">
        <nav className="nav nav-underline">
          <Link href='/dashboard'>
            <a className="p-2 text-dark nav-link">
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Dashboard
            </a>
          </Link>
          <a href="/add_shopping" className="p-2 text-dark nav-link">
            Nueva Compra
          </a>
          <a className="p-2 nav-link active disabled" href="#">Todos las compras</a>
        </nav>
      </div>
      <div className="d-flex align-items-center p-3 mb-3 text-white-50 bg-purple rounded shadow-sm">
        <img className="mr-3" src="https://getbootstrap.com/docs/4.3/assets/brand/bootstrap-outline.svg" alt="" width="48" height="48"/>
        <div className="lh-100">
          <h6 className="mb-0 text-white lh-100">Todas las Compras</h6>
        </div>
      </div>
      <div className="my-3 p-3 bg-white rounded shadow-sm">
        <h6 className="pb-2 mb-0 float-left">Todos las Compras</h6>
        <a href='/add_shopping' className="p-2 mb-2 btn btn-primary float-right">
          <FontAwesomeIcon icon={faPlus} />
          <span className="ml-2 ">Nueva Compra</span>
        </a>
        <div className="clearfix"></div>

        <ShoppingContent shopping={shopping} />

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

Products.getInitialProps = async ctx => {
  const _isAuth = isLogged(ctx);
  const { token } = nextCookie(ctx)
  agent.setToken(token);
  const shopping = await agent.Shopping.all();
  return { isAuth: _isAuth, token: token, shopping: shopping }
}

export default withAuthSync(Products)