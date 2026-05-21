import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {IPMCAssignRequestModel} from '../../../../models/projects-page/IPMCAssignRequestModel'
import {Button, Modal} from 'react-bootstrap-v5'
import {
  PMC_Assign_Req_Response_By_AdminApi,
  Req_ProjectID_With_VendorIDApi,
  getProjectRequestListToPMC,
} from '../../../../modules/project-master-page/project-master/pmc-assign-req-master-pages/PMCAssignReqCRUD'
import {valueContainerCSS} from 'react-select/dist/declarations/src/components/containers'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import moment from 'moment'
import {KTSVG} from '../../../../../_Ecd/helpers'

type Props = {}

interface IProjectVendor {
  loading: boolean
  PMCAssignRequestData: IPMCAssignRequestModel[]
  tmpPMCAssignRequestData: IPMCAssignRequestModel[]
  objPMCAssignReqData: IPMCAssignRequestModel
  selProjectAdditionalItemID: number
  activeID: number
  activeType: any
  imageShow: string
  selvendorTypeID: number
  projName: string
  customerName: string
  pathUrl: string
  projectID: number
  amount: number
  selStatusID: number
  currentDate: string
  mainSearchText: string
}

const PMCAssignRequestList: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IProjectVendor>({
    loading: false,
    PMCAssignRequestData: [] as IPMCAssignRequestModel[],
    tmpPMCAssignRequestData: [] as IPMCAssignRequestModel[],
    objPMCAssignReqData: {} as IPMCAssignRequestModel,
    selProjectAdditionalItemID: 0,
    activeID: 0,
    activeType: false,
    imageShow: '',
    selvendorTypeID: 0,
    projName: '',
    customerName: '',
    pathUrl: '',
    projectID: 0,
    amount: 0,
    selStatusID: 1,
    currentDate: moment(new Date()).format('YYYY-MM-DD'),
    mainSearchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let projectID: any = lc.projectID
      let customerName: any = lc.customerName
      var mainSearchText: any = ''
      if (lc != undefined) {
        mainSearchText = lc.searchText
      }
      getProjectReqListData(projName, customerName, projectID, mainSearchText)
    }, 100)
  }, [])

  function getProjectReqListData(
    projName: string,
    customerName: string,
    projectID: number,
    mainSearchText: string
  ) {
    getProjectRequestListToPMC(projectID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          let tmplstCheckedOutputData = [] as IPMCAssignRequestModel[]
          let resultOptputObj: IPMCAssignRequestModel[] = responseData
          for (let k in resultOptputObj) {
            let tmpCheckedData: IPMCAssignRequestModel = {
              vendorTypeID: resultOptputObj[k]['vendorTypeID'],
              vendorID: resultOptputObj[k]['vendorID'],
              email: resultOptputObj[k]['email'],
              companyName: resultOptputObj[k]['companyName'],
              contactPerson: resultOptputObj[k]['contactPerson'],
              gstNumber: resultOptputObj[k]['gstNumber'],
              aboutVendor: resultOptputObj[k]['aboutVendor'],
              contactNumber: resultOptputObj[k]['contactNumber'],
              address: resultOptputObj[k]['address'],
              isActive: resultOptputObj[k]['isActive'],
              vendorStatusID: resultOptputObj[k]['vendorStatusID'],
              isSent: resultOptputObj[k]['isSent'],
              isSelected: resultOptputObj[k]['isSent'] == true ? 1 : 0,
            }
            tmplstCheckedOutputData.push(tmpCheckedData)
          }
          setState({
            ...state,
            PMCAssignRequestData: tmplstCheckedOutputData,
            tmpPMCAssignRequestData: tmplstCheckedOutputData,
            projName: projName,
            customerName: customerName,
            projectID: projectID,
            selStatusID: response.data.statusID,
            loading: false,
            mainSearchText,
          })
          setAmount(response.data.projectCost)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            PMCAssignRequestData: [],
            tmpPMCAssignRequestData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          PMCAssignRequestData: [],
          tmpPMCAssignRequestData: [],
          loading: false,
        })
      })
  }

  // =================== For Selection ==============
  function setSelectedHandle(e: any) {
    let uid = e.target.id
    let isChecked = e.target.checked
    let tmpProjData = state.PMCAssignRequestData
    for (let k in tmpProjData) {
      if (parseInt(uid) == tmpProjData[k].vendorID) {
        if (isChecked) {
          tmpProjData[k].isSelected = 1
        } else {
          tmpProjData[k].isSelected = 0
        }
        break
      }
    }
    setState({...state, PMCAssignRequestData: tmpProjData})
  }
  // ----------- Select Handle Change  -----------
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'statusID') {
      setState({...state, selStatusID: parseInt(value)})
    }
  }
  // ------------ Amount Handle Func ----------------
  const [amount, setAmount] = useState<string>('')
  function handleAmount(e: any) {
    let tmpAmount = e.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpAmount)) && re.test(tmpAmount)) {
      setAmount(tmpAmount)
    } else if (tmpAmount == '') {
      setAmount('')
    }
  }

  // ------------------------------------
  const [loading, setloading] = useState<boolean>(false)
  function handleSubmit() {
    setloading(true)
    if (amount === '' || parseInt(amount) <= 0) {
      setloading(false)
      return toast.error('Amount field is required')
    } else {
      let tmpVendorIds: string = ''
      let tmpProjData = state.PMCAssignRequestData
      for (let k in tmpProjData) {
        if (tmpProjData[k].isSelected == 1) {
          if (tmpVendorIds == '') {
            tmpVendorIds = `${tmpProjData[k].vendorID}`
          } else {
            tmpVendorIds = tmpVendorIds + ',' + `${tmpProjData[k].vendorID}`
          }
        }
      }

      Req_ProjectID_With_VendorIDApi(
        state.projectID,
        tmpVendorIds,
        user.employeeID,
        '1',
        parseInt(amount),
        `${state.selStatusID}`,
        user.employeeID,
        '123'
      )
        .then((response) => {
          if (response.data.isSuccess == true) {
            toast.success('Created Successfull')
            history.push({
              pathname: '/projects/project/list',
              state: {searchText: state.mainSearchText},
            })
            setAmount('')
            setloading(false)
          } else {
            toast.error(`${response.data.message}`)
            setloading(false)
            // setAmount(0)
          }
        })
        .catch((error) => {
          toast.error(`${error}`)
          setloading(false)
        })
    }
  }

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => {
    setState({...state, objPMCAssignReqData: {} as IPMCAssignRequestModel})
    setShow(false)
  }
  const handleShow = (data: IPMCAssignRequestModel) => {
    setState({...state, objPMCAssignReqData: data})
    setShow(true)
  }

  // -------------Accepted Add Api -------------
  function assignProjectToVendor(data: IPMCAssignRequestModel) {
    PMC_Assign_Req_Response_By_AdminApi(
      state.projectID,
      data.vendorID,
      state.currentDate,
      'Project Accept By Admin',
      '',
      parseInt(amount),
      0,
      parseInt(amount),
      user.employeeID,
      '192.66.22'
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Assigned Project Successfully')
          setAmount('')
          history.push({
            pathname: '/projects/project/list',
            state: {searchText: state.mainSearchText},
          })
          setloading(false)
        } else {
          toast.error(`${response.data.message}`)
          setloading(false)
          // setAmount(0)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setloading(false)
      })
  }

  return (
    <>
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => history.push({
            pathname: '/projects/project/list',
            state: {searchText: state.mainSearchText},
          })}
        >
          Back To Main List
        </span>
      </div>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='col-8 text-start'>
            <label className='text-white fs-5 mt-1 fw-bold '>Project Name : &nbsp;</label>
            <span className='text-primary fw-bold  fs-5 '>{state.projName}</span>
          </div>
          <div className='col-8 text-start'>
            <label className='text-white fs-5 mt-1 fw-bold '>Customer Name : &nbsp;</label>
            <span className='text-primary fw-bold  fs-5 '>{state.customerName}</span>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th></th>
                  <th className='min-w-75px'>Company Name</th>
                  <th className='min-w-55px'>Contact Person</th>
                  <th className='min-w-75px'>Contact Number</th>
                  <th className='min-w-75px'>Email</th>
                  <th className='min-w-75px'>Response</th>
                  <th className='min-w-75px'>Assign</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {state.PMCAssignRequestData.length > 0 &&
                  state.PMCAssignRequestData.map((data, index) => {
                    return (
                      <tr key={data.vendorID}>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'>
                            <input
                              className='form-check-input widget-9-check'
                              type='checkbox'
                              checked={data.isSelected == 1 ? true : false}
                              disabled={data.isSent === true ? true : false}
                              id={`${data.vendorID}`}
                              onChange={(e) => setSelectedHandle(e)}
                            />
                          </div>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.companyName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.contactPerson}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.contactNumber}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.email}
                          </span>
                        </td>
                        <td className=' text-center'>
                          <div
                            className={`badge badge-light${
                              data.vendorStatusID === 1
                                ? '-primary'
                                : data.vendorStatusID === 2
                                ? '-success'
                                : data.vendorStatusID === 3
                                ? '-danger'
                                : ''
                            } fw-bold me-1`}
                          >
                            {data.vendorStatusID === 1
                              ? 'Generated'
                              : data.vendorStatusID === 2
                              ? 'Accepted'
                              : data.vendorStatusID === 3
                              ? 'Rejected'
                              : 'N.A.'}
                          </div>
                        </td>
                        <td className='text-center'>
                          {data.vendorStatusID === 2 && state.selStatusID !== 2 ? (
                            <span
                              className='btn btn-icon btn-bg-light pulse2-grow-on-hover bg-hover-primary text-hover-inverse-primary btn-sm me-2'
                              data-bs-toggle='tooltip'
                              data-bs-placement='top'
                              title='Assign'
                              onClick={() => handleShow(data)}
                            >
                              <KTSVG
                                path='/media/icons/duotune/arrows/arr016.svg'
                                className='svg-icon-2x svg-icon-primary'
                              />
                            </span>
                          ) : (
                            'N.A.'
                          )}
                        </td>
                      </tr>
                    )
                  })}
                <tr className='text-dark g-3'>
                  <td className='text-end fw-bolder required fs-6' colSpan={2}>
                    Project Amount :
                  </td>
                  <td className='border-dark text-start fw-bolder fs-6'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid border border-2 bg-light-primary'
                      placeholder='0'
                      value={amount}
                      autoFocus
                      id='amount'
                      onChange={(e) => handleAmount(e)}
                    />
                  </td>
                  <td className='text-end fw-bolder fs-6'>Status :</td>
                  <td className='border-dark text-start fw-bolder fs-6'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='statusID'
                    >
                      <option selected={state.selStatusID === 0 ? true : false} value={0}>
                        Select Status
                      </option>
                      <option selected={state.selStatusID === 1 ? true : false} value={1}>
                        Open
                      </option>
                      <option selected={state.selStatusID === 2 ? true : false} value={2}>
                        Close
                      </option>
                    </select>
                  </td>
                  <td colSpan={2}></td>
                </tr>
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={state.PMCAssignRequestData.length}
                  loading={state.loading}
                  colSpan={9}
                />
              </tbody>
            </table>
            <div className='card-footer d-flex justify-content-end py-6 px-9'>
              <Button
                variant='primary'
                className='text-center'
                disabled={loading || state.selStatusID == 2}
                onClick={handleSubmit}
              >
                Send Request
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} backdrop='true' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Project Assign to Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>
            Are you sure you want to assign project to {state.objPMCAssignReqData.companyName}
            {state.objPMCAssignReqData.contactPerson}
          </h4>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='success'
            onClick={() => assignProjectToVendor(state.objPMCAssignReqData)}
          >
            Assign
          </Button>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export {PMCAssignRequestList}
