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
      productName: '',
      branding : '',
      model: '',
      year: '',
      capacity: '',
      price: '',
      companiesProvider: [],
      selectCompaniesProvider: null,
      isLoading: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(){
    agent.setToken(this.props.token);
    const _companiesProvider = this.props.companiesProvider.map(function (company) {
      return { value: company.idEmpresaProveedora, label: company.nombreEmpresa };
    });
    this.setState({ companiesProvider: _companiesProvider });
    if(this.props.action && this.props.action ==='edit'){
      const _person = this.props.person;
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
    agent.setToken(token);
    const companiesProvider = await agent.Products.getCompanyProvider();
    return { isAuth: _isAuth, token: token, companiesProvider: companiesProvider }
  }

  handleChange (event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleChangeSelectCompany = selectCompaniesProvider => {
    console.log('companies : ', selectCompaniesProvider);
    this.setState({ selectCompaniesProvider });
  };

  async handleSubmit (event) {
    event.preventDefault();
    let isValidForm = true;
    const _this = this;
    this.setState({ error: '' });

    if(!this.state.selectCompaniesProvider){
      isValidForm = false;
      this.setState({ error: 'Es requerido llenar todos los campos'});
      return ;
    }

    const product =  {
      "idEmpresaProveedora": this.state.selectCompaniesProvider.value,
      "nombreProducto": this.state.productName,
      "marca": this.state.branding,
      "modelo": this.state.model,
      "anioFabricacion": this.state.year,
      "capacidadBtu": this.state.capacity ,
      "precioUnidad": this.state.price
    };

    for (let [key, value] of Object.entries(product)) {
      if( !value ){
        isValidForm = false;
      }
    }

    console.log('PRODUCT : ' , product);

    if(!isValidForm){
      this.setState({ error: 'Es requerido llenar todos los campos'});
      return ;
    }


    this.setState({isLoading: true});

    agent.Products.create(product).then(function (res) {
      _this.notify();
      _this.setState({isLoading: false});
      window.location.href = '/products';
    }, function (err) {
      _this.setState({isLoading: false});
      _this.errorNotify();
    })
  }

  notify = () => toast("Producto Agregado exitosamente!", { type: 'success', autoClose: 2000 });
  errorNotify = () => toast("Ha ocurrido un error al agregar un producto.", { type: 'error', autoClose: 4000 });

  render () {
    return (
      <Layout isAuth={this.props.isAuth}>
        <div className="nav-scroller bg-white shadow-sm">
          <nav className="nav nav-underline">
            <a className="p-2 text-dark nav-link" href='/products'>
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Todos los productos
            </a>
            <a className="p-2 nav-link active disabled" href="#">Agregar Productos</a>
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
              value={this.state.selectCompaniesProvider}
              onChange={this.handleChangeSelectCompany}
              options={this.state.companiesProvider}
            />
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input
              type='text'
              id='productName'
              name='productName'
              className="form-control my-1"
              placeholder="Nombre del Producto"
              required=""
              value={this.state.productName }
              onChange={this.handleChange}
              autoFocus=""/>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input
              type='text'
              id='branding'
              name='branding'
              className="form-control my-1"
              placeholder="Marca"
              required=""
              value={this.state.branding}
              onChange={this.handleChange}
              autoFocus=""/>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input
              type='text'
              id='model'
              name='model'
              className="form-control my-1"
              placeholder="Modelo"
              required=""
              value={this.state.model}
              onChange={this.handleChange}
              autoFocus=""/>

            <InputMask mask="9999"
                       maskChar={null}
                       placeholder="Año de Fabricación"
                       className="form-control my-2"
                       id='year'
                       name='year'
                       value={this.state.year}
                       onChange={this.handleChange}/>

            <InputMask mask=""
                       maskChar={null}
                       placeholder="Capacidad"
                       className="form-control my-2"
                       id='capacity'
                       name='capacity'
                       value={this.state.capacity}
                       onChange={this.handleChange}/>

            <InputMask mask=""
                       maskChar={null}
                       placeholder="Precio"
                       className="form-control my-2"
                       id='price'
                       name='price'
                       value={this.state.price}
                       onChange={this.handleChange}/>


            <ButtonAction action={this.props.action}/>
          </form>
        </div>
      </Layout>
    )
  }
}

export default withAuthSync(Add)