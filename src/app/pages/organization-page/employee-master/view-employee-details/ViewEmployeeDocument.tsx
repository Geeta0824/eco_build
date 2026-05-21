import React, {useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup/redux/RootReducer'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {IEmpDocMapModel} from '../../../../models/organization-page/Employee/EmpDocMapModel'
import {Link, useParams} from 'react-router-dom'
import {
  getEmpDocMap,
  getEmpDocMapByEmpDocMapId,
} from '../../../../modules/organization-page/employee-master-page/document-details/EmpDocMapCRUD'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {Pagination} from 'antd'
import {Button, Modal} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {toAbsoluteUrl} from '../../../../../_Ecd/helpers'

type Props = {}
interface IMyProfile {
  loading: boolean
  empDocData: IEmpDocMapModel[]
  selDocByID: IEmpDocMapModel
  pathUrl: any
}

export function ViewEmployeeDocument() {
  const {employeeID} = useParams<{employeeID: string}>()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IMyProfile>({
    loading: false,
    empDocData: [] as IEmpDocMapModel[],
    selDocByID: {} as IEmpDocMapModel,
    pathUrl: process.env.REACT_APP_API_URL,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getMyDocumentlData()
    }, 100)
  }, [])

  function getMyDocumentlData() {
    getEmpDocMap(parseInt(employeeID))
      .then((response) => {
        const personData = response.data.responseObject
     //  console.log(personData)
        setState({...state, empDocData: personData, loading: false})
        setTotal(personData.length)
      })
      .catch((error) => {
        alert(error)
        setState({...state, empDocData: [] as IEmpDocMapModel[], loading: false})
      })
  }

  const [show, setShow] = useState(false)

  function handleClose() {
    setShow(false)
  }

  function handleShow(Data: IEmpDocMapModel) {
    getEmpDocMapByEmpDocMapId(`${Data.employeeDocID}`)
      .then((response) => {
        setState({
          ...state,
          selDocByID: response.data,
        })
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
      })
    setShow(true)
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(state.empDocData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IEmpDocMapModel[] = state.empDocData.slice(indexOfFirstPage, indexOfLastPage)

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const {empDocData} = state

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
                  <th className='min-w-150px'>Document Type</th>
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
                        <div className='d-flex align-items-center'>
                          <div className='symbol symbol-45px me-5 cursor-pointer'>
                            {data.mediaTypeID === 2 ? (
                              <img src={state.pathUrl + data.filePath} alt='img' />
                            ) : (
                              <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='' />
                            )}
                          </div>
                          <td>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.documentTypeName}
                            </span>
                          </td>
                        </div>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.docNumber}
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
                Document Name :
              </span>
              <span className='col-9 col-sm-9 fw-bold fs-4'>{state.selDocByID.documentTypeName}</span>
            </div>
            <div className='w-100 border-bottom d-md-block my-2'></div>
            <div className='row g-4'>
              <span className='col-3 col-sm-3 text-gray-800 text-hover-primary fw-bold'>
                Document Number :
              </span>
              <span className='col-9 col-sm-9 fw-bold fs-4'>{state.selDocByID.docNumber}</span>
            </div>
            <div className='w-100 border-bottom d-md-block my-2'></div>
            <div className='row g-4'>
              <span className='col-3 col-sm-3 text-gray-800 text-hover-primary fw-bold'>
                Description :
              </span>
              <span className='col-9 col-sm-9 fw-bold fs-4'>{state.selDocByID.description}</span>
            </div>
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
