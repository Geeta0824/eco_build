import React, {useCallback, useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'

import {
  DeleteAreaPinCode,
  getAreaPincodeApi,
  isActiveAreaPinCode,
} from '../../../modules/master-page/area-pincode-master-page/AreaPincodeCRUD'
import {IAreaPinCodeModel} from '../../../models/master-page/IAreaPinCodeModel'
import {AreaPinCodeCard} from './AreaPinCodeCard'
import {
  DeleteAreaPinCode_new,
  getAreaPincodeApi_New,
  getAreaPincode_GetList_PaginationAPI,
  isActiveAreaPinCode_new,
} from '../../../modules/master-page/area-pincode-master-page/AreaPincodeNewCRUD'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import LoaderInTable from '../../../../components/loader/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import { ModelPopUpDelete } from '../../common-pages/ModelPopUpDelete'
import { ModelPopUpIsActive } from '../../common-pages/ModelPopUpIsActive'

interface IAreaPin {
  loading: boolean
  areaPinCodeData: IAreaPinCodeModel[]
  tmpAreaPinCodeData: IAreaPinCodeModel[]
  SearchText: string
  activeID: number
  activeType: any
  selAreaPindoceID: number
}

type Props = {}

const AreaPinCode: React.FC<Props> = () => {
  const [state, setState] = useState<IAreaPin>({
    loading: false,
    areaPinCodeData: [] as IAreaPinCodeModel[],
    tmpAreaPinCodeData: [] as IAreaPinCodeModel[],
    SearchText: '',
    activeID: 0,
    activeType: false,
    selAreaPindoceID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      // getAreaPinCodeData()
    }, 100)
  }, [])

  // // ==================== Get AreaPiCode  API Call===================
  // function getAreaPinCodeData() {
  //   getAreaPincodeApi()
  //     .then((response) => {
  //       let responseData = response.data.responseObject
  //       if (response.data.isSuccess === true) {
  //         setState({
  //           ...state,
  //           areaPinCodeData: responseData,
  //           tmpAreaPinCodeData: responseData,
  //           loading: false,
  //         })
  //         setTotal(responseData.length)
  //         setPage(1)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, areaPinCodeData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, areaPinCodeData: [], loading: false})
  //     })
  // }
  // =========================Get AreaPiCode  API Call=========================
  function getAreaPinCodeData(
    SearchText: string = state.SearchText,
    currentPage: number = page,
    currentPostPerPage: number = postPerPage
  ) {
    getAreaPincode_GetList_PaginationAPI(currentPage, currentPostPerPage, SearchText)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess === true) {
          let responseData = resp.responseObject
          setState({
            ...state,
            areaPinCodeData: responseData,
            tmpAreaPinCodeData: responseData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
          console.log(responseData)
        } else {
          toast.error(`${resp.message}`)
          setState({...state, areaPinCodeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          areaPinCodeData: [],
          loading: false,
        })
      })
  }
  // ===================== IsActive Model ==================
  const [showActive, setShowActive] = useState(false)
  const handleClose_Active = () => setShowActive(false)
  function handleShow_Active(event: React.ChangeEvent<HTMLInputElement>) {
    const Cid = event.target.id
    const tmpIsActive = event.target.checked
    setState({
      ...state,
      activeID: parseInt(Cid),
      activeType: tmpIsActive,
      loading: false,
    })
    setShowActive(true)
  }

  // ==================== IsActive API Call ===================
  function checkedFunction(tmpAreaPincodeId: number, tmpIsActive: boolean) {
    // let values = {areaPincodeID: tmpAreaPincodeId}
    const values = {areaPincodeID: tmpAreaPincodeId, isActive: tmpIsActive}
    console.log(values)
    var objEmp = btoa(JSON.stringify(values))
    isActiveAreaPinCode_new(`${objEmp}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        // console.log(decodeResp)
        let resp = decodeResp
        if (resp.isSuccess == true) {
          getAreaPinCodeData()
          setShowActive(false)
        } else {
          toast.error(`${resp.message}`)
          setShowActive(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }

  // ==================== Delete Model ============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (areaPincodeID: number) => {
    setState({
      ...state,
      selAreaPindoceID: areaPincodeID,
      loading: false,
    })
    setShow(true)
  }

  // ==================== Delete API Call ===================
  const deleteAreaPincode = (areaPincodeID: number) => {
    const values = {areaPincodeID: areaPincodeID}
    console.log(values)
    var objEmp = btoa(JSON.stringify(values))
    DeleteAreaPinCode_new(`${objEmp}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        // console.log(decodeResp)
        let resp = decodeResp
        if (resp.isSuccess === true) {
          toast.success('Deleted Successfully')
          getAreaPinCodeData()
          setShow(false)
        } else {
          toast.error(`${resp.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  // ============== Search Function =======================
  const [name, setName] = useState('')
  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpAreaPinCodeData.filter((user) => {
        return (
          user.areaName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.cityName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.stateName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.pincode.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, areaPinCodeData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, areaPinCodeData: state.tmpAreaPinCodeData, loading: false})

      setTotal(state.tmpAreaPinCodeData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ----------------------pagination---------------------------------------------
  // const onShowSizeChange = (current: any, pageSize: any) => {
  //   setPostPerPage(pageSize)
  // }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IAreaPinCodeModel[] = state.areaPinCodeData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  const onPageChange = useCallback(
    (value: number) => {
      setState((prev) => ({...prev, loading: true})) // Set loading state
      setPage(value)
      getAreaPinCodeData(name, value, postPerPage)
    },
    [name, postPerPage]
  )

  const onShowSizeChange = useCallback(
    (current: number, size: number) => {
      setState((prev) => ({...prev, loading: true})) // Set loading state
      setPostPerPage(size)
      setPage(1) // Reset to first page when page size changes
      getAreaPinCodeData(name, 1, size)
    },
    [name]
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}

        <Header_Search_Add
          filter={(e) => filter(e)}
          searchText={name}
          title='Click to add a City'
          pathName={'/locations/areapincode/add'}
        />

        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-striped align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-primary'>
                <tr className='fw-bolder fs-5 text-white'>
                  <th className='min-w-140px'>Area Name</th>
                  <th className='min-w-140px'>City Name</th>
                  <th className='min-w-140px'>state Name</th>
                  <th className='min-w-140px'>Pin Code</th>
                  <th className='min-w-25px'>Active</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={5} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <AreaPinCodeCard
                        key={index}
                        data={data}
                        handleShowActive={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleShow_Active(e)
                        }
                        handleShow={handleShow}
                      />
                    )
                  })}
                {/* =================== Loading get Api Data ============== */}
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
              onChange={onPageChange}
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
        id={state.selAreaPindoceID}
        pageName={'Area pin Code'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteAreaPincode(state.selAreaPindoceID)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Area pin Code'}
        showActive={showActive}
        handleCloseActive={handleClose_Active}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default AreaPinCode
