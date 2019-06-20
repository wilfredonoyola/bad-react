import React from 'react';
import Link from 'next/link'
import {isLoggedRedirectToDashboard, logout} from '../utils/auth'

function LoginButton(props) {
  if(props.isAuth){
    return (
      <button onClick={logout} className="btn btn-info">
        Salir
      </button>
    );
  }

  return (
    <Link href='/dashboard'>
      <a className="p-2 btn btn-primary btn-md">Entrar</a>
    </Link>
  );

}

class Header extends React.Component {
  render() {
    return (
      <header>
        <nav>
          <Link href='/dashboard'>
            <a className="p-2 text-dark">Inicio</a>
          </Link>
          <Link href='/sobre-nosotros'>
            <a className="p-2 text-dark">Sobre Nosotros</a>
          </Link>
          <Link href='/ayuda'>
            <a className="p-2 text-dark">Ayuda</a>
          </Link>
          <LoginButton isAuth={this.props.isAuth}/>
        </nav>
      </header>
    );
  }
}

export default Header