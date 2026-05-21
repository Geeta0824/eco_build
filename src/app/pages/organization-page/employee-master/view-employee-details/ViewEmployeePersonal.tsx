import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup/redux/RootReducer'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {employeePersonalApi} from '../../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {IEmployeePersonalModel} from '../../../../models/organization-page/Employee/IEmployeeModel'
import {useParams} from 'react-router-dom'
import Loader from '../../../common-pages/Loader'

type Props = {}
interface IMyProfile {
  loading: boolean
  empPersonalData: IEmployeePersonalModel
}

export function ViewEmployeePersonal() {
  const {employeeID} = useParams<{employeeID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IMyProfile>({
    loading: false,
    empPersonalData: {} as IEmployeePersonalModel,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getMyPersonalData()
    }, 100)
  }, [])

  function getMyPersonalData() {
    employeePersonalApi(parseInt(employeeID))
      .then((response) => {
        const personData = response.data
        setState({...state, empPersonalData: personData, loading: false})
      })
      .catch((error) => {
        alert(error)
        setState({...state, empPersonalData: {} as IEmployeePersonalModel, loading: false})
      })
  }

  const {empPersonalData} = state

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Employee Code</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.employeeCode}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>First Name</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.firstName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Last Name</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.lastName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Middle Name</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.middleName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Email</label>
            <div className='col-lg-8 fv-row'>
              <span className='fw-bolder fs-6 text-dark'>
                {empPersonalData.email == '' ? '-' : empPersonalData.email}
              </span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Contact Number</label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{empPersonalData.contactNumber}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Department</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.departmentName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Designation</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.designationName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Branch</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.branchName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Role</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.roleName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Nationality</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.nationalityName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Blood Group</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.bloodGroupName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Gender</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.genderName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Birth Date</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.birthDate}</span>
            </div>
          </div>
          <div className='row mb-10'>
            <label className='col-lg-3 fw-bold text-muted'>Anniversary Date</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.anniversaryDate}</span>
            </div>
          </div>
          <div className='row mb-10'>
            <label className='col-lg-3 fw-bold text-muted'>Join Date</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{empPersonalData.joinDate}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
