import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {
  I3dImagesModel,
  _3dImagesModelInitValues as initialValues,
} from '../../../../models/projects-page/I3dImagesModel'
import {shallowEqual, useSelector} from 'react-redux'
import {Add_Multi_Name_ProjectImageDetailsApi} from '../../../../modules/project-master-page/project-master/_3d-photos-master-pages/_3DPhotosCRUD'

const profileDetailsSchema = Yup.object().shape({
  // photoTitle: Yup.string().required('Title Field is required'),
})

interface I3dImage {
  loading: boolean
  projectID: number
  projName: string
  customerName: string
}

const Add3DPhotosPage: React.FC = () => {
  const [data, setData] = useState<I3dImagesModel>(initialValues)
  const [fileLoader, setFileLoader] = useState(false)
  const {projectID} = useParams<{projectID: string}>()

  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<I3dImagesModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<I3dImage>({
    loading: false,
    projectID: 0,
    projName: '',
    customerName: '',
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let projectID: any = lc.projectID
      let projName: any = lc.projName
      let customerName: any = lc.customerName
      setState({
        ...state,
        projectID: projectID,
        projName: projName,
        customerName: customerName,
        loading: false,
      })
    }, 100)
  }, [])

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [filePaths, setFilePaths] = useState<string[]>([])
  const [fileNames, setFileNames] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const imageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileLoader(true)
    e.preventDefault()
    const files = Array.from(e.target.files || [])
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file, file.name))

    fetch(
      process.env.REACT_APP_API_URL +
        `/ProjectImage/Upload_Multi_Name_ProjectPhotoByProjectID/${state.projectID}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setFilePaths(data.filePaths)
        setFileNames(data.fileNames)

        setFileLoader(false)
      })

    setSelectedFiles(files)
  }

  const renderPhotos = (files: File[]) => {
    return files.map((file, index) => (
      <div key={index} className='symbol symbol-45px me-5'>
        <img src={URL.createObjectURL(file)} alt={`img-${index}`} />
      </div>
    ))
  }

  const formik = useFormik<I3dImagesModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (filePaths.length == 0) {
          toast.error(`Please upload at least one file.`)
          return setLoading(false)
        }
        Add_Multi_Name_ProjectImageDetailsApi(
          state.projectID,
          fileNames,
          filePaths,
          user.employeeID
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfully')
              history.push({
                pathname: `/projects/project/photos/list`,
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
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              {/* <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Photo Title:
                </label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Title'
                    {...formik.getFieldProps('photoTitle')}
                  />
                  {formik.touched.photoTitle && formik.errors.photoTitle && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.photoTitle}</div>
                    </div>
                  )}
                </div>
              </div> */}
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Upload Files:</span>
                  <p className='text-muted fs-7'> (allow only .png files)</p>
                </label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='file'
                    accept='.jpg,.png,.jpeg'
                    multiple
                    className='form-control form-control-lg form-control-solid bg-light-primary mb-3'
                    onChange={(e) => imageUpload(e)}
                  />
                  <div>{selectedFiles.length > 0 && renderPhotos(selectedFiles)}</div>
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
              </button>
              <button
                onClick={() =>
                  history.push({
                    pathname: `/projects/project/photos/list`,
                    state: {
                      projectID: state.projectID,
                    },
                  })
                }
                className='btn btn-danger ms-3'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Add3DPhotosPage
