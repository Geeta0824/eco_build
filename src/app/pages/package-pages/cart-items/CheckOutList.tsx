import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap-v5'
import {IDIYCheckOutModel} from '../../../models/package-page/IPackageModel'
import {useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {
  checkoutPackageApi,
  savePackageDetailinCartApi,
} from '../../../modules/package-master-page/PackageCRUD'
import LoaderInTable from '../../common-pages/LoaderInTable'
import {KTSVG} from '../../../../_Ecd/helpers'

type Props = {
  checkOutList: IDIYCheckOutModel[]
  listTypeID: number
  packageID: number
  title: string
  show: boolean
  handleClose: () => void
  handleCheckOut: (_packageID: number) => void
  getAllAddonItemData: (_packageID: number) => void
}

const CheckOutList: React.FC<Props> = ({
  checkOutList,
  listTypeID,
  packageID,
  title,
  show,
  handleClose,
  handleCheckOut,
  getAllAddonItemData,
}) => {
  const [checkOutListNew, setCheckOutListNew] = useState<IDIYCheckOutModel[]>(
    [] as IDIYCheckOutModel[]
  )
  const [cartLength, setCartLength] = useState<number>(0)
  const [selProductID, setSelProductID] = useState<number>(0)
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [display, setDisplay] = useState<number>(0)
  const [newTitle, setNewTitle] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const history = useHistory()

  function handleContinue() {
    setLoading(true)
    checkoutPackageApi(packageID, 1)
      .then((response) => {
        if (response.data.isSuccess == true) {
          history.push({
            pathname: `/package/pdf/${packageID}`,
            state: {
              packageName: title,
              isDownload: 0,
            },
          })
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
  function onAddToCart(objProductList: IDIYCheckOutModel) {
    setSelProductID(objProductList.productID)
    setMainLoading(true)
    savePackageDetailinCartApi(
      packageID,
      objProductList.categoryID,
      objProductList.productID,
      objProductList.planAreaID,
      objProductList.unitID,
      objProductList.length,
      objProductList.depth,
      objProductList.height,
      objProductList.noOfUnit
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success(`Product Added in Cart`, {autoClose: 1000})
          setCartLength(cartLength + 1)
          setSelProductID(0)
          handleCheckOut(packageID)
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
    getAllAddonItemData(packageID)
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
                    <th className='min-w-125px text-center'>Add To Cart</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
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
                              onClick={() => onAddToCart(data)}
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
                          </td>{' '}
                          <td className='text-dark text-hover-primary mb-1 fs-6'>
                            {data.areaName}
                          </td>
                          <td>
                            <span
                              className='btn btn-sm btn-light-primary bg-white border border-primary text-center py-2 px-5'
                              onClick={() => onAddToCart(data)}
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
                pathname: `/package/pdf/${packageID}`,
                state: {
                  packageName: title,
                  isDownload: 0,
                },
              })
            }
          >
            Continue Without Above Product List
          </Button>
        ) : listTypeID !== 2 ? (
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
