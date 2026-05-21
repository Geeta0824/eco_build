import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'

import {
  PenaltyTypeModel,
  penaltyTypeInitValues as initialValues,
} from '../../../models/master-page/PenaltyTypeModel'
import { getPenaltyTypeByPenaltyTypeID, updatePenaltyType } from '../../../modules/master-page/Penalty-Type-page/PenaltyTypeCRUD'

const profileDetailsSchema = Yup.object().shape({
  penaltyTypeName: Yup.string().required('Penalty Type is required'),
})

interface IPMCWorkStage {
  loading: boolean
  pmcWorkStageID: number
  mainSearch: string
}

const EditPenaltyType: React.FC = () => {
  const {penaltyTypeId} = useParams<{penaltyTypeId: string}>()
  const [data, setData] = useState<PenaltyTypeModel>(initialValues)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const updateData = (fieldsToUpdate: Partial<PenaltyTypeModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [state, setState] = useState<IPMCWorkStage>({
    loading: false,
    pmcWorkStageID: 0,
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
      getDesignStageDataByID(mainSearch)
    }, 100)
  }, [])

  function getDesignStageDataByID(mainSearch: string) {
    getPenaltyTypeByPenaltyTypeID(parseInt(penaltyTypeId))
      .then((response) => {
        if (response.data.isSuccess == true) {
          formik.setFieldValue('penaltyTypeName', response.data.penaltyTypeName)

          setState({...state, loading: false, mainSearch})
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, loading: false})
      })
  }

  const formik = useFormik<PenaltyTypeModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        updatePenaltyType(
          parseInt(penaltyTypeId),
          values.penaltyTypeName,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/master/penalty-type/list',
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
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      {' '}
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
            to={{pathname: '/master/penalty-type/list', state: {search: state.mainSearch}}}
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Penalty Type:</label>

                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Penaty Type'
                    {...formik.getFieldProps('penaltyTypeName')}
                  />
                  {formik.touched.penaltyTypeName && formik.errors.penaltyTypeName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.penaltyTypeName}</div>
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
              </button>{' '}
              <Link
                className='btn btn-danger ms-3'
                to={{pathname: '/master/penalty-type/list', state: {search: state.mainSearch}}}
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

export default EditPenaltyType
