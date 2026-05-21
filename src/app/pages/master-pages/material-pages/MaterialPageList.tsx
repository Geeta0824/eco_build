import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IMaterialModel} from '../../../models/master-page/IMaterialModel'
import {
  deleteMaterialInfoApi,
  getAllMaterialInfoApi,
} from '../../../modules/master-page/material-master-page/MaterialCRUD'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {MaterialCard} from './MaterialCard'

interface ICountry {
  loading: boolean
  materialInfoData: IMaterialModel[]
  tmpMaterialInfoData: IMaterialModel[]
  imageShow: string
  SearchText: string
  selMaterialInfoID: number
  // pathUrl: any
}

type Props = {}

const MaterialPageList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<ICountry>({
    loading: false,
    materialInfoData: [] as IMaterialModel[],
    tmpMaterialInfoData: [] as IMaterialModel[],
    imageShow: '',
    SearchText: '',
    selMaterialInfoID: 0,
    // pathUrl: process.env.REACT_APP_API_URL,
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
      getMaterialInfoData(mainSearch)
    }, 100)
  }, [])

  // ==================== Get Country API Call===================

  function getMaterialInfoData(mainSearch: string) {
    getAllMaterialInfoApi()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.projectType.toLowerCase().startsWith(mainSearch.toLowerCase()) ||
                user.specification.toLowerCase().startsWith(mainSearch.toLowerCase()) ||
                user.doneby.toLowerCase().startsWith(mainSearch.toLowerCase()) ||
                user.importantPoint.toLowerCase().startsWith(mainSearch.toLowerCase()) ||
                user.materialName.toLowerCase().startsWith(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              materialInfoData: results,
              tmpMaterialInfoData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              materialInfoData: responseData,
              tmpMaterialInfoData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, materialInfoData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, materialInfoData: [], loading: false})
      })
  }

  // ====================Delete Model Function============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)

  const handleShow = (materialInfoID: number) => {
    setState({
      ...state,
      selMaterialInfoID: materialInfoID,
      loading: false,
    })
    setShow(true)
  }

  const deleteMaterialInfoItem = (materialInfoID: number) => {
    deleteMaterialInfoApi(materialInfoID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getMaterialInfoData(state.SearchText)
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

  // ============== Search Function =======================

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpMaterialInfoData.filter((user) => {
        return (
          user.projectType.toLowerCase().includes(keyword.toLowerCase()) ||
          user.specification.toLowerCase().includes(keyword.toLowerCase()) ||
          user.doneby.toLowerCase().includes(keyword.toLowerCase()) ||
          user.importantPoint.toLowerCase().includes(keyword.toLowerCase()) ||
          user.materialName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, materialInfoData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, materialInfoData: state.tmpMaterialInfoData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpMaterialInfoData.length)
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
  const currentPosts: IMaterialModel[] = state.materialInfoData.slice(
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
          pathName={'/master/material/add'}
          title='Click to add a Material'
        />
        {/* <div className='card-header border-0 py-2 bg-dark'>
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
            <Link
              to='/master/material/add'
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
                  <th className='min-w-150px'>Material Name</th>
                  <th className='min-w-150px'>Project Type</th>
                  <th className='min-w-150px'>Specification</th>
                  <th className='min-w-150px'>Selection Done By</th>
                  <th className='min-w-150px'>Important Point</th>
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
                      <MaterialCard
                        data={data}
                        handleShow={() => handleShow(data.materialInfoID)}
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.materialName}</td>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.projectType}</td>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.specification}</td>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.doneby}</td>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.importantPoint}</td>
                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/master/material/edit/${data.materialInfoID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.materialInfoID)}
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
        id={state.selMaterialInfoID}
        pageName={'Material Info'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteMaterialInfoItem(state.selMaterialInfoID)}
      />
    </>
  )
}

export default MaterialPageList
