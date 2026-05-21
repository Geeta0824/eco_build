import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap-v5'
import {IDIYCheckOutModel} from '../../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import {useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {
  checkoutDIYQuotationApi,
  saveQuotationDetailinCartApi,
} from '../../../../modules/quotations-master-page/diy-quotation-master-page/DIYQuotationCRUD'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import {KTSVG} from '../../../../../_Ecd/helpers'

type Props = {
  checkOutList: IDIYCheckOutModel[]
  listTypeID: number
  quotationID: number
  title: string
  show: boolean
  handleClose: () => void
  handleCheckOut: (_quotationID: number) => void
  getAllAddonItemData: (_quotationID: number) => void
  customerName: string
  bhkName: string
  carpetAreaName: string
  projectName: string
  projectNumber: string
  mainEmployeeID:number,
  mainCustomerID:number,
  mainSearch:string ,
}

const CheckOutList: React.FC<Props> = ({
  checkOutList,
  listTypeID,
  quotationID,
  title,
  show,
  handleClose,
  handleCheckOut,
  getAllAddonItemData,
  customerName,
  bhkName,
  carpetAreaName,
  projectName,
  projectNumber,
  mainEmployeeID,
  mainCustomerID,
  mainSearch ,
}) => {
  const [checkOutListNew, setCheckOutListNew] = useState<IDIYCheckOutModel[]>(
    [] as IDIYCheckOutModel[]
  )

  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [selProductID, setSelProductID] = useState<number>(0)
  const [cartLength, setCartLength] = useState<number>(0)
  const [display, setDisplay] = useState<number>(0)
  const [newTitle, setNewTitle] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const history = useHistory()

  function handleContinue() {
    setLoading(true)
    checkoutDIYQuotationApi(quotationID, 1)
      .then((response) => {
        if (response.data.isSuccess == true) {
          history.push({
            pathname: `/quotations/diy-quotation/backpdf/${quotationID}`,
            state: {
              isDownload: 0,
              customerName,
              bhkName,
              carpetAreaName,
              projectName,
              projectNumber,
              mainEmployeeID,
              mainCustomerID,
              mainSearch ,
            },
          })
          setLoading(false)
        } else if (response.data.isSuccess == false) {
          const responseData = response.data.responseObject
          if (response.data.listType == 4) {
            const tmpRowData: IDIYCheckOutModel[] = []
            for (let k in responseData) {
              let tmpAllData: IDIYCheckOutModel = {
                primaryID: parseInt(k + 1),
                productID: responseData[k]['productID'],
                productName: responseData[k]['productName'],
                description: responseData[k]['description'],
                areaName: responseData[k]['areaName'],
                productCategoryName: responseData[k]['productCategoryName'],
                unitName: responseData[k]['unitName'],
                parentName: responseData[k]['parentName'],
                planAreaID: responseData[k]['planAreaID'],
                productCategoryID: responseData[k]['productCategoryID'],
                length: responseData[k]['length'],
                pricePerSqFt: responseData[k]['pricePerSqFt'],
                depth: responseData[k]['depth'],
                height: responseData[k]['height'],
                noOfUnit: responseData[k]['noOfUnit'],
                photoPath: responseData[k]['photoPath'],
                defaultUnitID: responseData[k]['defaultUnitID'],
                isHeightChange: responseData[k]['isHeightChange'],
              }
              tmpRowData.push(tmpAllData)
            }
            setDisplay(1)
            toast.warning(`${response.data.message}`)
            listTypeID = 4
            setCheckOutListNew(tmpRowData)
            setNewTitle(response.data.message)
            setLoading(false)
          } else {
            toast.error(`${response.data.message}`)
            setLoading(false)
          }
        } else {
          toast.error(`${response.data.message}`)
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setLoading(false)
      })
  }

  function handleExit() {
    setDisplay(0)
    handleClose()
    getAllAddonItemData(quotationID)
  }
  function onAddToCart(objProductList: IDIYCheckOutModel, tmpPlanAreaID: number) {
    setMainLoading(true)
    saveQuotationDetailinCartApi(
      quotationID,
      objProductList.productCategoryID,
      objProductList.productID,
      objProductList.planAreaID,
      objProductList.defaultUnitID,
      parseInt(objProductList.length),
      parseInt(objProductList.depth),
      parseInt(objProductList.height),
      objProductList.noOfUnit
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success(`Product Added in Cart`, {autoClose: 1000})
          setCartLength(cartLength + 1)
          handleCheckOut(quotationID)
          // handleContinue()
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
      const Rows: IDIYCheckOutModel[] = checkOutList
      for (let key in Rows) {
        if (Rows[key].primaryID == elementId) {
          let tmpNoOfUnit = (
            value *
            parseInt(Rows[key].length) *
            parseInt(Rows[key].depth)
          ).toFixed(2)
          Rows[key].height = value
          Rows[key].noOfUnit = parseFloat(tmpNoOfUnit)
          setMainLoading(false)
          break
        }
      }
    }
  }

  const [valueLen, setValueLen] = useState<number>()
  const [selProductIDLen, setSelProductIDLen] = useState<string>()
  function handleLengthChange(event: any) {
    if (!isNaN(event.target.value)) {
      setMainLoading(true)
      const value = event.target.value
      const elementId = event.target.id
      const textBox = 'txtLen'
      setSelProductIDLen(textBox + elementId)
      setValueLen(value)
      const Rows: IDIYCheckOutModel[] = checkOutList
      for (let key in Rows) {
        if (Rows[key].primaryID == elementId) {
          let tmpNoOfUnit = (
            value *
            parseInt(Rows[key].height) *
            parseInt(Rows[key].depth)
          ).toFixed(2)
          Rows[key].length = value
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
      setValueUnit(value)
      const Rows: IDIYCheckOutModel[] = checkOutList
      for (let key in Rows) {
        if (Rows[key].primaryID == elementId) {
          Rows[key].noOfUnit = value
          setValueUnit(Rows[key].noOfUnit)
          setMainLoading(false)
          break
        }
      }
    }
  }

  return (
    <Modal size='xl' show={show} onHide={handleExit} backdrop='true' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{display == 0 ? title : newTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={`card `}>
          {/* begin::Body */}
          <div className='py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-bordered align-middle g-2'>
                {/* begin::Table head */}
                <thead className='bg-light-primary'>
                  <tr className='fw-bolder fs-5'>
                    <th className={display == 1 ? 'min-w-125px text-center' : 'd-none'}>
                      Parent Name
                    </th>
                    <th className='min-w-100px  fw-boldtext-start'>
                      <span className='text-primary'>Product Name</span>
                      <span className=' text-info d-block '>Product Category</span>
                    </th>
                    <th className='min-w-75px text-center fw-bold'>
                      <span className='text-primary'>Length</span>
                      <span className='d-block text-info'>Height</span>
                      <span className='text-success'>Defth</span>
                    </th>
                    <th className='min-w-150px  fw-bold text-center'>
                      <span className=' text-primary '>No Of Units</span>
                      <span className=' text-info d-block '>Unit Name</span>
                    </th>

                    <th className='min-w-125px text-center'>Description</th>
                    <th className='min-w-125px text-center'>Area Name</th>
                    <th className='min-w-125px text-center'>Add to Cart</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className='text-center'>
                  <LoaderInTable loading={loading} column={10} />
                  {checkOutList.length > 0 &&
                    display == 0 &&
                    checkOutList.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td className='text-start'>
                            <span className='text-primary text-hover-primary mb-1 fs-6'>
                              {data.productName}
                            </span>
                            <span className='text-info text-hover-primary mb-1 fs-6 d-block'>
                              {data.productCategoryName}
                            </span>
                          </td>
                          <td className='text-center'>
                            <span className='text-primary'>
                              <input
                                // type='number'
                                type='text'
                                id={`${data.primaryID}`}
                                value={
                                  selProductIDLen == `txtLen${data.primaryID}`
                                    ? valueLen
                                    : data.length
                                }
                                onChange={(e) => handleLengthChange(e)}
                                className=' w-50px h-30px bg-light-primary border-0 rounded text-primary'
                              />
                            </span>

                            <span className='text-info d-block'>
                              <input
                                // type='number'
                                type='text'
                                id={`${data.primaryID}`}
                                disabled={!data.isHeightChange}
                                value={
                                  selProductIDHei == `txthei${data.primaryID}`
                                    ? valueHei
                                    : data.height
                                }
                                onChange={(e) => handleHeightChange(e)}
                                className=' w-50px h-30px bg-light-primary border-0 rounded text-info '
                              />
                            </span>
                            <span className='text-success'>
                              <input
                                // type='number'
                                type='text'
                                disabled
                                value={data.depth}
                                className=' w-50px h-30px bg-light-primary border-0 rounded text-success'
                              />
                            </span>
                          </td>
                          <td className='text-center'>
                            <span className='text-primary '>
                              <input
                                // type='number'
                                type='text'
                                id={`${data.primaryID}`}
                                value={
                                  selProductIDUnit == `txtUnit${data.primaryID}`
                                    ? valueUnit
                                    : data.noOfUnit
                                }
                                disabled
                                onChange={(e) => handleUnitChange(e)}
                                className=' w-50px h-30px bg-light-primary border-0 rounded text-primary'
                              />
                            </span>
                            <span className='text-info d-block '> {data.unitName}</span>
                          </td>

                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.description}
                          </td>
                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.areaName}
                          </td>
                          <td>
                            <span
                              className='btn btn-sm btn-light-primary bg-white border border-primary text-center py-2 px-5'
                              onClick={() => onAddToCart(data, data.planAreaID)}
                            >
                              <KTSVG
                                path='/media/icons/duotune/arrows/arr075.svg'
                                className='svg-icon-2'
                              />
                              Add
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  {checkOutListNew.length > 0 &&
                    display == 1 &&
                    checkOutListNew.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td
                            className={
                              display == 1 ? 'text-dark text-hover-primary mb-1 fs-6' : 'd-none'
                            }
                          >
                            {data.parentName}
                          </td>
                          <td className='text-start'>
                            <span className='text-primary text-hover-primary mb-1 fs-6'>
                              {data.productName}
                            </span>
                            <span className='text-info text-hover-primary mb-1 fs-6 d-block'>
                              {data.productCategoryName}
                            </span>
                          </td>
                          <td className='text-center'>
                            <span className='text-primary'>
                              <input
                                // type='number'
                                type='text'
                                id={`${data.primaryID}`}
                                value={
                                  selProductIDLen == `txtLen${data.primaryID}`
                                    ? valueLen
                                    : data.length
                                }
                                onChange={(e) => handleLengthChange(e)}
                                className=' w-50px h-30px bg-light-primary border-0 rounded'
                              />
                            </span>

                            <span className='text-info d-block'>
                              <input
                                // type='number'
                                type='text'
                                id={`${data.primaryID}`}
                                disabled={!data.isHeightChange}
                                value={
                                  selProductIDHei == `txthei${data.primaryID}`
                                    ? valueHei
                                    : data.height
                                }
                                onChange={(e) => handleHeightChange(e)}
                                className=' w-50px h-30px bg-light-primary border-0 rounded text-info '
                              />
                            </span>
                            <span className='text-success'>
                              <input
                                // type='number'
                                type='text'
                                disabled
                                value={data.depth}
                                className=' w-50px h-30px bg-light-primary border-0 rounded text-success'
                              />
                            </span>
                          </td>
                          <td className='text-center'>
                            <span className='text-primary '>
                              <input
                                // type='number'
                                type='text'
                                id={`${data.primaryID}`}
                                value={
                                  selProductIDUnit == `txtUnit${data.primaryID}`
                                    ? valueUnit
                                    : data.noOfUnit
                                }
                                disabled
                                onChange={(e) => handleUnitChange(e)}
                                className=' w-50px h-30px bg-light-primary border-0 rounded'
                              />
                            </span>
                            <span className='text-info d-block '> {data.unitName}</span>
                          </td>
                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.description}
                          </td>
                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.areaName}
                          </td>
                          <td>
                            <span
                              className='btn btn-sm btn-light-primary bg-white border border-primary text-center py-2 px-5'
                              onClick={() => onAddToCart(data, data.planAreaID)}
                            >
                              <KTSVG
                                path='/media/icons/duotune/arrows/arr075.svg'
                                className='svg-icon-2'
                              />
                              Add
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  {/* <BlankDataImageInTable
                    length={checkOutList.length}
                    loading={state.loading}
                    colSpan={10}
                  /> */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {display == 1 ? (
          <Button
            variant='primary'
            onClick={() =>
              history.push({
                pathname: `/quotations/diy-quotation/backpdf/${quotationID}`,
                state: {
                  isDownload: 0,
                  customerName,
                  bhkName,
                  carpetAreaName,
                  projectName,
                  projectNumber,
                  mainEmployeeID,
                  mainCustomerID,
                  mainSearch ,
                },
              })
            }
          >
            Continue Without Above Product List
          </Button>
        ) : (
          <Button variant='primary' onClick={handleContinue}>
            Continue Without Above Product List
          </Button>
        )}
        <Button variant='secondary' onClick={() => handleExit()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {CheckOutList}
