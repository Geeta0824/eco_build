import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import moment from 'moment'
import {Pagination} from 'antd'
import {
  IPurchaseAccCheckModel,
  IPurchaseAccountModel,
  purchaseAccountInitValues as initialValues,
} from '../../../models/Accounts-page/purchase-account-page/IPurchaseAccountModel'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {Button, Modal} from 'react-bootstrap-v5'
import {getVenderWebList_Active} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {IUnitModel} from '../../../models/master-page/IUnitModel'
import {getActiveUnit} from '../../../modules/master-page/unit-master-page/UnitCRUD'
import {
  updatePurchaseAccountDetails,
  getPurchaseAccountDataByPurchaseID,
} from '../../../modules/account-page/purchase-account-master-page/PurchaseAccountCRUD'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'

const profileDetailsSchema = Yup.object().shape({
  // vendorTypeID: Yup.number().required('Vendor Type Is Required').min(1, 'Vendor Type Is Required'),
})

interface IPurchase {
  loading: boolean
  vendorData: IVenderModel[]
  tmpVendorData: IVenderModel[]
  defualtUnitData: IUnitModel[]
  purchaseData: IPurchaseAccCheckModel[]
  selVendorID: number
  // selVendorTypeID: number
  selUnitID: number
  tmpIncrementID: number
  selProductCategoryID: number
  selPurchaseID: number
  mainSearch: string
}

