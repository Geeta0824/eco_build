import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup/redux/RootReducer'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {customerTerminalApi} from '../../../../modules/organization-page/customer-master-page/CustomerCRUD'
import {useParams} from 'react-router-dom'
import Loader from '../../../common-pages/Loader'
import {ITerminalTypeWebModel} from '../../../../models/master-page/ITerminalTypeModel'

type Props = {}
interface IMyProfile {
  loading: boolean
  customerTerminalData: ITerminalTypeWebModel
}

export function ViewCustomerTerminalCode() {
  const {customerID} = useParams<{customerID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IMyProfile>({
    loading: false,
    customerTerminalData: {} as ITerminalTypeWebModel,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getMyAddressData()
    }, 100)
  }, [])

  function getMyAddressData() {
    customerTerminalApi(parseInt(customerID))
      .then((response) => {
        const personData = response.data
     //  console.log(personData)
        setState({...state, customerTerminalData: personData, loading: false})
      })
      .catch((error) => {
        alert(error)
        setState({...state, customerTerminalData: {} as ITerminalTypeWebModel, loading: false})
      })
  }

  const {customerTerminalData} = state

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Terminal Type</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>
                {customerTerminalData.terminalTypeName}
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Terminal Code</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{customerTerminalData.terminalCode}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
