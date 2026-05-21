import React, {useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../../_Ecd/helpers'
import {IPlanAreaModel} from '../../../../models/product-page/IPlanAreaModel'
import {toast} from 'react-toastify'
import Loader from '../../../common-pages/Loader'
import {
  UpdateTurnkeyQuotationDetailinCartApi,
  savePackageDetailinCartApi,
} from '../../../../modules/carpetry-master-page/carpetry-package-master-page/TurnkeyPackageCRUD'
import {IDIYProductListModel} from '../../../../models/carpetry-page/ICarpetryPackageModel'

type Props = {
  productList: IDIYProductListModel[]
  planAreaList: IPlanAreaModel[]
  selPackageId: number
  tmpPlanAreaID?: number
  tmpPackageDetailsID?: number
  loading: boolean
  pageName: string
}
interface IAddCart {
  tmpProductList: IDIYProductListModel[]
}
const EditCartCarpetryPackageList: React.FC<Props> = ({
  productList,
  planAreaList,
  selPackageId,
  tmpPlanAreaID,
  tmpPackageDetailsID,
  loading,
  pageName,
}) => {
  const [state, setState] = useState<IAddCart>({
    tmpProductList: [] as IDIYProductListModel[],
  })
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [cartLength, setCartLength] = useState<number>(0)

  const [valueLen, setValueLen] = useState<number>()
  const [selProductIDLen, setSelProductIDLen] = useState<string>()

  useEffect(() => {
    setSelAreaValue(tmpPlanAreaID)
    setTimeout(() => {
      setState({...state, tmpProductList: productList})
    }, 100)
  }, [])

  function handleLengthChange(event: any) {
    if (!isNaN(event.target.value)) {
      setMainLoading(true)
      const value = event.target.value
      const elementId = event.target.id
      const textBox = 'txtLen'
      setSelProductIDLen(textBox + elementId)
      setValueLen(value)
      const Rows: IDIYProductListModel[] = productList
      for (let key in Rows) {
        if (Rows[key].productID == elementId) {
          let tmpNoOfUnit = (value * Rows[key].height * Rows[key].depth).toFixed(2)
          Rows[key].length = value
          Rows[key].noOfUnit = parseFloat(tmpNoOfUnit)
          setMainLoading(false)
          break
        }
      }
    }
  }

  const [valueHei, setValueHei] = useState<number>()
  const [selProductIDHei, setSelProductIDHei] = useState<string>()
  function handleHeightChange(event: any) {
    if (!isNaN(event.target.value)) {
      setMainLoading(true)
      const value = event.target.value
      const elementId = event.target.id
      const textBox = 'txtHei'
      setSelProductIDHei(textBox + elementId)
      setValueHei(value)
      const Rows: IDIYProductListModel[] = productList
      for (let key in Rows) {
        if (Rows[key].productID == elementId) {
          let tmpNoOfUnit = (value * Rows[key].length * Rows[key].depth).toFixed(2)
          Rows[key].height = value
          Rows[key].noOfUnit = parseFloat(tmpNoOfUnit)
          setMainLoading(false)
          break
        }
      }
    }
  }

  const [valueUnit, setValueUnit] = useState<number>()
  const [selProductIDUnit, setSelProductIDUnit] = useState<string>()
  function handleUnitChange(event: any) {
    if (!isNaN(event.target.value)) {
      setMainLoading(true)
      const value = event.target.value
      const elementId = event.target.id
      const textBox = 'txtUnit'
      setSelProductIDUnit(textBox + elementId)
      // setValueUnit(value)
      const Rows: IDIYProductListModel[] = productList
      for (let key in Rows) {
        if (Rows[key].productID == elementId) {
          Rows[key].noOfUnit = value
          setMainLoading(false)
          break
        }
      }
    }
  }

  const [selAreaValue, setSelAreaValue] = useState<number>()
  const [selAreaId, setSelAreaId] = useState<string>()
  function handleOnChange(event: any) {
    if (!isNaN(event.target.value)) {
      setMainLoading(true)
      const value = event.target.value
      const elementId = parseInt(event.target.id)
      const textBox = 'txtUnit'
      setSelAreaId(textBox + elementId)
      setSelAreaValue(elementId)
      const Rows: IDIYProductListModel[] = productList
      for (let key in Rows) {
        if (Rows[key].productID == elementId) {
          Rows[key].planAreaID = value
          setMainLoading(false)
          break
        }
      }
    }
  }

  function onAddToCart(objProductList: IDIYProductListModel, tmpPlanAreaID: number) {
    if (objProductList.planAreaID == 0 || tmpPlanAreaID == undefined || tmpPlanAreaID == 0) {
      return toast.error(`Please Select Area.`, {autoClose: 1000})
    }
    setMainLoading(true)
    savePackageDetailinCartApi(
      selPackageId,
      objProductList.productCategoryID,
      objProductList.productID,
      objProductList.planAreaID,
      objProductList.defaultUnitID,
      objProductList.length,
      objProductList.depth,
      objProductList.height,
      objProductList.noOfUnit,
      objProductList.turnkeyQty
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data
          toast.success(`Product Added in Cart`, {autoClose: 1000})
          // setCartLength(cartLength + 1)
          // dispatch(increment(1,selPackageId))
          setMainLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setMainLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setMainLoading(false)
      })
  }

  function onEditToCart(objProductList: IDIYProductListModel, tmpPlanAreaID: number) {
    if (objProductList.planAreaID == 0 || tmpPlanAreaID == undefined || tmpPlanAreaID == 0) {
      return toast.error(`Please Select Area.`, {autoClose: 1000})
    }
    setMainLoading(true)
    UpdateTurnkeyQuotationDetailinCartApi(
      tmpPackageDetailsID,
      selPackageId,
      objProductList.productCategoryID,
      objProductList.productID,
      objProductList.planAreaID,
      objProductList.defaultUnitID,
      objProductList.length,
      objProductList.depth,
      objProductList.height,
      objProductList.noOfUnit,
      objProductList.turnkeyQty
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data
          toast.success(`Product Updated in Cart`, {autoClose: 1000})
          // setCartLength(cartLength + 1)
          setMainLoading(false)
        } else {
          toast.error(`${response.data.message}`)
          setMainLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setMainLoading(false)
      })
  }

  return (
    <>
      <Loader loading={loading} />
      {productList.length > 0 &&
        productList.map((data, index) => {
          return (
            <div key={data.productID} className='d-flex align-items-sm-center p-5 mb-4 shadow-sm'>
              {/* begin::Symbol */}
              <div className='symbol symbol-125px symbol-2by3 me-4'>
              {data.photoPath !== '' ? (
                      <img src={process.env.REACT_APP_API_URL + data.photoPath} alt='' />
                    ) : (
                      <div
                        className='symbol-label'
                        style={{
                          backgroundImage: `url(${toAbsoluteUrl('/media/img/NoProductImage.png')})`,
                        }}
                      ></div>
                    )}
              </div>
              {/* end::Symbol */}
              {/* begin::Content */}
              <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'>
                {/* begin::Title */}
                <div className='flex-grow-1 my-lg-0 my-2 m-2'>
                  <span className='d-block'>
                    <label className='text-muted fw-bold pt-1'>Area Name : &nbsp;</label>
                    <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                      <select
                        className='lineHeightByD bg-white'
                        id={`${data.productID}`}
                        onChange={(e) => handleOnChange(e)}
                        disabled
                      >
                        <option selected={selAreaValue === 0 ? true : false} value={0}>
                          Select Area
                        </option>
                        {planAreaList.length > 0 &&
                          planAreaList.map((areaData, index) => {
                            return (
                              <option
                                key={index}
                                value={areaData.planAreaID}
                                selected={selAreaValue === areaData.planAreaID ? true : false}
                              >
                                {areaData.areaName}
                              </option>
                            )
                          })}
                      </select>
                    </span>
                  </span>
                  <span className='d-block'>
                    <label className='text-muted fw-bold pt-1'>Product Name : &nbsp;</label>
                    <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                      {data.productName}
                    </span>
                  </span>
                  <span className='d-block'>
                    <label className='text-muted fw-bold pt-1'>Unit Name : &nbsp;</label>
                    <span className='text-gray-800 fw-bolder text-hover-primary fs-5'>
                      {data.unitName}
                    </span>
                  </span>
                  <span className='text-muted fw-bold d-block pt-1'>
                    <span className='text-muted fw-bold pt-1 ps-4'>
                      L : &nbsp;
                      <input
                        // type='number'
                        type='text'
                        id={`${data.productID}`}
                        value={
                          selProductIDLen == `txtLen${data.productID}` ? valueLen : data.length
                        }
                        onChange={(e) => handleLengthChange(e)}
                        className='text-center w-50px h-30px bg-light-primary border-0 rounded'
                      />
                    </span>
                    <span className='text-muted fw-bold pt-1 ps-4'>
                      H : &nbsp;
                      <input
                        // type='number'
                        type='text'
                        id={`${data.productID}`}
                        disabled={!data.isHeightChange}
                        value={
                          selProductIDHei == `txthei${data.productID}` ? valueHei : data.height
                        }
                        onChange={(e) => handleHeightChange(e)}
                        className='text-center w-50px h-30px bg-light-primary border-0 rounded'
                      />
                    </span>
                    <span className='text-muted fw-bold pt-1 ps-4'>
                      D : &nbsp;
                      <input
                        // type='number'
                        type='text'
                        disabled
                        value={data.depth}
                        className='text-center w-50px h-30px bg-light-primary border-0 rounded'
                      />
                    </span>
                  </span>
                  <span className='text-muted fw-bold d-block pt-2'>
                    No Of Unit : &nbsp;
                    <input
                      // type='number'
                      type='text'
                      id={`${data.productID}`}
                      value={
                        selProductIDUnit == `txtUnit${data.productID}` ? valueUnit : data.noOfUnit
                      }
                      onChange={(e) => handleUnitChange(e)}
                      className='text-center w-50px h-30px bg-light-primary border-0 rounded'
                    />
                  </span>
                </div>
                {/* end::Title */}
                {/* begin::Section */}
                <div className='d-flex align-items-center'>
                  <div
                    className='card-toolbar border border-primary rounded'
                    data-bs-toggle='tooltip'
                    data-bs-placement='top'
                  >
                    {mainLoading === true ? (
                      <span className='btn btn-sm btn-light-primary bg-white fs-5 px-10 text-center'>
                        <span
                          className='spinner-border'
                          style={{width: '1rem', height: '1rem'}}
                          role='status'
                        >
                          <span className='visually-hidden'>Loading...</span>
                        </span>
                      </span>
                    ) : pageName === 'Add' ? (
                      <span
                        className='btn btn-sm btn-light-primary bg-white fs-5'
                        onClick={() => onAddToCart(data, data.planAreaID)}
                      >
                        <KTSVG
                          path='/media/icons/duotune/arrows/arr075.svg'
                          className='svg-icon-3'
                        />
                        Add to cart
                      </span>
                    ) : (
                      <span
                        className='btn btn-sm btn-light-primary bg-white fs-5'
                        onClick={() => onEditToCart(data, data.planAreaID)}
                      >
                        <KTSVG
                          path='/media/icons/duotune/arrows/arr075.svg'
                          className='svg-icon-3'
                        />
                        Update Cart Item
                      </span>
                    )}
                  </div>
                </div>
                {/* end::Section */}
              </div>
              {/* end::Content */}
            </div>
          )
        })}
    </>
  )
}

export {EditCartCarpetryPackageList}
