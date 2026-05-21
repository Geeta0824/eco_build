import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {IDepartmentModel} from '../../../models/master-page/IDepartmentModel'
import {IDesignationModel} from '../../../models/master-page/IDesignationModel'
import {getAllDepartmentData} from '../../../modules/master-page/department-master-page/NewDepartmentCRUD'
import {
  deleteDesignation,
  getAllDesignation,
  isActiveDesignation,
} from '../../../modules/master-page/designation-master-page/NewDesignationCRUD'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import DesignationCard from './DesignationCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
type Props = {}

interface IDesignation {
  loading: boolean
  designationData: IDesignationModel[]
  temDesignationData: IDesignationModel[]
  departmentData: IDepartmentModel[]
  SearchText: string
  selDesigId: number
  activeID: number
  activeType: any
}

const Designation: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    designationData: [] as IDesignationModel[],
    temDesignationData: [] as IDesignationModel[],
    departmentData: [] as IDepartmentModel[],
    SearchText: '',
    selDesigId: 0,
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
      getDesignationData(mainSearch)
    }, 100)
  }, [])

  function getDesignationData(mainSearch: string) {
    getAllDesignation()
      .then((response) => {
        // const responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse)) 
        let resp = decodeResp
        if (resp.isSuccess == true) {
          const responseData = resp.responseObject
          getDepartmentData(responseData, mainSearch)
        } else {
          toast.error(`${resp.message}`)
        }
      })
      .catch((error) => {
        setState({...state, designationData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function getDepartmentData(temdesiData: IDesignationModel[], mainSearch: string) {
    getAllDepartmentData()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse)) 
        let resp = decodeResp
        // console.log(resp)
        if (resp.isSuccess == true) {
          let responseData = resp.responseObject
          if (mainSearch !== '') {
            const results = temdesiData.filter((user) => {
              return (
                user.departmentName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.designationName.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              designationData: results,
              temDesignationData: temdesiData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              departmentData: responseData,
              designationData: temdesiData,
              temDesignationData: temdesiData,
              loading: false,
            })
            setTotal(temdesiData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${resp.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          departmentData: [],
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
    let value = {designationID: temEmpId,isActive:temIsAct}
    var objDesig = btoa(JSON.stringify(value))
    isActiveDesignation(`${objDesig}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          getDesignationData(state.SearchText)
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
  const handleShow = (designationID: number) => {
    setState({
      ...state,
      selDesigId: designationID,
      loading: false,
    })
    setShow(true)
  }

  function deleteDesigantion(designationId: number) {
    let value = {designationID: designationId}
    var objDesigna = btoa(JSON.stringify(value))
    deleteDesignation(`${objDesigna}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          toast.success('Deleted Successfully')
          getDesignationData(state.SearchText)
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

  // =================== Filter Function===========
  function getDesignationIdValue(event: any) {
    const desigValue = event.target.value
    filterDesignation(desigValue)
  }

  function filterDesignation(desigValue: number) {
    const temRows = []
    const Rows = state.temDesignationData
    for (let key in Rows) {
      if (Rows[key].departmentID == desigValue) {
        temRows.push(Rows[key])
      }
    }
    if (desigValue == -1) {
      setState({...state, designationData: state.temDesignationData})
      setTotal(state.temDesignationData.length)
      setPage(1)
    } else {
      setState({...state, designationData: temRows})
      setTotal(temRows.length)
      setPage(1)
    }
  }

  // ================= SerchText Function ===========
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temDesignationData.filter((user) => {
        return (
          user.departmentName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.designationName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, designationData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, designationData: state.temDesignationData})
      // If the text field is empty, show all users
      setTotal(state.temDesignationData.length)
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
  const currentPosts: IDesignationModel[] = state.designationData.slice(
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
          pathName={'/master/designation/add'}
          title='Click to add a Designation'
        />
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}> */}
        {/* <h3 className='card-title align-items-start flex-column'> */}
        {/* <span className='card-label fw-bolder fs-3 mb-1'>Designation</span>
          <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Cities</span> */}
        {/* </h3> */}

        {/* <div className='pt-4'>
            <select
              className='form-select form-select-white lineHeightByD'
              onChange={(e) => getDesignationIdValue(e)}
            >
              <option value={-1}>Select All Department</option>
              {state.departmentData.length > 0 &&
                state.departmentData.map((data, index) => {
                  return (
                    <option key={index} value={data.departmentID}>
                      {data.departmentName}
                    </option>
                  )
                })}
            </select>
          </div> */}

        {/* <div className='card-header border-0 pt-4' id='kt_chat_contacts_header'>
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
              to='/master/designation/add'
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
                  <th className='min-w-150px'>Designation Name</th>
                  {/* <th className='min-w-140px'>Department Name</th> */}
                  <th className='min-w-25px'>Active</th>
                  <th className='min-w-100px text-end'>Edit</th>
                  {/* <th className='min-w-100px text-end'>Edit | Delete</th> */}
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts
                    // .filter(
                    //   (Sdata) =>
                    //     Sdata.designationName
                    //       .toLowerCase()
                    //       .includes(state.SearchText.toLowerCase()) ||
                    //     Sdata.departmentName.toLowerCase().includes(state.SearchText.toLowerCase())
                    // )
                    .map((data, index) => {
                      return (
                        <DesignationCard
                          data={data}
                          handleShowActive={(e) => handleShowActive(e)}
                          handleShow={() => handleShow(data.designationID)}
                          name={name}
                        />
                        // <tr key={index}>
                        //   <td>
                        //     <div className='d-flex align-items-center'>
                        //       <div className='d-flex justify-content-start flex-column'>
                        //         <a href='#' className='text-dark text-hover-primary fs-6'>
                        //           {data.designationName}
                        //         </a>
                        //       </div>
                        //     </div>
                        //   </td>
                        //   {/* <td>
                        //     <a href='#' className='text-dark text-hover-primary d-block fs-6'>
                        //       {data.departmentName}
                        //     </a>
                        //   </td> */}
                        //   <td>
                        //     <div className='form-check form-switch'>
                        //       <input
                        //         id={`${data.designationID}`}
                        //         className='form-check-input'
                        //         type='checkbox'
                        //         checked={data.isActive}
                        //         onChange={(e) => handleShowActive(e)}
                        //       />
                        //     </div>
                        //   </td>
                        //   <td>
                        //     <div className='d-flex justify-content-end flex-shrink-0'>
                        //       <Link
                        //         to={`/master/designation/edit/${data.designationID}`}
                        //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                        //       >
                        //         <KTSVG
                        //           path='/media/icons/duotune/art/art005.svg'
                        //           className='svg-icon-3 svg-icon-primary'
                        //         />
                        //       </Link>
                        //       <div
                        //         onClick={() => handleShow(data.designationID)}
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
        pageName={'Designation'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDesigantion(state.selDesigId)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Designation'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default Designation
