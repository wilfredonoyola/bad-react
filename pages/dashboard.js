import React from 'react';
import Link from 'next/link'
import Layout from '../components/layout'
import {isLogged, sessionGuard, withAuthSync} from '../utils/auth'
import Profile from "./profile";
/*import nextCookie from "next-cookies/index";
import Router from "next/router";*/

const Dashboard = props => {

  return (
    <Layout isAuth={props.isAuth}>
      <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1 className="display-4">Dashboard</h1>
        <p className="lead">
          Sistema de Gestión de equipos de alto consumo eléctrico en instituciones gubernamentales.
        </p>
      </div>
      <div className="container">
        <div className="card-deck mb-3 text-center">
          <div className="card mb-2 shadow-sm">
            <div className="card-header">
              <h4 className="my-0 font-weight-normal">Usuarios</h4>
            </div>
            <div className="card-body">
              <a href='/people' className="btn btn-lg btn-block btn-outline-primary">
                Administrar Personas
              </a>
              <a href='/users' className="btn btn-lg btn-block btn-outline-primary">
                Administrar Usuarios
              </a>
              <a href='/employee' className="btn btn-lg btn-block btn-outline-primary">
               Administrar Empleados
              </a>
              <a href='/roles' className="btn btn-lg btn-block btn-outline-primary">
                Administrar Roles
              </a>
            </div>
          </div>
          <div className="card mb-4 shadow-sm">
            <div className="card-header">
              <h4 className="my-0 font-weight-normal">Actividad</h4>
            </div>
            <div className="card-body">
              <a href='/activity'  className="btn btn-lg btn-block btn-outline-primary">Ver Actividad</a>

            </div>
          </div>
          <div className="card mb-4 shadow-sm">
            <div className="card-header">
              <h4 className="my-0 font-weight-normal">Empresas</h4>
            </div>
            <div className="card-body">
              <a href='/companies' className="btn btn-lg btn-block btn-outline-primary">
                Empresas Proveedoras
              </a>

              <a href='/institutions' className="btn btn-lg btn-block btn-outline-primary">
                Instituciones de Gobierno
              </a>
            </div>
          </div>
          <div className="card mb-4 shadow-sm">
            <div className="card-header">
              <h4 className="my-0 font-weight-normal">Productos</h4>
            </div>
            <div className="card-body">
              <a href='/products' className="btn btn-lg btn-block btn-outline-primary">
                Todos Productos
              </a>

              <a href='/add_products' className="btn btn-lg btn-block btn-outline-primary">
                Agregar Productos
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

Dashboard.getInitialProps = async ctx => {
  const _isAuth = isLogged(ctx);
  console.log('INTRO Dashboard.JS')
  return { isAuth: _isAuth};
}


export default withAuthSync(Dashboard)