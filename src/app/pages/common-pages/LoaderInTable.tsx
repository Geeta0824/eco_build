import React from 'react'

type Props = {
    loading: boolean
    column: number
}

const LoaderInTable: React.FC<Props> = ({loading, column}) => {
  return (
    <>
      <tr className={loading === true ? '' : 'd-none'}>
        <td colSpan={column}>
          <div className='d-flex justify-content-center m-5 p-5'>
            <div className='spinner-border text-primary' style={{width: '3rem', height: '3rem'}} role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}

export default LoaderInTable
