import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ICarpetAreaModel} from '../../../models/master-page/ICarpetAreaModel'
import {
  deleteCarpetArea,
  getAllCarpetArea,
} from '../../../modules/master-page/carpet-area-page/NewCarpetAreaCRUD'
import CarpetAreaCard from './CarpetAreaCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'

type Props = {}

interface ICarpetArea {
  loading: boolean
  carpetAreaData: ICarpetAreaModel[]
  tmpCarpetAreaData: ICarpetAreaModel[]
  SearchText: string
  selCarpetAreaID: number
  activeID: number
  activeType: any
}

const CarpetAreaListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<ICarpetArea>({
    loading: false,
    carpetAreaData: [] as ICarpetAreaModel[],
    tmpCarpetAreaData: [] as ICarpetAreaModel[],
    SearchText: '',
    selCarpetAreaID: 0,
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
      getAllCarpetAreaData(mainSearch)
    }, 100)
  }, [])

  function getAllCarpetAreaData(mainSearch: string) {
    getAllCarpetArea()
      .then((response) => {
        let decodeResp = JSON.parse(atob(response.data.encodedResponse)) 
        let resp = decodeResp
        // console.log(resp)
        if (resp.isSuccess == true) {
          let responseData = resp.responseObject
        // if (response.data.isSuccess == true) {
        //   const responseData = response.data.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                // user.countryName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.carpetArea.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              carpetAreaData: results,
              tmpCarpetAreaData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              carpetAreaData: responseData,
              tmpCarpetAreaData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${resp.message}`)
          setState({...state, carpetAreaData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, carpetAreaData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (carpetAreaID: number) => {
    setState({
      ...state,
      selCarpetAreaID: carpetAreaID,
      loading: false,
    })
    setShow(true)
  }

  function deleteCarpetAreaItem(temcarpetAreaID: number) {
    let value = {carpetAreaID: temcarpetAreaID}
    var objCarpetArea = btoa(JSON.stringify(value))
    deleteCarpetArea(`${objCarpetArea}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllCarpetAreaData(state.SearchText)
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

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpCarpetAreaData.filter((user) => {
        return (
          // user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.carpetArea.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, carpetAreaData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, carpetAreaData: state.tmpCarpetAreaData})
      // If the text field is empty, show all users
      setTotal(state.tmpCarpetAreaData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.carpetAreaData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICarpetAreaModel[] = state.carpetAreaData.slice(
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
          pathName={'/master/carpetArea/add'}
          title='Click to add CcarpetArea'
        />
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
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
            <Link to='/master/carpetArea/add' className='btn btn-sm btn-light-primary bg-white'>
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
                  <th className='min-w-150px'>Carpet Area</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <CarpetAreaCard
                        data={data}
                        handleShow={() => handleShow(data.carpetAreaID)}
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <span className='text-dark text-hover-primary fs-6'>
                      //           {data.carpetArea}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/master/carpetArea/edit/${data.carpetAreaID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.carpetAreaID)}
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
              // itemRender={itemRender}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selCarpetAreaID}
        pageName={'Carpet Area'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteCarpetAreaItem(state.selCarpetAreaID)}
      />
    </>
  )
}

export default CarpetAreaListPage
