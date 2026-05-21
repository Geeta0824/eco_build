import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IBranchModel, IBranchRateModel} from '../../../models/master-page/IBranchModel'

import {
  getBranchList,
  deleteBranch,
  isActiveBranch,
  AddUpdateBranchRate,
  GetBranchRate_ByBranchID,
} from '../../../modules/master-page/branch-master-page/BranchCRUD'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {BranchCard} from './BranchCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
type Props = {}

interface IBranch {
  loading: boolean
  branchData: IBranchModel[]
  temBranchData: IBranchModel[]
  branchRateData: IBranchRateModel[]
  selDesigId: number
  activeID: number
  BranchRateID: number
  BranchID: number
  activeType: any
  SearchText: string
  branchName: string
}

const Branch: React.FC<Props> = () => {
  const location = useLocation()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [state, setState] = useState<IBranch>({
    loading: false,
    branchData: [] as IBranchModel[],
    temBranchData: [] as IBranchModel[],
    branchRateData: [] as IBranchRateModel[],
    selDesigId: 0,
    activeID: 0,
    BranchRateID: 0,
    BranchID: 0,
    activeType: false,
    SearchText: '',
    branchName: '',
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getAllBranchData(mainSearch)
    }, 100)
  }, [])

  function getAllBranchData(mainSearch: string) {
    getBranchList()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        console.log(resp)
        if (resp.isSuccess == true) {
          let responseData = resp.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.branchName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.branchCode.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.contactPerson.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.mobileNumber.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.cityName.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              branchData: results,
              temBranchData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              branchData: responseData,
              temBranchData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            branchData: [],
            temBranchData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          branchData: [],
          temBranchData: [],
          loading: false,
        })
      })
  }

  // =================Is Active Function Model Call==============

  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)

  function handleShowActive(event: any) {
    const Cid = event.target.id
    const tmpIsActive = event.target.checked
    setState({
      ...state,
      activeID: Cid,
      activeType: tmpIsActive,
      loading: false,
    })
    setShowActive(true)
  }

  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    let value = {branchID: temEmpId, isActive: temIsAct}
    var objBranch = btoa(JSON.stringify(value))
    isActiveBranch(`${objBranch}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          getAllBranchData(state.SearchText)
          setShowActive(false)
        } else {
          toast.error(`${resp.massege}`)
          setShowActive(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (branchID: number) => {
    setState({
      ...state,
      selDesigId: branchID,
      loading: false,
    })
    setShow(true)
  }

  function deleteDesigantion(branchID: number) {
    let value = {branchID: branchID}
    var objBranch = btoa(JSON.stringify(value))
    deleteBranch(`${objBranch}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllBranchData(state.SearchText)
          setShow(false)
        } else {
          toast.error(`${resp.massege}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  const [showBranchRate, setShowBranchRate] = useState(false)

  const [ReadyMadePercentage, setReadyMadePercentage] = useState(0)
  const [DIYPercentage, setDIYPercentage] = useState(0)
  const [ModularPercentage, setModularPercentage] = useState(0)
  const [DNCPercentage, setDNCPercentage] = useState(0)

  // const handleChangeBranchRate = (setter: any) => (e: any) => {
  //   setter(Number(e.target.value) || 0)
  // }

  const handleChangeBranchRate = (setter: any) => (e: any) => {
    const value = e.target.value
    if (value === '') {
      setter('') // Allow clearing the input
    } else if (/^\d*\.?\d*$/.test(value)) {
      setter(value) // Allow only numbers and decimals
    }
  }

  const handleCloseBranchRate = () => {
    setState({
      ...state,
      // branchRateData: [],
      branchName: '',
      BranchID: 0,
      BranchRateID: 0,
    })
    setReadyMadePercentage(1)
    setDIYPercentage(1)
    setModularPercentage(1)
    setDNCPercentage(1)

    setShowBranchRate(false)
  }

  const handleShowBranchRate = (BranchID: number, branchName: string) => {
    GetBranchRate_ByBranchID(BranchID)
      .then((response) => {
        if (response.data.isSuccess) {
          setState({
            ...state,
            // branchRateData: response.data,
            branchName,
            BranchID: BranchID,
            BranchRateID: response.data.branchRateID,
          })
          setReadyMadePercentage(response.data.readyMadePercentage)
          setDIYPercentage(response.data.diyPercentage)
          setModularPercentage(response.data.modularPercentage)
          setDNCPercentage(response.data.dncPercentage)
        } else {
          setReadyMadePercentage(1)
          setDIYPercentage(1)
          setModularPercentage(1)
          setDNCPercentage(1)
          // toast.success('No record found.')
          setState({
            ...state,
            branchRateData: [],
            branchName,
            BranchID: BranchID,
            BranchRateID: response.data.branchRateID,
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(error.toString())
        setState({...state, branchRateData: [], loading: false})
      })

    setShowBranchRate(true)
  }

  const AddBranchDetails = () => {
    // if (ReadyMadePercentage === 0) {
    //   return toast.error('Please Enter Rate')
    // }

    setState({...state, loading: true})
    AddUpdateBranchRate(
      state.BranchRateID,
      state.BranchID,
      ReadyMadePercentage,
      DIYPercentage,
      ModularPercentage,
      DNCPercentage,
      user.employeeID,
      '192.168.0.1'
    )
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success('Update Successful')
          setState({
            ...state,
            // branchRateData: [],
            branchName: '',
            BranchID: 0,
            BranchRateID: 0,
          })
          setReadyMadePercentage(1)
          setDIYPercentage(1)
          setModularPercentage(1)
          setDNCPercentage(1)
          setShowBranchRate(false)
        } else {
          toast.error(response.data.message)
        }
        setState({...state, loading: false})
      })
      .catch((error) => {
        toast.error(error.toString())
        setState({...state, loading: false})
      })
  }

  //
  // ================= SerchText Function ===========
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temBranchData.filter((user) => {
        return (
          user.branchName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.branchCode.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
          user.mobileNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cityName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, branchData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, branchData: state.temBranchData})
      // If the text field is empty, show all users
      setTotal(state.temBranchData.length)
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
  const currentPosts: IBranchModel[] = state.branchData.slice(indexOfFirstPage, indexOfLastPage)

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/branch/add'}
          title='Click to add a Branch'
        />
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
                  <th className='min-w-125px'>
                    <span className='d-block mb-1'>Branch Name</span>
                    <span className='text-muted fw-bold d-block fs-7'>Branch Code</span>
                  </th>
                  <th className='min-w-125px'>
                    <span className='d-block mb-1'>Contact Preson</span>
                    <span className='text-muted fw-bold d-block fs-7'>Contact Number</span>
                  </th>
                  <th className='min-w-125px'>
                    <span className='d-block mb-1'>State</span>
                    <span className='text-muted fw-bold d-block fs-7'>City</span>
                  </th>
                  <th className='min-w-25px'>Kazulencia Min Amount</th>
                  <th className='min-w-25px'>Active</th>
                  <th className='min-w-25px'>Rate</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <BranchCard
                        data={data}
                        handleShowActive={(e) => handleShowActive(e)}
                        // handleShowBranchMap={handleShowBranchRate}
                        handleShowBranchMap={() =>
                          handleShowBranchRate(data.branchID, data.branchName)
                        }
                        handleShow={() => handleShow(data.branchID)}
                        name={name}
                      />
                    )
                  })}

                {/* ===============================================================
                    {/* ============== Update Model ========== */}
                <Modal
                  size='lg'
                  show={showBranchRate}
                  onHide={handleCloseBranchRate}
                  centered
                  keyboard={false}
                >
                  <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
                    <div className='d-block'>
                      <Modal.Title className='text-white'>Branch Rate</Modal.Title>
                    </div>
                    <div className='d-block'>
                      <Modal.Title className='text-white'>
                        Branch Name: {state.branchName}
                      </Modal.Title>
                    </div>
                  </Modal.Header>
                  <Modal.Body>
                    {[
                      {
                        label: 'Readymade Percentage',
                        state: ReadyMadePercentage,
                        setter: setReadyMadePercentage,
                      },
                      {label: 'DIY Percentage', state: DIYPercentage, setter: setDIYPercentage},
                      {
                        label: 'Modular Percentage',
                        state: ModularPercentage,
                        setter: setModularPercentage,
                      },
                      {label: 'D & C Percentage', state: DNCPercentage, setter: setDNCPercentage},
                    ].map(({label, state, setter}, index) => (
                      <div className='row mb-3 text-center' key={index}>
                        <label className='form-check-label text-start ms-5 col-lg-4 mt-3 fs-5'>
                          {label}:
                        </label>
                        <div className='col-lg-4 fv-row d-flex align-items-center mt-3'>
                          <input
                            type='text'
                            step='0.01'
                            onChange={handleChangeBranchRate(setter)}
                            value={state}
                            className='form-control'
                          />
                          <span className='ms-2 text-dark fs-3'>%</span>
                        </div>
                      </div>
                    ))}
                    <div className='text-end'>
                      <Button variant='danger' onClick={AddBranchDetails}>
                        Update
                      </Button>
                    </div>
                  </Modal.Body>
                </Modal>
                {/* =================== Loading get Api Data ============== */}
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
        id={state.selDesigId}
        pageName={'Branch'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDesigantion(state.selDesigId)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Branch'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default Branch
