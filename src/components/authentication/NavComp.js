import React, { useContext } from 'react'
import logoimg from '../../assets/logo.png'
import { LoginComp } from './LoginComp'
import { RegisterComp } from './RegisterComp'
import { AuthContext } from '../../context/AuthContext'

export const NavComp = () => {
  const { currentUser , logout} = useContext(AuthContext);
  return (
  <nav className='navbar sticky-top navbar-light bg-black'>
    <div className="container-fluid">
      <div className="navbar-brand"><img src={logoimg} alt="logo" height="75" /></div>
      <div className="d-flex">
        <div className="col">
          {currentUser ? (
            <>
            <div className="btn btn-primary mx-2 disabled">{currentUser.email}
            </div>
            <div onClick={() => logout()} className="btn btn-primary mx-2">
              Logout
            </div>
            </>
          ) : (
            <>
              <LoginComp />
              <RegisterComp />
            </>
          )}

        </div>
      </div>
    </div>
  </nav>
  )
}
