import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {RootState} from '../../../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
import {
  IProjectAlbumModel,
  projectAlbumInitValues as initialValues,
} from '../../../../models/projects-page/IProjectDocumentModel'
import {addProjectAlbumByProjectID} from '../../../../modules/project-master-page/project-master/photo-album-pages/PhotoAlbumCRUD'

const profileDetailsSchema = Yup.object().shape({
  albumName: Yup.string().required('Album Name Feild is required'),
})
interface IProjectDoc {
  loading: boolean
  projectID: number
  projName: string
  customerName: string
}

const AddProjectAlbum: React.FC = () => {
  const [data, setData] = useState<IProjectAlbumModel>(initialValues)
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IProjectAlbumModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IProjectDoc>({
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

  const formik = useFormik<IProjectAlbumModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        addProjectAlbumByProjectID(
          state.projectID,
          values.albumName,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({
                pathname: `/projects/project/album/list`,
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
    <div className='card mt-4'>
      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9 ms-6'>
            <div className='row mb-6'>
              <label className='col-lg-3 col-form-label fw-bold fs-6'>
                <span className='required'>Album Name:</span>
              </label>
              <div className='col-lg-9 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Enter Album Name'
                  {...formik.getFieldProps('albumName')}
                />
                {formik.touched.albumName && formik.errors.albumName && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.albumName}</div>
                  </div>
                )}
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
              className='btn btn-danger mx-4'
              onClick={() =>
                history.push({
                  pathname: `/projects/project/album/list`,
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
export default AddProjectAlbum
