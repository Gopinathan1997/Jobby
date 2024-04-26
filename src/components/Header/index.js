import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const renderLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-bar">
      <Link to="/" className="link">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="logo"
        />
      </Link>

      <ul>
        <li className="headerlist">
          <Link to="/" className="link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="link">
            Jobs
          </Link>
        </li>
        <li>
          <button type="button" onClick={renderLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
