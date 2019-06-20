import Router from 'next/router'
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import Layout from '../components/layout'
import { withAuthSync, sessionGuard } from '../utils/auth'

const Profile = props => {
  // const { name, login, bio, avatarUrl } = props.data

  return (
    <div>
      <p>Here the profile info</p>

    </div>
  )
}

Profile.getInitialProps = async ctx => {
  sessionGuard(ctx);
  return {}
}

export default Profile