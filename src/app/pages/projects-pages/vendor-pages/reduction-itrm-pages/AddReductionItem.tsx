import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {
  IReductionServiceModel,
  reductionServiceModelInitValues as initialValues,
} from '../../../../models/projects-page/IReductionServiceModel'
import {shallowEqual, useSelector} from 'react-redux'
import {AddProjectReductionDetailsAPI} from '../../../../modules/project-master-page/project-master/DeductionItemServiceCRUD'
import {Button, Modal} from 'react-bootstrap-v5'
import {AddVendorReductionDetailsAPI} from '../../../../modules/project-master-page/vendor-Master-page/reduction-item-page/ReductionItemCRUD'
import {parse} from 'path'
import moment from 'moment'

type Props = {
  ShowReductionAdd: boolean
  HandleCloseReductionAdd: () => void
  vendorID: number
  projectID: number
  projectVendorID: number
  vendorName: string
  allVendorReductionDescListFunc: (
    vendorID: number,
    projectVendorID: number,
    vendorName: string
  ) => void
}
interface IReduction {}

const AddReductionItem: React.FC<Props> = ({
  ShowReductionAdd,
  HandleCloseReductionAdd,
  vendorID,
  projectID,
  projectVendorID,
  vendorName,
  allVendorReductionDescListFunc,
}) => {
  const [data, setData] = useState<IReductionServiceModel>(initialValues)
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IReductionServiceModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IReduction>({})

  const [remarks, setRemarks] = useState<string>('')
  function ReductionDescription(e: any) {
    setRemarks(e.target.value)
  }
  const [reductionCost, setReductionCost] = useState<string>('')
  function ReductionCost(e: any) {
    setReductionCost(e.target.value)
  }
  const [reductionDate, setReductionDate] = useState<string>(
    moment(new Date()).format('YYYY-MM-DD')
  )
  function ReductionDate(e: any) {
    setReductionDate(e.target.value)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  function saveAddReductionDes() {
    setTimeout(() => {
      if (reductionCost == '') {
        return toast.error('Reduction Cost Feild is Required')
      }
       if (remarks == '') {
        return toast.error('Description Feild is Required')
      }
      AddVendorReductionDetailsAPI(
        projectID,
        vendorID,
        projectVendorID,
        remarks,
        parseInt(reductionCost),
        reductionDate,
        user.employeeID,
        '192.168.0.1'
      )
        .then((response) => {
          if (response.data.isSuccess == true) {
            toast.success('Created Successfully')
            HandleCloseReductionAdd()
            allVendorReductionDescListFunc(vendorID, projectVendorID, vendorName)
            setRemarks('')
            setReductionCost('')
            setReductionDate('')
            setLoading(false)
          } else {
            toast.error(`${response.data.message}`)
            setLoading(false)
          }
        })
        .catch((error) => {
          toast.error(`${error}`)
          setLoading(false)
        })
      setLoading(false)
    }, 1000)
  }

  return (
    <>
      <Modal size='lg' show={ShowReductionAdd} onHide={HandleCloseReductionAdd} keyboard={false}>
        <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
          <Modal.Title className='text-primary'>Add Reduction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='card-body border-top p-9 ms-6'>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label fw-bold fs-6'>
                <span className='required'>Description:</span>
              </label>
              <div className='col-lg-10 fv-row'>
                <textarea
                  rows={2}
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Description...'
                  value={remarks}
                  onChange={(e) => ReductionDescription(e)}
                />
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>Amount:</label>
              <div className='col-lg-4 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='amount'
                  value={reductionCost}
                  onChange={(e) => ReductionCost(e)}
                />
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label fw-bold fs-6'>Date:</label>
              <div className='col-lg-3 fv-row ps-4'>
                <input
                  type='date'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  value={reductionDate}
                  onChange={(e) => ReductionDate(e)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => saveAddReductionDes()}>
            Submit
          </Button>
          <Button variant='danger' onClick={HandleCloseReductionAdd}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default AddReductionItem
