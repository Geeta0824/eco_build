import React, {useEffect, useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {useLocation} from 'react-router'
import {stat} from 'fs'

interface ICustomerEdit {
  loading: boolean
  newCustomerID: number
  accountName: string
  action: string
  mainSearch: string
}

const CashAccountEmployeeHeader: React.FC = () => {
  const location = useLocation()
  const history = useHistory()

  const [state, setState] = useState<ICustomerEdit>({
    loading: false,
    newCustomerID: 0,
    accountName: '',
    action: 'Personal',
    mainSearch: '',
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let accountName: any = lc.accountName
      var mainSearch: string = ''
      if (lc.mainSearch == undefined) {
        mainSearch = lc.mainSearchConfig
      }
      getEmployeeData(accountName, mainSearch)
    }, 100)
  }, [])

  function getEmployeeData(accountName: string, mainSearch: string) {
    setState({
      ...state,
      loading: false,
      accountName: accountName,
      mainSearch,
    })
  }

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/organization/cashaccount/list',
              state: {search: state.mainSearch},
            })
          }}
        >
          Back To Main List
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-body ps-8 py-3'>
          <div className='d-flex flex-wrap flex-sm-nowrap mb-1'>
            <div className='flex-grow-1'>
              <div className='d-flex align-items-center justify-content-left fs-4 '>
                <span className='col-6 text-dark fs-4 fw-bold me-1'>
                  Company Name : &nbsp;&nbsp;&nbsp;
                  <span className='text-primary text-hover-danger fs-3 fw-bold me-1'>
                    {state.accountName}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CashAccountEmployeeHeader
