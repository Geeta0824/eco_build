import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup/redux/RootReducer'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {employeeAddressApi} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import Loader from '../../common-pages/Loader'
import {getUserByUserID} from '../../../modules/organization-page/user-master-page/UserCRUD'
import {IUserModel} from '../../../models/organization-page/user/IUserModel'

type Props = {}
interface IUser {
  loading: boolean
  userData: IUserModel
  mainSearch: string
}

export function ViewUserDetails() {
  const location = useLocation()
  const history = useHistory()
  const {userID} = useParams<{userID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IUser>({
    loading: false,
    userData: {} as IUserModel,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      getMyAddressData(mainSearch)
    }, 100)
  }, [])

  function getMyAddressData(mainSearch: string) {
    getUserByUserID(parseInt(userID))
      .then((response) => {
        const personData = response.data
        setState({...state, userData: personData, mainSearch: mainSearch, loading: false})
      })
      .catch((error) => {
        alert(error)
        setState({...state, userData: {} as IUserModel, loading: false})
      })
  }

  const {userData} = state

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({pathname: '/organization/user/list', state: {search: state.mainSearch}})
          }}
        >
          Back To List
        </span>
      </div>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <Loader loading={state.loading} />
        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>User Name</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{userData.userName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Employee Name</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{userData.employeeName}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Department</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{userData.departmentName}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Role</label>
            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6 text-dark'>{userData.roleName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Password</label>
            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6 text-dark'>{userData.password}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
