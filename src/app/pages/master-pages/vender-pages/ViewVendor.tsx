import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup/redux/RootReducer'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import Loader from '../../common-pages/Loader'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {getVenderViewDataApi} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {toast} from 'react-toastify'

type Props = {}
interface IMyProfile {
  loading: boolean
  mainSearch: string
  vendorData: IVenderModel
}

export function ViewVendor() {
  const history = useHistory()
  const location = useLocation()
  const {vendorID} = useParams<{vendorID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IMyProfile>({
    loading: false,
    mainSearch: '',
    vendorData: {} as IVenderModel,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      getMyPersonalData(mainSearch)
    }, 100)
  }, [])

  function getMyPersonalData(mainSearch: string) {
    getVenderViewDataApi(parseInt(vendorID))
      .then((response) => {
        const personData = response.data
        setState({...state, vendorData: personData, loading: false, mainSearch})
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, vendorData: {} as IVenderModel, loading: false})
      })
  }

  const {vendorData} = state

  return (
    <>
      <div className='text-end mb-4'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 btn btn-rounded'
          onClick={() =>
            history.push({pathname: '/vender/list', state: {search: state.mainSearch}})
          }
        >
          Back To List
        </span>
      </div>
      <Loader loading={state.loading} />
      <div className='card mb-3 mb-xl-2' id='kt_profile_details_view'>
        <div className='card-body p-9'>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted'>Vendor Type Name</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{vendorData.vendorTypeName}</span>
            </div>
          </div>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted'>Company Name</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{vendorData.companyName}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Contact Parson</label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{vendorData.contactPerson}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Contact Number</label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{vendorData.contactNumber}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-3 fw-bold text-muted'>Email</label>
            <div className='col-lg-8'>
              <a href='#' className='fw-bolder fs-6 text-dark'>
                {vendorData.email}
              </a>
            </div>
          </div>
          <div className='row mb-5'>
            <label className='col-lg-3 fw-bold text-muted'>Password</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{vendorData.password}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
