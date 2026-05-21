import React, {useContext, useEffect, useState} from 'react'
import {IDistrictModel, IStateWebModel} from '../../../models/master-page/IDistrictModel'
import {MachineMain} from './DistrictListPage'
import {getAllState} from '../../../modules/master-page/state-master-page/StateCRUD'
import {toast} from 'react-toastify'
interface props {
  districtID: number
}

const DropdownSate: React.FC<props> = ({districtID}) => {
  const {getState} = useContext(MachineMain)
  const [stateData, setStateData] = useState<IStateWebModel[]>([] as IStateWebModel[])

  useEffect(() => {
    setTimeout(() => {
      getStateData()
    }, 100)
  }, [stateData])

  function getStateData() {
    getAllState()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess) {
          //   const temRows: IStateWebModel[] = []
          //   const Rows: IStateWebModel[] = responseData
          //   for (let key in Rows) {
          //     if (Rows[key].isActive === true) {
          //       temRows.push(Rows[key])
          //     }
          //   }
          setStateData(responseData)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }
  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          {/* <h3 className='card-title align-items-start flex-column'> */}
          {/* <span className='card-label fw-bolder fs-3 mb-1'>City</span>
            <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Cities</span> */}
          {/* </h3> */}

          <div className='pt-4'>
            <select
              className='form-select form-select-white'
              onChange={(e) => getState(parseInt(e.target.value))}
            >
              <option value={-1} selected={districtID == -1}>
                Select All State
              </option>
              {stateData.length > 0 &&
                stateData.map((data, index) => {
                  return (
                    <option key={index} value={data.stateID} selected={districtID == data.stateID}>
                      {data.stateMaster}
                    </option>
                  )
                })}
            </select>
          </div>
        </div>
      </div>
    </>
  )
}

export default DropdownSate
