import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IProjectExpenseModel} from '../../../models/master-page/IProjectExpenseModel'
import {
  deleteProjectExpenseData,
  getProjectExpenseList,
} from '../../../modules/account-page/project-expense-master-page/ProjectExpenseCRUD'
import {ProjectExpenseCard} from './ProjectExpenseCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {ProjectDetailsModel} from '../../common-pages/ProjectDetailsModel'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {getGetProjectDetailsList_ByProjectIDAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

interface IProjExp {
  loading: boolean
  projectExpenseData: IProjectExpenseModel[]
  tmpProjectExpenseData: IProjectExpenseModel[]
  projectData: IProjectModel[]
  PDFShow: string
  SearchText: string
  mainSearch: string
  selProjExpID: number
  activeID: number
  activeType: any
  pathUrl: any
  expenseTypeID: number
}

type Props = {}

const ProjectExpenseList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IProjExp>({
    loading: false,
    projectExpenseData: [] as IProjectExpenseModel[],
    tmpProjectExpenseData: [] as IProjectExpenseModel[],
    projectData: [] as IProjectModel[],
    PDFShow: '',
    SearchText: '',
    mainSearch: '',
    selProjExpID: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
    expenseTypeID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.Search
      }
      getProjectExpenseData(mainSearch)
    }, 100)
  }, [])

  // ==================== Get Project Expense API Call===================

  function getProjectExpenseData(mainSearch: string) {
    getProjectExpenseList()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.voucherNo.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.transactionMode.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.projectName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.amount.toString().includes(mainSearch.toLowerCase()) ||
                user.expenseDate.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.cashAccountName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.title.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              projectExpenseData: results,
              tmpProjectExpenseData: responseData,

              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              projectExpenseData: responseData,
              tmpProjectExpenseData: responseData,

              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, projectExpenseData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, projectExpenseData: [], loading: false})
      })
  }

  // ====================Delete Model Function============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)

  const handleShow = (projExpenseID: number) => {
    setState({
      ...state,
      selProjExpID: projExpenseID,
      loading: false,
    })
    setShow(true)
  }

  const deleteCounteyItem = (projExpID: number) => {
    deleteProjectExpenseData(projExpID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getProjectExpenseData(state.mainSearch)
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  //   ------View on other tab --------------
  async function downloadQuotationFile(selURL: string) {
    var fullUrl = process.env.REACT_APP_API_URL + selURL
    //Split image name
    const nameSplit = fullUrl.split('/')
    const duplicateName = nameSplit.pop()
    // let url = window.URL.createObjectURL(new Blob([fullUrl]))
    // let a = document.createElement('a')
    // a.href = url
    // a.download = '' + duplicateName + ''
    // a.click()
    const link = document.createElement('a')
    // link.download = '' + duplicateName + ''
    link.target = '_blank'
    link.href = `${fullUrl}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ====================Country Flag============
  const [showDocument, setShowDocument] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, PDFShow: '', loading: false})
    setShowDocument(false)
  }
  const handleShowFlag = (selPathUrl: string) => {
    setState({
      ...state,
      PDFShow: toAbsoluteUrl('/media/svg/files/pdf.svg') + selPathUrl,
      loading: false,
    })
    setShowDocument(true)
  }

  // ============== Search Function =======================

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpProjectExpenseData.filter((user) => {
        return (
          user.voucherNo.toLowerCase().includes(keyword.toLowerCase()) ||
          user.transactionMode.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.amount.toString().includes(keyword.toLowerCase()) ||
          user.expenseDate.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cashAccountName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.title.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, projectExpenseData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, projectExpenseData: state.tmpProjectExpenseData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpProjectExpenseData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ----------------------pagination---------------------------------------------
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectExpenseModel[] = state.projectExpenseData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  // ------------------------- For Project Details ---------------------
  const [showProDtl, setShowProDtl] = useState(false)
  function handleCloseProDtl() {
    setShowProDtl(false)
  }

  function handleShowProDtl(temProjectID: number) {
    getGetProjectDetailsList_ByProjectIDAPI(temProjectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectData: [],
          loading: false,
        })
      })
    setShowProDtl(true)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/accounts/project-expense/add'}
          title='Click to add a Project Expense '
        />
        {/* <div className='card-header border-0 py-2 bg-dark'>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
            <form className='w-100 position-relative' autoComplete='off'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                // name='search'
                placeholder='Search'
                onChange={filter}
                value={name}
              />
            </form>
          </div>

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to='/accounts/project-expense/add'
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div> */}
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-secondary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Expense Date</span>
                    <span className='text-muted fw-bold d-block fs-6'>Vouchar No.</span>
                  </th>

                  <th className='min-w-175px'>
                    <span className='d-block mb-1 '>Project Name</span>
                    <span className='text-muted fw-bold d-block fs-6'>Title</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Amount</span>
                    <span className='text-muted fw-bold d-block fs-6'>Transction Mode</span>
                  </th>

                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Is GST</span>
                    <span className='text-muted fw-bold d-block fs-6'>GST Amount (%)</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Is TDS</span>
                    <span className='text-muted fw-bold d-block fs-6'>TDS Amount (%)</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Final Amount</span>
                    <span className='text-muted fw-bold d-block fs-6'>Cash Account</span>
                  </th>
                  <th className='w-125px'>Create By</th>
                  <th className='min-w-25px text-left'>Download</th>
                  <th className='min-w-125px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                {/* =================== Api Data Blank ============== */}
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={15} />
                ) : (
                  <>
                    {currentPosts.length > 0 &&
                      currentPosts.map((data, index) => {
                        return (
                          <ProjectExpenseCard
                            data={data}
                            downloadQuotationFile={() => downloadQuotationFile(data.filePath)}
                            handleShow={() => handleShow(data.projectExpenseID)}
                            handleShowProDtl={() => handleShowProDtl(data.projectID)}
                            name={name}
                            EmployeeID={user.employeeID}
                          />
                        )
                      })}
                  </>
                )}
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={15}
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
            ></Pagination>
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selProjExpID}
        pageName={'Project Expense'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteCounteyItem(state.selProjExpID)}
      />

      {/* =====================Image Model=================== */}
      <Modal
        size='lg'
        show={showDocument}
        onHide={handleCloseFlag}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Attach Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5'>
            <img
              alt='Pic'
              className='img-fluid'
              src={toAbsoluteUrl(`/media/svg/files/pdf.svg+${state.PDFShow}`)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseFlag}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ProjectDetailsModel
        data={state.projectData}
        show={showProDtl}
        handleClose={handleCloseProDtl}
        loading={state.loading}
      />
    </>
  )
}

export default ProjectExpenseList
