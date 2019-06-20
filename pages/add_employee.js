import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import {isLogged, withAuthSync} from '../utils/auth'
import Layout from '../components/layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';

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

// Companies
const SelectCompanies = function(props){
  if(!props.peoples){
    return (
      <div>Cargando personas...</div>
    )
  }

  return (
    props.peoples.map((people) =>
      <option
        key={people.idPersona}
        value={people.idPersona}>
        {people.nombrePersona + ' ' + people.apellidoPersona}
      </option>
    )
  )
}

const SelectFirstOptionCompany = function(props){
  if(props.peoples && props.peoples.length && props.action && props.action === 'edit'){
    const currentPerson = props.peoples.find( person => person.idPersona === props.idPerson );
    if(currentPerson && currentPerson.idPersona){
      return (
        <option value={currentPerson.idPersona}>
          {currentPerson.nombrePersona + ' ' + currentPerson.apellidoPersona}
        </option>
      )
    }else{
      return (
        <option>
          Seleccione una Empresa
        </option>
      )
    }

  }

  return (
    <option>
      Seleccione una persona
    </option>
  )
}


// Employee
const SelectEmployee = function(props){
  if(!props.employee){
    return (
      <div>Cargando Empleados...</div>
    )
  }

  return (
    props.employee.map((emplo) =>
      <option
        key={emplo.id}
        value={emplo.id}>
        {emplo.nombreCompleto}
      </option>
    )
  )
}

const SelectFirstOptionEmployee = function(props){
  if(props.peoples && props.peoples.length && props.action && props.action === 'edit'){
    const currentPerson = props.peoples.find( person => person.idPersona === props.idPerson );
    if(currentPerson && currentPerson.idPersona){
      return (
        <option value={currentPerson.idPersona}>
          {currentPerson.nombrePersona + ' ' + currentPerson.apellidoPersona}
        </option>
      )
    }else{
      return (
        <option>
          Seleccione una Empresa
        </option>
      )
    }

  }

  return (
    <option>
      Seleccione una persona
    </option>
  )
}



class Add extends Component {
  constructor (props) {
    super(props)

    this.state = {
      password: '',
      email : '',
      selectPerson: '',
      error: '',
      action: '',
      id: '',
      idPerson: '',
      companies: [],
      employee: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(){
    this.getCompanies();
    this.getPeoplesNotEmployee();
    if(this.props.action && this.props.action ==='edit'){
      const _person = this.props.person;
      console.log('PERSON : ', _person);
      this.setState({
        action: 'edit',
        id: _person.idUsuario,
        password: _person.clave,
        email: _person.correoElectronico,
        idPerson: _person.idPersona
      })
    }
  }

  static async getInitialProps(ctx) {
    const _isAuth = isLogged(ctx);
    const { token } = nextCookie(ctx)

    // Get All Peoples

    if(ctx.query.id && ctx.query.action && ctx.query.action === 'edit'){
      const url = `${process.env.API_URL}/Usuarios/${ctx.query.id}`
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

  async getCompanies(){
    const url =  `${process.env.API_URL}/Empleadoes/EmpresasDisponibles`

    try {
      const response = await fetch(url, {
        method: 'GET',
        // credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + this.props.token ,
        },
        // body: JSON.stringify(aPerson)
      })
      if (response.ok) {
        const companies = await response.json()
        this.setState({companies : companies})
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
      // this.setState({ error: error.message })
    }
  }

  async getPeoplesNotEmployee(){
    const url =  `${process.env.API_URL}/Empleadoes/ObtenerPersonasNoEmpleadas`

    try {
      const response = await fetch(url, {
        method: 'GET',
        // credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + this.props.token ,
        },
        // body: JSON.stringify(aPerson)
      })
      if (response.ok) {
        const employee = await response.json()
        console.log(' employeee : ', employee)
        this.setState({employee : employee})
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
      // this.setState({ error: error.message })
    }
  }

  handleChange (event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log('HANDLE CHANGE...');
    this.setState({
      [name]: value
    });
  }

  async handleSubmit (event) {
    event.preventDefault()
    this.setState({ error: '' })
    const aPerson =  {
      "clave": this.state.password,
      "correoElectronico": this.state.email,
      "idPersona": this.state.idPerson
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

    const url = this.props.action === 'edit' ? `${process.env.API_URL}/Usuarios/${this.state.id}` : `${process.env.API_URL}/Usuarios`

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
        window.location.href = '/users';
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
            <a className="p-2 text-dark nav-link" href='/employee'>
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Empleados
            </a>
            <a className="p-2 nav-link active disabled" href="#">Agregar Empleados</a>
          </nav>
        </div>
        <div className="my-3 p-3 bg-white rounded shadow-sm">
          <div>
            <ToastContainer />
          </div>

          <form className="form-signin text-center" onSubmit={this.handleSubmit}>
            <MessageError error={this.state.error}/>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <select value={this.state.idPerson}
                    id='idPerson'
                    name='idPerson'
                    className="form-control my-2"
                    onChange={this.handleChange}>
              <SelectFirstOptionCompany action={this.state.action} peoples={this.state.peoples} idPerson={this.state.idPerson}/>
              <SelectCompanies peoples={this.state.peoples}/>
            </select>

            <select value={this.state.idPerson}
                    id='idPerson'
                    name='idPerson'
                    className="form-control my-2"
                    onChange={this.handleChange}>
              <SelectFirstOptionEmployee action={this.state.action} employee={this.state.employee} idPerson={this.state.idPerson}/>
              <SelectEmployee employee={this.state.employee}/>
            </select>

            <select value={this.state.idPerson}
                    id='idPerson'
                    name='idPerson'
                    className="form-control my-2"
                    onChange={this.handleChange}>
              <SelectFirstOptionCompany action={this.state.action} peoples={this.state.peoples} idPerson={this.state.idPerson}/>
              <SelectCompanies peoples={this.state.peoples}/>
            </select>

            <ButtonAction action={this.props.action}/>
          </form>
        </div>
      </Layout>
    )
  }
}

export default withAuthSync(Add)