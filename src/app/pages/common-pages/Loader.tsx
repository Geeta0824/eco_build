import React from 'react'

type Props = {
  loading: boolean
}

const Loader: React.FC<Props> = ({loading}) => {
  return (
    <>
      <div className={loading === true ? 'card mb-5 mb-xl-10 h-100' : 'd-none'}>
        <div className='card-body border-top p-9 ms-10'>
          <div className='d-flex justify-content-center m-5 p-5'>
            <div className='spinner-border' style={{width: '3rem', height: '3rem'}} role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Loader
