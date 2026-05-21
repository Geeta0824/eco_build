import React, {useEffect, useState} from 'react'

import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'

import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  IAddonListModel,
  IPaymentStructureModel,
  totalPaymentStructure,
} from '../../../models/projects-page/IPaymentStructureModel'
import {
  DeleteProjectPaymentStructureByID,
  ProjectPaymentStructureList,
} from '../../../modules/project-master-page/payment-structure-master-page/PaymentStructureCRUD'

type Props = {}

interface ITurnkey {
  loading: boolean
  payStructureData: IPaymentStructureModel[]
  tmpPayStructureData: IPaymentStructureModel[]
  addonListData: IAddonListModel[]
  totalData: totalPaymentStructure
  searchText: string
  projectName: string
  customerName: string
  PaymentStructureID: number
}

const PaymentStructureList: React.FC<Props> = () => {
  const location = useLocation()
  const {projectID} = useParams<{projectID: string}>()
  const [state, setState] = useState<ITurnkey>({
    loading: false,
    payStructureData: [] as IPaymentStructureModel[],
    tmpPayStructureData: [] as IPaymentStructureModel[],
    addonListData: [] as IAddonListModel[],
    totalData: {} as totalPaymentStructure,
    searchText: '',
    projectName: '',
    customerName: '',
    PaymentStructureID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    let lc: any = location.state
    let projName: any = lc.projName
    console.log(projName)
    let customerName: any = lc.customerName
    setTimeout(() => {
      getpayStructureData(projName, customerName)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  function getpayStructureData(projName: string, customerName: string) {
    ProjectPaymentStructureList(parseInt(projectID))
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          setState({
            ...state,
            payStructureData: responseData.responseObject,
            tmpPayStructureData: responseData.responseObject,
            addonListData: responseData.addonList,
            totalData: responseData,
            projectName: projName,
            customerName: customerName,
            loading: false,
          })
          // setTotal(responseData.responseObject.length)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, payStructureData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, payStructureData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (projectID: number) => {
    setState({
      ...state,
      loading: false,
      PaymentStructureID: projectID,
    })
    setShow(true)
  }

  // ========================Delete Department=====================
  function deleteProjectPaymentStructure(PaymentStructureID: number) {
    DeleteProjectPaymentStructureByID(PaymentStructureID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getpayStructureData(state.projectName, state.customerName)
          setShow(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpPayStructureData.filter((user) => {
        return (
          user.amtPercentage.toString().includes(keyword.toLowerCase()) ||
          user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.sequenceNo.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, payStructureData: results, searchText: keyword})
      // setTotal(results.length)
    } else {
      setState({...state, payStructureData: state.tmpPayStructureData, searchText: keyword})
      // If the text field is empty, show all users
      // setTotal(state.tmpPayStructureData.length)
    }

    setName(keyword)
  }

  // ====================Pagination==============
  // const onShowSizeChange = (current: any, pageSize: any) => {
  //   setPostPerPage(pageSize)
  // }
  // const [total, setTotal] = useState(0) //  length
  // const [page, setPage] = useState(1)
  // const [postPerPage, setPostPerPage] = useState(10)
  // const indexOfLastPage = page * postPerPage
  // const indexOfFirstPage = indexOfLastPage - postPerPage
  // const currentPosts: IPaymentStructureModel[] = state.payStructureData.slice(
  //   indexOfFirstPage,
  //   indexOfLastPage
  // )

  // function handleClose(): void {
  //   throw new Error('Function not implemented.')
  // }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='border-0 pt-2' id='kt_chat_contacts_header'>
            <span className='w-100 position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                // name='search'
                placeholder='Search'
                // placeholder={intl.formatMessage({id: 'PEOPLE.SEARCH'})}
                onChange={filter}
                value={name}
              />
            </span>
          </div>
          <div className='col-1 mt-2'>
            <Link
              to={{
                pathname: `/projects/project/edit/${projectID}/paymentstructure/pdf`,
                state: {projName: state.projectName, customerName: state.customerName},
              }}
              className='symbol symbol-40px cursor-pointer d-block justify-content-center text-center'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='View PDF'
            >
              <img src={toAbsoluteUrl('/media/img/download.png')} alt='' />
            </Link>
          </div>
          {/* <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={`/projects/project/edit/${parseInt(projectID)}/paymentstructure/add`}
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div> */}
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-200px'>Payment Details</th>
                  <th className='min-w-150px'>% of Invoice Amount</th>
                  <th className='min-w-150px'>Expect Date</th>
                  <th className='min-w-100px'>Payment</th>
                  <th className='min-w-150px'>Receive Date</th>
                  <th className='min-w-100px'>Receive Amount</th>
                  <th className='min-w-50px'>Remaining Amount</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {state.payStructureData.length > 0 &&
                  state.payStructureData.map((data, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td className='text-dark text-hover-primary fs-6'>{data.stageName}</td>

                          <td className='text-dark text-hover-primary fs-6'>
                            {data.amtPercentage} %
                          </td>

                          <td className='text-dark text-hover-primary fs-6'>
                            {data.amountExpectDate}
                          </td>
                          <td className='text-dark text-hover-primary fs-6'>
                            {data.stageWiseAmount}
                          </td>
                          <td className='text-dark text-hover-primary fs-6'>{data.receiveDate}</td>
                          <td className='text-dark text-hover-primary fs-6'>
                            {data.stageWiseReciveAmt}
                          </td>
                          <td className='text-dark text-hover-primary fs-6'>
                            {data.staeWiseRemAmt}
                          </td>
                        </tr>
                      </>
                    )
                  })}
                {state.addonListData.length > 0 &&
                  state.addonListData.map((data, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td className='text-dark text-hover-primary fs-6'>{data.stageName}</td>

                          <td className='text-dark text-hover-primary fs-6' colSpan={2}>
                            {data.addonItemName}
                          </td>
                          <td className='text-dark text-hover-primary fs-6'>
                            {data.stageWiseAmount}
                          </td>
                          <td className='text-dark text-hover-primary fs-6'>{data.receiveDate}</td>
                          <td className='text-dark text-hover-primary fs-6'>
                            {data.stageWiseReciveAmt}
                          </td>
                          <td className='text-dark text-hover-primary fs-6'>
                            {data.staeWiseRemAmt}
                          </td>
                        </tr>
                      </>
                    )
                  })}
                <tr className='text-dark'>
                  <td className='text-start fw-bolder fs-6'>Total</td>
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.totalData.amtPercentage}%
                  </td>
                  <td className='text-start'></td>
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.totalData.stageWiseAmount}
                  </td>
                  <td className='text-start'></td>
                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.totalData.stageWiseReciveAmt}
                  </td>

                  <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                    {state.totalData.staeWiseRemAmt}
                  </td>
                </tr>
                {/* =================== Image no data ============== */}
                <BlankDataImageInTable
                  length={state.payStructureData.length}
                  loading={state.loading}
                  colSpan={9}
                />
              </tbody>
            </table>
          </div>
          {/* <div className='text-start'>
            <Pagination
              onChange={(value: any) => setPage(value)}
              pageSize={postPerPage}
              total={total}
              current={page}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={onShowSizeChange}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div> */}
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.PaymentStructureID}
        pageName={'Payment Structure'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteProjectPaymentStructure(state.PaymentStructureID)}
      />
    </>
  )
}

export default PaymentStructureList
