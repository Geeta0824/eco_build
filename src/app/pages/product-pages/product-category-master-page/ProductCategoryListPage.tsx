import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IProductCategoryModel} from '../../../models/product-page/IProductCategoryModel'
import {
  deleteProductCategory,
  getAllProductCategoryApi,
  isActiveProductCategory,
} from '../../../modules/product-master-page/product-category-master-page/ProductCategoryCRUD'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {Button, Modal} from 'react-bootstrap-v5'

type Props = {}

interface IProductCategory {
  loading: boolean
  productCategory: IProductCategoryModel[]
  tmpProductCategoryData: IProductCategoryModel[]
  imageShow: string
  SearchText: string
  mainSearch: string
  selProductCategoryID: number
  activeID: number
  activeType: any
}

const ProductCategoryListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IProductCategory>({
    loading: false,
    productCategory: [] as IProductCategoryModel[],
    tmpProductCategoryData: [] as IProductCategoryModel[],
    imageShow: '',
    SearchText: '',
    mainSearch: '',
    selProductCategoryID: 0,
    activeID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.search
      }
      getAllProductCategory(mainSearch)
    }, 100)
  }, [])

  function getAllProductCategory(mainSearch: string) {
    getAllProductCategoryApi()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return user.productCategoryName.toLowerCase().includes(mainSearch.toLowerCase())
            })

            setState({
              ...state,
              productCategory: results,
              tmpProductCategoryData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              productCategory: responseData,
              tmpProductCategoryData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, productCategory: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, productCategory: [], loading: false})
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
    isActiveProductCategory(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getAllProductCategory(state.mainSearch)
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
  const handleShow = (productCategoryID: number) => {
    setState({
      ...state,
      selProductCategoryID: productCategoryID,
      loading: false,
    })
    setShow(true)
  }

  function deleteProductCategoryItem(temproductCategoryID: number) {
    deleteProductCategory(temproductCategoryID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllProductCategory(state.mainSearch)
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

  // ====================Country Flag============
  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg: string) => {
    setState({...state, imageShow: process.env.REACT_APP_API_URL + selImg, loading: false})
    setShowFlag(true)
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpProductCategoryData.filter((user) => {
        return (
          // user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.productCategoryName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, productCategory: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, productCategory: state.tmpProductCategoryData})
      // If the text field is empty, show all users
      setTotal(state.tmpProductCategoryData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.productCategory.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProductCategoryModel[] = state.productCategory.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
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
              to={{pathname: '/p-product/product-category/add', state: {mainSearch: name}}}
              className='btn btn-sm btn-light-primary bg-white'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div>
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
                  <th className='min-w-150px'>Product Category Name</th>
                  <th className='min-w-25px'>isActive</th>
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
                      <tr key={index}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div
                              className='symbol symbol-45px me-5 cursor-pointer'
                              onClick={() => handleShowFlag(data.photoPath)}
                            >
                              <img src={process.env.REACT_APP_API_URL + data.photoPath} alt='' />
                            </div>
                            <div className='d-flex justify-content-start flex-column'>
                              <a href='#' className='text-dark text-hover-primary fs-6'>
                                {data.productCategoryName}
                              </a>
                            </div>
                          </div>
                        </td>
                        {/* <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.productCategoryName}
                              </span>
                            </div>
                          </div>
                        </td> */}
                        <td>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.productCategoryID}`}
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/p-product/product-category/edit/${data.productCategoryID}`,
                                state: {mainSearch: name},
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <div
                              onClick={() => handleShow(data.productCategoryID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='ssvg-icon-3 svg-icon-danger'
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
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
        id={state.selProductCategoryID}
        pageName={'Product Category'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteProductCategoryItem(state.selProductCategoryID)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Product Category'}
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

export default ProductCategoryListPage
