import React, {useEffect, useState} from 'react'
import {Pagination} from 'antd'
import {Button, Modal} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {IDiscountStatusData} from '../../../models/discount-request-page/IDiscountRequestModel'
import {RespForExtraDisctByAdminApi} from '../../../modules/discount-request-master-page/design-and-consultancy-request-master-page/DesignAndConsultancyDiscountRequestCRUD'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import Loader from '../../common-pages/Loader'

type Props = {
  quotationID: number
  discountStatusID: number
  discountTypeID: number
  projectNumber: string
  reqExtraDisc: string
  extraDiscount: string
  discountCondition: string
  discountStatusData: IDiscountStatusData[]
  show: boolean
  handleClose: () => void
}

interface ICustomerExpense {
  loading: boolean
  statusData: []
  selStatusID: number
}

const ModelCivilWithDesignDiscountRequest: React.FC<Props> = ({
  quotationID,
  discountStatusID,
  discountTypeID,
  projectNumber,
  reqExtraDisc,
  extraDiscount,
  discountCondition,
  discountStatusData,
  show,
  handleClose,
}) => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [discountStatusType, setDiscountStatusType] = useState<number>(0)
  const [valueCondition, setValueCondition] = useState<number>()
  const [valueConditionType, setValueConditionType] = useState<number>(0)
  const [valueDiscount, setValueDiscount] = useState<number>()
  const [valueDiscountType, setValueDiscountType] = useState<number>(0)
  const [state, setState] = useState<ICustomerExpense>({
    loading: false,
    statusData: [],
    selStatusID: 0,
  })

  // -----------------dropdown select----------------------
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId == 'statusID') {
      setDiscountStatusType(1)
      discountStatusID = parseInt(value)
      setState({...state, selStatusID: parseInt(value)})
    }
  }

  function handleDiscountChange(event: any) {
    if (!isNaN(event.target.value)) {
      const value = event.target.value
      const elementId = event.target.id
      if (elementId == 'txtdis') {
        setValueDiscountType(1)
        extraDiscount = value
        setValueDiscount(value)
      }
    }
  }

  function handleConditionChange(event: any) {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId == 'textCond') {
      setValueConditionType(1)
      discountCondition = value
      setValueCondition(value)
    }
  }

  function handleDiscounApi() {
    let discStatus: number = 0
    let tmpValueDiscount: any = 0
    let tmpValueCondition: any = ''
    if (valueDiscountType == 0) {
      tmpValueDiscount = extraDiscount
    } else {
      tmpValueDiscount = valueDiscount
    }
    if (tmpValueDiscount == undefined || tmpValueDiscount <= 0.01) {
      return toast.error('Discount field is required')
    }
    if (discountStatusType == 0) {
      discStatus = discountStatusID
    } else {
      discStatus = state.selStatusID
    }
    if (valueConditionType == 0) {
      if (discStatus != 3) {
        tmpValueCondition = ''
      } else {
        tmpValueCondition = discountCondition
      }
    } else {
      if (discStatus != 3) {
        tmpValueCondition = ''
      } else {
        tmpValueCondition = valueCondition
      }
    }
    if (discStatus == 4) {
      tmpValueDiscount = 0
      tmpValueCondition = ''
    }
    RespForExtraDisctByAdminApi(
      user.employeeID,
      quotationID,
      tmpValueDiscount,
      discStatus,
      tmpValueCondition
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          setDiscountStatusType(0)
          setValueConditionType(0)
          setValueDiscountType(0)
          setValueDiscount(0)
          setValueCondition(0)
          handleClose()
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  function clearData() {
    setDiscountStatusType(0)
    setValueConditionType(0)
    setValueDiscountType(0)
    setValueDiscount(0)
    setValueCondition(0)
    handleClose()
  }

  return (
    <>
      {state.loading == true ? (
        <Loader loading={state.loading} />
      ) : (
        <Modal size='xl' show={show} onHide={clearData} backdrop='true' keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Project No. : {projectNumber}</Modal.Title>
            <Modal.Title>
              Requested Discount : {reqExtraDisc}{' '}
              {discountTypeID === 1 ? 'Fix Value' : '%'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='card-body p-9 ms-6'>
              <div className='row mb-6 text-center'>
                <label className='col-lg-4 col-form-label required fw-bold fs-6'>Status :</label>
                <div className='col-lg-7 fv-row d-flex'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='statusID'
                  >
                    <option selected={discountStatusID == 0 ? true : false} value={0}>
                      Select Status
                    </option>
                    {discountStatusData.length > 0 &&
                      discountStatusData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.discountStatusID}
                            selected={discountStatusID == data.discountStatusID ? true : false}
                          >
                            {data.discoutStatusName}
                          </option>
                        )
                      })}
                  </select>
                </div>
              </div>
              <div
                className={
                  ((state.selStatusID == 3 || state.selStatusID == 2) && discountStatusType == 1) ||
                  ((discountStatusID == 3 || discountStatusID == 2) && discountStatusType == 0)
                    ? 'row mb-6 text-center'
                    : 'd-none'
                }
              >
                <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                  Given Discount :
                </label>
                <div className='col-lg-7 fv-row d-flex'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Discount'
                    value={valueDiscountType == 0 ? extraDiscount : valueDiscount}
                    onChange={(e) => handleDiscountChange(e)}
                    id='txtdis'
                    tabIndex={1}
                    autoFocus
                  />
                  &nbsp;{' '}
                  {discountTypeID === 1 ? (
                    <span className='mt-4 fs-6'>Fix Value</span>
                  ) : (
                    <span className='mt-4 fs-3'>%</span>
                  )}
                </div>
              </div>
              <div
                className={
                  (state.selStatusID == 3 && discountStatusType == 1) ||
                  (discountStatusID == 3 && discountStatusType == 0)
                    ? 'row mb-6 text-center'
                    : 'd-none'
                }
              >
                <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                  Conditions :
                </label>
                <div className='col-lg-7 fv-row d-flex'>
                  <textarea
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    rows={3}
                    placeholder='write here...'
                    id='textCond'
                    value={valueConditionType == 0 ? discountCondition : valueCondition}
                    onChange={(e) => handleConditionChange(e)}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' className='text-center' onClick={() => handleDiscounApi()}>
              Submit
            </Button>
            <Button variant='secondary' onClick={clearData}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}

export default ModelCivilWithDesignDiscountRequest
