import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  IDNCPaymentStructureModel,
  IDNCPmtStageByBranchModel,
} from '../../../models/master-page/IDNCPaymentStructureModel'
import {
  deleteDNCProjPayStructureAPI,
  getAllDNCProjPayStructureAPI,
  getBranchWithDNCPaymentStageIDApi,
} from '../../../modules/master-page/dnc-payment-structure-master-page/DNCPaymentStructureCRUD'
import {DNCPaymentStructureCard} from './DNCPaymentStructureCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {DNCPayStructureBranchMap} from './DNCPayStructureBranchMap'

type Props = {}

interface IDNCStage {
  loading: boolean
  dncPaymentData: IDNCPaymentStructureModel[]
  tmpDNCPaymentData: IDNCPaymentStructureModel[]
  objDNCPaymentData: IDNCPaymentStructureModel
  dncPayStrBranchMapData: IDNCPmtStageByBranchModel[]
  searchText: string
  dncProjPaymentStageID: number
}

const DNCPaymentStructureList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IDNCStage>({
    loading: false,
    dncPaymentData: [] as IDNCPaymentStructureModel[],
    tmpDNCPaymentData: [] as IDNCPaymentStructureModel[],
    objDNCPaymentData: {} as IDNCPaymentStructureModel,
    dncPayStrBranchMapData: [] as IDNCPmtStageByBranchModel[],
    searchText: '',
    dncProjPaymentStageID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.search
      }
      getDNCProjPayData(mainSearch)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  function getDNCProjPayData(mainSearch: string) {
    getAllDNCProjPayStructureAPI()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.responseObject.filter((user: any) => {
              return (
                user.stageName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.amtPercentage.toString().includes(mainSearch.toLowerCase()) ||
                user.sequenceNo.toString().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              dncPaymentData: results,
              searchText: mainSearch,
              tmpDNCPaymentData: responseData.responseObject,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              dncPaymentData: responseData.responseObject,
              tmpDNCPaymentData: responseData.responseObject,
              loading: false,
            })
            setTotal(responseData.responseObject.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, dncPaymentData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, dncPaymentData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (pmcid: number) => {
    setState({
      ...state,
      dncProjPaymentStageID: pmcid,
      loading: false,
    })
    setShow(true)
  }

  // ========================Delete DNC PAYMENT STRUCTURE=====================
  function deleteDeparmentItem(dncId: number) {
    deleteDNCProjPayStructureAPI(dncId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getDNCProjPayData(state.searchText)
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

  // -------------------Branch Map -----------------
  const [dncPmtStructureBranch, setDNCPmtStructureBranch] = useState(false)
  const [showDNCPmtStructureBranch, setShowDNCPmtStructureBranch] = useState(false)
  const handleCloseDNCPayStrBranch = () => {
    setShowDNCPmtStructureBranch(false)
    setState({...state, dncPayStrBranchMapData: [], loading: false})
  }

  function DNCPmtStructureBranchMapData(tmpObjDNCPmtStructure: IDNCPaymentStructureModel) {
    setDNCPmtStructureBranch(true)
    getBranchWithDNCPaymentStageIDApi(tmpObjDNCPmtStructure.dncProjPaymentStageID)
      .then((response) => {
        const dncPayStrBranchMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            dncPayStrBranchMapData: dncPayStrBranchMapData,
            objDNCPaymentData: tmpObjDNCPmtStructure,
            loading: false,
          })
          setShowDNCPmtStructureBranch(true)
          setDNCPmtStructureBranch(false)
        } else {
          setState({
            ...state,
            dncPayStrBranchMapData: dncPayStrBranchMapData,
            objDNCPaymentData: tmpObjDNCPmtStructure,
            loading: false,
          })
          setShowDNCPmtStructureBranch(true)
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setDNCPmtStructureBranch(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setDNCPmtStructureBranch(false)
        setState({
          ...state,
          dncPayStrBranchMapData: [],
          objDNCPaymentData: tmpObjDNCPmtStructure,
          loading: false,
        })
      })
    setShowDNCPmtStructureBranch(false)
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpDNCPaymentData.filter((user) => {
        return (
          user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.amtPercentage.toString().includes(keyword.toLowerCase()) ||
          user.sequenceNo.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, dncPaymentData: results, searchText: keyword})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, dncPaymentData: state.tmpDNCPaymentData, searchText: keyword})
      // If the text field is empty, show all users
      setTotal(state.tmpDNCPaymentData.length)
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
  const currentPosts: IDNCPaymentStructureModel[] = state.dncPaymentData.slice(
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
          pathName={'/master/dnc-pay-struc/add'}
          title='Click to add a DNC Payment Structure'
        />
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}> */}
        {/* <h3 className='card-title align-items-start flex-column'> */}
        {/* <span className='card-label fw-bolder fs-3 mb-1'>Department</span>
          <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Cities</span> */}
        {/* </h3> */}

        {/* <div className='border-0 pt-2' id='kt_chat_contacts_header'>
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
              to='/master/dnc-pay-struc/add'
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div> */}
        {/* </div> */}
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
                  <th className='min-w-150px'>Stage Name</th>
                  <th className='min-w-25px'>Payment Percentage</th>
                  <th className='min-w-25px'>Sequence No.</th>
                  <th className='min-w-25px'>No. Of Days</th>
                  <th className='min-w-25px'>Branch</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <DNCPaymentStructureCard
                        data={data}
                        handleShow={() => handleShow(data.dncProjPaymentStageID)}
                        dncPmtStructureBranchMapData={() => DNCPmtStructureBranchMapData(data)}
                        name={name}
                      />
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
        id={state.dncProjPaymentStageID}
        pageName={'DNCPay'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDeparmentItem(state.dncProjPaymentStageID)}
      />
      <DNCPayStructureBranchMap
        show={showDNCPmtStructureBranch}
        handleClose={handleCloseDNCPayStrBranch}
        dncPmtStageBranchMapData={state.dncPayStrBranchMapData}
        dncProjPaymentStageID={state.objDNCPaymentData.dncProjPaymentStageID}
        stageName={state.objDNCPaymentData.stageName}
      />
    </>
  )
}
export default DNCPaymentStructureList
