import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {
  IEmployeeQuoLevelMapModel,
  IQuotationLevelModel,
} from '../../../models/master-page/IQuotationLevelModel'
import {QuotationLevelCard} from './QuotationLevelCard'
import {
  deleteQuotationLevelDetails,
  getAllQuotationLevel,
  getEmployeeListWithQuotationLevelIDApi,
} from '../../../modules/master-page/quotation-level-page/QuotationLevelCRUD'
import {ModelPopUpEmployeeMapWithQuoLevel} from './ModelPopUpEmployeeMapWithQuoLevel'

type Props = {}

interface IQuotationLevel {
  loading: boolean
  quotationLevelData: IQuotationLevelModel[]
  tmpQuotationLevelData: IQuotationLevelModel[]
  empWithQuoLevelMapData: IEmployeeQuoLevelMapModel[]
  objQuotLevelData: IQuotationLevelModel
  searchText: string
  sequenceNo: number
  stageName: string
  amtPercentage: number
  QuotationLevelID: number
}

const QuotationLevelListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IQuotationLevel>({
    loading: false,
    quotationLevelData: [] as IQuotationLevelModel[],
    tmpQuotationLevelData: [] as IQuotationLevelModel[],
    empWithQuoLevelMapData: [] as IEmployeeQuoLevelMapModel[],
    objQuotLevelData: {} as IQuotationLevelModel,
    searchText: '',
    sequenceNo: 0,
    stageName: '',
    amtPercentage: 0,
    QuotationLevelID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getquotationLevelData(mainSearch)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  function getquotationLevelData(mainSearch: string) {
    getAllQuotationLevel()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.responseObject.filter((user: any) => {
              return user.title.toLowerCase().includes(mainSearch.toLowerCase())
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              quotationLevelData: results,
              searchText: mainSearch,
              tmpQuotationLevelData: responseData.responseObject,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              quotationLevelData: responseData.responseObject,
              tmpQuotationLevelData: responseData.responseObject,
              loading: false,
            })
            setTotal(responseData.responseObject.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, quotationLevelData: [], loading: true})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, quotationLevelData: [], loading: false})
      })
  }

  //====================Employee=========================

  const [empMap, setEmpMap] = useState(false)
  const [showEmpMap, setShowEmpMap] = useState(false)
  const handleCloseEmp = () => {
    setShowEmpMap(false)
    setState({...state, loading: false})
  }
  function handleShowEmpMap(objQuoLevelMdl: IQuotationLevelModel) {
    setEmpMap(true)
    getEmployeeListWithQuotationLevelIDApi(objQuoLevelMdl.quotationLevelID)
      .then((response) => {
        const empWithQuoLevelMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            empWithQuoLevelMapData: empWithQuoLevelMapData,
            objQuotLevelData: objQuoLevelMdl,
            loading: false,
          })
          setEmpMap(false)
        } else {
          setState({
            ...state,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setEmpMap(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setEmpMap(false)
        setState({...state, loading: false})
      })
    setShowEmpMap(true)
  }
  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (QuotationLevelID: number) => {
    setState({
      ...state,
      loading: false,
      QuotationLevelID: QuotationLevelID,
    })
    setShow(true)
  }

  // ========================Delete Department=====================
  function deleteQuotationLevelItem(QuotationLevelID: number) {
    deleteQuotationLevelDetails(QuotationLevelID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getquotationLevelData(state.searchText)
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
      const results = state.tmpQuotationLevelData.filter((user) => {
        return user.quotationLevelName.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, quotationLevelData: results, searchText: keyword})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, quotationLevelData: state.tmpQuotationLevelData, searchText: keyword})
      // If the text field is empty, show all users
      setTotal(state.tmpQuotationLevelData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IQuotationLevelModel[] = state.quotationLevelData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/quotation-level/add'}
          title='Click to add Quotation Level'
        />
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
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

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to='/master/pmc-work-stage/add'
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
            <table className='table table-striped align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Quotation Level</th>
                  <th className='min-w-150px text-center'>Employee</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <QuotationLevelCard
                        data={data}
                        handleShow={() => handleShow(data.quotationLevelID)}
                        name={name}
                        handleShowEmpMap={() => handleShowEmpMap(data)}
                      />
                      // <tr key={index}>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.stageName}</td>

                      //   <td className='text-dark text-hover-primary fs-6'>{data.amtPercentage} %</td>

                      //   <td className='text-dark text-hover-primary fs-6'>{data.sequenceNo}</td>

                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/master/pmc-work-stage/edit/${data.QuotationLevelID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.QuotationLevelID)}
                      //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/general/gen027.svg'
                      //           className='ssvg-icon-3 svg-icon-danger'
                      //         />
                      //       </div>
                      //     </div>
                      //   </td>
                      // </tr>
                    )
                  })}
                {/* =================== Image no data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={9}
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
        id={state.QuotationLevelID}
        pageName={'Design Stage'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteQuotationLevelItem(state.QuotationLevelID)}
      />
      {/* ===================Employee Model=====================  */}
      <ModelPopUpEmployeeMapWithQuoLevel
        show={showEmpMap}
        handleClose={handleCloseEmp}
        EmployeeMapData={state.empWithQuoLevelMapData}
        QuotationLevelID={state.objQuotLevelData.quotationLevelID}
        QuotationLevelName={state.objQuotLevelData.quotationLevelName}
      />
    </>
  )
}

export default QuotationLevelListPage
