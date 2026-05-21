import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
import {Add_Multi_Name_ProjectImageDetailsApi} from '../../../../modules/project-master-page/project-master/_3d-photos-master-pages/_3DPhotosCRUD'
import {
  IAlbumImageModel,
  albumImageInitValues as initialValues,
} from '../../../../models/projects-page/IAlbumImageModel'
import {addMultiNameProjectAlbumPhotosDtlsApi} from '../../../../modules/project-master-page/project-master/photo-album-pages/PhotoAlbumCRUD'

const profileDetailsSchema = Yup.object().shape({
  // photoTitle: Yup.string().required('Title Field is required'),
})

interface I3dImage {
  loading: boolean
  projectID: number
  projectAlbumID: number
  projName: string
  albumName: string
  customerName: string
}

const AddProjectAlbumImage: React.FC = () => {
  const [data, setData] = useState<IAlbumImageModel>(initialValues)
  const [fileLoader, setFileLoader] = useState(false)
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IAlbumImageModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<I3dImage>({
    loading: false,
    projectID: 0,
    projectAlbumID: 0,
    projName: '',
    albumName: '',
    customerName: '',
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      let projectID: any = lc.projectID
      let projectAlbumID: any = lc.projectAlbumID
      let projName: any = lc.projName
      let albumName: any = lc.albumName
      let customerName: any = lc.customerName
      setState({
        ...state,
        projectID: projectID,
        projectAlbumID: projectAlbumID,
        projName: projName,
        albumName: albumName,
        customerName: customerName,
        loading: false,
      })
    }, 100)
  }, [])

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [filePaths, setFilePaths] = useState<string[]>([])
  const [fileNames, setFileNames] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const photoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileLoader(true)
    e.preventDefault()
    const files = Array.from(e.target.files || [])
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file, file.name))

    fetch(
      process.env.REACT_APP_API_URL +
        `/ProjectAlbum/Upload_Multi_Name_ProjectAlbumPhotosByProjectAlbumID/${state.projectID}`,
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

  const formik = useFormik<IAlbumImageModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (filePaths.length == 0) {
          toast.error(`Please upload at least one file.`)
          return setLoading(false)
        }
        addMultiNameProjectAlbumPhotosDtlsApi(
          state.projectAlbumID,
          fileNames,
          filePaths,
          user.employeeID,
          '192.16.1.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfully')
              history.push({
                pathname: `/projects/project/album/imgList`,
                state: {
                  projectID: state.projectID,
                  projectAlbumID: state.projectAlbumID,
                  projName: state.projName,
                  albumName: state.albumName,
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
      <div className='card mt-4'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Upload Photos:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='file'
                    accept='image/*,.png'
                    multiple
                    className='form-control form-control-lg form-control-solid bg-light-primary mb-3'
                    onChange={(e) => photoUpload(e)}
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
                    pathname: `/projects/project/album/imgList`,
                    state: {
                      projectID: state.projectID,
                      projectAlbumID: state.projectAlbumID,
                      projName: state.projName,
                      albumName: state.albumName,
                      customerName: state.customerName,
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

export default AddProjectAlbumImage
