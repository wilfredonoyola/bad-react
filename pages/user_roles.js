import { Component } from 'react'
import nextCookie from 'next-cookies'
import {isLogged, withAuthSync} from '../utils/auth'
import Layout from '../components/layout'
import Loading from '../components/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
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




class Add extends Component {
  constructor (props) {
    super(props)

    this.state = {
      roles: [],
      rolesFormatted: [],
      isLoading: false
    };
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(){
    agent.setToken(this.props.token);
    //this.getUserInfo()
    console.log(' roles : ', this.props.roles);
    console.log(' userInfo : ', this.props.userInfo);

    if(this.props.userInfo.listaRoles && this.props.userInfo.listaRoles.length === 0){
      const _rolesFormated = this.formattedInitRole();

      console.log('_rolesFormated: ', _rolesFormated)
      this.setState({
        rolesFormatted: _rolesFormated
      });
    }else{
      const prepareRoles = this.formattedPrepareRoles(this.props.userInfo.listaRoles, this.props.roles);
      console.log('PREPARE ROLES : ', prepareRoles);
      this.setState({
        rolesFormatted: prepareRoles
      });
    }
  }

  formattedInitRole(){
    return this.props.roles.map(function (role) {
      return { idRol: role.idRol, nombreRol: role.nombreRol, checked: false };
    });
  }

  formattedPrepareRoles(userRoles, roles){
    let prepareRoles = [];
    roles.forEach(function(role){
      userRoles.forEach(function (userRol) {
        const checked = role.idRol == userRol.idRol;
        prepareRoles.push({ idRol: role.idRol, nombreRol: role.nombreRol, checked: checked });
      })
    });
    return prepareRoles;
  }

  static async getInitialProps(ctx) {
    const _isAuth = isLogged(ctx);
    const { token } = nextCookie(ctx);
    agent.setToken(token);
    const userInfo = await agent.Users.get(ctx.query.id);
    const roles = await agent.Roles.all();
    return { isAuth: _isAuth, token: token, roles: roles, userInfo: userInfo, userId: ctx.query.id }
  }

  handleChange (event) {
    const target = event.target;
    const idRol = target.value;
    const index = this.state.rolesFormatted.findIndex(role => role.idRol == idRol);
    const payload = {
      "idRol" : this.state.rolesFormatted[index].idRol,
      "nombreRol" : this.state.rolesFormatted[index].nombreRol
    };
    this.state.rolesFormatted[index].checked = !this.state.rolesFormatted[index].checked;
    if(this.state.rolesFormatted[index].checked){
      this.addRole(payload);
    }else{
      this.removeRole(payload);
    }

    this.setState({
      rolesFormatted: this.state.rolesFormatted
    });
  }

  addRole(payload){
    agent.Users.addRole(this.props.userId, payload).then(function(res){
      console.log('ADD ROLE EXITOSO');
    },function (err) {
      console.log('error al addRole')
    })
  }

  removeRole(payload){
    agent.Users.removeRole(this.props.userId, payload).then(function(res){
      console.log('REMOVE ROLE EXITOSO');
    },function (err) {
      console.log('error al removeRole')
    })
  }

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
            <a className="p-2 text-dark nav-link" href='/users'>
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Todos los usuarios
            </a>
            <a className="p-2 nav-link active disabled" href="#">Roles</a>
          </nav>
        </div>
        <div className="d-flex align-items-center p-3 mb-3 text-white-50 bg-purple rounded shadow-sm">
          <img className="mr-3" src="https://getbootstrap.com/docs/4.3/assets/brand/bootstrap-outline.svg" alt="" width="48" height="48"/>
          <div className="lh-100">
            <h6 className="mb-0 text-white lh-100">Administrar Roles</h6>
          </div>
        </div>
        <div className="my-3 p-3 bg-white rounded shadow-sm">
          <div>
            <ToastContainer />
          </div>
          <Loading isLoading={this.state.isLoading}/>
          <MessageError error={this.state.error}/>
          <ul className="list-group">
            {this.state.rolesFormatted.map((rol) =>
              <li className="list-group-item" key={rol.idRol} >
                <div className="float-left">
                  {rol.nombreRol}
                </div>
                <div className="float-right">
                  <input
                        className="form-check-input "
                        name="roleToggle"
                        type="checkbox" id="inlineCheckbox1"
                        onClick={this.handleChange}
                        defaultChecked={rol.checked}
                        value={rol.idRol}/>
                </div>
              </li>
            )}
          </ul>
        </div>
      </Layout>
    )
  }
}

export default withAuthSync(Add)