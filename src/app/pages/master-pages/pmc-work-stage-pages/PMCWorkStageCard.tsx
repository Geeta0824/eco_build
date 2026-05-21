import {useEffect} from 'react'

import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import React from 'react'
import {Link} from 'react-router-dom'
import {IPDFPhotoMstModel} from '../../../models/master-page/IPDFPhotoMstModel'
import {IPMCWorkStageModel} from '../../../models/master-page/IPMCWorkStageModel'
import {spawn} from 'child_process'

type props = {
  data: IPMCWorkStageModel
  name: string
  handleShow: (id: number) => void
}
const PMCWorkStageCard: React.FC<props> = ({data, handleShow, name}) => {
  useEffect(() => {
    //  console.log('Use Effect Call')
    return () => {}
  }, [data])
  return (
    <>
      <tr key={data.pmcWorkStageID}>
        <td className='text-dark text-hover-primary fs-6'>{data.stageName}</td>

        <td className='text-dark text-hover-primary fs-6'>{data.amtPercentage} %</td>

        <td className='text-dark text-hover-primary fs-6'>{data.sequenceNo}</td>
        <td className='text-center'>
          <div>
            {data.amtPercentage > 0 ? (
              <Link
                to={{
                  pathname: `/master/pmc-work-stage/material`,
                  state: {
                    pmcWorkStageID: data.pmcWorkStageID,
                    stageName: data.stageName,
                    searchText: name,
                  },
                }}
                className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm m-1'
                title='Material'
              >
                <KTSVG
                  path='/media/icons/duotune/maps/map004.svg'
                  className='svg-icon-2 svg-icon-success'
                />
              </Link>
            ) : (
              <span className='text-muted d-block fs-7 mt-1'>N.A</span>
            )}
          </div>
        </td>
        <td>
          <div className='d-flex justify-content-end flex-shrink-0'>
            <Link
              to={{
                pathname: `/master/pmc-work-stage/edit/${data.pmcWorkStageID}`,
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
              onClick={() => handleShow(data.pmcWorkStageID)}
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
export {PMCWorkStageCard}
