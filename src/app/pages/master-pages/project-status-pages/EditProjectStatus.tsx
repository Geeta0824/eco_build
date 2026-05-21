import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  IProjectStatusModel,
  projStatusInitValue as initialValues,
} from '../../../models/master-page/IProjectStatusModel'
import {
  EditProjectStatusDataAPI,
  getProjectStatusByProjectStatusIDAPI,
} from '../../../modules/master-page/project-status-master-page/ProjectStatusCRUD'

const profileDetailsSchema = Yup.object().shape({
  seqNo: Yup.number().required('Sequence No. is required').min(1, 'Sequence No. is required'),
  projectStatusName: Yup.string().required('Project Status Name is required'),
})

interface ProjectStatus {
  loading: boolean
  mainSearch: string
}

const AddProjectStatus: React.FC = () => {
  const [data, setData] = useState<IProjectStatusModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const {projectStuID} = useParams<{projectStuID: string}>()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<IProjectStatusModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<ProjectStatus>({
    loading: false,
    mainSearch: '',
  })
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
      }
      getProjectStatusDataByProjectStatusID(mainSearch)
    }, 100)
  }, [])

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  function getProjectStatusDataByProjectStatusID(mainSearch: string) {
    getProjectStatusByProjectStatusIDAPI(parseInt(projectStuID))
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          formik.setFieldValue('projectStatusID', responseData.projectStatusID)
          formik.setFieldValue('projectStatusName', responseData.projectStatusName)
          formik.setFieldValue('seqNo', responseData.seqNo)
          setState({...state, loading: false, mainSearch})
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  const formik = useFormik<IProjectStatusModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        EditProjectStatusDataAPI(
          parseInt(projectStuID),
          values.projectStatusName,
          values.seqNo,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/master/projectstatus/list',
                state: {search: state.mainSearch},
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
    <>
      {' '}
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: '/master/projectstatus/list',
              state: {search: state.mainSearch},
            })
          }
        >
          Back To List
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Project Status:
                </label>

                <div className='col-lg-6 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='project status'
                    {...formik.getFieldProps('projectStatusName')}
                  />
                  {formik.touched.projectStatusName && formik.errors.projectStatusName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectStatusName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Seq No:</span>
                </label>
                <div className='col-lg-6 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Sequence No'
                    {...formik.getFieldProps('seqNo')}
                  />
                  {formik.touched.seqNo && formik.errors.seqNo && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.seqNo}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className='row mb-6'>
              <label className='col-lg-2 col-form-label fw-bold fs-6'>
                <span className=''>isActive:</span>
              </label>
              <div className='col-lg-6 fv-row'>
                <div className='form-check form-switch'>
                  <input
                    className='form-check-input mt-3'
                    type='checkbox'
                    onChange={(e) => checkedFunction(e)}
                  />
                </div>
              </div>
            </div> */}
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
                onClick={() =>
                  history.push({
                    pathname: '/master/projectstatus/list',
                    state: {search: state.mainSearch},
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
export default AddProjectStatus
