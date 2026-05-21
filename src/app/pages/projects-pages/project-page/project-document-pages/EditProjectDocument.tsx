import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {
  IProjectDocumentModel,
  projectDocumentInitValues as initialValues,
} from '../../../../models/projects-page/IProjectDocumentModel'
import {shallowEqual, useSelector} from 'react-redux'
import {
  EditProjectDocumentDetailsAPI,
  getProjectDocumentByProjectDocumentIdAPI,
} from '../../../../modules/project-master-page/project-master/project-document-pages/ProjectDocumentCRUD'
import {toAbsoluteUrl} from '../../../../../_Ecd/helpers'

const profileDetailsSchema = Yup.object().shape({
  docName: Yup.string().required('Document Name Feild is required'),
})

interface IProjectVendor {
  loading: boolean
  projectID: number
  projName: string
  customerName: string
}
const EditProjectDocument: React.FC = () => {
  const [data, setData] = useState<IProjectDocumentModel>(initialValues)
  const {projDocID} = useParams<{projDocID: string}>()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IProjectDocumentModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const [state, setState] = useState<IProjectVendor>({
    loading: false,
    projectID: 0,
    projName: '',
    customerName: '',
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let projectID: any = lc.projectID
      let customerName: any = lc.customerName
      getProjectDocumentDataByID(projectID, projName, customerName)
    }, 100)
  }, [])

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  function getProjectDocumentDataByID(projectID: number, projName: string, customerName: string) {
    getProjectDocumentByProjectDocumentIdAPI(parseInt(projDocID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('docName', response.data.docName)
          setFilePath(response.data.docPath)
          setState({
            ...state,
            projectID: projectID,
            projName: projName,
            customerName: customerName,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  // -----------------File photo----------------------

  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [filePath, setFilePath] = useState<string>('')
  const FileUpload = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/ProjectDocument/SaveProjectDocumentFile', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFilePath(data)
        setFileLoader(false)
      })
  }

  const formik = useFormik<IProjectDocumentModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        EditProjectDocumentDetailsAPI(
          state.projectID,
          parseInt(projDocID),
          values.docName,
          filePath,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: `/projects/project/proj-document/list`,
                state: {
                  projectID: state.projectID,
                  projName: state.projName,
                  customerName: state.customerName,
                },
              })
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
        // const updatedData = Object.assign(data, values)
        // setData(updatedData)
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <div className='card mb-5 mb-xl-10'>
      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9 ms-6'>
            <div className='row mb-6'>
              <label className='col-lg-3 col-form-label fw-bold fs-6'>
                <span className='required'>Document Name:</span>
              </label>
              <div className='col-lg-9 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Enter Document Name'
                  {...formik.getFieldProps('docName')}
                />
                {formik.touched.docName && formik.errors.docName && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.docName}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-3 col-form-label fw-bold fs-6'>
                <span className=''>Upload File:</span>
              </label>
              <div className={filePath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}>
                <div className='symbol symbol-45px me-5'>
                  <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='' />
                </div>
              </div>
              <div className={filePath === '' ? 'col-lg-9 fv-row' : 'col-lg-8 fv-row'}>
                <input
                  type='file'
                  accept='.pdf'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  onChange={(e) => FileUpload(e)}
                />
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {!loading && 'Save'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>{' '}
            <button
              className='btn btn-danger mx-4'
              onClick={() =>
                history.push({
                  pathname: `/projects/project/proj-document/list`,
                  state: {
                    projectID: state.projectID,
                    projName: state.projName,
                    customerName: state.customerName,
                  },
                })
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default EditProjectDocument
