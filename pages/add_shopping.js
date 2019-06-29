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
      password: '',
      email : '',
      selectPerson: '',
      error: '',
      action: '',
      id: '',
      idPerson: '',
      products: [],
      companies: [],
      employments: [],
      dateStartInstallation: '',
      dateStartMaintenance: '',
      typeList: [
        { label: 'Licitación', value: 0 },
        { label: 'Libre Gestión', value: 1}
      ],
      warrantyList: [
        { label: '6 Meses', value: 6 },
        { label: '12 Meses', value: 12},
        { label: '24 Meses', value: 24},
        { label: '36 Meses', value: 36},
        { label: '48 Meses', value: 48},
        { label: '60 Meses', value: 60},
        { label: '72 Meses', value: 72}

      ],
      companiesAuthorized:[],
      companiesAuthorizedInstall:[],
      shiftInstallation: [],
      shiftMaintenance: [],
      selectType: null,
      selectCompaniesAuthorized: null,
      selectProduct: null,
      selectWarranty: null,
      selectCompanyInstallation: null,
      selectShiftInstallation: null,
      selectShiftMaintenance: null,
      select: null,
      isLoading: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(){
    agent.setToken(this.props.token);

    this.setState({ companiesAuthorized: this.props.companiesAuthorized });
    this.setState({ products: this.props.products });
    this.setState({ companiesAuthorizedInstall: this.props.companiesAuthorizedInstall });
    /*if(this.props.action && this.props.action ==='edit'){
      const _person = this.props.person;
      this.setState({
        action: 'edit',
        id: _person.idUsuario,
        password: _person.clave,
        email: _person.correoElectronico,
        idPerson: _person.idPersona
      })
    }*/
  }

  static async getInitialProps(ctx) {
    const _isAuth = isLogged(ctx);
    const { token } = nextCookie(ctx);
    agent.setToken(token);
    const _companiesAuthorized = await agent.Shopping.getCompanyProviderAuthorized();
    const companiesAuthorized = _companiesAuthorized.map(function (cpn) {
      return { value: cpn.id, label: cpn.nombreEmpresa };
    });

    const _products = await agent.Products.all();
    const products = _products.map(function (cpn) {
      return { value: cpn.idProducto, label: cpn.nombreProducto };
    });


    const _companiesAuthorizedInstall = await agent.Shopping.getCompanyProviderAuthorizedInstall();
    const companiesAuthorizedInstall = _companiesAuthorizedInstall.map(function (cpn) {
      return { value: cpn.id, label: cpn.nombreEmpresa };
    });

    return {
      isAuth: _isAuth,
      token: token,
      companiesAuthorized: companiesAuthorized,
      products: products,
      companiesAuthorizedInstall: companiesAuthorizedInstall
    }
  }

  getShiftInstallation(id){
    const _this = this;
    agent.Shopping.getShiftInstallation(id).then(function (res) {
      const shiftInstallation = res.map(function (cpn) {
         return { value: cpn.id, label: cpn.nombreEmpleado };
       });

      _this.setState({ shiftInstallation: shiftInstallation})
      console.log('getShiftInstallation : ', res);
    }, function (err) {
      console.log('ERR : ', err)
    });
  }


  getShiftMaintenance(id){
    const _this = this;
    agent.Shopping.getShiftMaintenance(id).then(function (res) {
      const shiftMaintenance = res.map(function (cpn) {
        return { value: cpn.id, label: cpn.nombreEmpleado };
      });

      _this.setState({ shiftMaintenance: shiftMaintenance})
      console.log('getShiftMaintenance : ', res);
    }, function (err) {
      console.log('ERR : ', err)
    });
  }

  handleChange (event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleChangeSelectType = selectType => {
    this.setState({ selectType });
  };

  handleChangeSelectCompany = selectCompaniesAuthorized => {
    this.setState({ selectCompaniesAuthorized });
    this.getShiftMaintenance((selectCompaniesAuthorized.value))
  };

  handleChangeSelectProducts = selectProduct => {
    this.setState({ selectProduct });
  };

  handleChangeSelectWarranty = selectWarranty => {
    this.setState({ selectWarranty });
  };

  handleChangeSelectCompanyInstallation = selectCompanyInstallation => {
    this.setState({ selectCompanyInstallation });
    this.getShiftInstallation((selectCompanyInstallation.value));
  };

  handleChangeSelectShiftInstallation = selectShiftInstallation => {
    this.setState({ selectShiftInstallation });
  };

  handleChangeSelectShiftMaintenance = selectShiftMaintenance => {
    this.setState({ selectShiftMaintenance });
  };

  async handleSubmit (event) {
    event.preventDefault();
    let isValidForm = true;
    const _this = this;
    this.setState({ error: '' });

    if(!this.state.selectType
      || !this.state.selectCompaniesAuthorized
      || !this.state.selectProduct
      || !this.state.selectWarranty
      || !this.state.selectCompanyInstallation
      || !this.state.selectShiftInstallation
      || !this.state.selectShiftMaintenance
      || !this.state.dateStartInstallation
      || !this.state.dateStartMaintenance){
      isValidForm = false;
    }
    if(!isValidForm){
      this.setState({ error: 'Es requerido llenar todos los campos'});
     return ;
    }
    const shooping =  {
      "tipoContratacion": this.state.selectType.label,
      "idEmpresaProveedora": this.state.selectCompaniesAuthorized.value,
      "idProducto": this.state.selectProduct.value,
      "garantia": this.state.selectWarranty.value,
      "idEmpresaInstalacion": this.state.selectCompanyInstallation.value,
      "idEncargadoInstalacion": this.state.selectShiftInstallation.value,
      "idEmpleadoMantenimiento": this.state.selectShiftMaintenance.value,
      "fechaInicioInstalacion": this.state.dateStartInstallation,
      "fechaInicioMantenimiento": this.state.dateStartMaintenance
    };

    this.setState({isLoading: true});

    agent.Shopping.buy(shooping).then(function (res) {
      _this.notify();
      _this.setState({isLoading: false});
      window.location.href = '/shopping';
    }, function (err) {
      _this.setState({isLoading: false});
      _this.errorNotify();
    })
  }

  notify = () => toast("Compra Agregado exitosamente!", { type: 'success', autoClose: 2000 });
  errorNotify = () => toast("Ha ocurrido un error al agregar una compra.", { type: 'error', autoClose: 4000 });

  render () {
    return (
      <Layout isAuth={this.props.isAuth}>
        <div className="nav-scroller bg-white shadow-sm">
          <nav className="nav nav-underline">
            <a className="p-2 text-dark nav-link" href='/shopping'>
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Todas las Compras
            </a>
            <a className="p-2 nav-link active disabled" href="#">Agregar Compra</a>
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
              placeholder="Tipo de Contratación"
              value={this.state.selectType}
              onChange={this.handleChangeSelectType}
              options={this.state.typeList}
            />

            <Select
              className="my-2"
              placeholder="Empresa Proveedora"
              value={this.state.selectCompaniesAuthorized}
              onChange={this.handleChangeSelectCompany}
              options={this.state.companiesAuthorized}
            />

            <Select
              className="my-2"
              placeholder="Selecciona una Producto"
              value={this.state.selectProduct}
              onChange={this.handleChangeSelectProducts}
              options={this.state.products}
            />

            <Select
              className="my-2"
              placeholder="Garantia"
              value={this.state.selectWarranty}
              onChange={this.handleChangeSelectWarranty}
              options={this.state.warrantyList}
            />

            <Select
              className="my-2"
              placeholder="Empresa Autorizada para Instalar"
              value={this.state.selectCompanyInstallation}
              onChange={this.handleChangeSelectCompanyInstallation}
              options={this.state.companiesAuthorizedInstall}
            />

            <Select
              className="my-2"
              placeholder="Encargado de Instalacion"
              value={this.state.selectShiftInstallation}
              onChange={this.handleChangeSelectShiftInstallation}
              options={this.state.shiftInstallation}
            />

            <InputMask mask="9999-99-99"
                       maskChar={null}
                       placeholder="Fecha de inicio de la Instalación"
                       className="form-control my-2"
                       id='dateStartInstallation'
                       name='dateStartInstallation'
                       value={this.state.dateStartInstallation}
                       onChange={this.handleChange}/>

            <Select
              className="my-2"
              placeholder="Encargado de Mantenimiento"
              value={this.state.selectShiftMaintenance}
              onChange={this.handleChangeSelectShiftMaintenance}
              options={this.state.shiftMaintenance}
            />

            <InputMask mask="9999-99-99"
                       maskChar={null}
                       placeholder="Fecha de inicio de la Mantenimiento"
                       className="form-control my-2"
                       id='dateStartMaintenance'
                       name='dateStartMaintenance'
                       value={this.state.dateStartMaintenance}
                       onChange={this.handleChange}/>
            <ButtonAction action={this.props.action}/>
          </form>
        </div>
      </Layout>
    )
  }
}

export default withAuthSync(Add)