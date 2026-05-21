import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {GetPurchaseListByVendorID} from '../../../modules/account-page/pay-purchase-master-page/PayPurchaseCRUD'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {
  getVenderListByVendorTypeID,
  getVenderWebList,
} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {Button, Modal} from 'react-bootstrap-v5'
import {Pagination} from 'antd'
import {IPurchasetModel} from '../../../models/Accounts-page/pay-purchase-page copy/IPayPurchaseModel'
import {venderTypeData} from '../../other-dropDowns/otherDropDowns'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {
  IDebitNoteEditModel,
  IDebitNoteDtlModel,
  IDebitNoteModel,
  IPurchasetDtlByIDModel,
  accountTransferInitValues as initialValues,
} from '../../../models/Accounts-page/debit-note-page/IDebitNoteModel'
import {IUnitModel} from '../../../models/master-page/IUnitModel'
import {getActiveUnit} from '../../../modules/master-page/unit-master-page/UnitCRUD'
import LoaderInTable from '../../common-pages/LoaderInTable'
import {
  AddDebitNotesMstApi,
  GetDebitNoteDataByDebitNoteIDApi,
  GetPurchaseMastersDataByPurchaseMastersIDaPI,
} from '../../../modules/account-page/debit-note-master-page/DebitNoteCRUD'
import Loader from '../../common-pages/Loader'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'

const profileDetailsSchema = Yup.object().shape({
  bhkName: Yup.string().required('Name Field is required'),
})

interface IDepartment {
  loading: boolean
  vendorData: IVenderModel[]
  temVendorData: IVenderModel[]
  purchaseData: IPurchasetModel[]
  temPurchaseData: IPurchasetModel[]
  purchaseDtlData: IPurchasetDtlByIDModel[]
  temPurchaseDtlData: IPurchasetDtlByIDModel[]
  umoData: IUnitModel[]
  selDebitNoteID: number
  selVendorID: number
  selVendorTypeID: number
  selPurchaseID: number
  selUOMID: number
  returnQty: string
  totalAmt: string
  debitAmt:  string
  SearchText:  string
}

