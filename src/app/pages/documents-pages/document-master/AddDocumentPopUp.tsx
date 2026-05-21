import React, {useState} from 'react'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Modal, Button} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {createDocumentMstDetails} from '../../../modules/documents-mst-pages/document-mst-pages/DocumentCRUD'

type Props = {
  show: boolean
  handleClose: () => void
  documentCategoryID: number
  documentCategoryName: string
}

const AddDocumentPopUp: React.FC<Props> = ({
  show,
  handleClose,
  documentCategoryID,
  documentCategoryName,
}) => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [filePath, setFilePath] = useState<string>('')
  const [fileType, setFileType] = useState<string>('')
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [documentName, setDocumentName] = useState<string>('')
  function DocumentCategory(event: any) {
    setDocumentName(event.target.value)
  }

  const [isActive, setIsActive] = useState(false)
  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const imageUpload = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    const file = e.target.files[0]
    if (file) {
      const fileType = file.type

      if (fileType === 'application/pdf') {
        setFileType('PDF')
      } else if (fileType.startsWith('image/')) {
        setFileType('Image')
      } else {
        setFileType('Unknown')
      }
    }
    fetch(process.env.REACT_APP_API_URL + '/Document/SaveDocumentFile', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFilePath(data)
        setFileLoader(false)
      })
  }

  // =================== For Asseccories ==========================
  function AddDocument() {
    setTimeout(() => {
      if (documentName == '') {
        return toast.error(`Please Enter Dcument Category`)
      }

      createDocumentMstDetails(
        documentName,
        documentCategoryID,
        filePath,
        isActive,
        user.employeeID,
        '192.168.0.1'
      )
        .then((response) => {
          if (response.data.isSuccess == true) {
            toast.success('Created Successfull')
            setLoading(false)
            handleClose()
            setDocumentName('')
            setFilePath('')
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
        <h3 className='card-title align-items-start'>
          <span className='text-white card-label fs-5 mb-1'>Document Category Name : </span>
          <span className='text-primary card-label fw-bolder fs-5 mb-1'>
            {documentCategoryName}
          </span>
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className='card-body border-top p-9 ms-6'>
          <div className='row mb-6'>
            <label className='col-lg-3 col-form-label required fw-bold fs-6'>Document Name:</label>
            <div className='col-lg-9 fv-row'>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid bg-light-primary'
                placeholder='document name'
                value={documentName}
                onChange={(e) => DocumentCategory(e)}
              />
            </div>
          </div>
          <div className='row mb-6'>
            <label className='col-lg-3 col-form-label fw-bold fs-6'>
              <span className=''>Upload File:</span>
            </label>
            <div className={filePath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}>
              <div className='symbol symbol-45px me-5'>
                {fileType == 'Image' ? (
                  <img src={process.env.REACT_APP_API_URL + filePath} alt='img' />
                ) : fileType == 'PDF' ? (
                  <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='' />
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className={filePath === '' ? 'col-lg-9 fv-row' : 'col-lg-8 fv-row'}>
              <input
                type='file'
                accept='image/*,.pdf'
                className='form-control form-control-lg form-control-solid bg-light-primary'
                onChange={(e) => imageUpload(e)}
              />
            </div>
          </div>
          <div className='row mb-6'>
            <label className='col-lg-3 col-form-label fw-bold fs-6'>
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
        <Button variant='primary' onClick={() => AddDocument()}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {AddDocumentPopUp}
