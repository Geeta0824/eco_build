import React from 'react'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
type Props = {
  handleAddKitchen: (_id: number) => void
  wall: number
  img: string
}

const KitchenLayout: React.FC<Props> = ({handleAddKitchen, wall, img}) => {
  return (
    <>
      <div
        className={
          wall === wall
            ? 'col-lg-3 fv-row border border-primary border-2 cursor-pointer'
            : 'col-lg-3 fv-row border border-primary border-hover border-2 cursor-pointer'
        }
        id='WallA'
        onClick={() => handleAddKitchen(wall)}
      >
        <div className='card mb-10 card text-center'>
          <h6
            className='card-title text-muted position-absolute top-0
                       start-50 translate-middle-x pt-3'
          >
            Wall A
          </h6>
          <span className='align-self-center'>
            <img className='w-100' src={img} alt='' />
          </span>
          <div className='mt-5'>
            <p className='fs-5 text-bold'>Straight Kitchen</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default KitchenLayout
