import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {IEduDepartmentModel} from '../../../../models/master-page/IEducationDepartmentModel'
import {IEmployeeWebModel} from '../../../../models/organization-page/Employee/IEmployeeModel'
import {IEduCategoryModel} from '../../../../models/master-page/IEducationCategoryModel'
import {
  IEmployeeEducationModel,
  employeeEducationInitValue as initialValues,
} from '../../../../models/organization-page/Employee/IEmployeeEducationModel'
import {getDropDownEduDepartment} from '../../../../modules/master-page/education-department-master-page/EducationDepartmentCRUD'
import {getDropDownEduCategory} from '../../../../modules/master-page/education-category-master-page/EducationCategoryCRUD'
import {
  getEmpEducationById,
  updateEmpEducation,
} from '../../../../modules/organization-page/employee-master-page/education-details/EmployeeEducationCRUD'
import Loader from '../../../common-pages/Loader'

const profileDetailsSchema = Yup.object().shape({
  instituteName: Yup.string().required('Institute Name is required'),
  // eduDepartmentID: Yup.number()
  //   .required('Department is required')
  //   .min(1, 'Department is required'),
  eduCategoryID: Yup.number().required('Category is required').min(0, 'Category is required'),
  passingYear: Yup.string().required('Passing Year is required'),
  percentage: Yup.string().required('Persentage is required'),
})

interface IEduDepartment {
  eduDepartment: IEduDepartmentModel[]
  eduCategory: IEduCategoryModel[]
  selDepartment: number
  selCategory: number
  selEmpId: number
  mainSearch: string
  loading: boolean
}

const EditEmployeeEducation: React.FC = () => {
  const [state, setState] = useState<IEduDepartment>({
    eduDepartment: [] as IEduDepartmentModel[],
    eduCategory: [] as IEduCategoryModel[],
    selDepartment: 0,
    selCategory: -1,
    selEmpId: 0,
    mainSearch: '',
    loading: false,
  })
  const location = useLocation()
  const history = useHistory()
  const [isActive, setIsActive] = useState(false)
  const {educationID} = useParams<{educationID: string}>()
  const {employeeID} = useParams<{employeeID: string}>()
  const [data, setData] = useState<IEmployeeEducationModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IEmployeeEducationModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

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
      getEduDepartment(parseInt(employeeID), mainSearch)
    }, 100)
  }, [])

  function getEduDepartment(finalempID: number, mainSearch: string) {
    getDropDownEduDepartment()
      .then((response) => {
        let responseEduData = response.data.responseObject
        getEduCategory(finalempID, responseEduData, mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, eduDepartment: []})
      })
  }

  function getEduCategory(
    finalempID: number,
    tmpEduDeptData: IEduDepartmentModel[],
    mainSearch: string
  ) {
    getDropDownEduCategory()
      .then((response) => {
        let responseCategoryData = response.data.responseObject
        getEmpEducatonDataById(finalempID, tmpEduDeptData, responseCategoryData, mainSearch)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, eduCategory: [], eduDepartment: []})
      })
  }

  function getEmpEducatonDataById(
    finalempID: number,
    tmpEduDeptData: IEduDepartmentModel[],
    tmpEduCatData: IEduCategoryModel[],
    mainSearch: string
  ) {
    getEmpEducationById(educationID)
      .then((response) => {
        formik.setFieldValue('instituteName', response.data.instituteName)
        formik.setFieldValue('eduDepartmentID', response.data.eduDepartmentID)
        formik.setFieldValue('subjectName', response.data.subjectName)
        formik.setFieldValue('eduCategoryID', response.data.eduCategoryID)
        formik.setFieldValue('employeeID', response.data.employeeID)
        formik.setFieldValue('passingYear', response.data.passingYear)
        formik.setFieldValue('percentage', response.data.percentage)
        formik.setFieldValue('otherCategory', response.data.otherCategory)
        setIsActive(response.data.isActive)
        setState({
          ...state,
          mainSearch,
          eduCategory: tmpEduCatData,
          eduDepartment: tmpEduDeptData,
          selDepartment: response.data.eduDepartmentID,
          selCategory: response.data.eduCategoryID,
          selEmpId: finalempID,
          loading: false,
        })
      })
      .catch((error) => {
        toast.error(`${error}`)
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
      setState({...state, selCategory: parseInt(value)})
    }
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IEmployeeEducationModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const edit = window.confirm('Are You Sure to Update')
        if (edit) {
          updateEmpEducation(
            parseInt(educationID),
            values.instituteName,
            values.subjectName,
            // values.eduDepartmentID,
            0,
            values.eduCategoryID,
            state.selEmpId,
            values.passingYear,
            values.percentage,
            isActive,
            values.otherCategory
          )
            .then((response) => {
              toast.success('Updated Successfull')
              history.push({
                pathname: `/organization/employee/edit/${state.selEmpId}/education/list`,
                state: {search: state.mainSearch},
              })
              setLoading(false)
            })
            .catch((error) => {
              toast.error(`${error}`)
              setLoading(false)
            })
        } else {
          return setLoading(false)
        }
        // const updatedData = Object.assign(data, values)
        // setData(updatedData)
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Institute Name:
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Employee Institute Name'
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
                    <option selected value='0'>
                      Select Education Department
                    </option>
                    {state.eduDepartment.length > 0 &&
                      state.eduDepartment.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.eduDepartmentID}
                            selected={data.eduDepartmentID === state.selDepartment ? true : false}
                          >
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
                    className='form-control form-control-lg form-control-solid'
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
                    type='number'
                    min='0'
                    className='form-control form-control-lg form-control-solid'
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
                    <option selected={state.selCategory === -1 ? true : false} value={-1}>
                      Select Education Category
                    </option>
                    <option selected={state.selCategory === 0 ? true : false} value={0}>
                      Other
                    </option>
                    {state.eduCategory.length > 0 &&
                      state.eduCategory.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.eduCategoryID}
                            selected={data.eduCategoryID === state.selCategory ? true : false}
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
                    state.selCategory === 0 ? 'col-lg-3 col-form-label fw-bold fs-6' : 'd-none'
                  }
                >
                  <span className='required'>Other Category:</span>
                </label>
                <div className={state.selCategory === 0 ? 'col-lg-3 fv-row' : 'd-none'}>
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
                      checked={isActive}
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
                to={{
                  pathname: `/organization/employee/edit/${state.selEmpId}/education/list`,
                  state: {search: state.mainSearch},
                }}
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

export {EditEmployeeEducation}
