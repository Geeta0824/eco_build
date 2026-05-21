import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {IEduDepartmentModel} from '../../../../models/master-page/IEducationDepartmentModel'
import {IEduCategoryModel} from '../../../../models/master-page/IEducationCategoryModel'
import {
  IEmployeeEducationModel,
  employeeEducationInitValue as initialValues,
} from '../../../../models/organization-page/Employee/IEmployeeEducationModel'
import {IEmployeeWebModel} from '../../../../models/organization-page/Employee/IEmployeeModel'
import {KTSVG} from '../../../../../_Ecd/helpers'
import {getAllEduDepartment} from '../../../../modules/master-page/education-department-master-page/EducationDepartmentCRUD'
import {getAllEduCategory} from '../../../../modules/master-page/education-category-master-page/EducationCategoryCRUD'
import {createEmpEducation} from '../../../../modules/organization-page/employee-master-page/education-details/EmployeeEducationCRUD'
import Loader from '../../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  instituteName: Yup.string().required('Institute Name is required'),
  // eduDepartmentID: Yup.number()
  //   .required('Department Name is required')
  //   .min(1, 'Department Name is required'),
  eduCategoryID: Yup.number()
    .required('Category Name is required')
    .min(0, 'Category Name is required'),
  passingYear: Yup.string().required('Passing Year is required'),
  percentage: Yup.string().required('Persentage is required'),
})

interface IEduDepartment {
  loading: boolean
  eduDepartment: IEduDepartmentModel[]
  eduCategory: IEduCategoryModel[]
  employeeData: IEmployeeWebModel[]
  empEducationData: IEmployeeEducationModel[]
  selEmployeeID: number
  selEduCategoryID: number
  mainSearch: string
}

const AddEmployeeEducation: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const {employeeID} = useParams<{employeeID: string}>()
  const [data, setData] = useState<IEmployeeEducationModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const updateData = (fieldsToUpdate: Partial<IEmployeeEducationModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IEduDepartment>({
    loading: false,
    eduDepartment: [] as IEduDepartmentModel[],
    eduCategory: [] as IEduCategoryModel[],
    employeeData: [] as IEmployeeWebModel[],
    empEducationData: [] as IEmployeeEducationModel[],
    selEmployeeID: 0,
    selEduCategoryID: -1,
    mainSearch: '',
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
      // let empID = localStorage.getItem('editEmpID')!
      // let finalempID: number = JSON.parse(empID)
      getEduDepartment(parseInt(employeeID),mainSearch)
    }, 100)
  }, [])

  function getEduDepartment(finalempID: number,mainSearch:string) {
    getAllEduDepartment()
      .then((response) => {
        let responseData = response.data.responseObject
        getEduCategory(finalempID, responseData,mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, eduDepartment: [], loading: false})
      })
  }

  function getEduCategory(finalempID: number, tmpEduDept: IEduDepartmentModel[],mainSearch:string) {
    getAllEduCategory()
      .then((response) => {
        let responseData = response.data.responseObject
        setState({
          ...state,
          loading: false,
          eduCategory: responseData,
          eduDepartment: tmpEduDept,
          mainSearch,
          selEmployeeID: finalempID,
      
        })
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, eduCategory: [], eduDepartment: [], loading: false})
      })
  }

  function checkedFunction(event: any) {
    setIsActive(event.target.checked)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    // if (elementId === 'eduDepartmentID') {
    //   formik.setFieldValue('eduDepartmentID', parseInt(value))
    // } else
    if (elementId === 'eduCategoryID') {
      formik.setFieldValue('eduCategoryID', parseInt(value))
      setState({...state, selEduCategoryID: parseInt(value)})
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IEmployeeEducationModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        createEmpEducation(
          values.instituteName,
          values.subjectName,
          // values.eduDepartmentID,
          0,
          values.eduCategoryID,
          state.selEmployeeID,
          values.passingYear,
          values.percentage,
          isActive,
          values.otherCategory
        ).then((response) => {
          toast.success('Created Successfull')
          history.push({pathname:`/organization/employee/edit/${state.selEmployeeID}/education/list`,state:{search:state.mainSearch}})
        })
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-5'>
        {/* <div
          className='card-header border-0 cursor-pointer'
          role='button'
          data-bs-toggle='collapse'
          data-bs-target='#kt_account_profile_education_details'
          aria-expanded={state.hideShow}
          aria-controls='kt_account_profile_education_details'
        >
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Create Employee Education Details</h3>
          </div>
        </div> */}
        <div id='kt_account_profile_education_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Institute Name:
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Institute Name'
                    {...formik.getFieldProps('instituteName')}
                  />
                  {formik.touched.instituteName && formik.errors.instituteName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.instituteName}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>Subject Name:</label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Subject Name'
                    {...formik.getFieldProps('subjectName')}
                  />
                  {formik.touched.subjectName && formik.errors.subjectName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.subjectName}</div>
                    </div>
                  )}
                </div>
                {/* <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Department Name:
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='eduDepartmentID'
                  >
                    <option selected value={0}>
                      Select Department
                    </option>
                    {state.eduDepartment.length > 0 &&
                      state.eduDepartment.map((data, index) => {
                        return (
                          <option key={index} value={data.eduDepartmentID}>
                            {data.eduDepartmentName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.eduDepartmentID && formik.errors.eduDepartmentID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.eduDepartmentID}</div>
                    </div>
                  )}
                </div> */}
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Passing Year:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Passing Year'
                    {...formik.getFieldProps('passingYear')}
                  />
                  {formik.touched.passingYear && formik.errors.passingYear && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.passingYear}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Persentage:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='0.0'
                    {...formik.getFieldProps('percentage')}
                  />
                  {formik.touched.percentage && formik.errors.percentage && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.percentage}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Category Name:
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='eduCategoryID'
                  >
                    <option selected={state.selEduCategoryID === -1 ? true : false} value={-1}>
                      Select Education Category
                    </option>
                    <option selected={state.selEduCategoryID === 0 ? true : false} value={0}>
                      Other
                    </option>
                    {state.eduCategory.length > 0 &&
                      state.eduCategory.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.eduCategoryID}
                            selected={state.selEduCategoryID === data.eduCategoryID ? true : false}
                          >
                            {data.eduCategoryName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.eduCategoryID && formik.errors.eduCategoryID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.eduCategoryID}</div>
                    </div>
                  )}
                </div>
                <label
                  className={
                    state.selEduCategoryID === 0 ? 'col-lg-3 col-form-label fw-bold fs-6' : 'd-none'
                  }
                >
                  <span className='required'>Other Category:</span>
                </label>
                <div className={state.selEduCategoryID === 0 ? 'col-lg-3 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Other Category'
                    {...formik.getFieldProps('otherCategory')}
                  />
                  {formik.touched.otherCategory && formik.errors.otherCategory && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.otherCategory}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-3 fv-row'>
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
              <Link
                to={{pathname:`/organization/employee/edit/${state.selEmployeeID}/education/list`,state:{search:state.mainSearch}}}
                className='btn btn-danger ms-3'
              >
                Close
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {AddEmployeeEducation}
