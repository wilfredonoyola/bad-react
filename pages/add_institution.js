import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import {isLogged, login, withAuthSync} from '../utils/auth'
import Layout from '../components/layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import agent from "../utils/agent";
import Select from 'react-select';

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
      companyName: '',
      telephoneSwitch: '',
      telephonePBX: '',
      email: '',
      website: '',
      error: '',
      action: '',
      employee: [],
      id: '',
      selectDelegate: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(){
    agent.setToken(this.props.token);
    this.setState({employee: this.props.employee});
    if(this.props.action && this.props.action ==='edit'){
      const _company = this.props.company;
      const telePhoneswitch =  _company.contactoEmpresaDetalles.find( compa => compa.nombreLista === 'Conmutador' );
      const telephonePBX =  _company.contactoEmpresaDetalles.find( compa => compa.nombreLista === 'PBX' );
      const email =  _company.contactoEmpresaDetalles.find( compa => compa.nombreLista === 'Correo Electrónico' );
      const website =  _company.contactoEmpresaDetalles.find( compa => compa.nombreLista === 'Página Web' );

      this.setState({
        action: 'edit',
        id: _company.idEmpresaProveedora || '',
        companyName: _company.nombreEmpresa || '',
        address: _company.direccionEmpresa || '',
        nit: _company.nitempresa || '',
        ammountAllow: _company.montoPermitido || '',
        // responsable: _company.responsable,
        telephoneSwitch: telePhoneswitch.descripcionContacto ?  telePhoneswitch.descripcionContacto : '' ,
        telephonePBX: telephonePBX.descripcionContacto ?  telephonePBX.descripcionContacto : '',
        email: email.descripcionContacto ?  email.descripcionContacto : '',
        website: website.descripcionContacto ?  website.descripcionContacto : ''
      })
    }
  }

  handleChangeSelectDelegate = selectDelegate => {
    console.log('selectDelegate :  ', selectDelegate);
    this.setState({ selectDelegate });
  };

  async getUsers(){
    const url =  `${process.env.API_URL}/Usuarios`

    try {
      const response = await fetch(url, {
        method: 'GET',
        // credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + this.props.token ,
        },
        // body: JSON.stringify(aPerson)
      })
      if (response.ok) {
        const users= await response.json();
        this.setState({users : users})
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


  static async getInitialProps(ctx) {
    const _isAuth = isLogged(ctx);
    const { token } = nextCookie(ctx);
    agent.setToken(token);
    const _employee = await agent.Employee.get();
    console.log('_employee : ', _employee );
    const employee = _employee.map(function (cpn) {
      return { value: cpn.id, label: cpn.nombreCompleto };
    });
    if(ctx.query.id && ctx.query.action && ctx.query.action === 'edit'){
      const url = `${process.env.API_URL}/EmpresaProveedoras/${ctx.query.id}`
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token ,
            'X-Requested-With': 'XMLHttpRequest'
          }
        })

        if (response.ok) {
          let companyObj = await response.json()
          return { company: companyObj, isAuth: _isAuth, action: 'edit', employee: employee}
        }
        return { error : 'Un error ocurrio.', isAuth: _isAuth, company: [], token: token, action: 'edit',  employee: employee}
      } catch (error) {
        return { error : error, isAuth: _isAuth , company: [], token: token, action: 'edit',  employee: employee}
      }
    }
    return { isAuth: _isAuth, token: token,  employee: employee }
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
    const _this = this;
    event.preventDefault()
    this.setState({error: ''})
    if (!this.state.selectDelegate) {
      this.setState({error: 'Es requerido llenar todos los campos'});
      return;
    }
    const company = {
      "nombreInstitucionG": this.state.companyName,
      "logotipoInstitucionG": 'url',
      "telefonoConmutador": this.state.telephoneSwitch,
      "telefonoPBX": this.state.telephonePBX,
      "correoElectronico": this.state.email,
      "paginaWeb": this.state.website,
      "encargadoUACI": this.state.selectDelegate.value
    }


    let isValidForm = true;
    for (let [key, value] of Object.entries(company)) {
      if (!value) {
        isValidForm = false;
      }
    }
    if (!isValidForm) {
      this.setState({error: 'Es requerido llenar todos los campos'});
      return;
    }

    agent.Companies.createGovernmentInstitution(company).then(function (res) {
      _this.notify();
      _this.setState({isLoading: false});
      window.location.href = '/institutions';
    }, function (err) {
      _this.setState({isLoading: false});
      _this.errorNotify();
    })


  }

  notify = () => toast("Institucion Agregado exitosamente!", { type: 'success', autoClose: 2000 });
  errorNotify = () => toast("Ha ocurrido un error al agregar una Institución.", { type: 'error', autoClose: 4000 });

  render () {
    return (
      <Layout isAuth={this.props.isAuth}>
        <div className="nav-scroller bg-white shadow-sm">
          <nav className="nav nav-underline">
            <a className="p-2 text-dark nav-link" href='/institutions'>
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Todas las Instituciones
            </a>
            <a className="p-2 nav-link active disabled" href="#">Agregar Instituciones de Gobierno</a>
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
              id='companyName'
              name='companyName'
              className="form-control"
              placeholder="Nombre de la Institución"
              required=""
              value={this.state.companyName}
              onChange={this.handleChange}
              autoFocus=""/>
            <label htmlFor="inputPassword" className="sr-only">Segundo Nombre</label>
            <Select
              className="my-2"
              placeholder="Encargado"
              value={this.state.selectDelegate}
              onChange={this.handleChangeSelectDelegate}
              options={this.state.employee}
            />

            <InputMask mask="9999-9999"
                       maskChar={null}
                       placeholder="Telefono Conmutador"
                       className="form-control my-2"
                       id='telephoneSwitch'
                       name='telephoneSwitch'
                       value={this.state.telephoneSwitch}
                       onChange={this.handleChange}/>
            <InputMask mask="9999-9999"
                       maskChar={null}
                       placeholder="Telefono PBX"
                       className="form-control my-2"
                       id='telephonePBX'
                       name='telephonePBX'
                       value={this.state.telephonePBX}
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

            <input
              type='text'
              id='website'
              name='website'
              className="form-control my-2"
              placeholder="Pagina Web"
              required=""
              value={this.state.website}
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