const EditDebitNote: React.FC = () => {
  const {debitNoteId} = useParams<{debitNoteId: string}>()
  const [mainLoading, setMainLoading] = useState<boolean>(false)
  const [totalAmt, setTotalAmt] = useState<number>(0)
  const history = useHistory()
  const [data, setData] = useState<IDebitNoteModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IDebitNoteModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDepartment>({
    loading: false,
    vendorData: [] as IVenderModel[],
    temVendorData: [] as IVenderModel[],
    purchaseData: [] as IPurchasetModel[],
    temPurchaseData: [] as IPurchasetModel[],
    purchaseDtlData: [] as IPurchasetDtlByIDModel[],
    temPurchaseDtlData: [] as IPurchasetDtlByIDModel[],
    umoData: [] as IUnitModel[],
    selDebitNoteID: 0,
    selVendorID: 0,
    selVendorTypeID: 0,
    selPurchaseID: 0,
    selUOMID: 0,
    returnQty: '',
    totalAmt: '',
    debitAmt: '',
    SearchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      let SearchText: string = ''
      if (lc.mainSearch != undefined) {
        SearchText = lc.mainSearch
      }
      getByIDData(SearchText)
    }, 100)
  }, [])

  // ===========================unit type API=============================
  function getByIDData(SearchText: string) {
    GetDebitNoteDataByDebitNoteIDApi(parseInt(debitNoteId))
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.lstItems
          formik.setFieldValue('debitNoteID', response.data.debitNoteID)
          formik.setFieldValue('purchaseID', response.data.purchaseID)
          formik.setFieldValue('remarks', response.data.remarks)
          formik.setFieldValue('debitNoteDate', response.data.debitNoteDate)
          formik.setFieldValue('filePath', response.data.filePath)
          formik.setFieldValue('totalReturnAmt', response.data.totalReturnAmt)
          formik.setFieldValue('vendorName', response.data.vendorName)
          formik.setFieldValue('vendorID', response.data.vendorID)
          formik.setFieldValue('vendorTypeID', response.data.vendorTypeID)
          getUnitTypeData(
            responseData,
            response.data.debitNoteID,
            response.data.purchaseID,
            response.data.vendorID,
            response.data.vendorTypeID,
            response.data.totalReturnAmt,
            SearchText
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, purchaseDtlData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, purchaseDtlData: [], loading: false})
      })
  }

  function getUnitTypeData(
    purchaseDtlData: [],
    debitNoteID: number,
    purchaseID: number,
    vendorID: number,
    vendorTypeID: number,
    totalReturnAmt: number,
    SearchText: string
  ) {
    getActiveUnit()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.responseObject
          getVendorData(
            purchaseDtlData,
            debitNoteID,
            purchaseID,
            vendorID,
            vendorTypeID,
            totalReturnAmt,
            responseData,
            SearchText
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, umoData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, umoData: [], loading: false})
      })
  }

  // ===============Vendor Get Api========================
  function getVendorData(
    purchaseDtlData: [],
    debitNoteID: number,
    purchaseID: number,
    vendorID: number,
    vendorTypeID: number,
    totalReturnAmt: number,
    umoData: [],
    SearchText: string
  ) {
    getVenderListByVendorTypeID(vendorTypeID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          getPurchaseData(
            purchaseDtlData,
            debitNoteID,
            purchaseID,
            vendorID,
            vendorTypeID,
            totalReturnAmt,
            umoData,
            SearchText,
            responseData
          )
          for (let key in responseData) {
            if (responseData[key].vendorID === vendorID) {
              formik.setFieldValue('vendorID', responseData[key].vendorID)
              formik.setFieldValue('vendorName', responseData[key].companyName)
              formik.setFieldValue('contactNumber', responseData[key].contactNumber)
              break
            }
          }
          setTotal(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  function getPurchaseData(
    purchaseDtlData: [],
    debitNoteID: number,
    purchaseID: number,
    vendorID: number,
    vendorTypeID: number,
    totalReturnAmt: number,
    umoData: [],
    SearchText: string,
    vendorData: []
  ) {
    GetPurchaseListByVendorID(vendorID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          for (let key in responseData) {
            if (responseData[key].purchaseID === purchaseID) {
              formik.setFieldValue('purchaseID', responseData[key].purchaseID)
              formik.setFieldValue('itemQty', responseData[key].itemQty)
              formik.setFieldValue('itemName', responseData[key].itemName)
              formik.setFieldValue('itemName', responseData[key].itemName)
              formik.setFieldValue('voucherNo', responseData[key].voucherNo)
              formik.setFieldValue('unitName', responseData[key].unitName)
              formik.setFieldValue('unitID', responseData[key].unitID)
              formik.setFieldValue('itemAmount', responseData[key].totalAmount)
              break
            }
          }
          setTotalAmt(totalReturnAmt)
          setState({
            ...state,
            selDebitNoteID: debitNoteID,
            selPurchaseID: purchaseID,
            selVendorID: vendorID,
            selVendorTypeID: vendorTypeID,
            umoData: umoData,
            vendorData: vendorData,
            purchaseData: responseData,
            temPurchaseData: responseData,
            purchaseDtlData: purchaseDtlData,
            SearchText:SearchText,
            loading: false,
          })
          setTotalPurchase(responseData.length)
          setPagePurchase(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            purchaseData: [],
            loading: false,
          })
          setTotalPurchase(0)
          setPagePurchase(1)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          purchaseData: [],
          loading: false,
        })
        setTotalPurchase(0)
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'vendorTypeID') {
      if (parseInt(value) > 0) {
        formik.setFieldValue('vendorTypeID', parseInt(value))
        getVenderByVendorTypeIDData(parseInt(value))
      } else {
        formik.setFieldValue('vendorID', 0)
        formik.setFieldValue('vendorName', '')
        formik.setFieldValue('contactNumber', '')
        formik.setFieldValue('purchaseID', 0)
        formik.setFieldValue('unitID', 0)
        formik.setFieldValue('itemName', '')
        formik.setFieldValue('voucherNo', '')
        formik.setFieldValue('unitName', '')
        formik.setFieldValue('itemQty', '')
        formik.setFieldValue('itemAmount', '')
        setState({
          ...state,
          vendorData: [],
          temVendorData: [],
          purchaseData: [],
          temPurchaseData: [],
          selVendorTypeID: 0,
          selPurchaseID: 0,
          loading: false,
        })
        setTotal(0)
      }
    } else if (elementId == 'uomID') {
      formik.setFieldValue('uomID', parseInt(value))
      setState({
        ...state,
        selUOMID: parseInt(value),
      })
    }
  }

  // ===============Vendor Get Api========================
  function getVenderByVendorTypeIDData(selVendorTypeID: number) {
    getVenderListByVendorTypeID(selVendorTypeID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          formik.setFieldValue('purchaseID', 0)
          formik.setFieldValue('unitID', 0)
          formik.setFieldValue('itemName', '')
          formik.setFieldValue('voucherNo', '')
          formik.setFieldValue('unitName', '')
          formik.setFieldValue('itemQty', '')
          formik.setFieldValue('itemAmount', '')
          setState({
            ...state,
            vendorData: responseData,
            temVendorData: responseData,
            selVendorTypeID: selVendorTypeID,
            purchaseData: [],
            temPurchaseData: [],
            selPurchaseID: 0,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, vendorData: [], loading: false})
        toast.error(`${error}`)
      })
  }

  // ======================= Vendor Model PopUp ======================
  const [showVendor, setShowVendor] = useState(false)
  function handleCloseVendor() {
    setShowVendor(false)
  }
  function handleShowVendor() {
    if (state.selVendorTypeID > 0) {
      setShowVendor(true)
    } else {
      toast.error(`Please Select Vendor Type`)
    }
  }

  // --------For Model Data onClick Function-------
  function selectVendor(tmpVendortData: IVenderModel) {
    formik.setFieldValue('vendorID', tmpVendortData.vendorID)
    formik.setFieldValue('vendorName', tmpVendortData.companyName)
    formik.setFieldValue('contactNumber', tmpVendortData.contactNumber)
    getAllPurchaseData(tmpVendortData.vendorID)
    setShowVendor(false)
  }

  function getAllPurchaseData(vendorID: number) {
    GetPurchaseListByVendorID(vendorID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          state.purchaseData = []
          state.temPurchaseData = []
          formik.setFieldValue('purchaseID', 0)
          formik.setFieldValue('unitID', 0)
          formik.setFieldValue('itemName', '')
          formik.setFieldValue('voucherNo', '')
          formik.setFieldValue('unitName', '')
          formik.setFieldValue('itemQty', '')
          formik.setFieldValue('itemAmount', '')
          setState({
            ...state,
            purchaseData: responseData,
            temPurchaseData: responseData,
            selVendorID: vendorID,
            selPurchaseID: 0,
            loading: false,
          })
          setTotalPurchase(responseData.length)
          setPagePurchase(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            purchaseData: [],
            loading: false,
          })
          setTotalPurchase(0)
          setPagePurchase(1)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          purchaseData: [],
          loading: false,
        })
        setTotalPurchase(0)
        setPagePurchase(1)
      })
  }

  // ======================= Project Model PopUp ======================
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }

  // ===================== For Project Filter =====================
  const [namePurchase, setNamePurchase] = useState('')
  const filterPurchase = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.temPurchaseData.filter((user) => {
        return (
          user.vendorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.voucherNo.toLowerCase().includes(keyword.toLowerCase()) ||
          user.itemAmount.toString().includes(keyword.toString()) ||
          user.remainingAmount.toString().includes(keyword.toString()) ||
          user.paidAmount.toString().includes(keyword.toString()) ||
          user.itemQty.toString().includes(keyword.toString()) ||
          user.itemName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.voucherNo.toLowerCase().includes(keyword.toLowerCase()) ||
          user.voucherNo.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, purchaseData: results})
      setTotalPurchase(results.length)
      setPagePurchase(1)
    } else {
      setState({...state, purchaseData: state.temPurchaseData})
      setTotalPurchase(state.temPurchaseData.length)
      setPagePurchase(1)
    }
    setNamePurchase(keyword)
  }

  function selectPurchase(tmpPurchaseData: IPurchasetModel) {
    formik.setFieldValue('purchaseID', tmpPurchaseData.purchaseID)
    formik.setFieldValue('itemQty', tmpPurchaseData.itemQty)
    formik.setFieldValue('itemName', tmpPurchaseData.itemName)
    formik.setFieldValue('itemName', tmpPurchaseData.itemName)
    formik.setFieldValue('voucherNo', tmpPurchaseData.voucherNo)
    formik.setFieldValue('unitName', tmpPurchaseData.unitName)
    formik.setFieldValue('unitID', tmpPurchaseData.unitID)
    formik.setFieldValue('itemAmount', tmpPurchaseData.totalAmount)
    GetPurchaseMastersDataByPurchaseMastersIDaPI(tmpPurchaseData.purchaseID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.lstItems
          let tmplstCheckedData = [] as IPurchasetDtlByIDModel[]
          for (let k in responseData) {
            let tmpCheckedData: IPurchasetDtlByIDModel = {
              debitNoteDetailID: responseData[k]['debitNoteDetailID'],
              purchaseDetailID: responseData[k]['purchaseDetailID'],
              debitNoteID: responseData[k]['debitNoteID'],
              purchaseID: responseData[k]['purchaseID'],
              purchaseQty: responseData[k]['purchaseQty'],
              returnQty: responseData[k]['returnQty'],
              itemName: responseData[k]['itemName'],
              purchaseUnitName: responseData[k]['purchaseUnitName'],
              pricePerUnit: responseData[k]['pricePerUnit'],
              purchaseTotal: responseData[k]['purchaseTotal'],
              returnTotal: responseData[k]['returnTotal'],
              purchaseUnitID: responseData[k]['purchaseUnitID'],
              returnUnitID: responseData[k]['returnUnitID'],
              // purchaseDetailID: responseData[k]['purchaseDetailID'],
              // itemQty: responseData[k]['itemQty'],
              // pricePerUnit: responseData[k]['pricePerUnit'],
              // itemName: responseData[k]['itemName'],
              // unitName: responseData[k]['unitName'],
              // unitID: responseData[k]['unitID'],
              // lineTotal: responseData[k]['lineTotal'],
              // debitAmount: '',
              // returnQty: '',
              // returnUnit: responseData[k]['unitID'],
              // isSelected: 0,
              // purchaseID: tmpPurchaseData.purchaseID,
              // debitNoteDetailID: responseData[k]['debitNoteDetailID'],
            }
            tmplstCheckedData.push(tmpCheckedData)
          }
          setState({
            ...state,
            purchaseDtlData: tmplstCheckedData,
            selPurchaseID: tmpPurchaseData.purchaseID,
            // selUOMID: tmpPurchaseData.unitID,
            loading: false,
          })
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, purchaseDtlData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, purchaseDtlData: [], loading: false})
      })
  }

  // =================== For Selection ==============
  // function setSelectedHandle(e: any) {
  //   let uid: number = e.target.id
  //   let isChecked = e.target.checked
  //   let tmpProjData = state.purchaseDtlData
  //   for (let k in tmpProjData) {
  //     if (uid == tmpProjData[k].purchaseDetailID) {
  //       if (isChecked) {
  //         tmpProjData[k].isSelected = 1
  //       } else {
  //         tmpProjData[k].isSelected = 0
  //       }
  //       break
  //     }
  //   }
  //   setState({...state, purchaseDtlData: tmpProjData})
  // }

  // =================== For Item Meter Input Selection ==============
  function setInputData(e: any) {
    let tmpName: string = e.target.name
    let uid: number = e.target.id
    let tmpValue: string = e.target.value
    const re = /^[0-9\b.]+$/
    let tmpProjctData: IPurchasetDtlByIDModel[] = state.purchaseDtlData
    for (let k in tmpProjctData) {
      if (uid == tmpProjctData[k].purchaseDetailID) {
        if (tmpName == 'returnQty') {
          if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
            if (tmpProjctData[k].purchaseQty >= parseInt(tmpValue)) {
              let tmpAmt: number = 0
              let tmpPerAmt: number = tmpProjctData[k].pricePerUnit
              tmpAmt = parseInt(tmpValue) * tmpPerAmt
              tmpProjctData[k].returnQty = parseInt(tmpValue)
              tmpProjctData[k].returnTotal = tmpAmt
            } else {
              toast.error('return Qty is not maximum to Item Qty.')
            }
          } else if (tmpValue === '') {
            tmpProjctData[k].returnQty = 0
            tmpProjctData[k].returnTotal = 0
          }
        } else if (tmpName == 'debitAmount') {
          if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
            tmpProjctData[k].returnTotal = parseInt(tmpValue)
          } else if (tmpValue === '') {
            tmpProjctData[k].returnTotal = 0
          }
        } else if (tmpName == 'returnUnit') {
          tmpProjctData[k].returnUnitID = parseInt(tmpValue)
        }
        break
      }
    }
    let TAMt: number = 0
    for (let k in tmpProjctData) {
      TAMt = tmpProjctData[k].returnTotal + TAMt
    }
    setTotalAmt(TAMt)
    setState({...state, purchaseDtlData: tmpProjctData})
  }

  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [quotationFilePath, setQuotationFilePath] = useState<string>('')
  // -----------------upload File ----------------------
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/DebitNote/UploadDebitNoteDocument', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setQuotationFilePath(data)
        setFileLoader(false)
      })
  }

  // ================= SerchText Function ===========
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.temVendorData.filter((user) => {
        return (
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.address.toLowerCase().includes(keyword.toLowerCase()) ||
          user.aboutVendor.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, vendorData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, vendorData: state.temVendorData})
      setTotal(state.temVendorData.length)
      setPage(1)
    }

    setName(keyword)
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

  const [totalPurchase, setTotalPurchase] = useState(state.purchaseData.length) //  length
  const [pagePurchase, setPagePurchase] = useState(1)
  const [postPerPagePurchase, setPostPerPagePurchase] = useState(10)
  const indexOfLastPagePurchase = pagePurchase * postPerPagePurchase
  const indexOfFirstPagePurchase = indexOfLastPagePurchase - postPerPagePurchase
  const currentPostsPurchase: IPurchasetModel[] = state.purchaseData.slice(
    indexOfFirstPagePurchase,
    indexOfLastPagePurchase
  )
  const onShowSizeChangePurchase = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IDebitNoteModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        const Edit = window.confirm('Are you sure you want to update selected record')
        if (Edit) {
          let totalAmount: number = 0
          let tmppurchaseDtlData: IDebitNoteEditModel[] = []
          let tmpProjData = state.purchaseDtlData
          for (let k in tmpProjData) {
            totalAmount = tmpProjData[k].returnTotal + totalAmount
            let tmpCheckedData: IDebitNoteEditModel = {
              returnQty: tmpProjData[k].returnQty,
              itemName: tmpProjData[k].itemName,
              pricePerUnit: tmpProjData[k].pricePerUnit,
              lineTotal: tmpProjData[k].returnTotal,
              unitID: tmpProjData[k].returnUnitID,
              purchaseID: tmpProjData[k].purchaseID,
              purchaseDetailID: tmpProjData[k].purchaseDetailID,
              debitNoteDetailID: tmpProjData[k].debitNoteDetailID,
            }
            tmppurchaseDtlData.push(tmpCheckedData)
          }
          //  console.log(tmppurchaseDtlData)
          // UpdateDebitNotesMstApi(
          //   values.debitNoteID,
          //   values.vendorName,
          //   values.remarks,
          //   values.purchaseDate,
          //   quotationFilePath,
          //   `${totalAmount}`,
          //   parseInt(values.purchaseID),
          //   user.employeeID,
          //   '192.66.22',
          //   values.vendorID,
          //   values.vendorTypeID,
          //   tmppurchaseDtlData
          // )
          //   .then((response) => {
          //     if (response.data.isSuccess == true) {
          //       toast.success('Created Successfull')
          //       history.push('/accounts/debit-note/list')
          //       setLoading(false)
          //     } else {
          //       toast.error(`${response.data.message}`)
          //       setLoading(false)
          //     }
          //   })
          //   .catch((error) => {
          //     toast.error(`${error}`)
          //     setLoading(false)
          //   })
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
      {state.loading ? (
        <Loader loading={state.loading} />
      ) : (
        <div className='card mb-5 mb-xl-10'>
          <div id='kt_account_profile_details' className='collapse show'>
            <form onSubmit={formik.handleSubmit} noValidate className='form'>
              <div className='card-body border-top p-9 ms-6'>
                <div className='row mb-6'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className='required'> Select Vendor Type:</span>
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Default select example'
                      onChange={selectChange}
                      disabled
                      id='vendorTypeID'
                    >
                      <option selected value={0}>
                        Vendor Type
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
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>Date:</label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='date'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      {...formik.getFieldProps('purchaseDate')}
                    />
                    {formik.touched.purchaseDate && formik.errors.purchaseDate && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.purchaseDate}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={state.selVendorTypeID > 0 ? 'row mb-6' : 'd-none'}>
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    Select Vendor:
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg border-0 bg-white'
                      placeholder='Select Vendor'
                      disabled
                      {...formik.getFieldProps('vendorName')}
                    />
                  </div>
                  {/* <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                    onClick={handleShowVendor}
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen004.svg'
                      className='svg-icon-3 svg-icon-white'
                    />
                  </div>
                </div> */}
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Contact No:</label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg border-0 bg-white'
                      placeholder='Select Vendor'
                      disabled
                      {...formik.getFieldProps('contactNumber')}
                    />
                  </div>
                </div>
                <div
                  className={
                    state.selVendorTypeID > 0 && state.selVendorID > 0 ? 'row mb-6' : 'd-none'
                  }
                >
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                    Select Purchase:
                  </label>
                  <div className='col-lg-4 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg border-0 bg-white'
                      placeholder='Select Purchase'
                      disabled
                      {...formik.getFieldProps('voucherNo')}
                    />
                  </div>
                  {/* <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                    onClick={handleShow}
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen004.svg'
                      className='svg-icon-3 svg-icon-white'
                    />
                  </div>
                </div> */}
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>PO Amount:</span>
                  </label>
                  <div className={state.selPurchaseID === 0 ? 'd-none' : 'col-lg-4 fv-row'}>
                    <input
                      type='text'
                      className='form-control form-control-lg  border-0 bg-white'
                      placeholder='PO Amount'
                      disabled
                      {...formik.getFieldProps('itemAmount')}
                    />
                  </div>
                </div>

                {/* ----------------------------- Start :: Purchase Dtl ---------------------------- */}
                <div
                  className={
                    state.selVendorID > 0 && state.selPurchaseID > 0 ? 'row mb-6' : 'd-none'
                  }
                >
                  <div className='d-flex justify-content-start mb-2 text-center'>
                    <label className='fs-3 fw-bolder text-dark'> Select Purchase Details : </label>
                  </div>
                  <div className='card'>
                    <div className='py-3'>
                      {/* begin::Table container */}
                      <div className='table-responsive'>
                        {/* begin::Table */}
                        <table className='table table-bordered align-middle g-2'>
                          {/* begin::Table head */}
                          <thead className='bg-success'>
                            <tr className='fw-bolder fs-5 text-white text-center'>
                              {/* <th className='w-25px'></th> */}
                              <th className='min-w-25px'>Item Name</th>
                              <th className='w-25px'>Qty</th>
                              <th className='min-w-25px'>Unit</th>
                              <th className='min-w-25px text-end'>Price Per Unit</th>
                              <th className='min-w-25px text-end'>Line Total</th>
                              <th className='min-w-25px'>Return Qty</th>
                              <th className='min-w-25px'>Returrn Unit</th>
                              <th className='min-w-25px'>Debit Amount </th>
                            </tr>
                          </thead>
                          {/* end::Table head */}
                          {/* begin::Table body */}
                          <tbody className="border-bottom">
                            {mainLoading ? (
                              <LoaderInTable loading={mainLoading} column={15} />
                            ) : (
                              <>
                                {state.purchaseDtlData.length > 0 &&
                                  state.purchaseDtlData.map((data, index) => {
                                    let tmpTAmt: number = 0
                                    tmpTAmt = data.returnTotal + tmpTAmt
                                    // setTotalAmt(tmpTAmt)
                                    return (
                                      <tr key={index}>
                                        {/* <td>
                                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                          <input
                                            className='form-check-input widget-9-check'
                                            type='checkbox'
                                            id={`${data.purchaseDetailID}`}
                                            onChange={(e) => setSelectedHandle(e)}
                                          />
                                        </div>
                                      </td> */}
                                        <td className='min-w-25px text-center'>
                                          <span className='mb-1'>{data.itemName}</span>
                                        </td>
                                        <td className='min-w-25px text-center'>
                                          <span className='mb-1'>{data.purchaseQty}</span>
                                        </td>
                                        <td className='min-w-25px text-center'>
                                          <span className='mb-1'>{data.purchaseUnitName}</span>
                                        </td>
                                        <td className='min-w-25px text-center'>
                                          <span className='mb-1'>{data.pricePerUnit}</span>
                                        </td>
                                        <td className='min-w-25px text-center'>
                                          <span className='mb-1'>{data.purchaseTotal}</span>
                                        </td>
                                        <th className='w-75px'>
                                          <span className='mb-1'>
                                            <input
                                              className='form-control form-control-sm text-center'
                                              type='text'
                                              name='returnQty'
                                              id={`${data.purchaseDetailID}`}
                                              // disabled={data.isSelected === 1 ? false : true}
                                              onChange={(e) => setInputData(e)}
                                              value={data.returnQty}
                                            />
                                          </span>
                                        </th>
                                        <th className='min-w-25px'>
                                          <span className='mb-1'>
                                            <select
                                              className='lineHeightByD'
                                              name='returnUnit'
                                              onChange={setInputData}
                                              // disabled={data.isSelected === 1 ? false : true}
                                              id={`${data.purchaseDetailID}`}
                                            >
                                              <option
                                                selected={0 === data.returnUnitID ? true : false}
                                                value={0}
                                              >
                                                Select Unit
                                              </option>
                                              {state.umoData.length > 0 &&
                                                state.umoData.map((datas, index) => {
                                                  return (
                                                    <option
                                                      key={index}
                                                      value={datas.unitID}
                                                      selected={
                                                        datas.unitID === data.returnUnitID
                                                          ? true
                                                          : false
                                                      }
                                                    >
                                                      {datas.unitName}
                                                    </option>
                                                  )
                                                })}
                                            </select>
                                          </span>
                                        </th>
                                        <th className='w-125px'>
                                          <span className='mb-1'>
                                            <input
                                              className='form-control form-control-sm text-center'
                                              type='text'
                                              name='debitAmount'
                                              id={`${data.purchaseDetailID}`}
                                              // disabled={data.isSelected === 1 ? false : true}
                                              onChange={(e) => setInputData(e)}
                                              value={data.returnTotal}
                                            />
                                          </span>
                                        </th>
                                      </tr>
                                    )
                                  })}
                                <tr className='text-dark'>
                                  <td className='text-center fw-bolder fs-6' colSpan={7}></td>
                                  <td className='border-top border-bottom border-dark text-center fw-bolder fs-6'>
                                    {Number.isNaN(totalAmt) ? 0 : totalAmt}
                                  </td>
                                  {/* <td className='text-start'></td> */}
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ----------------------------- End :: Purchase Dtl ---------------------------- */}

                <div
                  className={
                    state.selVendorID > 0 && state.selPurchaseID > 0 ? 'row mb-6' : 'd-none'
                  }
                >
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className=''>Remarks:</span>
                  </label>
                  <div className='col-lg-10 fv-row'>
                    <textarea
                      rows={2}
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Write here...'
                      {...formik.getFieldProps('remarks')}
                    />
                    {formik.touched.remarks && formik.errors.remarks && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.remarks}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={
                    state.selVendorID > 0 && state.selPurchaseID > 0 ? 'row mb-6' : 'd-none'
                  }
                >
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>
                    <span className='d-block'>Attach File:</span>
                    <p className='text-muted fs-7'> (allow only .pdf files)</p>
                  </label>
                  <div
                    className={
                      quotationFilePath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center'
                    }
                  >
                    <div className='symbol symbol-45px me-5 cursor-pointer'>
                      {/* <img src={process.env.REACT_APP_API_URL + quotationFilePath} alt='img' /> */}
                      <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                    </div>
                  </div>
                  <div
                    className={quotationFilePath === '' ? 'col-lg-10 fv-row' : 'col-lg-8 fv-row'}
                  >
                    <input
                      type='file'
                      accept='.pdf'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      onChange={(e) => imageUploadQuotation(e)}
                    />
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
                <Link className='btn btn-danger ms-3' to={{pathname:'/accounts/debit-note/list',state:{search:state.SearchText}}}>
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ----------------------------Vendor Model PopUp---------------------- */}
      <Modal size='xl' scrollable={true} show={showVendor} onHide={handleCloseVendor}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Vendor Data</Modal.Title>
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
                          className={'bg-hover-light-primary text-hover-primary'}
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
                    })}{' '}
                  {/* =================== Loading get Api Data ============== */}
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
      {/* ----------------------------Purchase Selection Model---------------------- */}
      <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Purchase Data</Modal.Title>
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
                  onChange={filterPurchase}
                  value={namePurchase}
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
                      <span className='d-block mb-1 ps-1'>Purchase Date</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Voucher No</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Vendor Name</span>
                    </th>
                    {/* <th className='min-w-150px'>
                      <span className='d-block mb-1'>Item Qty</span>
                    </th> */}
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>PO Amount</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Paid Amount</span>
                    </th>
                    <th className='min-w-155px'>
                      <span className='d-block mb-1'>Remaining Amount</span>
                    </th>
                    {/* <th className='min-w-150px'>
                      <span className='d-block mb-1'>Project Status</span>
                    </th> */}
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {currentPostsPurchase.length > 0 &&
                    currentPostsPurchase.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          // className={
                          //   data.isActive === false
                          //     ? 'd-none'
                          //     : 'bg-hover-light-primary text-hover-primary'
                          // }
                          className={'bg-hover-light-primary text-hover-primary'}
                          onClick={() => selectPurchase(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.purchaseDate}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.voucherNo}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.vendorName}
                            </span>
                          </td>
                          {/* <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.itemQty}
                            </span>
                          </td> */}
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.totalAmount}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.paidAmount}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.remainingAmount}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  {/* =================== Loading get Api Data ============== */}
                  <BlankDataImageInTable
                    length={currentPostsPurchase.length}
                    loading={state.loading}
                    colSpan={9}
                  />
                </tbody>
              </table>
            </div>
            <div className='text-center'>
              <Pagination
                onChange={(value: any) => setPagePurchase(value)}
                pageSize={postPerPagePurchase}
                total={totalPurchase}
                current={pagePurchase}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChangePurchase}
                showTotal={(total) => `Total ${total} items`}
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

export {EditDebitNote}
