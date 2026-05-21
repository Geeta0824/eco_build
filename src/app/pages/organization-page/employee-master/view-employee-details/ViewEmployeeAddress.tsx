import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup/redux/RootReducer'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {employeeAddressApi} from '../../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {useParams} from 'react-router-dom'
import {IEmployeeAddressModel} from '../../../../models/organization-page/Employee/IEmployeeModel'
import Loader from '../../../common-pages/Loader'

type Props = {}
interface IMyProfile {
  loading: boolean
  empAddressData: IEmployeeAddressModel
}

export function ViewEmployeeAddress() {
  const {employeeID} = useParams<{employeeID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IMyProfile>({
    loading: false,
    empAddressData: {} as IEmployeeAddressModel,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getMyAddressData()
    }, 100)
  }, [])

  function getMyAddressData() {
    employeeAddressApi(parseInt(employeeID))
      .then((response) => {
        const personData = response.data
        setState({...state, empAddressData: personData, loading: false})
      })
      .catch((error) => {
        alert(error)
        setState({...state, empAddressData: {} as IEmployeeAddressModel, loading: false})
      })
  }

  const {empAddressData} = state

  return (
    <>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <Loader loading={state.loading} />
        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Address Line 1</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empAddressData.curntAddress1}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Address Line 2</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empAddressData.curntAddress2}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Country</label>
            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6'>{empAddressData.curntCountryName}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>State</label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{empAddressData.curntStateName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>District</label>
            <div className='col-lg-8'>
              <a href='#' className='fw-bold fs-6 text-dark text-hover-primary'>
                {empAddressData.curntCityName}
              </a>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Taluka</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empAddressData.curntTalukaName}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Pincode</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empAddressData.curntPincode}</span>
            </div>
          </div>

          <div className='row mb-10'>
            <label className='col-lg-3 fw-bold text-muted'>City</label>
            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>{empAddressData.curntPincodeCityName}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
