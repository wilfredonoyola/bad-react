import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import {isLogged, login, withAuthSync} from '../utils/auth'
import { Button } from 'reactstrap';
import Link from 'next/link'
import Layout from '../components/layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import Router from 'next/router';
import InputMask from 'react-input-mask';

const MessageError = function(props){
  if(!props.error){
    return null
  }

  return(
    <div className="alert alert-warning" role="alert">
      {props.error}
    </div>
  )
};

const ButtonAction = function(props){
  if(props.action && props.action === 'edit'){
    return (
      <button className="btn btn-lg btn-primary btn-block" type="submit">Actualizar</button>
    )
  }

  return (
    <button className="btn btn-lg btn-primary btn-block" type="submit">Agregar</button>
  )
}



class Add extends Component {
  constructor (props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      dui: '',
      nit: '',
      isss: '',
      fotoPerfil: '',
      homePhone: '',
      mobilePhone: '',
      email : '',
      usuarioSession : 0,
      error: '',
      action: '',
      id: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(){
    if(this.props.action && this.props.action ==='edit'){
      const _person = this.props.person;
      const mobilePhone =  _person.contactoPersonaDetalles[0] ? _person.contactoPersonaDetalles[0].descripcionContacto : '';
      const homePhone =  _person.contactoPersonaDetalles[1] ? _person.contactoPersonaDetalles[1].descripcionContacto : '';
      const email =  _person.contactoPersonaDetalles[2] ? _person.contactoPersonaDetalles[2].descripcionContacto : '';

      this.setState({
        action: 'edit',
        id: _person.idPersona,
        firstName: _person.nombrePersona,
        lastName: _person.apellidoPersona,
        dui: _person.dui,
        nit: _person.nit,
        isss: _person.isss,
        mobilePhone: mobilePhone ,
        homePhone: homePhone,
        email: email
      })
    }
  }

  static async getInitialProps(ctx) {
    const _isAuth = isLogged(ctx);
    const { token } = nextCookie(ctx)
    if(ctx.query.id && ctx.query.action && ctx.query.action === 'edit'){
      const url = `${process.env.API_URL}/Personas/${ctx.query.id}`
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token ,
            'X-Requested-With': 'XMLHttpRequest'
          }
        })

        if (response.ok) {
          let personObj = await response.json()
          return { person: personObj, isAuth: _isAuth, action: 'edit'}
        }
        return { error : 'Un error ocurrio.', isAuth: _isAuth, person: [], token: token, action: 'edit'}
      } catch (error) {
        return { error : error, isAuth: _isAuth , person: [], token: token, action: 'edit'}
      }
    }
    return { isAuth: _isAuth, token: token }
  }

  handleChange (event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  async handleSubmit (event) {
    event.preventDefault()
    this.setState({ error: '' })
    const aPerson =  {
      "nombrePersona": this.state.firstName,
      "apellidoPersona": this.state.lastName,
      "dui": this.state.dui,
      "nit": this.state.nit,
      "isss": this.state.isss,
      "fotoPerfil": 'https://ui-avatars.com/api/?name=' + this.state.firstName + '+' + this.state.lastName,
      "telefonoFijo": this.state.homePhone,
      "telefonoMovil": this.state.mobilePhone,
      "correoElectronico": this.state.email
    }

    let isValidForm = true;
    for (let [key, value] of Object.entries(aPerson)) {
      if( !value ){
        isValidForm = false;
      }
    }
    if(!isValidForm){
      this.setState({ error: 'Es requerido llenar todos los campos'});
      return ;
    }

    const url = this.props.action === 'edit' ? `${process.env.API_URL}/Personas/${this.state.id}` : `${process.env.API_URL}/Personas`

    try {
      const response = await fetch(url, {
        method: this.props.action === 'edit' ? 'PUT' : 'POST',
        // credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + this.props.token ,
        },
        body: JSON.stringify(aPerson)
      })
      if (response.ok) {
        this.notify();
        window.location.href = '/people';
      } else {
        let error = new Error(response.statusText)
        error.response = response
        throw error
      }
    } catch (error) {
      console.error(
        'You have an error in your code or there are Network issues.',
        error
      )
      this.setState({ error: error.message })
    }
  }

  notify = () => toast("Usuario Agregado exitosamente!", { type: 'success', autoClose: 2000 });

  render () {
    return (
      <Layout isAuth={this.props.isAuth}>
        <div className="nav-scroller bg-white shadow-sm">
          <nav className="nav nav-underline">
            <a className="p-2 text-dark nav-link" href='/people'>
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Personas
            </a>
            <a className="p-2 nav-link active disabled" href="#">Agregar Personas</a>
          </nav>
        </div>
        <div className="my-3 p-3 bg-white rounded shadow-sm">
          <div>
            <ToastContainer />
          </div>

          <form className="form-signin text-center" onSubmit={this.handleSubmit}>
            <MessageError error={this.state.error}/>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              className="form-control"
              placeholder="Primer Nombre"
              required=""
              value={this.state.firstName}
              onChange={this.handleChange}
              autoFocus=""/>
            <label htmlFor="inputPassword" className="sr-only">Segundo Nombre</label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              className="form-control my-2"
              placeholder="Segundo Nombre"
              required=""
              value={this.state.lastName}
              onChange={this.handleChange}
              autoFocus=""/>
            <InputMask mask="99999999-9"
                       maskChar={null}
                       placeholder="DUI"
                       className="form-control my-2"
                       id='dui'
                       name='dui'
                       value={this.state.dui}
                       onChange={this.handleChange}/>

            <InputMask mask="9999-999999-999-9"
                       maskChar={null}
                       placeholder="NIT"
                       className="form-control my-2"
                       id='nit'
                       name='nit'
                       value={this.state.nit}
                       onChange={this.handleChange}/>

            <InputMask mask="999999"
                       maskChar={null}
                       placeholder="ISSS"
                       className="form-control my-2"
                       id='isss'
                       name='isss'
                       value={this.state.isss}
                       onChange={this.handleChange}/>

            <InputMask mask="9999-9999"
                       maskChar={null}
                       placeholder="Telefono Fijo"
                       className="form-control my-2"
                       id='homePhone'
                       name='homePhone'
                       value={this.state.homePhone}
                       onChange={this.handleChange}/>
            <InputMask mask="9999-9999"
                       maskChar={null}
                       placeholder="Telefono Movil"
                       className="form-control my-2"
                       id='mobilePhone'
                       name='mobilePhone'
                       value={this.state.mobilePhone}
                       onChange={this.handleChange}/>

            <input
              type='email'
              id='email'
              name='email'
              className="form-control my-2"
              placeholder="Correo Electronico"
              required=""
              value={this.state.email}
              onChange={this.handleChange}
              autoFocus=""/>
            <ButtonAction action={this.props.action}/>
            </form>
        </div>
      </Layout>
    )
  }
}

export default withAuthSync(Add)