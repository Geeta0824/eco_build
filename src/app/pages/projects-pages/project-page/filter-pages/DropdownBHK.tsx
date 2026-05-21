import React, {useContext, useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {getActiveBHKApi} from '../../../../modules/master-page/bhk-master-page/NewBHKCRUD'
import {IBHKMasterModel} from '../../../../models/master-page/IBHKMasterModel'
import {ProjectMain} from '../ProjectList'

const DropdownBHK: React.FC = () => {
  const {getBHKFunc, selBHKID} = useContext(ProjectMain)
  const [bhkData, setBHKData] = useState<IBHKMasterModel[]>([] as IBHKMasterModel[])

  useEffect(() => {
    setTimeout(() => {
      getbhkData()
    }, 100)
  }, [])

  function getbhkData() {
    getActiveBHKApi()
      .then((response) => {
        // let responseData = response.data.responseObject

        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess) {
          let responseData = resp.responseObject
          setBHKData(responseData)
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
      <div className='pt-4'>
        <select
          className='form-select form-select-white'
          onChange={(e) => getBHKFunc(parseInt(e.target.value))}
        >
          <option value={0}>Select BHK</option>
          {bhkData.length > 0 &&
            bhkData.map((data, index) => {
              return (
                <option
                  key={data.bhkid}
                  value={data.bhkid}
                  selected={data.bhkid === selBHKID ? true : false}
                >
                  {data.bhkName}
                </option>
              )
            })}
        </select>
      </div>
    </>
  )
}

export default DropdownBHK
