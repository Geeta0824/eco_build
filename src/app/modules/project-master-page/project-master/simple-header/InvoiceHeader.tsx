import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useLocation} from 'react-router'

interface ICustomerEdit {
  projectID: any
  loading: boolean
  newCustomerID: number
  cmpName: string
  projName: String
  customerName: String
  mainSearchText: String
  action: string
  projectAmount: number
  paidAmount: number
  remainingAmount: number
}

const InvoiceHeader: React.FC = () => {
  const location = useLocation()
  const history = useHistory()

  const [state, setState] = useState<ICustomerEdit>({
    loading: false,
    newCustomerID: 0,
    cmpName: '',
    action: 'ProjInfo',
    projectID: 0,
    projName: '',
    customerName: '',
    mainSearchText: '',
    projectAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let customerName: any = lc.customerName
      let projectID: any = lc.projectID
      let projectAmount: any = lc.projectAmount
      let paidAmount: any = lc.paidAmount
      let remainingAmount: any = lc.remainingAmount
      var mainSearchText: any = ''
      if (lc != undefined) {
        mainSearchText = lc.searchText
      }
      getEmployeeData(
        projName,
        customerName,
        projectID,
        projectAmount,
        paidAmount,
        remainingAmount,
        mainSearchText
      )
    }, 100)
  }, [])

  function getEmployeeData(
    selprojName: string,
    customerName: string,
    projectID: number,
    projectAmount: number,
    paidAmount: number,
    remainingAmount: number,
    mainSearchText: string
  ) {
    setState({
      ...state,
      loading: false,
      projName: selprojName,
      customerName: customerName,
      projectID: projectID,
      projectAmount: projectAmount,
      paidAmount: paidAmount,
      remainingAmount: remainingAmount,
      mainSearchText,
    })
  }
  return (
    <>
      <div className='text-end'>
        <span
          className='border border-dark btn btn-sm btn-primary bg-danger'
          onClick={() =>
            history.push({
              pathname: '/projects/project/list',
              state: {searchText: state.mainSearchText},
            })
          }
        >
          Back To Main List
        </span>
      </div>{' '}
      <div className='flex-grow-1 ms-8'>
        <div className='col-12 text-start'>
          <label className='text-dark fs-5 fw-bolder '>Project Name : &nbsp;</label>
          <span className='text-primary fw-bolder fs-5'>{state.projName} </span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <label className='text-dark fs-5  fw-bolder '>Customer Name : &nbsp;</label>
          <span className='text-primary fw-bolder fs-5'>{state.customerName}</span>
        </div>
        <div className='col-12 text-start mb-5'>
          <label className='text-dark fs-5 fw-bolder '>Project Amount : &nbsp;</label>
          <span className='text-primary fw-bolder fs-5'>{state.projectAmount} </span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label className='text-dark fs-5 fw-bolder ms-8'>Paid Amount : &nbsp;</label>
          <span className='text-primary fw-bolder fs-5 '>{state.paidAmount}</span>
          <label className='text-dark fs-5 mt-3 fw-bolder ms-8 '>Remaining : &nbsp;</label>
          <span className='text-primary fw-bolder fs-5 '>{state.remainingAmount}</span>
        </div>
      </div>
    </>
  )
}

export default InvoiceHeader