const EditPurchaseAccount: React.FC = () => {
  const location = useLocation()
  const [data, setData] = useState<IPurchaseAccountModel>(initialValues)
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [tAMT, setTAMT] = useState<number>(0)
  const {purchaseID} = useParams<{purchaseID: string}>()
  const [quotationFilePath, setQuotationFilePath] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [arrLoading, setArrLoading] = useState(false)
  const updateData = (fieldsToUpdate: Partial<IPurchaseAccountModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [state, setState] = useState<IPurchase>({
    loading: false,
    vendorData: [] as IVenderModel[],
    tmpVendorData: [] as IVenderModel[],
    defualtUnitData: [] as IUnitModel[],
    purchaseData: [] as IPurchaseAccCheckModel[],
    selVendorID: 0,
    // selVendorTypeID: 0,
    selUnitID: 0,
    tmpIncrementID: 1,
    selProductCategoryID: 0,
    selPurchaseID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch != undefined) {
        mainSearch = lc.mainSearch
      }
      setState({...state, loading: true})
      getPurchaseAccountDataBypurchaseID(mainSearch)
    }, 100)
  }, [])

  function getPurchaseAccountDataBypurchaseID(mainSearch: string) {
    getPurchaseAccountDataByPurchaseID(parseInt(purchaseID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data
          const temVendorID = responseData.vendorID
          const temVendorTypeID = responseData.vendorTypeID
          const temPurchaseID = responseData.purchaseID
          const temlstItems = responseData.lstItems
          formik.setFieldValue('purchaseID', responseData.purchaseID)
          formik.setFieldValue('vendorID', responseData.vendorID)
          formik.setFieldValue('vendorTypeID', responseData.vendorTypeID)
          formik.setFieldValue('itemDescr', responseData.itemDescr)
          formik.setFieldValue('purchaseDate', responseData.purchaseDate)
          formik.setFieldValue('totalAmount', responseData.totalAmount)
          formik.setFieldValue('vendorName', responseData.vendorName)
          setQuotationFilePath(responseData.documentPath)
          setTAMT(responseData.totalAmount)
          getVenderActiveData(temVendorTypeID, temVendorID, temPurchaseID, temlstItems, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, defualtUnitData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, defualtUnitData: [], loading: false})
      })
  }

  function getVenderActiveData(
    temVendorTypeID: number,
    temVendorID: number,
    temPurchaseID: number,
    temlstItems: IPurchaseAccCheckModel[],
    mainSearch: string
  ) {
    getVenderWebList_Active()
      .then((response) => {
        // let tmpvendorID: number = 0
        const responseData = response.data.responseObject
        const Row = responseData
        for (let key in Row) {
          if (Row[key].vendorID === temVendorID) {
            formik.setFieldValue('vendorID', Row[key].vendorID)
            formik.setFieldValue('contactNumber', Row[key].contactNumber)
            // formik.setFieldValue('vendorName', Row[key].vendorName)
            // formik.setFieldValue('contactPerson', Row[key].contactPerson)
            // tmpvendorID = Row[key].vendorID
            break
          }
        }
        if (response.data.isSuccess == true) {
          getUnitTypeData(
            temVendorTypeID,
            temVendorID,
            temPurchaseID,
            temlstItems,
            mainSearch,
            responseData
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, vendorData: [], loading: false})
        }
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // ===========================unit type API=============================
  function getUnitTypeData(
    temVendorTypeID: number,
    temVendorID: number,
    temPurchaseID: number,
    temlstItems: IPurchaseAccCheckModel[],
    mainSearch: string,
    temVendorData: IVenderModel[]
  ) {
    getActiveUnit()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.responseObject
          setState({
            ...state,
            defualtUnitData: responseData,
            purchaseData: temlstItems,
            mainSearch,
            vendorData: temVendorData,
            tmpVendorData: temVendorData,
            // selVendorTypeID: temVendorTypeID,
            selVendorID: temVendorID,
            selPurchaseID: temPurchaseID,
            loading: false,
          })
          setTotal(temVendorData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, purchaseData: [], defualtUnitData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, purchaseData: [], defualtUnitData: [], loading: false})
      })
  }

  // ======================= Vendor Model PopUp ======================
  const [showVendor, setShowVendor] = useState(false)
  function handleCloseVendor() {
    setShowVendor(false)
  }

  function handleShowVendor() {
    setShowVendor(true)
  }

  const handleDelete = (id: number) => {
    const newPeople = state.purchaseData.filter((person) => person.purchaseDetailID !== id)
    setState({
      ...state,
      purchaseData: newPeople,
      loading: false,
    })
  }

  // function getVenderByVendorTypeIDData(temVendorTypeID: number) {
  //state.selVendorTypeID = 0
  //   formik.setFieldValue('vendorID', 0)
  //   formik.setFieldValue('vendorName', '')
  //   formik.setFieldValue('contactPerson', '')
  //   formik.setFieldValue('contactNumber', '')
  //   getVenderListByVendorTypeID()
  //     .then((response) => {
  //       const responseData = response.data.responseObject
  //       if (response.data.isSuccess == true) {
  //         setState({
  //           ...state,
  //           vendorData: responseData,
  //           tmpVendorData: responseData,
  //           // selVendorTypeID: temVendorTypeID,
  //           loading: false,
  //         })
  //         setTotal(responseData.length)
  //         setPage(1)
  //       } else {
  //         toast.error(`${response.data.message}`)
  //         setState({...state, vendorData: [], loading: false})
  //       }
  //     })
  //     .catch((error) => {
  //       setState({...state, vendorData: [], loading: false})
  //       toast.error(`${error}`)
  //     })
  // }

  // --------For Model Data onClick Function-------
  function selectVendor(tmpVendortData: IVenderModel) {
    formik.setFieldValue('vendorCost', '')
    formik.setFieldValue('paidAmount', '')
    formik.setFieldValue('remeningAmount', '')
    formik.setFieldValue('vendorID', tmpVendortData.vendorID)
    formik.setFieldValue('vendorName', tmpVendortData.companyName)
    formik.setFieldValue('contactPerson', tmpVendortData.contactPerson)
    formik.setFieldValue('contactNumber', tmpVendortData.contactNumber)
    setState({...state, selVendorID: tmpVendortData.vendorID})
    setShowVendor(false)
  }
  // -----------------dropdown select----------------------
  // const selectChange = (event: any) => {
  //   const value = event.target.value
  //   const elementId = event.target.id
  //   if (elementId === 'vendorTypeID') {
  //     formik.setFieldValue('vendorTypeID', parseInt(value))
  //     getVenderByVendorTypeIDData(parseInt(value))
  //     setState({...state, selVendorTypeID: 0})
  //   }
  // }

  // -----------------Item Width Input TextBox----------------
  function setPurchaseDetails(e: any) {
    let tmpName: string = e.target.name
    let uid: string = e.target.id
    let tmpValue: string = e.target.value
    const re = /^[0-9\b.]+$/
    let tmpOutputMaterialData = state.purchaseData
    for (let k in tmpOutputMaterialData) {
      if (uid == `${tmpOutputMaterialData[k].purchaseDetailID}`) {
        if (tmpName == 'ItemName') {
          tmpOutputMaterialData[k].itemName = tmpValue
        } else if (tmpName == 'ItemQty') {
          if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
            let tmpAmt: number =
              tmpOutputMaterialData[k].pricePerUnit == ''
                ? 0
                : parseInt(tmpOutputMaterialData[k].pricePerUnit)
            let tmpTotal: number = tmpAmt * parseInt(tmpValue)
            tmpOutputMaterialData[k].itemQty = tmpValue
            tmpOutputMaterialData[k].lineTotal = `${tmpTotal}`
          } else if (tmpValue === '') {
            tmpOutputMaterialData[k].itemQty = ''
          }
        } else if (tmpName == 'unitID') {
          tmpOutputMaterialData[k].unitID = parseInt(tmpValue)
        } else if (tmpName == 'ItemAmount') {
          if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
            let tmpAmt: number =
              tmpOutputMaterialData[k].itemQty == ''
                ? 0
                : parseInt(tmpOutputMaterialData[k].itemQty)
            let tmpTotal: number = tmpAmt * parseInt(tmpValue)
            tmpOutputMaterialData[k].pricePerUnit = tmpValue
            tmpOutputMaterialData[k].lineTotal = `${tmpTotal}`
          } else if (tmpValue === '') {
            tmpOutputMaterialData[k].pricePerUnit = ''
          }
        } else if (tmpName == 'LineTotal') {
          if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
            tmpOutputMaterialData[k].lineTotal = tmpValue
          } else if (tmpValue === '') {
            tmpOutputMaterialData[k].lineTotal = ''
          }
        }
        break
      }
    }
    let TAMt2: number = 0
    for (let k in tmpOutputMaterialData) {
      TAMt2 = parseInt(tmpOutputMaterialData[k].lineTotal) + TAMt2
    }
    setTAMT(TAMt2)
    setState({
      ...state,
      purchaseData: tmpOutputMaterialData,
    })
  }

  function addPurchaseData() {
    setArrLoading(true)
    let length: number = state.tmpIncrementID
    let ItemList: IPurchaseAccCheckModel[] = state.purchaseData
    for (let k in ItemList) {
      let tmpCheckedData: IPurchaseAccCheckModel = {
        purchaseDetailID: length + 1,
        unitID: 0,
        itemName: '',
        itemQty: '',
        pricePerUnit: '',
        lineTotal: '',
      }
      ItemList.push(tmpCheckedData)
      break
    }
    setState({
      ...state,
      purchaseData: ItemList,
      tmpIncrementID: length + 1,
    })
    setArrLoading(false)
  }

  // -----------------upload File ----------------------
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/PurchaseMasters/UploadPurchaseMastersDocument', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setQuotationFilePath(data)
        setFileLoader(false)
      })
  }

  //----------Download on other tab --------------
  async function downloadQuotationFile(selURL: string) {
    var fullUrl = process.env.REACT_APP_API_URL + selURL
    //Split image name
    const nameSplit = fullUrl.split('/')
    const duplicateName = nameSplit.pop()
    // let url = window.URL.createObjectURL(new Blob([fullUrl]))
    // let a = document.createElement('a')
    // a.href = url
    // a.download = '' + duplicateName + ''
    // a.click()
    const link = document.createElement('a')
    // link.download = '' + duplicateName + ''
    link.target = '_blank'
    link.href = `${fullUrl}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const [total, setTotal] = useState(state.vendorData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IVenderModel[] = state.vendorData.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  // ===================== For Filter =====================
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpVendorData.filter((user) => {
        return (
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, vendorData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, vendorData: state.tmpVendorData})
      setTotal(state.tmpVendorData.length)
      setPage(1)
    }
    setName(keyword)
  }

  const formik = useFormik<IPurchaseAccountModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        if (values.purchaseDate > moment(new Date()).format('YYYY-MM-DD')) {
          toast.error(`Date should be less than or Equal to today's date`)
          return setLoading(false)
        }
        let total: number = 0
        let tmpOutputMaterialData = state.purchaseData
        for (let k in tmpOutputMaterialData) {
          total = parseInt(tmpOutputMaterialData[k].lineTotal) + total
        }
        // setTotalAmount(total)

        updatePurchaseAccountDetails(
          parseInt(purchaseID),
          values.vendorName,
          values.itemDescr,
          values.purchaseDate,
          quotationFilePath,
          total,
          user.employeeID,
          '192.168.0.1',
          values.vendorID,
          0,
          state.purchaseData
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({pathname: '/accounts/purchase/list', state: {Search: state.mainSearch}})
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
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              {/* <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Vendor Type:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='vendorTypeID'
                  >
                    <option selected value={0}>
                      Select Vendor Type
                    </option>
                    {venderTypeData.length > 0 &&
                      venderTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.vendorTypeID}
                            selected={state.selVendorTypeID == data.vendorTypeID ? true : false}
                          >
                            {data.vendorTypeName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.vendorTypeID && formik.errors.vendorTypeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.vendorTypeID}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Purchase Date:</label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Purchase Date'
                    {...formik.getFieldProps('purchaseDate')}
                  />
                  {formik.touched.purchaseDate && formik.errors.purchaseDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.purchaseDate}</div>
                    </div>
                  )}
                </div>
              </div> */}
              <div className={'row mb-6'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Vendor Name:</span>
                </label>
                <div className={state.selVendorID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Enter Vendor Name'
                    {...formik.getFieldProps('vendorName')}
                    disabled
                  />
                  {formik.touched.vendorName && formik.errors.vendorName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.vendorName}</div>
                    </div>
                  )}
                </div>
                <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn- 
                       md me-1 p-5 ms-6'
                    onClick={handleShowVendor}
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen004.svg'
                      className='svg-icon-3 svg-icon-white'
                    />
                  </div>
                </div>
                <label
                  className={
                    state.selVendorID === 0 ? 'd-none' : 'col-lg-2 col-form-label fw-bold fs-6'
                  }
                >
                  <span className=''>Contact Number:</span>
                </label>
                <div className={state.selVendorID === 0 ? 'd-none' : 'col-lg-4 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Enter Contact Number'
                    disabled
                    {...formik.getFieldProps('contactNumber')}
                  />
                  {formik.touched.contactNumber && formik.errors.contactNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.contactNumber}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Description:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={2}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Description'
                    {...formik.getFieldProps('itemDescr')}
                  />
                  {formik.touched.itemDescr && formik.errors.itemDescr && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.itemDescr}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='d-block'>Select File:</span>
                  <p className='text-muted fs-7'> (allow only .pdf files)</p>
                </label>
                <div
                  className={
                    quotationFilePath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center'
                  }
                >
                  <div className='symbol symbol-45px me-5 cursor-pointer'>
                    {/* <img src={process.env.REACT_APP_API_URL + quotationFilePath} alt='img' /> */}
                    <img
                      src={toAbsoluteUrl('/media/svg/files/pdf.svg')}
                      alt='pdf'
                      onClick={() => downloadQuotationFile(quotationFilePath)}
                    />
                  </div>
                </div>
                <div className={quotationFilePath === '' ? 'col-lg-10 fv-row' : 'col-lg-8 fv-row'}>
                  <input
                    type='file'
                    accept='.pdf'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => imageUploadQuotation(e)}
                  />
                </div>
              </div>
            </div>

            <div className='text-end me-10'>
              <span
                onClick={addPurchaseData}
                className='btn btn-sm btn-light-primary text-white bg-primary'
                title='Click To Add New Item'
              >
                Add New Item
              </span>
            </div>

            <div className='py-1'>
              {/* begin::Table container */}
              <div className='table-responsive'>
                {/* begin::Table */}
                <table className='table table-bordered align-middle g-2'>
                  {/* begin::Table head */}
                  <thead className='bg-dark'>
                    <tr className='fw-bolder fs-5 text-white text-center'>
                      <th className='w-25px'>SR No.</th>
                      <th className='w-100px'>Item Name</th>
                      <th className='w-25px'>QTY</th>
                      <th className='w-100px'>Unit Name</th>
                      <th className='w-100px'>Price Per Unit</th>
                      <th className='w-100px'>Line Total</th>
                      <th className='w-50px'>Delete</th>
                    </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody className='text-center'>
                    {/* =================== Loading ============== */}
                    {state.purchaseData.length > 0 &&
                      state.purchaseData.map((data, index) => {
                        return (
                          <tr key={index + 1}>
                            <td className='min-w-25px text-center'>
                              <input
                                className='text-center w-50px border-0'
                                // type='number'
                                disabled
                                name='LineNumber'
                                id={`${data.purchaseDetailID}`}
                                autoComplete='off'
                                onChange={(e) => setPurchaseDetails(e)}
                                value={index + 1}
                              />
                            </td>
                            <td className='w-200px text-center'>
                              <input
                                className='text-start w-300px'
                                type='text'
                                name='ItemName'
                                id={`${data.purchaseDetailID}`}
                                autoComplete='off'
                                onChange={(e) => setPurchaseDetails(e)}
                                value={data.itemName}
                              />
                            </td>
                            <td className='min-w-25px text-center'>
                              <input
                                className='text-center w-100px'
                                type='text'
                                name='ItemQty'
                                id={`${data.purchaseDetailID}`}
                                autoComplete='off'
                                onChange={(e) => setPurchaseDetails(e)}
                                value={data.itemQty}
                              />
                            </td>

                            <td className='w-100px text-center'>
                              <select
                                className='form-select form-select-white lineHeightByD w-150px'
                                aria-label='Default select example'
                                onChange={setPurchaseDetails}
                                id={`${data.purchaseDetailID}`}
                                autoComplete='off'
                                name='unitID'
                              >
                                <option selected={0 === data.unitID ? true : false} value={0}>
                                  Select Unit
                                </option>
                                {state.defualtUnitData.length > 0 &&
                                  state.defualtUnitData.map((datas, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={datas.unitID}
                                        selected={datas.unitID === data.unitID ? true : false}
                                      >
                                        {datas.unitName}
                                      </option>
                                    )
                                  })}
                              </select>
                            </td>
                            <td className='min-w-25px text-center'>
                              <input
                                className='text-center w-100px'
                                type='text'
                                name='ItemAmount'
                                id={`${data.purchaseDetailID}`}
                                autoComplete='off'
                                onChange={(e) => setPurchaseDetails(e)}
                                value={data.pricePerUnit}
                              />
                            </td>
                            <td className='min-w-50px text-center'>
                              <input
                                className='text-center w-100px'
                                type='text'
                                name='LineTotal'
                                id={`${data.purchaseDetailID}`}
                                autoComplete='off'
                                onChange={(e) => setPurchaseDetails(e)}
                                value={data.lineTotal}
                                disabled
                              />
                            </td>
                            <td className='min-w-25px text-center'>
                              <div
                                onClick={() => handleDelete(data.purchaseDetailID)}
                                className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                              >
                                <KTSVG
                                  path='/media/icons/duotune/general/gen027.svg'
                                  className='ssvg-icon-3 svg-icon-danger'
                                />
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    <tr className='text-dark'>
                      <td className='text-center fw-bolder fs-6' colSpan={5}></td>
                      <td className='border-top border-bottom border-dark text-start fw-bolder fs-6'>
                        {Number.isNaN(tAMT) ? 0 : tAMT}
                      </td>
                      {/* <td className='text-start'></td> */}
                    </tr>
                  </tbody>
                </table>
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
                className='btn btn-danger ms-3'
                to={{pathname: '/accounts/purchase/list', state: {Search: state.mainSearch}}}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
      {/* ----------------------------Vendor Model PopUp---------------------- */}
      <Modal size='xl' scrollable={true} show={showVendor} onHide={handleCloseVendor}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Vendor Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <form className='w-100 position-relative' autoComplete='off'>
                <KTSVG
                  path='/media/icons/duotune/general/gen021.svg'
                  className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                />
                <input
                  type='text'
                  className='form-control form-control-solid px-15 bg-white'
                  // name='search'
                  placeholder='Search'
                  onChange={filter}
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
                    <th className='min-w-120px'>
                      <span className='d-block mb-1 ps-1'>Vendor Type Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Company Name</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Contact Person</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Contact Number</span>
                    </th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {currentPosts.length > 0 &&
                    currentPosts.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          // className={
                          //   data.isActive == true
                          //     ? 'bg-hover-light-primary text-hover-primary'
                          //     : 'd-none'
                          // }
                          onClick={() => selectVendor(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.vendorTypeName}
                            </span>
                          </td>
                          <td>
                            {data.vendorTypeID === 1 || data.vendorTypeID === 2 ? (
                              <div className='d-flex align-items-center'>
                                <div className='text-dark text-hover-primary fs-6'>
                                  {data.companyName}
                                </div>
                              </div>
                            ) : (
                              <div className='text-dark text-hover-primary fs-6'>N.A</div>
                            )}
                          </td>

                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactPerson}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.contactNumber}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  <BlankDataImageInTable
                    length={currentPosts.length}
                    loading={state.loading}
                    colSpan={9}
                  />
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
                showTotal={(total) => `Total ${total} items`}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseVendor}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default EditPurchaseAccount
