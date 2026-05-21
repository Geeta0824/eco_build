import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import {useHistory, useLocation} from 'react-router-dom'
import {GetProjectTypeDropdownListAPI} from '../../../../modules/project-master-page/project-master/ProjectCRUD'
import {IBHKMasterModel} from '../../../../models/master-page/IBHKMasterModel'
import {IProjectTypeodel} from '../../../../models/projects-page/IProjectsModel'
import {getActiveBHKApi} from '../../../../modules/master-page/bhk-master-page/NewBHKCRUD'
import {
  GetAreaPriceByAreaRateIDAPI,
  UpdateAreaPriceByAreaIDAPI,
  getPlanAreaByBhkIDAndProjectTypeIDAPI,
} from '../../../../modules/product-master-page/plan-area-master-page/AreaPriceCRUD'
import {
  AreaPriceModel,
  IAreaSqftModel,
  areaPriceInitValue as initialValues,
} from '../../../../models/product-page/AreaPriceModel'
import Search from 'antd/es/transfer/search'

const profileDetailsSchema = Yup.object().shape({
  areaRate: Yup.number().required('Area Rate is required').min(1, 'Area Rate is required'),
})

interface IUpgrade {
  loading: boolean
  bhkData: IBHKMasterModel[]
  ProjectTypeData: IProjectTypeodel[]
  areaSqftData: IAreaSqftModel[]
  selBHKID: number
  selProjectTypeID: number
  selAreaID: number
  selAreaRateID: number
  selCarpetArea: string
  selBhkName: string
  selProjectTypeName: string
  mainSearch: string
}

