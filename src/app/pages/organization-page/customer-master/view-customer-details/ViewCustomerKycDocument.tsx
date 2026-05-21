import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup/redux/RootReducer'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {Link, useParams} from 'react-router-dom'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {
  getCustomerKYCDocument,
  getCustomerKYCDocumentByCustomerKYCDocumentId,
} from '../../../../modules/organization-page/customer-master-page/KYC-document-details/CustomerKYCDocCRUD'
import {ICustomerKYCDocumentWebModel} from '../../../../models/organization-page/customer/ICustomerKYCDocumentModel'
import {Pagination} from 'antd'
import {Button, Modal} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'

type Props = {}
interface IMyProfile {
  loading: boolean
  customerDocumentData: ICustomerKYCDocumentWebModel[]
  selDocumentID: ICustomerKYCDocumentWebModel
}

export function ViewCustomerKycDocument() {
  const {customerID} = useParams<{customerID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IMyProfile>({
    loading: false,
    customerDocumentData: [] as ICustomerKYCDocumentWebModel[],
    selDocumentID: {} as ICustomerKYCDocumentWebModel,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getCustomerKYCDocumentData()
    }, 100)
  }, [])

  function getCustomerKYCDocumentData() {
    getCustomerKYCDocument(parseInt(customerID))
      .then((response) => {
        const cusDocumentData = response.data.responseObject
        setState({...state, customerDocumentData: cusDocumentData, loading: false})
        setTotal(cusDocumentData.length)
      })
      .catch((error) => {
        alert(error)
        setState({
          ...state,
          customerDocumentData: [] as ICustomerKYCDocumentWebModel[],
          loading: false,
        })
      })
  }

  const [show, setShow] = useState(false)

  function handleClose() {
    setShow(false)
  }

  function handleShow(Data: ICustomerKYCDocumentWebModel) {
    getCustomerKYCDocumentByCustomerKYCDocumentId(`${Data.customerkycDocIMapD}`)
      .then((response) => {
        setState({
          ...state,
          selDocumentID: response.data,
        })
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
      })
    setShow(true)
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(state.customerDocumentData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICustomerKYCDocumentWebModel[] = state.customerDocumentData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const {customerDocumentData} = state

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
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
                  <th className='min-w-150px'>Document Name</th>
                  <th className='min-w-150px'>Document Number</th>
                  <th className='min-w-25px text-center'>View</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <div className={state.loading === true ? 'card mb-5 mb-xl-10 h-100' : 'd-none'}>
                  <div className='card-body border-top p-9 ms-10'>
                    <div className='d-flex justify-content-center m-5 p-5'>
                      <div
                        className='spinner-border'
                        style={{width: '3rem', height: '3rem'}}
                        role='status'
                      >
                        <span className='visually-hidden'>Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.documentName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.documentNumber}
                          </span>
                        </td>
                        <td className='text-center'>
                          <span
                            className='btn btn-icon btn-bg-light text-success bg-hover-success text-hover-inverse-success btn-sm'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                            onClick={() => handleShow(data)}
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                {/* =================== Blank Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={5}
                />
              </tbody>
            </table>
          </div>
          <div className='text-center'>
            <Pagination
              onChange={(value: any) => setPage(value)}
              pageSize={postPerPage}
              total={total}
              current={page}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={onShowSizeChange}
              showTotal={(total) => `Total ${total} items`}
            />
          </div>
        </div>
      </div>
      {/* ---------------------------------view data ----------------------------- */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Modal heading</Modal.Title>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body pt-2'>
            <div className='w-100 border-bottom d-md-block my-2'></div>
            <div className='row g-4'>
              <span className='col-3 col-sm-3 text-gray-800 text-hover-primary fw-bold'>
              Document Name:
              </span>
              <span className='col-9 col-sm-9 fw-bold fs-4'>
                {state.selDocumentID.documentName}
              </span>
            </div>
            <div className='w-100 border-bottom d-md-block my-2'></div>
            <div className='row g-4'>
              <span className='col-3 col-sm-3 text-gray-800 text-hover-primary fw-bold'>
                Account Number:
              </span>
              <span className='col-9 col-sm-9 fw-bold fs-4'>
                {state.selDocumentID.documentNumber}
              </span>
            </div>
            <div className='w-100 border-bottom d-md-block my-2'></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary2' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
