import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap-v5'
import {IDIYCheckOutModel} from '../../../models/quotations-page/diy-quotation-page/IDIYQuotationModel'
import {useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {
  checkoutCustomizationQuotationApi,
  saveQuotationDetailinCartApi,
} from '../../../modules/customization-quotation-master-page/CustomizationQuotationsCRUD'
import LoaderInTable from '../../common-pages/LoaderInTable'
import {KTSVG} from '../../../../_Ecd/helpers'

type Props = {
  checkOutList: IDIYCheckOutModel[]
  listTypeID: number
  quotationID: number
  title: string
  show: boolean
  handleClose: () => void
  handleCheckOut: (_quotationID: number) => void
  getAllAddonItemData: (_quotationID: number) => void
  mainCustomerID: number
  mainEmployeeID: number
  mainSearch: string
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
  mainCustomerID,
  mainEmployeeID,
  mainSearch,
}) => {
  const [checkOutListNew, setCheckOutListNew] = useState<IDIYCheckOutModel[]>(
    [] as IDIYCheckOutModel[]
  )

  const [cartLength, setCartLength] = useState<number>(0)
  const [display, setDisplay] = useState<number>(0)
  const [selProductID, setSelProductID] = useState<number>(0)
  const [newTitle, setNewTitle] = useState<string>('')
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const history = useHistory()

  function handleContinue() {
    setLoading(true)
    checkoutCustomizationQuotationApi(quotationID, 1)
      .then((response) => {
        if (response.data.isSuccess == true) {
          history.push({pathname:`/customization-quotations/pdf/${quotationID}`,state:{mainCustomerID, mainEmployeeID, mainSearch}})
          setLoading(false)
        } else if (response.data.isSuccess == false) {
          const responseData = response.data.responseObject
          if (response.data.listType == 4) {
            setDisplay(1)
            toast.warning(`${response.data.message}`)
            listTypeID = 4
            setCheckOutListNew(responseData)
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
  function onAddToCart(objProductList: IDIYCheckOutModel, tmpPlanAreaID: number) {
    setSelProductID(objProductList.productID)
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
          setSelProductID(0)
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
  function handleExit() {
    setDisplay(0)
    handleClose()
    getAllAddonItemData(quotationID)
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
                    <th className='min-w-125px text-center'>Product Name</th>
                    <th className='min-w-125px text-center'>Product Category</th>
                    <th className='min-w-125px text-center'>Unit Name</th>
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
                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.productName}
                          </td>
                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.productCategoryName}
                          </td>
                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.unitName}
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
                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.productName}
                          </td>
                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.productCategoryName}
                          </td>
                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.unitName}
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
            variant='success'
            onClick={() =>
              history.push({
                pathname: `/customization-quotations/pdf/${quotationID}`,
                state: {mainCustomerID, mainEmployeeID, mainSearch},
              })
            }
          >
            Continue Without Above Product List
          </Button>
        ) : listTypeID == 3 ? (
          <Button variant='primary' onClick={handleContinue}>
            Continue Without Above Product List
          </Button>
        ) : (
          <></>
        )}
        <Button variant='secondary' onClick={() => handleExit()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {CheckOutList}
