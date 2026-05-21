import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {createBHK} from '../../../modules/master-page/bhk-master-page/NewBHKCRUD'
import {
  ImpRemarksModel,
  impRemarksInitValue as initialValues,
} from '../../../models/projects-page/ImpRemarksModel'

const profileDetailsSchema = Yup.object().shape({
  bhkName: Yup.string().required('Name field is required'),
})

interface IBHK {
  loading: boolean
  mainSearch: string
  ProjectName: string
  projectCategoryID: number
}

const AddImpRemarks: React.FC = () => {
  const {projectID} = useParams<{projectID: string}>()
  const history = useHistory()
  const location = useLocation()
  const [isActive, setIsActive] = useState(false)
  const [data, setData] = useState<ImpRemarksModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<ImpRemarksModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const [state, setState] = useState<IBHK>({
    loading: false,
    mainSearch: '',
    ProjectName: '',
    projectCategoryID: 0,
  })
  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      getBHKDataByBHKId(mainSearch)
    }, 100)
  }, [])

  function getBHKDataByBHKId(mainSearch: string) {
    setState({...state, loading: false, mainSearch: mainSearch})
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<ImpRemarksModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const updatedValues = {
          ...values,
          createBy: user.employeeID,
          ipAddress: '192.168.0.1',
          isActive: isActive,
        } // assuming bhkId is defined somewhere
        var objBhk = btoa(JSON.stringify(updatedValues))
        createBHK(`${objBhk}`)
          .then((response) => {
            var decodeResp = JSON.parse(atob(response.data.encodedResponse))
            let resp = decodeResp
            if (resp.isSuccess == true) {
              toast.success('Created Successfull')
              history.push({pathname: '/master/bhkMaster/list', state: {search: state.mainSearch}})
              setLoading(false)
            } else {
              toast.error(`${resp.message}`)
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
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-7 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: `/projects/project/edit/${parseInt(projectID)}/imp-remarks/list`,
              state: {projName: state.ProjectName, projectCategoryID: state.projectCategoryID},
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
                  IMP Remarks Name:
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='BHK name'
                    {...formik.getFieldProps('bhkName')}
                  />
                  {formik.touched.bhkName && formik.errors.bhkName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.bhkName}</div>
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
              <span
                className='btn btn-danger ms-3'
                onClick={() =>
                  history.push({
                    pathname: `/projects/project/edit/${parseInt(projectID)}/imp-remarks/list`,
                    state: {
                      projName: state.ProjectName,
                      projectCategoryID: state.projectCategoryID,
                    },
                  })
                }
              >
                Cancel
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {AddImpRemarks}
