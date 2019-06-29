import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import {isLogged, withAuthSync} from '../utils/auth'
import Layout from '../components/layout'
import Loading from '../components/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import agent from '../utils/agent';


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
      password: '',
      email : '',
      selectPerson: '',
      error: '',
      action: '',
      id: '',
      idPerson: '',
      employees: [],
      companies: [],
      employments: [],
      selectEmployee: null,
      selectCompany: null,
      selectEmployment: null,
      isLoading: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(){
    this.getCompanies();
    this.getPeoplesNotEmployee();
    this.getEmployments();
    agent.setToken(this.props.token);
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
        console.log('companies : ', companies);
        const _companies = companies.map(function (company) {
          return { value: company.id, label: company.nombreEmpresa };
        });
        this.setState({companies : _companies});
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
        console.log(' employeee : ', employee);
        const _employee = employee.map(function (emp) {
          return { value: emp.id, label: emp.nombreCompleto };
        });
        this.setState({employee : _employee})
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

  async getEmployments(){
    const url =  `${process.env.API_URL}/Empleadoes/ObtenerPuestos`

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
        const employments = await response.json()
        console.log('Employments : ', employments);
        const _employments = employments.map(function (employment) {
          return { value: employment.id, label: employment.nombreLista };
        });
        this.setState({employments : _employments});
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

  handleChangeSelectCompany = selectCompany => {
    this.setState({ selectCompany });
  };

  handleChangeSelectEmployee = selectEmployee => {
    this.setState({ selectEmployee });
  };

  handleChangeSelectEmployment = selectEmployment => {
    this.setState({ selectEmployment });
  };

  async handleSubmit (event) {
    event.preventDefault();
    let isValidForm = true;
    const _this = this;
    this.setState({ error: '' });
    if(!this.state.selectCompany || !this.state.selectEmployee || !this.state.selectEmployment){
      isValidForm = false;
    }
    if(!isValidForm){
      this.setState({ error: 'Es requerido llenar todos los campos'});
      return ;
    }
    const aEmployee =  {
      "idEmpresa": this.state.selectCompany.value,
      "idPersona": this.state.selectEmployee.value,
      "idPuesto": this.state.selectEmployment.value
    };

    this.setState({isLoading: true});

    const url = this.props.action === 'edit' ? `${process.env.API_URL}/Usuarios/${this.state.id}` : `${process.env.API_URL}/Empleadoes`
    agent.Employee.create(aEmployee).then(function (res) {
      _this.notify();
      _this.setState({isLoading: false});
      window.location.href = '/employee';
    }, function (err) {
      _this.setState({isLoading: false});
      _this.errorNotify();
    })
  }

  notify = () => toast("Empleado Agregado exitosamente!", { type: 'success', autoClose: 2000 });
  errorNotify = () => toast("Ha ocurrido un error al agregar un empleado.", { type: 'error', autoClose: 4000 });

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
          <Loading isLoading={this.state.isLoading}/>
          <form className="form-signin text-center" onSubmit={this.handleSubmit}>
            <MessageError error={this.state.error}/>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <Select
              className="my-2"
              placeholder="Selecciona una Empresa"
              value={this.state.selectCompany}
              onChange={this.handleChangeSelectCompany}
              options={this.state.companies}
            />

            <Select
              className="my-2"
              placeholder="Selecciona una Empleado"
              value={this.state.selectEmployee}
              onChange={this.handleChangeSelectEmployee}
              options={this.state.employee}
            />

            <Select
              className="my-2"
              placeholder="Selecciona un puesto"
              value={this.state.selectEmployment}
              onChange={this.handleChangeSelectEmployment}
              options={this.state.employments}
            />
            <ButtonAction action={this.props.action}/>
          </form>
        </div>
      </Layout>
    )
  }
}

export default withAuthSync(Add)