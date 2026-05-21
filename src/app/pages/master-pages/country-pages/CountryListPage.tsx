import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {ICountryModel} from '../../../models/master-page/ICountryModel'
import {
  deleteCountry,
  getAllCountry,
  isActiveCountry,
} from '../../../modules/master-page/country-master-page/NewCountryCRUD'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {CountryCard} from './CountryCard'

interface ICountry {
  loading: boolean
  countryData: ICountryModel[]
  tmpCountryData: ICountryModel[]
  imageShow: string
  SearchText: string
  selCountryId: number
  activeID: number
  activeType: any
  pathUrl: any
}

type Props = {}

const CountryListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<ICountry>({
    loading: false,
    countryData: [] as ICountryModel[],
    tmpCountryData: [] as ICountryModel[],
    imageShow: '',
    SearchText: '',
    selCountryId: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
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
      getCountryData(mainSearch)
    }, 100)
  }, [])

  // =====================IsActive==================

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

  function checkedFunction(temCountryID: number, temIsAct: boolean) {
    let value = {countryID: temCountryID,isActive:temIsAct}
    var objCountry = btoa(JSON.stringify(value))
    isActiveCountry(`${objCountry}`)
      .then((response) => {
        let decodeResp = JSON.parse(atob(response.data.encodedResponse)) 
        let resp = decodeResp
        console.log(resp)
        if (resp.isSuccess === true) {
          getCountryData(state.SearchText)
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

  // ==================== Get Country API Call===================

  function getCountryData(mainSearch: string) {
    getAllCountry()
      .then((response) => {
        // let responseData = response.data.responseObject
        let decodeResp = JSON.parse(atob(response.data.encodedResponse)) 
        let resp = decodeResp
        if (resp.isSuccess == true) {
          let responseData = resp.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user:any) => {
              return (
                user.countryName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.countryCode.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({...state, countryData: results, tmpCountryData: responseData, loading: false})
            setTotal(results.length)
            setPage(1)
          }else{
          setState({
            ...state,
            countryData: responseData,
            tmpCountryData: responseData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        }
        setName(mainSearch)
        } else {
          toast.error(`${resp.message}`)
          setState({...state, countryData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, countryData: [], loading: false})
      })
  }

  // ====================Delete Model Function============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)

  const handleShow = (countryID: number) => {
    setState({
      ...state,
      selCountryId: countryID,
      loading: false,
    })
    setShow(true)
  }

  const deleteCounteyItem = (cuntryId: number) => {
    let value = {countryID: cuntryId}
    var objCountry = btoa(JSON.stringify(value))
    deleteCountry(`${objCountry}`)
      .then((response) => {
        let decodeResp = JSON.parse(atob(response.data.encodedResponse)) 
        let resp = decodeResp
        if (resp.isSuccess === true) {
          toast.success('Deleted Successfully')
          getCountryData(state.SearchText)
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

  // ====================Country Flag============
  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg: string) => {
    setState({...state, imageShow: state.pathUrl + selImg, loading: false})
    setShowFlag(true)
  }

  // ============== Search Function =======================

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpCountryData.filter((user) => {
        return (
          user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.countryCode.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, countryData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, countryData: state.tmpCountryData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpCountryData.length)
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
  const currentPosts: ICountryModel[] = state.countryData.slice(indexOfFirstPage, indexOfLastPage)

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/country/add'}
          title='Click to add a Country'
        />
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}> */}
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
                // onChange={(e) => handleChange(e)}
                // value={state.SearchText}
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
              to='/master/country/add'
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
                  <th className='min-w-150px'>Country Name</th>
                  <th className='min-w-140px'>Country Code</th>
                  <th className='min-w-40px'>Active</th>
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
                      <CountryCard
                        data={data}
                        handleShowFlag={() => handleShowFlag(data.flagPath)}
                        handleShowActive={(e) => handleShowActive(e)}
                        handleShow={() => handleShow(data.countryID)}
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div
                      //         className='symbol symbol-45px me-5 cursor-pointer'
                      //         onClick={() => handleShowFlag(data.flagPath)}
                      //       >
                      //         <img src={state.pathUrl + data.flagPath} alt='' />
                      //       </div>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <a href='#' className='text-dark text-hover-primary fs-6'>
                      //           {data.countryName}
                      //         </a>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <a href='#' className='text-dark text-hover-primary d-block fs-6'>
                      //       {data.countryCode}
                      //     </a>
                      //   </td>
                      //   <td>
                      //     <div className='form-check form-switch'>
                      //       <input
                      //         id={`${data.countryID}`}
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
                      //         to={`/master/country/edit/${data.countryID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.countryID)}
                      //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/general/gen027.svg'
                      //           className='svg-icon-3 svg-icon-danger'
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
        id={state.selCountryId}
        pageName={'Country'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteCounteyItem(state.selCountryId)}
      />

      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Country'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />

      {/* =====================Image Model=================== */}
      <Modal
        size='lg'
        show={showFlag}
        onHide={handleCloseFlag}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Country Flag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5'>
            <img alt='Pic' className='img-fluid' src={toAbsoluteUrl(`${state.imageShow}`)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseFlag}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CountryListPage
