import {useEffect} from 'react'
import {KTSVG} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'
import {IModularPaymentSystemModel} from '../../../models/master-page/IModularPaymentSystemModel'

type props = {
  data: IModularPaymentSystemModel
  handleShow: (id: number) => void
  modularPmtStructureBranchMapData: (trunkeyMapData: IModularPaymentSystemModel) => void
  name: string
}
const ModularPaymentStructureCard: React.FC<props> = ({
  data,
  handleShow,
  modularPmtStructureBranchMapData,
  name,
}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.dncProjPaymentStageID}>
        <td className='text-dark text-hover-primary fs-6'>{data.stageName}</td>

        <td className='text-dark text-hover-primary fs-6'>{data.amtPercentage} %</td>

        <td className='text-dark text-hover-primary fs-6'>{data.sequenceNo}</td>
        <td className='text-dark text-hover-primary fs-6'>{data.noOfDays}</td>
        <td>
          {' '}
          <div>
            <div
              onClick={() => modularPmtStructureBranchMapData(data)}
              className='mt-2 btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen001.svg'
                className='svg-icon-2 svg-icon-primary'
              />
            </div>
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{
                pathname: `/master/modular-pay-struc/edit/${data.dncProjPaymentStageID}`,
                state: {searchText: name},
              }}
              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
            >
              <KTSVG
                path='/media/icons/duotune/art/art005.svg'
                className='svg-icon-3 svg-icon-primary'
              />
            </Link>
            <div
              onClick={() => handleShow(data.dncProjPaymentStageID)}
              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen027.svg'
                className='ssvg-icon-3 svg-icon-danger'
              />
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}
export {ModularPaymentStructureCard}
