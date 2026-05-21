import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {UserModel} from '../../auth/models/UserModel'
import {useLocation} from 'react-router'

interface IEmployeeEdit {
  loading: boolean
  newEmployeeID: number
  selAgencyTypeName: string
  employeeCode: string
  mainSearch: string
  searchText: string
}

const AgencyWorkStageHeader: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IEmployeeEdit>({
    loading: false,
    newEmployeeID: 0,
    selAgencyTypeName: '',
    employeeCode: '',
    mainSearch: '',
    searchText: '',
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let agencyTypeName = lc.agencyTypeName
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }

      setState({...state, selAgencyTypeName: agencyTypeName, mainSearch, loading: false})
    }, 100)
  }, [])

  return (
    <>
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/p-product/agency-type/list',
              state: {search: state.mainSearch},
            })
          }
        >
          Back To Main List
        </span>
      </div>
      <div className='d-flex flex-column mb-2'>
        <div className='d-flex align-items-center'>
          <label className='text-dark text-hover-primary cursor-pointer fs-2 fw-bolder'>
            Agency Type Name :
          </label>
          <span className='text-primary text-hover-dark cursor-pointer fs-3 fw-bolder ms-3'>
            {state.selAgencyTypeName}
          </span>
        </div>
      </div>
    </>
  )
}

export {AgencyWorkStageHeader}
