import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {IDepartmentModel} from '../../../models/master-page/IDepartmentModel'
import {
  deleteDeparment,
  getAllDepartmentData,
  isActiveDepartment,
} from '../../../modules/master-page/department-master-page/NewDepartmentCRUD'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {DepartmentCard} from './DepartmentCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'

type Props = {}

interface IDepartment {
  loading: boolean
  departmentData: IDepartmentModel[]
  tmpDepartmentData: IDepartmentModel[]
  searchText: string
  selDeparId: number
  activeID: number
  activeType: any
}

const Department: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IDepartment>({
    loading: false,
    departmentData: [] as IDepartmentModel[],
    tmpDepartmentData: [] as IDepartmentModel[],
    searchText: '',
    selDeparId: 0,
    activeID: 0,
    activeType: false,
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
      getDepartmentData(mainSearch)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  function getDepartmentData(mainSearch: string) {
    getAllDepartmentData()
      .then((response) => {
        // let responseData = response.data
        let decodeResp = JSON.parse(atob(response.data.encodedResponse)) 
        let resp = decodeResp
        console.log(resp)
        if (resp.isSuccess == true) {
          if (mainSearch !== '') {
            const results = resp.responseObject.filter((user:any) => {
              return (
                user.departmentCode.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.departmentName.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              departmentData: results,
              tmpDepartmentData: resp.responseObject,
              loading: false,
              searchText: mainSearch,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              departmentData: resp.responseObject,
              tmpDepartmentData: resp.responseObject,
              loading: false,
            })
            setTotal(resp.responseObject.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${resp.massege}`)
          setState({...state, departmentData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, departmentData: [], loading: false})
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
    let value = {departmentID: temEmpId,isActive:temIsAct}
    var objDepartment = btoa(JSON.stringify(value))
    isActiveDepartment(`${objDepartment}`)
      .then((response) => {
        let decodeResp = JSON.parse(atob(response.data.encodedResponse)) 
        let resp = decodeResp
        if (resp.isSuccess == true) {
          getDepartmentData(state.searchText)
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
  const handleShow = (departmentID: number) => {
    setState({
      ...state,
      selDeparId: departmentID,
      loading: false,
    })
    setShow(true)
  }

  // ========================Delete Department=====================
  function deleteDeparmentItem(deparmentId: number) {
    let value = {departmentID: deparmentId}
    var objDepartment = btoa(JSON.stringify(value))
    deleteDeparment(`${objDepartment}`)
      .then((response) => {
        let decodeResp = JSON.parse(atob(response.data.encodedResponse)) 
        let resp = decodeResp
        if (resp.isSuccess == true) {
          toast.success('Deleted Successfully')
          getDepartmentData(state.searchText)
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

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpDepartmentData.filter((user) => {
        return (
          user.departmentCode.toLowerCase().includes(keyword.toLowerCase()) ||
          user.departmentName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, departmentData: results, searchText: keyword})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, departmentData: state.tmpDepartmentData, searchText: keyword})
      // If the text field is empty, show all users
      setTotal(state.tmpDepartmentData.length)
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
  const currentPosts: IDepartmentModel[] = state.departmentData.slice(
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
          pathName={'/master/department/add'}
          title='Click to add a Department'
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
              to='/master/department/add'
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
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Department Name</th>
                  <th className='min-w-140px'>Department Code</th>
                  <th className='min-w-25px'>isActive</th>
                  <th className='min-w-100px text-end'>Edit</th>
                  {/* <th className='min-w-100px text-end'>Edit | Delete</th> */}
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts
                    // .filter(
                    //   (Sdata) =>
                    //     Sdata.departmentName
                    //       .toLowerCase()
                    //       .includes(state.searchText.toLowerCase()) ||
                    //     Sdata.departmentCode.toLowerCase().includes(state.searchText.toLowerCase())
                    // )
                    .map((data, index) => {
                      return (
                        <DepartmentCard
                          data={data}
                          handleShowActive={(e) => handleShowActive(e)}
                          handleShow={() => handleShow(data.departmentID)}
                          name={name}
                        />
                        // <tr key={index}>
                        //   <td>
                        //     <div className='d-flex align-items-center'>
                        //       <div className='d-flex justify-content-start flex-column'>
                        //         <a href='#' className='text-dark text-hover-primary fs-6'>
                        //           {data.departmentName}
                        //         </a>
                        //       </div>
                        //     </div>
                        //   </td>

                        //   <td>
                        //     <a href='#' className='text-dark text-hover-primary d-block fs-6'>
                        //       {data.departmentCode}
                        //     </a>
                        //   </td>

                        //   <td>
                        //     <div className='form-check form-switch'>
                        //       <input
                        //         className='form-check-input'
                        //         type='checkbox'
                        //         id={`${data.departmentID}`}
                        //         checked={data.isActive}
                        //         onChange={(e) => handleShowActive(e)}
                        //       />
                        //     </div>
                        //   </td>

                        //   <td>
                        //     <div className='d-flex justify-content-end flex-shrink-0'>
                        //       <Link
                        //         to={`/master/department/edit/${data.departmentID}`}
                        //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                        //       >
                        //         <KTSVG
                        //           path='/media/icons/duotune/art/art005.svg'
                        //           className='svg-icon-3 svg-icon-primary'
                        //         />
                        //       </Link>
                        //       <div
                        //         onClick={() => handleShow(data.departmentID)}
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
        id={state.selDeparId}
        pageName={'Department'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDeparmentItem(state.selDeparId)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Department'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default Department
