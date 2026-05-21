import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {shallowEqual, useSelector} from 'react-redux'
import {useHistory, useLocation} from 'react-router-dom'
import {UserModel} from '../../modules/auth/models/UserModel'
import {KTSVG} from '../../../_Ecd/helpers'
import {RootState} from '../../../setup'
import {IDescModel, ICustomerListModel} from '../../models/Customer-Complain/IComplainReqModel'
import {IAgencyTypeDropdownModel} from '../../models/master-page/IComplainModel'
import {getAllAgencyType} from '../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import {
  CreateCustomerComplainReq,
  GetComplainDescriptionlist,
  GetCustomerListForComplainReq,
} from '../../modules/customer-complain-master-page/CustomerComplainCRUD'
import {Pagination} from 'antd'
import Loader from '../common-pages/Loader'

interface IDepartment {
  loading: boolean
  agencyTypeData: IAgencyTypeDropdownModel[]
  complainCheckData: IDescModel[]
  customerData: ICustomerListModel[]
  temCustomerData: ICustomerListModel[]
  selAgencyTypeID: number
  selProjectID: number
  selCustomerID: number
  temComplnID: string
  mainSearch: string
}

const AddCustomerComplain: React.FC = () => {
  const location = useLocation()
  const [fileLoader, setFileLoader] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [projectName, setProjectName] = useState('')
  const history = useHistory()

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IDepartment>({
    loading: false,
    agencyTypeData: [] as IAgencyTypeDropdownModel[],
    complainCheckData: [] as IDescModel[],
    customerData: [] as ICustomerListModel[],
    temCustomerData: [] as ICustomerListModel[],
    selAgencyTypeID: 0,
    selProjectID: 0,
    selCustomerID: 0,
    temComplnID: '',
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
      getAllagencyTypeData(mainSearch)
    }, 100)
  }, [])

  function getAllagencyTypeData(mainSearch: string) {
    getAllAgencyType()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            agencyTypeData: responseData,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, agencyTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, agencyTypeData: [], loading: false})
      })
  }

  function handleShowComplainDesc(agencyTypeID: number) {
    GetComplainDescriptionlist(agencyTypeID)
      .then((response) => {
        const resComplainMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          let tmplstCheckedOutputData = []
          let resultOptputObj = resComplainMapData
          for (let k in resultOptputObj) {
            let tmpCheckedData = {
              complainID: resultOptputObj[k]['complainID'],
              complainDescription: resultOptputObj[k]['complainDescription'],
              isMember: 0,
              photoPath: '',
            }
            tmplstCheckedOutputData.push(tmpCheckedData)
          }
          setState({
            ...state,
            complainCheckData: tmplstCheckedOutputData,
            selAgencyTypeID: agencyTypeID,
            loading: false,
          })
        } else {
          setState({
            ...state,
            complainCheckData: resComplainMapData,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, complainCheckData: [], loading: false})
      })
  }

  // =================== For Area ==========================
  function AreaProjectItem(tech: IDescModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    let strSelPhotos: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isMember === 1) {
        if (strSelTechid == '') {
          strSelTechid = `${tmpTech[k].complainID}`
          strSelPhotos = `${tmpTech[k].photoPath}`
        } else {
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].complainID}`
          strSelPhotos = strSelPhotos + ',' + `${tmpTech[k].photoPath}`
        }
      }
    }
    addAreaByTurnkeyProductMstID(strSelTechid, strSelPhotos)
  }

  const [description, setDescription] = useState<string>('')
  function handleDescription(event: any) {
    const tmpDes = event.target.value
    setDescription(tmpDes)
  }

  // ------------------------------
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = state.complainCheckData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].complainID) {
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
      complainCheckData: tmpTechno,
    })
  }

  // --------------------------
  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'agencyTypeID') {
      handleShowComplainDesc(parseInt(value))
    }
  }

  // -----------------upload photo----------------------
  const imageUpload = (e: any) => {
    const elementId = e.target.id
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(
      process.env.REACT_APP_API_URL +
        `/CustomerComplain/UploadComplainPhotoPath/${state.selProjectID}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        let tmpTechno = state.complainCheckData
        for (let k in tmpTechno) {
          if (elementId == tmpTechno[k].complainID) {
            tmpTechno[k].photoPath = data
            break
          }
        }
        setState({
          ...state,
          complainCheckData: tmpTechno,
        })
        setFileLoader(false)
      })
  }

  // -----------------Customer Select-------------------
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    GetCustomerListForComplainReq()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            customerData: responseData,
            temCustomerData: responseData,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, customerData: [], loading: false})
        }
        setTotal(responseData.length)
        setPage(1)
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, customerData: [], loading: false})
      })
    setShow(true)
  }

  // --------For Model Data onClick Function-------
  function selectCustomer(tmpCustomerData: ICustomerListModel) {
    setCustomerName(tmpCustomerData.customerName)
    setProjectName(tmpCustomerData.projectName)
    setState({
      ...state,
      selCustomerID: tmpCustomerData.customerID,
      selProjectID: tmpCustomerData.projectID,
    })
    setShow(false)
  }

  //-------------------------- Pagination --------------------------
  const [total, setTotal] = useState(state.customerData.length)
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICustomerListModel[] = state.customerData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  // ===================== For Customer Filter =====================
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temCustomerData.filter((user) => {
        return (
          user.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.mobileNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.address1.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectName.toLowerCase().includes(keyword.toString())
        )
      })
      setState({...state, customerData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, customerData: state.temCustomerData})
      setTotal(state.temCustomerData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================= Add Area Function =============
  function addAreaByTurnkeyProductMstID(strSelTechid: string, strSelPhotos: string) {
    if (state.selAgencyTypeID === 0) {
      return toast('Please Select Agency Type')
    } else {
      CreateCustomerComplainReq(
        state.selCustomerID,
        state.selProjectID,
        state.selAgencyTypeID,
        description,
        strSelTechid,
        strSelPhotos,
        user.employeeID,
        '192.66.22'
      )
        .then((response) => {
          if (response.data.isSuccess === true) {
            toast.success('Complaint Created Successfully.', {position: 'top-center'})
            history.push({pathname: `/cust-complaint/list`, state: {search: state.mainSearch}})
          } else {
            toast.error(`${response.data.message}`, {position: 'top-center'})
            setState({...state, loading: false})
          }
        })
        .catch((error) => {
          toast.error(`${error}`, {position: 'top-center'})
          setState({...state, loading: false})
        })
    }
  }

  return (
    <>
      <Loader loading={state.loading} />
      <div className='card m-10 me-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form className='form'>
            <div className='card-body border-top mb-3 mb-xl-5 '>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Customer:
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Customer Name'
                    disabled
                    id='complain'
                    value={customerName}
                  />
                </div>
                <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                    onClick={handleShow}
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen004.svg'
                      className='svg-icon-3 svg-icon-white'
                    />
                  </div>
                </div>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Project Name:
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Project Name'
                    disabled
                    id='complain'
                    value={projectName}
                  />
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Agency Type :
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='agencyTypeID'
                  >
                    <option selected={state.selAgencyTypeID === 0 ? true : false} value={0}>
                      Select Agency Type
                    </option>
                    {state.agencyTypeData.length > 0 &&
                      state.agencyTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.agencyTypeID}
                            selected={state.selAgencyTypeID == data.agencyTypeID ? true : false}
                          >
                            {data.agencyTypeName}
                          </option>
                        )
                      })}
                  </select>
                </div>
              </div>
              <div className={state.complainCheckData.length == 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-4 col-form-label fw-bold fs-6 '>
                  <div className='required'>Select Complaint Request:</div>
                </label>
                <div className={`col-lg-10 box-shadow-0 mt-5`}>
                  {state.complainCheckData.length > 0 &&
                    state.complainCheckData.map((item, index) => (
                      <div key={index}>
                        <div className='form-check form-check-custom form-check-solid mb-4'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id={`${item.complainID}`}
                            value={item.complainID}
                            name={item.complainDescription}
                            checked={item.isMember == 1 ? true : false}
                            onChange={(e) => SetStatus(e)}
                          />
                          <label
                            className='form-check-label text-start ms-5 col-lg-2'
                            htmlFor='flexCheckDefault'
                          >
                            {item.complainDescription}
                          </label>
                          <label className='col-lg-2 ms-5 col-form-label fw-bold fs-6'>
                            <span className='d-block'>Upload Photo:</span>
                            <p className='text-muted fs-7'> (allow only .jpg files)</p>
                          </label>
                          <div
                            className={
                              item.photoPath === ''
                                ? 'd-none'
                                : 'ms-5 col-lg-1 d-flex align-items-center'
                            }
                          >
                            <div className='symbol symbol-45px me-5 ms-2'>
                              <img src={process.env.REACT_APP_API_URL + item.photoPath} alt='img' />
                            </div>
                          </div>
                          <div
                            className={
                              item.photoPath === ''
                                ? 'col-lg-7 fv-row'
                                : 'ms-2 text-end col-lg-6 fv-row'
                            }
                          >
                            <input
                              type='file'
                              accept='.jpg'
                              className='form-control form-control-lg form-control-solid bg-light-primary'
                              onChange={(e) => imageUpload(e)}
                              id={`${item.complainID}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Remarks :</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={4}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Remarks...'
                    value={description}
                    onChange={handleDescription}
                  />
                </div>
              </div>
              <div className='card-footer d-flex justify-content-end py-6 px-9 ms-2'>
                <Button variant='primary' onClick={() => AreaProjectItem(state.complainCheckData)}>
                  Submit
                </Button>
                <button
                  onClick={() =>
                    history.push({
                      pathname: `/cust-complaint/list`,
                      state: {search: state.mainSearch}
                    })
                  }
                  className='btn btn-danger ms-3'
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* ----------------------------Customer Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Customer Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <form className='w-100 position-relative' autoComplete='off'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-light-primary'
                  // name='search'
                  placeholder='Search'
                  onChange={(e) => filter(e)}
                  value={name}
                />
              </form>
            </div>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-125px'>
                      <span className='d-block mb-1 ps-2'>Customer Name</span>
                    </th>
                    <th className='min-w-125px'>
                      <span className='d-block mb-1 ps-2'>Project Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Mobile Number</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Email</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {currentPosts.length > 0 &&
                    currentPosts.map((data, index) => {
                      function handleShowActive(e: React.ChangeEvent<HTMLInputElement>): void {
                        throw new Error('Function not implemented.')
                      }

                      return (
                        <tr
                          key={index}
                          className={
                            data.isActive === false
                              ? 'd-none'
                              : 'bg-hover-light-primary text-hover-primary'
                          }
                          id={`${data.projectID}`}
                          // selected={state.selProjectID == data.projectID ? true : false}

                          onClick={() => selectCustomer(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.customerName}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.projectName}
                            </span>
                          </td>

                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.mobileNumber}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                              {data.email}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>

            <div className='text-center'>
              <Pagination
                onChange={(value: any) => setPage(value)}
                pageSize={postPerPage}
                total={total}
                current={page}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChange}
                showTotal={(total) => `Total ${total} customer`}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default AddCustomerComplain