const EditArea: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<AreaPriceModel>(initialValues)
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const updateData = (fieldsToUpdate: Partial<AreaPriceModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IUpgrade>({
    loading: false,
    bhkData: [] as IBHKMasterModel[],
    ProjectTypeData: [] as IProjectTypeodel[],
    areaSqftData: [] as IAreaSqftModel[],
    selBHKID: 0,
    selProjectTypeID: 0,
    selAreaID: 0,
    selAreaRateID: 0,
    selCarpetArea: '',
    selBhkName: '',
    selProjectTypeName: '',
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      if (!lc) {
        setState({...state, loading: false}) // Handle case where location.state is undefined
        return
      }
      console.log(lc)
      let AreaID = lc.AreaID
      let AreaRateID = lc.areaRateID
      let CarpetArea = lc.CarpetArea
      let BhkName = lc.BhkName
      let ProjectTypeName = lc.ProjectTypeName
var mainSearch=lc.mainSerach
      getAreaPriceListDataByAreaRateID(
        AreaID,
        AreaRateID,
        CarpetArea,
        BhkName,
        ProjectTypeName,
        mainSearch
      )
      // getProjectTypeData(AreaID, AreaRateID, CarpetArea, BhkName, ProjectTypeName)
    }, 100)
  }, [])

  function getAreaPriceListDataByAreaRateID(
    AreaID: number,
    AreaRateID: number,
    CarpetArea: string,
    BhkName: string,
    ProjectTypeName: string,
    mainSearch: string
  ) {
    GetAreaPriceByAreaRateIDAPI(AreaRateID)
      .then((response) => {
        const responseData = response.data
        if (response.data.isSuccess) {
          formik.setFieldValue('bhkID', responseData.bhkID)
          formik.setFieldValue('projectTypeID', responseData.projectTypeID)
          formik.setFieldValue('areaRate', responseData.areaRate)
          setState({
            ...state,
            selAreaID: AreaID,
            selAreaRateID: AreaRateID,
            selBHKID: responseData.bhkID,
            selCarpetArea: CarpetArea,
            selBhkName: BhkName,
            selProjectTypeName: ProjectTypeName,
            mainSearch,
            selProjectTypeID: responseData.projectTypeID,
            loading: false, // Add this line to stop loading
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, ProjectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, bhkData: [], loading: false})
      })
  }

  function getProjectTypeData(
    AreaID: number,
    AreaRateID: number,
    CarpetArea: string,
    BhkName: string,
    ProjectTypeName: string
  ) {
    GetProjectTypeDropdownListAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getBHKData(responseData, AreaID, AreaRateID, CarpetArea, BhkName, ProjectTypeName)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, ProjectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, ProjectTypeData: [], loading: false})
      })
  }
  function getBHKData(
    ProjectTypeData: IProjectTypeodel[],
    AreaID: number,
    AreaRateID: number,
    CarpetArea: string,
    BhkName: string,
    ProjectTypeName: string
  ) {
    getActiveBHKApi()
      .then((response) => {
        // let responseData = response.data.responseObjectresp
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          let responseData = resp.responseObjectresp
          // getAreaPriceListDataByAreaRateID(
          //   ProjectTypeData,
          //   AreaID,
          //   AreaRateID,
          //   responseData,
          //   CarpetArea,
          //   BhkName,
          //   ProjectTypeName
          // )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, ProjectTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, bhkData: [], loading: false})
      })
  }

  // function getAreaPriceListDataByAreaRateID(
  //   ProjectTypeData: IProjectTypeodel[],
  //   AreaID: number,
  //   AreaRateID: number,
  //   bhkData: IBHKMasterModel[],
  //   CarpetArea: string,
  //   BhkName: string,
  //   ProjectTypeName: string
  // ) {
  //   GetAreaPriceByAreaRateIDAPI(AreaRateID)
  //     .then((response) => {
  //       const responseData = response.data
  //       if (response.data.isSuccess == true) {
  //         formik.setFieldValue('bhkID', responseData.bhkID)
  //         formik.setFieldValue('projectTypeID', responseData.projectTypeID)
  //         formik.setFieldValue('areaRate', responseData.areaRate)
  //         setState({
  //           ...state,
  //           bhkData: bhkData,
  //           selAreaID: AreaID,
  //           selAreaRateID: AreaRateID,
  //           ProjectTypeData: ProjectTypeData,
  //           selBHKID: responseData.bhkID,
  //           selCarpetArea: CarpetArea,
  //           selBhkName: BhkName,
  //           selProjectTypeName: ProjectTypeName,
  //           selProjectTypeID: responseData.projectTypeID,
  //         })
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, ProjectTypeData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       toast.error(`${error}`)
  //       setState({...state, bhkData: [], loading: false})
  //     })
  // }

  function getAreaSquireFitByBhkID(temBhkID: number) {
    getPlanAreaByBhkIDAndProjectTypeIDAPI(state.selProjectTypeID, temBhkID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({...state, areaSqftData: responseData, selBHKID: temBhkID, loading: false})
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, areaSqftData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, areaSqftData: [], loading: false})
      })
  }

  function getAreaSquireFitByProjectTypeID(temProjectTypeID: number) {
    getPlanAreaByBhkIDAndProjectTypeIDAPI(temProjectTypeID, state.selBHKID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            areaSqftData: responseData,
            selProjectTypeID: temProjectTypeID,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, areaSqftData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, areaSqftData: [], loading: false})
      })
  }

  // =================== For Asseccories ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = state.areaSqftData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].carpetAreaID) {
        if (isChecked) {
          tmpTechno[k].isMember = 1
        } else {
          tmpTechno[k].isMember = 0
        }
        break
      }
    }
    setState({
      ...state,
      areaSqftData: tmpTechno,
    })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'projectTypeID') {
      formik.setFieldValue('projectTypeID', parseInt(value))
      getAreaSquireFitByProjectTypeID(parseInt(value))
    } else if (elementId === 'bhkid') {
      formik.setFieldValue('bhkid', parseInt(value))
      getAreaSquireFitByBhkID(parseInt(value))
    }
  }

  const formik = useFormik<AreaPriceModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        let tmpTech = state.areaSqftData
        let strSelTechid: string = ''
        for (let k in tmpTech) {
          if (tmpTech[k].isMember === 1) {
            if (strSelTechid === '') {
              strSelTechid = `${tmpTech[k].carpetAreaID}`
            } else {
              strSelTechid = strSelTechid + ',' + `${tmpTech[k].carpetAreaID}`
            }
          }
        }
        UpdateAreaPriceByAreaIDAPI(
          state.selAreaRateID,
          values.areaRate,
          user.employeeID,
          '192.66.22'
        )
          .then((response: {data: {isSuccess: boolean; message: any}}) => {
            if (response.data.isSuccess) {
              toast.success('Updated Successfully')
              history.push({
                pathname: `/p-product/plan-area/${state.selAreaID}/list`,
                state: {
                  planAreaID: state.selAreaID,
                  AreaRateID: state.selAreaRateID,
                  search: state.mainSearch,
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
      {' '}
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                  <span className=''>Project Type:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <span className='form-control form-control-lg form-control-solid bg-white border-0'>
                    {state.selProjectTypeName}
                  </span>
                </div>
              </div>
              <div className='row mb-6'>
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                  <span className=''>BHK Name:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <span className='form-control form-control-lg form-control-solid bg-white border-0'>
                    {state.selBhkName}
                  </span>
                </div>
              </div>
              <div className='row mb-6'>
                <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                  <span className=''>Area Sqft:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <span className='form-control form-control-lg form-control-solid bg-white border-0'>
                    {state.selCarpetArea}
                  </span>
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Rate:</span>
                </label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Rate '
                    {...formik.getFieldProps('areaRate')}
                  />
                  {formik.touched.areaRate && formik.errors.areaRate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.areaRate}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* ===================================================================== */}
              {/* <Container className='ms-10 mt-2'>
                <Row>
                  {state.areaSqftData.length > 0 &&
                    state.areaSqftData.map((item, index) => (
                      <Col xs={6} md={2} key={index}>
                        <div className='form-check form-check-custom form-check-solid mb-5'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id={`${item.carpetAreaID}`}
                            value={item.carpetArea}
                            name={item.carpetArea}
                            checked={item.isMember === 1 ? true : false}
                            onChange={(e) => SetStatus(e)}
                          />
                          <label className='form-check-label' htmlFor='flexCheckDefault'>
                            {item.carpetArea}
                          </label>
                        </div>
                      </Col>
                    ))}
                </Row>
              </Container> */}
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
                onClick={() => {
                  console.log('Cancel button clicked')
                  console.log('state.selAreaID:', state.selAreaID)
                  console.log('state.selAreaRateID:', state.selAreaRateID)
                  console.log('state.mainSearch:', state.mainSearch)
                  history.push({
                    pathname: `/p-product/plan-area/${state.selAreaID}/list`,
                    state: {
                      planAreaID: state.selAreaID,
                      AreaRateID: state.selAreaRateID,
                      search: state.mainSearch,
                    },
                  })
                }}
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
export {EditArea}
