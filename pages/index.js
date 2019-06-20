import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import { login, isLoggedRedirectToDashboard } from '../utils/auth'
import { Button } from 'reactstrap';
import Link from 'next/link'
import Layout from '../components/layout'

const MessageError = function(props){
  if(!props.error){
    return null
  }

  return(
    <div className="alert alert-warning" role="alert">
      {props.error}
    </div>
  )
}

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = { username: '', password: '', error: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  static async getInitialProps(ctx) {
    if(ctx){
      isLoggedRedirectToDashboard(ctx);
    }
    return {}

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
    const errorAuth = 'Error de acceso: Nombre de usuario o contraseña incorrecta';
    const username = this.state.username
    const password = this.state.password
    const user = {
      "correoElectronico" : username,
      "clave": password
    }
    //const url = `${process.env.API_URL}/users/login`
    const url = `${process.env.API_URL}/Home`

    try {
      const response = await fetch(url, {
        method: 'POST',
        // credentials: 'include',
        headers: {
            //'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',

        },
        body: JSON.stringify(user)
      })
      if (response.ok) {
         // const { token } = await response.json()
        // let responseJson = await response.json()
        const { token } = await response.json()
        console.log('responseJson : ', token)
        // return { activityList: activityListObj }
        login({ token })
      } else {
        let error = new Error(response.statusText)
        error.response = response
        console.log('Login failed. MSG : ', response.json())
        this.setState({ error: response.statusText })
        throw error
      }
    } catch (error) {
      console.error(
        'You have an error in your code or there are Network issues.',
        error
      );
      console.log('error message: ', error.message);
      this.setState({ error: errorAuth })
    }
  }

  render () {
    return (
      <Layout>
        <form className="form-signin text-center" onSubmit={this.handleSubmit}>
          <svg className="bd-placeholder-img mb-4 rounded" width="75" height="75" xmlns="http://www.w3.org/2000/svg"
               preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 32x32">
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#007bff"></rect>
            <text x="50%" y="50%" fill="#007bff" dy=".3em">GE</text>
          </svg>
            <h1 className="h3 mb-3 font-weight-normal">Por favor inicie sesión</h1>
            <MessageError error={this.state.error}/>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input
              type='email'
              id='username'
              name='username'
              className="form-control"
              placeholder="Correo Electronico"
              required=""
              value={this.state.username}
              onChange={this.handleChange}
              autoFocus=""/>
              <label htmlFor="inputPassword" className="sr-only">Password</label>
              <input
                type="password"
                name='password'
                id="password"
                className="form-control"
                placeholder="Contraseña"
                required=""
                value={this.state.password}
                onChange={this.handleChange}
              />
              <div className="checkbox mb-3">
                <label>
                  <input type="checkbox" value="remember-me"/> Recordarme
                </label>
              </div>
              <button className="btn btn-lg btn-primary btn-block" type="submit">Entrar</button>
        </form>
      </Layout>
    )
  }
}

export default Login