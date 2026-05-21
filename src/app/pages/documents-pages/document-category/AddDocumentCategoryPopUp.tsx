import React, {useState} from 'react'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Modal, Button} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {createDocumentCategoryDetails} from '../../../modules/documents-mst-pages/document-category/DocumentCategoryCRUD'

type Props = {
  show: boolean
  handleClose: () => void
}

const AddDocumentCategoryPopUp: React.FC<Props> = ({show, handleClose}) => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [loading, setLoading] = useState(false)
  const [docCategoryName, setDocCategoryName] = useState<string>('')
  function DocumentCategory(event: any) {
    setDocCategoryName(event.target.value)
  }

  const [isActive, setIsActive] = useState(false)
  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  // =================== For Asseccories ==========================
  function UserMapForDocument() {
    setTimeout(() => {
      if (docCategoryName == '') {
        return toast.error(`Please Enter Dcument Category`)
      }

      createDocumentCategoryDetails(docCategoryName, isActive, user.employeeID, '192.168.0.1')
        .then((response) => {
          if (response.data.isSuccess == true) {
            toast.success('Created Successfull')
            setLoading(false)
            handleClose()
            setDocCategoryName('')
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
    <Modal size='lg' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        <Modal.Title className='text-white'>Add Document Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='card-body border-top p-9 ms-6'>
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>
              Document Category Name:
            </label>

            <div className='col-lg-8 fv-row'>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid bg-light-primary'
                placeholder='document Category name'
                value={docCategoryName}
                onChange={(e) => DocumentCategory(e)}
              />
            </div>
          </div>
          <div className='row mb-6'>
            <label className='col-lg-4 col-form-label fw-bold fs-6'>
              <span className=''>isActive:</span>
            </label>
            <div className='col-lg-8 fv-row'>
              <div className='form-check form-switch'>
                <input
                  className='form-check-input mt-3'
                  type='checkbox'
                  onChange={(e) => checkedFunction(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={() => UserMapForDocument()}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {AddDocumentCategoryPopUp}
