import React from 'react'
import App, { Container } from 'next/app'
// import Layout from '../components/layout'
import {isLogged, isLoggedRedirectToDashboard} from '../utils/auth'

class Layout extends React.Component {
  render () {
    const { children } = this.props
    return <div className='layout'>{children}</div>
  }
}

export default class MyApp extends App {
  static async getInitialProps({ctx}) {
    const _isAuth = isLogged(ctx);
    console.log('INTRO _APP.JS')
    return { isAuth: _isAuth};
  }
  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Layout isAuth={this.props.isAuth}>
          <Component {...pageProps} />
        </Layout>
      </Container>
    )
  }
}