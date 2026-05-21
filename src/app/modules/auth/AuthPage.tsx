import React, {useEffect} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {toAbsoluteUrl} from '../../../_Ecd/helpers'

export function AuthPage() {
  useEffect(() => {
    document.body.classList.add('bg-light')
    return () => {
      document.body.classList.remove('bg-light')
    }
  }, [])

  return (
    <div
      className='d-flex justify-content-center align-items-center'
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #4e342e 0%, #e6b800 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Layer */}
      <div
        className='position-absolute'
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.25) 100%)',
          zIndex: 1,
        }}
      ></div>

      <div
        className='card mx-auto shadow-lg position-relative'
        style={{
          maxWidth: '900px',
          width: '100%',
          borderRadius: '25px',
          background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
          padding: '35px',
          boxShadow: '0 15px 50px rgba(0, 0, 0, 0.2), 0 0 20px rgba(141, 20, 60, 0.03)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 2,
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {/* GIF Section - Shadow-Framed Panel with Hover Zoom */}
        <div
          style={{
            flex: '0 0 400px',
            height: '450px',
            marginRight: '50px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            animation: 'gentlePulse 4s infinite ease-in-out',
          }}
        >
          <img
            src={toAbsoluteUrl('/media/logos/sidegif2.gif')}
            alt='Auth Visual'
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.03)',
              borderRadius: '20px',
            }}
          ></div>
        </div>

        {/* Form Section */}
        <div
          className='d-flex flex-column justify-content-center'
          style={{
            flex: 1,
          }}
        >
          <div className='text-center mb-6'>
            <img
              src={toAbsoluteUrl('/media/logos/Logo-Final-C2C-1.png')}
              alt='Company Logo'
              className='px-5 mb-4'
              style={{
                height: '70px',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                transition: 'transform 0.3s ease-in-out',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <img
              src={toAbsoluteUrl('/media/logos/logo-Final-C2C.png')}
              alt='Company Logo'
              style={{
                height: '70px',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                transition: 'transform 0.3s ease-in-out',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
          <div style={{maxWidth: '380px', margin: '0 auto', width: '100%'}}>
            <Switch>
              <Route path='/auth/login' component={Login} />
              <Route path='/auth/registration' component={Registration} />
              <Route path='/auth/forgot-password' component={ForgotPassword} />
              <Redirect from='/auth' exact={true} to='/auth/login' />
              <Redirect to='/auth/login' />
            </Switch>
          </div>
        </div>
      </div>

      {/* Inline CSS for Animations */}
      <style>
        {`
          @keyframes gentlePulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
          }
          @media (max-width: 768px) {
            .card {
              flex-direction: column !important;
              padding: 25px !important;
            }
            .card > div:first-child {
              margin-right: 0 !important;
              margin-bottom: 25px !important;
              flex: 0 0 auto !important;
              width: 100% !important;
              height: 220px !important;
            }
          }
        `}
      </style>
    </div>
  )
}
