import React from 'react'
import { toAbsoluteUrl } from '../../_Ecd/helpers'

type Props = {
  loading: boolean
  length?: number
}

const BlankDataImage: React.FC<Props> = ({loading, length}) => {
  return (
    <>
      <tr className={length === 0 && loading === false ? '' : 'd-none'}>
        <td colSpan={9}>
          <div className='d-flex justify-content-center mt-3 pt-3 fs-5'>No data found</div>
          <div className='d-flex justify-content-center mt-2 pt-2'>
            <img
              className='w-25'
              src={toAbsoluteUrl('/media/illustrations/sigma-1/13-dark.png')}
              alt=''
            />
          </div>
        </td>
      </tr>
    </>
  )
}

export default BlankDataImage
