import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup/redux/RootReducer'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {customerAddressApi} from '../../../../modules/organization-page/customer-master-page/CustomerCRUD'
import {useParams} from 'react-router-dom'
import {ICustomerAddressModel} from '../../../../models/organization-page/customer/ICustomenrModel'
import Loader from '../../../common-pages/Loader'

type Props = {}
interface IMyProfile {
  loading: boolean
  customerAddressData: ICustomerAddressModel
}

export function ViewCustomerAddress() {
  const {customerID} = useParams<{customerID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IMyProfile>({
    loading: false,
    customerAddressData: {} as ICustomerAddressModel,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getMyAddressData()
    }, 100)
  }, [])

  function getMyAddressData() {
    customerAddressApi(parseInt(customerID))
      .then((response) => {
        const personData = response.data
     //  console.log(personData)
        setState({...state, customerAddressData: personData, loading: false})
      })
      .catch((error) => {
        alert(error)
        setState({...state, customerAddressData: {} as ICustomerAddressModel, loading: false})
      })
  }

  const {customerAddressData} = state

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Address Line 1</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{customerAddressData.address1}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Address Line 2</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{customerAddressData.address2}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Coutnry</label>
            <div className='col-lg-8 fv-row'>
              <span className='fw-bolder fs-6 text-dark'>{customerAddressData.countryName}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>State</label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{customerAddressData.stateName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>District</label>
            <div className='col-lg-8'>
              <a href='#' className='fw-bolder fs-6 text-dark'>
                {customerAddressData.districtName}
              </a>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Taluka</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{customerAddressData.talukaName}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Pincode</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{customerAddressData.pincode}</span>
            </div>
          </div>

          <div className='row mb-10'>
            <label className='col-lg-4 fw-bold text-muted'>City Name.</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{customerAddressData.cityName}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
