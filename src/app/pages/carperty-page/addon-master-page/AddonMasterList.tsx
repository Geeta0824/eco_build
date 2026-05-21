import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'

import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  DeleteAddonItemApi,
  getAddonItemApi,
} from '../../../modules/carpetry-master-page/addon-master-page/AddonMasterCRUD'
import {IAddonMasterModel} from '../../../models/carpetry-page/IAddonMasterModel'
import {AddonMasterCard} from './AddonMasterCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'

type Props = {}

interface ICarpetArea {
  loading: boolean
  addonItemData: IAddonMasterModel[]
  tmpAddonItemData: IAddonMasterModel[]
  SearchText: string
  selAddonItemID: number
  imageShow: string
}

const AddonMasterList: React.FC<Props> = () => {
  const location = useLocation()
  // const [photoPath,setPhotoPath] = useState('')
  const [state, setState] = useState<ICarpetArea>({
    loading: false,
    addonItemData: [] as IAddonMasterModel[],
    tmpAddonItemData: [] as IAddonMasterModel[],
    SearchText: '',
    selAddonItemID: 0,
    imageShow: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getAllAddonItemData(mainSearch)
    }, 100)
  }, [])

  function getAllAddonItemData(mainSearch: string) {
    getAddonItemApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                // user.countryName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.addonItemName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.itemPrice.toString().includes(mainSearch.toLowerCase()) ||
                user.productCategoryName.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              addonItemData: results,
              tmpAddonItemData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              addonItemData: responseData,
              tmpAddonItemData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, addonItemData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, addonItemData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (addonItemID: number) => {
    setState({
      ...state,
      selAddonItemID: addonItemID,
      loading: false,
    })
    setShow(true)
  }

  function deleteCarpetAreaItem(addonItemID: number) {
    DeleteAddonItemApi(addonItemID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllAddonItemData(state.SearchText)
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

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpAddonItemData.filter((user) => {
        return (
          // user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.addonItemName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.itemPrice.toString().includes(keyword.toLowerCase()) ||
          user.productCategoryName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, addonItemData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, addonItemData: state.tmpAddonItemData})
      // If the text field is empty, show all users
      setTotal(state.tmpAddonItemData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ====================Images Flag============
  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg: string) => {
    setState({...state, imageShow: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowFlag(true)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.addonItemData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IAddonMasterModel[] = state.addonItemData.slice(
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
          pathName={'/carpetry/addon-master/add'}
          title='Click to add a Addon Master'
        />
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
            <form className='w-100 position-relative' autoComplete='off'>
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
            </form>
          </div>

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link to='/carpetry/addon-master/add' className='btn btn-sm btn-light-primary bg-white'>
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
                  <th className='min-w-500px'>Item Name</th>
                  <th className='min-w-300px'>Product Category Name</th>
                  <th className='min-w-150px'>Price</th>
                  <th className='min-w-150px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <AddonMasterCard
                        data={data}
                        handleShowFlag={() => handleShowFlag(data.filePath)}
                        handleShow={() => handleShow(data.addonItemID)}
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div
                      //         className='symbol symbol-45px me-5 cursor-pointer'
                      //         onClick={() => handleShowFlag(data.filePath)}
                      //       >
                      //         {data.filePath !== '' ? (
                      //           <img src={process.env.REACT_APP_API_URL + data.filePath} alt='' />
                      //         ) : (
                      //           <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='' />
                      //         )}
                      //       </div>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <span className='text-dark text-hover-primary fs-6'>
                      //           {data.addonItemName}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <span className='text-dark text-hover-primary fs-6'>
                      //           {data.productCategoryName}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <span className='text-dark text-hover-primary fs-6'>
                      //           {data.itemPrice}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/carpetry/addon-master/edit/${data.addonItemID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.addonItemID)}
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
        id={state.selAddonItemID}
        pageName={'Carpet Area'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteCarpetAreaItem(state.selAddonItemID)}
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
          <Modal.Title>Product Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5'>
            <img
              alt='image not found'
              className='img-fluid'
              src={
                state.imageShow == ''
                  ? toAbsoluteUrl('/media/img/NoProductImage.png')
                  : toAbsoluteUrl(`${state.imageShow}`)
              }
            />
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

export default AddonMasterList
