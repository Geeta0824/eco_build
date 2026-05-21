import React, {useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {IDIYProductListModel} from '../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import {toast} from 'react-toastify'
import Loader from '../../common-pages/Loader'
import {
  ChangeProductFromCustomCartApi,
  GetProductListForChangeProductApi,
} from '../../../modules/customization-quotation-master-page/CustomizationQuotationsCRUD'
import {ModelPopUpChangeConfirm} from './ModelPopUpChangeConfirm'

type Props = {
  quotationDetailID: number
  onClose: () => void
}
interface IAddCart {
  productList: IDIYProductListModel[]
  tmpProductList: IDIYProductListModel[]
  selProductList: IDIYProductListModel
  selPackageID: number
  selProductID: number
  selQuotationDetailID: number
}
const DrawerChangeProduct: React.FC<Props> = ({quotationDetailID, onClose}) => {
  const [state, setState] = useState<IAddCart>({
    productList: [] as IDIYProductListModel[],
    tmpProductList: [] as IDIYProductListModel[],
    selProductList: {} as IDIYProductListModel,
    selPackageID: 0,
    selProductID: 0,
    selQuotationDetailID: 0,
  })
  const [mainLoading, setMainLoading] = useState<boolean>(false)

  useEffect(() => {
    setMainLoading(true)
    setTimeout(() => {
      getProductListData(quotationDetailID)
    }, 100)
  }, [])

  function getProductListData(quotationDetailID: number) {
    GetProductListForChangeProductApi(quotationDetailID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          const selResponseData = response.data.selectedProduct
          setState({
            ...state,
            selProductList: selResponseData,
            productList: responseData,
            tmpProductList: responseData,
            selQuotationDetailID: quotationDetailID,
          })
          setMainLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, productList: [], tmpProductList: []})
          setMainLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, productList: [], tmpProductList: []})
        setMainLoading(false)
      })
  }

  //------------------- the value of the search field----------------
  const [name2, setName2] = useState<string>('')
  //------------------- the search result-----------------
  const filter2 = (e: any) => {
    const results = state.tmpProductList.filter((post) => {
      if (e.target.value === '') return state.tmpProductList
      return post.productName.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setState({
      ...state,
      productList: results,
    })
    // const keyword = e.target.value
    // console.log(keyword)
    // if (keyword !== '') {
    //   const results = state.tmpProductList.filter((user) => {
    //     return (
    //       // user.productName.toLowerCase().includes(keyword.toLowerCase()) ||
    //       // user.unitName.toLowerCase().includes(keyword.toLowerCase()) ||
    //       // user.areaName.toLowerCase().includes(keyword.toLowerCase()) ||
    //       user.description.toLowerCase().includes(keyword.toLowerCase()) ||
    //       user.areaName.toLowerCase().includes(keyword.toLowerCase())
    //     )
    //   })
    //   setState({...state, productList: results})
    // } else {
    //   setState({...state, productList: state.tmpProductList})
    // }
    setName2(e.target.value)
  }

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (productID: number) => {
    setState({
      ...state,
      selProductID: productID,
    })
    setShow(true)
  }

  function changeProductItem(temproductID: number) {
    ChangeProductFromCustomCartApi(state.selQuotationDetailID, temproductID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Changed Successfully')
          onClose()
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

  return (
    <>
      {mainLoading ? (
        <Loader loading={mainLoading} />
      ) : (
        <>
          <div className='d-flex align-items-sm-center p-5 mb-4 shadow-sm border border-success'>
            {/* begin::Symbol */}
            <div className='d-block align-items-center'>
              {/* begin::Symbol */}
              <div className='symbol symbol-75px symbol-2by3 text-center'>
                {state.selProductList.photoPath !== '' ? (
                  <img src={process.env.REACT_APP_API_URL + state.selProductList.photoPath} alt='' />
                  // <div
                  //   className='symbol-label'
                  //   style={{
                  //     backgroundImage: `url(${toAbsoluteUrl(
                  //       `${process.env.REACT_APP_API_URL + state.selProductList.photoPath}`
                  //     )})`,
                  //   }}
                  // ></div>
                ) : (
                  <div
                    className='symbol-label'
                    style={{
                      backgroundImage: `url(${toAbsoluteUrl('/media/img/NoProductImage.png')})`,
                    }}
                  ></div>
                )}
              </div>
              <div className='card-toolbar rounded text-center text-success mt-2'>
                Selected Item
              </div>
            </div>
            {/* end::Symbol */}
            {/* begin::Content */}
            <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'>
              {/* begin::Title */}
              <div className='flex-grow-1 my-lg-0 my-2 m-2'>
                <span className='d-block'>
                  <label className='text-muted fw-bold pt-1'>Area Name : &nbsp;</label>
                  <span className='text-gray-800 fw-bolder  fs-5'>test</span>
                </span>
                <span className='d-block'>
                  <label className='text-muted fw-bold pt-1'>Product Name : &nbsp;</label>
                  <span className='text-gray-800 fw-bolder  fs-5'>
                    {state.selProductList.productName}
                  </span>
                </span>
                <span className='text-muted fw-bold d-block pt-2'>
                  <span className='text-muted fw-bold'>
                    L :{' '}
                    <span className='text-primary fw-bold ps-2'>{state.selProductList.length}</span>
                  </span>
                  <span className='text-muted fw-bold ps-4'>
                    H :
                    <span className='text-primary fw-bold ps-2'>{state.selProductList.height}</span>
                  </span>
                  <span className='text-muted fw-bold ps-4'>
                    D :
                    <span className='text-primary fw-bold ps-2'>{state.selProductList.depth}</span>
                  </span>
                  <span className='text-muted fw-bold ps-4'>
                    No Of Unit :
                    <span className='text-primary fw-bold ps-2'>
                      {state.selProductList.noOfUnit}
                    </span>
                  </span>
                  <span className='text-muted fw-bold ps-4'>
                    Unit :
                    <span className='text-primary fw-bold ps-2'>
                      {state.selProductList.unitName}
                    </span>
                  </span>
                </span>
                <span className='d-block pt-2'>
                  <label className='text-muted fw-bold ps-2'>Description : &nbsp;</label>
                  <span className=' fs-6'>{state.selProductList.description}</span>
                </span>
              </div>
              {/* end::Title */}
            </div>
            {/* end::Content */}
          </div>
          <div className='card-header border-0 d-flex' style={{backgroundColor: '#000000'}}>
            <h6 className='col-6'></h6>
            <div className='col-6 border-0 p-2' id=''>
              <form className='w-100 position-relative' autoComplete='off'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='search'
                  className='form-control form-control-solid px-15 bg-white'
                  // name='search'
                  placeholder='Search'
                  id='filter2'
                  onChange={filter2}
                  value={name2}
                />
              </form>
            </div>
          </div>
          {state.productList.length > 0 &&
            state.productList.map((data, index) => {
              return (
                <div
                  key={data.productID}
                  className='d-flex align-items-sm-center p-5 mb-4 shadow-sm border border-hover-primary'
                >
                  {/* begin::Symbol */}
                  <div className='d-block align-items-center'>
                    {/* begin::Symbol */}
                    <div className='symbol symbol-75px symbol-2by3 text-center'>
                      {data.photoPath !== '' ? (
                        <img src={process.env.REACT_APP_API_URL + data.photoPath} alt='' />
                      ) : (
                        <div
                          className='symbol-label'
                          style={{
                            backgroundImage: `url(${toAbsoluteUrl(
                              '/media/img/NoProductImage.png'
                            )})`,
                          }}
                        ></div>
                      )}
                    </div>
                    <div className='card-toolbar rounded text-center mt-2'>
                      {mainLoading ? (
                        <span className='btn btn-sm btn-light-primary bg-white px-10 text-center'>
                          <span
                            className='spinner-border'
                            style={{width: '1rem', height: '1rem'}}
                            role='status'
                          >
                            <span className='visually-hidden'>Loading...</span>
                          </span>
                        </span>
                      ) : (
                        <span
                          className='btn btn-sm btn-light-primary bg-white fs-5 border border-primary text-center py-2 px-5'
                          onClick={() => handleShow(data.productID)}
                        >
                          <KTSVG
                            path='/media/icons/duotune/arrows/arr075.svg'
                            className='svg-icon-3'
                          />
                          Change
                        </span>
                      )}
                    </div>
                  </div>
                  {/* end::Symbol */}
                  {/* begin::Content */}
                  <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'>
                    {/* begin::Title */}
                    <div className='flex-grow-1 my-lg-0 my-2 m-2'>
                      <span className='d-block'>
                        <label className='text-muted fw-bold pt-1'>Area Name : &nbsp;</label>
                        <span className='text-gray-800 fw-bolder  fs-5'>test</span>
                      </span>
                      <span className='d-block'>
                        <label className='text-muted fw-bold pt-1'>Product Name : &nbsp;</label>
                        <span className='text-gray-800 fw-bolder  fs-5'>{data.productName}</span>
                      </span>
                      <span className='text-muted fw-bold d-block pt-2'>
                        <span className='text-muted fw-bold'>
                          L : <span className='text-primary fw-bold ps-2'>{data.length}</span>
                        </span>
                        <span className='text-muted fw-bold ps-4'>
                          H :<span className='text-primary fw-bold ps-2'>{data.height}</span>
                        </span>
                        <span className='text-muted fw-bold ps-4'>
                          D :<span className='text-primary fw-bold ps-2'>{data.depth}</span>
                        </span>
                        <span className='text-muted fw-bold ps-4'>
                          No Of Unit :
                          <span className='text-primary fw-bold ps-2'>{data.noOfUnit}</span>
                        </span>
                        <span className='text-muted fw-bold ps-4'>
                          Unit :<span className='text-primary fw-bold ps-2'>{data.unitName}</span>
                        </span>
                      </span>
                      <span className='d-block pt-2'>
                        <label className='text-muted fw-bold ps-2'>Description : &nbsp;</label>
                        <span className=' fs-6'>{data.description}</span>
                      </span>
                    </div>
                    {/* end::Title */}
                  </div>
                  {/* end::Content */}
                </div>
              )
            })}
        </>
      )}
      {/* =====================Change Model PopUp=============== */}
      <ModelPopUpChangeConfirm
        id={state.selProductID}
        pageName={'Change Product'}
        show={show}
        handleClose={handleClose}
        deleteData={() => changeProductItem(state.selProductID)}
      />
    </>
  )
}

export {DrawerChangeProduct}
