/* eslint-disable jsx-a11y/anchor-is-valid */
import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {IEduDepartmentModel} from '../../../models/master-page/IEducationDepartmentModel'
import {
  deleteEduDepartment,
  getAllEduDepartment,
  isActiveEduDepartment,
} from '../../../modules/master-page/education-department-master-page/EducationDepartmentCRUD'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {EducationDepartmentCard} from './EducationDepartmentCard'

interface IEduDepartment {
  loading: boolean
  eduDepartment: IEduDepartmentModel[]
  tmpEduDepartment: IEduDepartmentModel[]
  SearchText: string
  selEduDepId: number
  activeID: number
  activeType: any
}

type Props = {}

const EducationDepartment: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IEduDepartment>({
    loading: false,
    eduDepartment: [] as IEduDepartmentModel[],
    tmpEduDepartment: [] as IEduDepartmentModel[],
    SearchText: '',
    selEduDepId: 0,
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
      getEduDepartment(mainSearch)
    }, 100)
  }, [])

  function getEduDepartment(mainSearch: string) {
    getAllEduDepartment()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return user.eduDepartmentName.toLowerCase().includes(mainSearch.toLowerCase())
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              eduDepartment: results,
              tmpEduDepartment: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              eduDepartment: responseData,
              tmpEduDepartment: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, eduDepartment: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, eduDepartment: [], loading: false})
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
    isActiveEduDepartment(temEmpId, temIsAct)
      .then((response) => {
        if ((response.data.isSuccess = true)) {
          getEduDepartment(state.SearchText)
          setShowActive(false)
        } else {
          toast.error(`${response.data.message}`)
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
  const handleShow = (eduDepartmentID: number) => {
    setState({
      ...state,
      selEduDepId: eduDepartmentID,
      loading: false,
    })
    setShow(true)
  }

  const deleteEduDepartmentItem = (eduDepartmentID: number) => {
    deleteEduDepartment(eduDepartmentID)
      .then((res) => {
        if (res.data.isSuccess == true) {
          toast.success('Deleted Successfull')
          getEduDepartment(state.SearchText)
          setShow(false)
        } else {
          toast.error(`${res.data.message}`)
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
      const results = state.tmpEduDepartment.filter((user) => {
        return user.eduDepartmentName.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, eduDepartment: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, eduDepartment: state.tmpEduDepartment})
      // If the text field is empty, show all users
      setTotal(state.tmpEduDepartment.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.eduDepartment.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IEduDepartmentModel[] = state.eduDepartment.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}> */}
        {/* <h3 className='card-title align-items-start flex-column'> */}
        {/* <span className='card-label fw-bolder fs-3 mb-1'>Education Department Name</span>
          <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Cities</span> */}
        {/* </h3> */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/eduDepartment/add'}
          title='Click to add a Education Department'
        />
        {/* <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
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
              to='/master/eduDepartment/add'
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
                  <th className='min-w-150px'>Education Department Name</th>
                  <th className='min-w-25px'>isActive</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts
                    // .filter((Sdata) =>
                    //   Sdata.eduDepartmentName.toLowerCase().includes(state.SearchText.toLowerCase())
                    // )
                    .map((data, index) => {
                      return (
                        <EducationDepartmentCard
                          data={data}
                          handleShowActive={(e) => handleShowActive(e)}
                          handleShow={() => handleShow(data.eduDepartmentID)}
                          name={name}
                        />
                        // <tr key={index}>
                        //   <td>
                        //     <div className='d-flex align-items-center'>
                        //       <div className='d-flex justify-content-start flex-column'>
                        //         <a href='#' className='text-dark text-hover-primary fs-6'>
                        //           {data.eduDepartmentName}
                        //         </a>
                        //       </div>
                        //     </div>
                        //   </td>
                        //   <td>
                        //     <div className='form-check form-switch'>
                        //       <input
                        //         id={`${data.eduDepartmentID}`}
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
                        //         to={`/master/eduDepartment/edit/${data.eduDepartmentID}`}
                        //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                        //       >
                        //         <KTSVG
                        //           path='/media/icons/duotune/art/art005.svg'
                        //           className='svg-icon-3 svg-icon-primary'
                        //         />
                        //       </Link>
                        //       <div
                        //         onClick={() => handleShow(data.eduDepartmentID)}
                        //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
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
            ></Pagination>
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selEduDepId}
        pageName={'Education Department'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteEduDepartmentItem(state.selEduDepId)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Education Department'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default EducationDepartment
