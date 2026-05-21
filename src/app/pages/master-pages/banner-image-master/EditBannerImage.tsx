import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Link, useHistory, useParams} from 'react-router-dom'
import {
  IBannerImageModel,
  bannerImageInitValues as initialValues,
} from '../../../models/master-page/IBannerImageModel'
import {
  getBannerImageByBannerId,
  updateBannerImageApi,
} from '../../../modules/master-page/banner-image-master-page/BannerImageCRUD'
import {
  getBannerImageByBannerId_new,
  updateBannerImageApi_new,
} from '../../../modules/master-page/banner-image-master-page/BannerImageNewCRUD'
const profileDetailsSchema = Yup.object().shape({
  bannerTitle: Yup.string().required('Banner title is required'),
})

interface IItem {
  loading: boolean
  bannerImageData: IBannerImageModel[]
}

const EditBannerImage: React.FC = () => {
  const [data, setData] = useState<IBannerImageModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filePath, setFilePath] = useState('')
  const {bannerId} = useParams<{bannerId: string}>()
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<IBannerImageModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IItem>({
    loading: false,
    bannerImageData: [] as IBannerImageModel[],
  })
  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getBannerImageByBannerImageIDData()
    }, 100)
  }, [])

  const checkedFunction = (event: any) => {
    setIsActive(event.target.checked)
  }
  function getBannerImageByBannerImageIDData() {
    let values = {bannerID: parseInt(bannerId)}
    var objEmp = btoa(JSON.stringify(values))
    console.log(values)
    getBannerImageByBannerId_new(`${objEmp}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        console.log(decodeResp)
        let resp = decodeResp
        if (resp.isSuccess == true) {
          formik.setFieldValue('bannerID', resp.bannerID)
          formik.setFieldValue('bannerTitle', resp.bannerTitle)

          setFilePath(resp.bannerPath)
          setIsActive(resp.isActive)
        } else {
          toast.error(`${resp.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  const imageUpload = (e: any) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)

    fetch(process.env.REACT_APP_API_URL + '/Banner/Banner_Upload_photo', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFilePath(data)
      })
  }

  const formik = useFormik<IBannerImageModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const edit = window.confirm('Are you sure you want to update selected record')
        if (edit) {
          const updatedValues = {
            ...values,
            bannerPath: filePath,
            isActive: isActive,
            updateBy: user.employeeID,
            bannerId: parseInt(bannerId),
          }
          console.log(updatedValues)
          var objEmp = btoa(JSON.stringify(updatedValues))
          updateBannerImageApi_new(`${objEmp}`)
            .then((response) => {
              var decodeResp = JSON.parse(atob(response.data.encodedResponse))
              let resp = decodeResp
              if (resp.isSuccess === true) {
                toast.success('Updated Successfulll')
                history.push('/master/bannerimage/list')
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
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Title:</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter  Title'
                    {...formik.getFieldProps('bannerTitle')}
                  />
                  {formik.touched.bannerTitle && formik.errors.bannerTitle && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.bannerTitle}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Select Photo:</span>
                  {/* <p className='text-muted fs-7'> (allow only .png files)</p> */}
                </label>
                <div className={filePath === '' ? 'd-none' : 'col-lg-1 d-flex align-items-center'}>
                  <div className='symbol symbol-45px me-5'>
                    <img src={process.env.REACT_APP_API_URL + filePath} alt='img' />
                  </div>
                </div>
                <div className={filePath === '' ? 'col-lg-8 fv-row' : 'col-lg-7 fv-row'}>
                  <input
                    type='file'
                    accept='image/*'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUpload(e)}
                  />
                </div>
              </div>
              {/* / </div> */}
              {/* </div> */}

              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-4'
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
                {!loading && 'Submit'}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
              <Link className='btn btn-danger ms-3' to='/master/bannerimage/list'>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export {EditBannerImage}
