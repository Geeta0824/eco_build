import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'

import {shallowEqual, useSelector} from 'react-redux'
import {
  SupportModel,
  SupportModelInitValues as initialValues,
} from '../../models/Support-page/SupportModel'
import {UserModel} from '../../modules/auth/models/UserModel'
import {RootState} from '../../../setup'
import {priorityData} from '../common-pages/CommonDropDown'
import {
  AddProjectTaskDetails_Outer_WithProjApi,
  HRMS_API_URL,
} from '../../modules/support/SupportCRUD'

const profileDetailsSchema = Yup.object().shape({
  taskName: Yup.string().required('Task Name Field is required'),
  description: Yup.string().required('Description Field is required'),
  priorityID: Yup.number()
    .min(1, 'Description Field is required')
    .required('Description Field is required'),
})

const AddSupport: React.FC = () => {
  const [data, setData] = useState<SupportModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [file, setFile] = useState('')
  const [searchName, setSearchName] = useState('')
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<SupportModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const location = useLocation()

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch !== undefined) {
        mainSearch = lc.mainSearch
      }
      setSearchName(mainSearch)
    }, 100)
  }, [])

  // const OnFileChange = (e: any) => {
  //   setFile(e.target.file)
  // }

  const imageUpload = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(HRMS_API_URL + '/ProjectTask/TaskDocument_Upload_Photo', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFile(data)
        setFileLoader(false)
      })
      .catch((err) => {
        //  console.log(err)
        setFileLoader(false)
      })
  }

  const formik = useFormik<SupportModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        AddProjectTaskDetails_Outer_WithProjApi(
          10010,
          2,
          values.taskName,
          values.description,
          null,
          null,
          27,
          1,
          values.priorityID,
          '',
          // 2,
          file,
          true,
          10012,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Created Successfull')
              history.push({pathname: '/support/list', state: {search: searchName}})
            } else {
              toast.error(`${response.data.message}`)
            }
          })
          .catch((error) => {
            toast.error(`${error}`)
          })
        setLoading(false)
      }, 1000)
    },
  })
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'priorityID') {
      formik.setFieldValue('priorityID', parseInt(value))
    }
  }

  return (
    <>
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
            to={{pathname: '/support/list', state: {mainSearch: searchName}}}
          >
            Back To List
          </Link>
        </span>
      </div>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Title:</label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Task name'
                    {...formik.getFieldProps('taskName')}
                  />
                  {formik.touched.taskName && formik.errors.taskName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.taskName}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Description:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={4}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Description...'
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.description}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Upload File:</span>
                </label>
                <div className='col-lg-2 d-flex align-items-center'>
                  <div className='symbol symbol-45px me-5'>
                    <img src={HRMS_API_URL + file} alt='img' />
                  </div>
                </div>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='file'
                    accept='image/*'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload(e)}
                  />
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Priority Name:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='priorityID'
                  >
                    <option selected value='0'>
                      Select Priority
                    </option>
                    {priorityData.length > 0 &&
                      priorityData.map((data, index) => {
                        return (
                          <option key={index} value={data.priorityId}>
                            {data.priorityName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.priorityID && formik.errors.priorityID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.priorityID}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <button type='submit' className='btn btn-primary' disabled={loading || fileLoader}>
                {!loading && !fileLoader && 'Save'}
                {(loading || fileLoader) && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>{' '}
              <Link
                className='btn btn-danger ms-3'
                to={{pathname: '/support/list', state: {mainSearch: searchName}}}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {AddSupport}
