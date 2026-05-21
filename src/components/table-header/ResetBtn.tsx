import React, {useEffect} from 'react'

type Props = {
  resetFilter: () => void
}

const ResetBtn: React.FC<Props> = ({resetFilter}) => {
  useEffect(() => {
 //  console.log('reset btn')
  }, [])
  return (
    <>
      <div className=' mt-6 col-xl-1 col-sm-6 d-flex align-content-around flex-wrap justify-content-center'>
        <button className='btn btn-sm btn-danger' type='button' onClick={resetFilter}>
          Reset
        </button>
      </div>
    </>
  )
}

export default ResetBtn
