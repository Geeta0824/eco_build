import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup/redux/RootReducer'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {getViewCustomerByCustomerID} from '../../../../modules/organization-page/customer-master-page/CustomerCRUD'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {ICustomerViewModel} from '../../../../models/organization-page/customer/ICustomenrModel'
import Loader from '../../../common-pages/Loader'

type Props = {}
interface IMyProfile {
  loading: boolean
  customerPersonalData: ICustomerViewModel
  mainSearch: string
  mainBranchID: number
}

export function ViewCustomerPersonal() {
  const history = useHistory()
  const location = useLocation()
  const {customerID} = useParams<{customerID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IMyProfile>({
    loading: false,
    customerPersonalData: {} as ICustomerViewModel,
    mainSearch: '',
    mainBranchID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainBranchID: number = 0
      var mainSearch: string = ''
      if (lc.mainBranchID == undefined || lc.mainSearch !== undefined) {
        mainBranchID = lc.mainBranchID
        mainSearch = lc.mainSearch
      }
      getMyPersonalData(mainBranchID, mainSearch)
    }, 100)
  }, [])

  function getMyPersonalData(mainBranchID: number, mainSearch: string) {
    getViewCustomerByCustomerID(parseInt(customerID))
      .then((response) => {
        const personData = response.data
        setState({
          ...state,
          customerPersonalData: personData,
          mainBranchID: mainBranchID,
          mainSearch: mainSearch,
          loading: false,
        })
      })
      .catch((error) => {
        setState({...state, customerPersonalData: {} as ICustomerViewModel, loading: false})
      })
  }

  const {customerPersonalData} = state

  return (
    <>
      <div className='text-end mb-5 '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/organization/customer/list',
              state: {
                BranchID: state.mainBranchID,
                search: state.mainSearch,
              },
            })
          }
        >
          Back To List
        </span>
      </div>
      <Loader loading={state.loading} />
      <div className='card mb-3 mb-xl-5' id='kt_profile_details_view'>
        <div className='card-body p-9'>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted'>Customer Name</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{customerPersonalData.customerName}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Barnch Name</label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{customerPersonalData.branchName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>User Name</label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{customerPersonalData.userName}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Email</label>
            <div className='col-lg-8'>
              <a href='#' className='fw-bolder fs-6 text-dark'>
                {customerPersonalData.email}
              </a>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Contact Number</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{customerPersonalData.contactNumber}</span>
            </div>
          </div>

          <div className='row mb-10'>
            <label className='col-lg-3 fw-bold text-muted'>Password</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{customerPersonalData.password}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
