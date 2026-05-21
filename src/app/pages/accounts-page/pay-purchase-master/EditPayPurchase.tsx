import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Button, Modal} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
import {gstTypeData, venderTypeData} from '../../other-dropDowns/otherDropDowns'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {
  IPayFundModel,
  payFundInitValues as initialValues,
} from '../../../models/Accounts-page/pay-fund-page/IPayFundModel'
import {Pagination} from 'antd'
import {IProjectVendorMapModel} from '../../../models/projects-page/IProjectsModel'
import {ICashAccountModel} from '../../../models/organization-page/cashaccount/ICashAccountModel'
import {GetCashAccountListAPI} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {IEmployeeBankDetailsModel} from '../../../models/organization-page/Employee/IEmployeeBankDetailsModel'
import {getEmpBankDetailsByEmpID} from '../../../modules/organization-page/employee-master-page/bank-details/EmployeeBankDetailsCRUD'
import {getVenderListByVendorTypeID} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import moment from 'moment'
import {
  UpdatePurchaseFundPayDetails,
  GetPurchaseListByVendorID,
  GetPayPurchaseFundByPurchasePaymentIDApi,
} from '../../../modules/account-page/pay-purchase-master-page/PayPurchaseCRUD'
import {IPurchasetModel} from '../../../models/Accounts-page/pay-purchase-page copy/IPayPurchaseModel'
import {GetProjectListByVendorID} from '../../../modules/account-page/pay-fund-master-page/PayFundCRUD'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'

const profileDetailsSchema = Yup.object().shape({
  vendorTypeID: Yup.number().required('Field is required').min(1, 'Field is required'),
  cashAccountID: Yup.number().required('Field is required').min(1, 'Field is required'),
  transactionModeID: Yup.number().required('Field is required').min(1, 'Field is required'),
})

interface IPayPurchase {
  selCashAccountTypeID: number
  selCustomerId: number
  selPurchaseID: number
  loading: boolean
  purchaseData: IPurchasetModel[]
  temPurchaseData: IPurchasetModel[]
  cashAccountData: ICashAccountModel[]
  proVendroMapData: IProjectVendorMapModel[]
  vendorData: IVenderModel[]
  tmpVendorData: IVenderModel[]
  selVendorTypeID: number
  selpaymentID: number
  selEmployeeBankID: number
  selTypeID: number
  selEmpId: number
  selVendorID: number
  selGstTypeID: number
  vendorID: number
  selRemAmnt: number
  mainSearch: string
}

const EditPayPurchase: React.FC = () => {
  const [data, setData] = useState<IPayFundModel>(initialValues)
  const [Tds, setTds] = useState<string>('1')
  const [tdsAmount, setTdsAmount] = useState<string>('')
  const [afterTDSAmount, setAfterTDSAmount] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [cgstPer, setCgstPer] = useState<string>('')
  const [cgstVal, setCgstVal] = useState<string>('')
  const [sgstVal, setSgstVal] = useState<string>('')
  const [sgstPer, setSgstPer] = useState<string>('')
  const [igstVal, setIgstVal] = useState<string>('')
  const [igstPer, setIgstPer] = useState<string>('')
  const [gstAmount, setGstAmount] = useState<string>('')
  const {purchasePaymentID} = useParams<{purchasePaymentID: string}>()
  const [afterGstAmount, setAfterGstAmount] = useState<string>('')
  const [finalAmount, setFinalAmount] = useState<string>('')
  const [isgst, setIsgst] = useState(false)
  const [isTdsDeduct, setIsTdsDeduct] = useState(false)
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [quotationFilePath, setQuotationFilePath] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [empBankData, setEmpBankData] = useState<IEmployeeBankDetailsModel[]>(
    [] as IEmployeeBankDetailsModel[]
  )
  const updateData = (fieldsToUpdate: Partial<IPayFundModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IPayPurchase>({
    loading: false,
    selCustomerId: 0,
    selCashAccountTypeID: 0,
    selPurchaseID: 0,
    purchaseData: [] as IPurchasetModel[],
    temPurchaseData: [] as IPurchasetModel[],
    cashAccountData: [] as ICashAccountModel[],
    vendorData: [] as IVenderModel[],
    tmpVendorData: [] as IVenderModel[],
    proVendroMapData: [] as IProjectVendorMapModel[],
    selVendorTypeID: 0,
    selpaymentID: 0,
    selEmployeeBankID: 0,
    selTypeID: 0,
    selEmpId: 0,
    selVendorID: 0,
    selGstTypeID: 0,
    vendorID: 0,
    selRemAmnt: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc.mainSearch != undefined) {
        mainSearch = lc.mainSearch
      }
      getCashAccountData(mainSearch)
    }, 100)
  }, [])

  function getCashAccountData(mainSearch: string) {
    GetCashAccountListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          GetPayPurchaseFundByPurchasePaymentID(responseData, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, cashAccountData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, cashAccountData: [], loading: false})
      })
  }

  function GetPayPurchaseFundByPurchasePaymentID(
    cashAccountData: ICashAccountModel[],
    mainSearch: string
  ) {
    GetPayPurchaseFundByPurchasePaymentIDApi(parseInt(purchasePaymentID))
      .then((response) => {
        if (response.data.isSuccess) {
          const responseData = response.data
          let temVendorID = responseData.vendorID
          let temPurchaseID = responseData.purchaseID
          let temVendorTypeID = responseData.vendorTypeID
          let temCasAccID = responseData.cashAccountID
          let temCasAccBankID = responseData.cashAccountBankID
          let temTrnsModeID = responseData.transactionModeID
          let temProjectVendorID = responseData.projectVendorID
          let temGstTypeID = responseData.gstTypeID
          formik.setFieldValue('projectName', responseData.projectName)
          formik.setFieldValue('vendorTypeID', temVendorTypeID)
          formik.setFieldValue('purchaseID', temPurchaseID)
          formik.setFieldValue('projectVendorID', temProjectVendorID)
          formik.setFieldValue('transactionModeID', temTrnsModeID)
          formik.setFieldValue('description', responseData.description)
          formik.setFieldValue('projectInvoiceNo', responseData.projectInvoiceNo)
          formik.setFieldValue('cashAccountBankID', temCasAccBankID)
          formik.setFieldValue('transactionID', responseData.transactionID)
          formik.setFieldValue('cashAccountID', temCasAccID)
          formik.setFieldValue('vendorID', temVendorID)
          formik.setFieldValue('vendorInvoiceNo', responseData.vendorInvoiceNo)
          formik.setFieldValue('chequeBankName', responseData.chequeBankName)
          formik.setFieldValue('chequeNumber', responseData.chequeNumber)
          formik.setFieldValue('chequeBankBranch', responseData.chequeBankBranch)
          formik.setFieldValue('chequeDate', responseData.chequeDate)
          formik.setFieldValue('gstTypeID', responseData.gstTypeID)
          formik.setFieldValue('chequeAmount', responseData.chequeAmount)
          setTdsAmount(responseData.tdsAmount)
          setAfterTDSAmount(responseData.afterTDSAmount)
          setAmount(responseData.amount)
          setFinalAmount(responseData.finalAmount)
          setGstAmount(responseData.gstAmount)
          setAfterGstAmount(responseData.afterGSTAmount)
          setCgstPer(responseData.cgstPer)
          setCgstVal(responseData.cgstVal)
          setSgstPer(responseData.sgstPer)
          setSgstVal(responseData.sgstVal)
          setIgstPer(responseData.igstPer)
          setIgstVal(responseData.igstval)
          setIsgst(responseData.isgst)
          setIsTdsDeduct(responseData.isTdsDeduct)
          setTds(responseData.tdsPercentage)
          setQuotationFilePath(responseData.filePath)
          getPurchaseDataByAndVendorID(
            cashAccountData,
            mainSearch,
            temVendorID,
            temPurchaseID,
            temProjectVendorID,
            temVendorTypeID,
            temCasAccID,
            temCasAccBankID,
            temTrnsModeID,
            temGstTypeID
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            cashAccountData: cashAccountData,
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          cashAccountData: cashAccountData,
          loading: false,
        })
      })
  }

  // --------For Model Data onClick Function-------
  function getPurchaseDataByAndVendorID(
    cashAccountData: ICashAccountModel[],
    mainSearch: string,
    temVendorID: number,
    temPurchaseID: number,
    temProjectVendorID: number,
    temVendorTypeID: number,
    temCasAccID: number,
    temCasAccBankID: number,
    temTrnsModeID: number,
    temGstTypeID: number
  ) {
    GetPurchaseListByVendorID(temVendorID).then((resp) => {
      const responseData = resp.data.responseObject
      getVenderByVendorTypeIDDataList(
        cashAccountData,
        mainSearch,
        temVendorID,
        temPurchaseID,
        temProjectVendorID,
        temVendorTypeID,
        temCasAccID,
        temCasAccBankID,
        temTrnsModeID,
        temGstTypeID,
        responseData
      )
    })
    setShow(false)
  }

  function getVenderByVendorTypeIDDataList(
    cashAccountData: ICashAccountModel[],
    mainSearch: string,
    temVendorID: number,
    temPurchaseID: number,
    temProjectVendorID: number,
    temVendorTypeID: number,
    temCasAccID: number,
    temCasAccBankID: number,
    temTrnsModeID: number,
    temGstTypeID: number,
    purchaseData: IPurchasetModel[]
  ) {
    getVenderListByVendorTypeID(temVendorTypeID)
      .then((response) => {
        const responseData = response.data.responseObject
        let tmpPurchaseID: number = 0
        let tmpvendorID: number = 0
        let selRemAmnt: number = 0
        if (response.data.isSuccess == true) {
          const Rows = purchaseData
          for (let key in Rows) {
            if (Rows[key].purchaseID === temPurchaseID) {
              formik.setFieldValue('purchaseID', Rows[key].purchaseID)
              formik.setFieldValue('vendorName', Rows[key].vendorName)
              formik.setFieldValue('remainingAmount', Rows[key].remainingAmount)
              formik.setFieldValue('paidAmount', Rows[key].paidAmount)
              formik.setFieldValue('totalAmount', Rows[key].totalAmount)
              formik.setFieldValue('itemName', Rows[key].itemName)
              formik.setFieldValue('voucherNumber', Rows[key].voucherNo)
              formik.setFieldValue('remeningAmount', Rows[key].remainingAmount)
              formik.setFieldValue('itemQty', Rows[key].itemQty)
              formik.setFieldValue('itemDescr', Rows[key].itemDescr)
              tmpPurchaseID = Rows[key].purchaseID
              selRemAmnt = parseInt(Rows[key].remainingAmount)
              break
            }
          }

          const Row = responseData
          for (let key in Row) {
            if (Row[key].vendorID === temVendorID)
              formik.setFieldValue('vendorID', Row[key].vendorID)
            formik.setFieldValue('companyName', Row[key].companyName)
            formik.setFieldValue('contactPerson', Row[key].contactPerson)
            formik.setFieldValue('contactNumber', Row[key].contactNumber)
            tmpvendorID = Row[key].vendorID
            break
          }

          setState({
            ...state,
            cashAccountData: cashAccountData,
            mainSearch,

            vendorData: responseData,
            tmpVendorData: responseData,
            selpaymentID: temTrnsModeID,
            selEmployeeBankID: temCasAccBankID,
            selVendorTypeID: temVendorTypeID,
            selCashAccountTypeID: temCasAccID,
            selPurchaseID: tmpPurchaseID,
            selVendorID: tmpvendorID,
            selGstTypeID: temGstTypeID,
            purchaseData: purchaseData,
            temPurchaseData: purchaseData,
            selRemAmnt: selRemAmnt,
            loading: false,
          })
          setTotal(purchaseData.length)
          setPage(1)
          setTotalVendor(responseData.length)
          setPageVendor(1)
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

  function getVenderByVendorTypeIDData(temVendorTypeID: number) {
    state.selVendorTypeID = 0
    state.selVendorID = 0
    formik.setFieldValue('vendorID', 0)
    formik.setFieldValue('companyName', '')
    formik.setFieldValue('contactPerson', '')
    formik.setFieldValue('contactNumber', '')
    getVenderListByVendorTypeID(temVendorTypeID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            vendorData: responseData,
            selVendorTypeID: temVendorTypeID,
            loading: false,
          })
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

  function getAllEmpBankDetailsDataByEmpID(empID: number) {
    state.vendorData = []
    getEmpBankDetailsByEmpID(empID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          const responseData = response.data.responseObject
          setEmpBankData(responseData)
        } else {
          toast.error(`${response.data.message}`)
          setEmpBankData([])
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setEmpBankData([])
      })
  }

  function getAllPurchaseData(vendorID: number) {
    GetPurchaseListByVendorID(vendorID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            purchaseData: responseData,
            temPurchaseData: responseData,
            selVendorID: vendorID,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            purchaseData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          purchaseData: [],
          loading: false,
        })
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
  function selectVendor(tmpVendorData: IVenderModel) {
    state.selPurchaseID = 0
    formik.setFieldValue('purchaseID', 0)
    formik.setFieldValue('voucherNumber', '')
    formik.setFieldValue('purchaseDate', '')
    formik.setFieldValue('totalAmount', 0)
    formik.setFieldValue('remainingAmount', 0)
    formik.setFieldValue('paidAmount', 0)
    formik.setFieldValue('vendorID', tmpVendorData.vendorID)
    formik.setFieldValue('companyName', tmpVendorData.companyName)
    formik.setFieldValue('contactPerson', tmpVendorData.contactPerson)
    formik.setFieldValue('contactNumber', tmpVendorData.contactNumber)
    getAllPurchaseData(tmpVendorData.vendorID)
    setShowVendor(false)
  }

  // ======================= Project Model PopUp ======================
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }

  function selectPurchase(tmpPurchaseData: IPurchasetModel) {
    formik.setFieldValue('purchaseID', tmpPurchaseData.purchaseID)
    formik.setFieldValue('voucherNumber', tmpPurchaseData.voucherNo)
    formik.setFieldValue('purchaseDate', tmpPurchaseData.purchaseDate)
    formik.setFieldValue('totalAmount', tmpPurchaseData.totalAmount)
    formik.setFieldValue('remainingAmount', tmpPurchaseData.remainingAmount)
    formik.setFieldValue('paidAmount', tmpPurchaseData.paidAmount)
    formik.setFieldValue('itemQty', tmpPurchaseData.itemQty)
    formik.setFieldValue('itemName', tmpPurchaseData.itemName)
    formik.setFieldValue('voucherNo', tmpPurchaseData.voucherNo)
    formik.setFieldValue('itemDescr', tmpPurchaseData.itemDescr)
    setState({
      ...state,
      selPurchaseID: tmpPurchaseData.purchaseID,
      selRemAmnt: parseInt(tmpPurchaseData.remainingAmount),
    })
    setShow(false)
  }

  // -----------------upload File ----------------------
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/PurchasePayment/AddPurchasePayFundFilePath', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setQuotationFilePath(data)
        setFileLoader(false)
      })
  }

  //   ------View on other tab --------------
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

  // =================-------------------------- Vendor Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [totalVendor, setTotalVendor] = useState(0) //  length
  const [pageVendor, setPageVendor] = useState(1)
  const [postPerPageVendor, setPostPerPageVendor] = useState(10)
  const indexOfLastPageVendor = pageVendor * postPerPageVendor
  const indexOfFirstPageVendor = indexOfLastPageVendor - postPerPageVendor
  const currentPostsVendor: IVenderModel[] = state.vendorData.slice(
    indexOfFirstPageVendor,
    indexOfLastPageVendor
  )
  const onShowSizeChangeVendor = (current: any, pageSize: any) => {
    setPostPerPageVendor(pageSize)
  }
  // ===================== For Vendor Filter =====================
  const [nameVendor, setNameVendor] = useState('')

  const filterVendor = (e: any) => {
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
      setTotalVendor(results.length)
      setPageVendor(1)
    } else {
      setState({...state, vendorData: state.tmpVendorData})
      setTotalVendor(state.tmpVendorData.length)
      setPageVendor(1)
    }
    setNameVendor(keyword)
  }

  function checkedFunction(event: any) {
    const elementId = event.target.id
    if (elementId === 'isTdsDeduct') {
      if (parseInt(amount) > 0.0) {
        setIsTdsDeduct(event.target.checked)
      } else {
        toast.error('Please Enter Amount')
      }
      if (event.target.checked === true) {
        const tdsamount: any = (parseInt(amount) * parseInt(Tds)) / 100
        const afteramount: any = parseInt(amount) - tdsamount
        setTdsAmount(tdsamount)
        setAfterTDSAmount(afteramount)
        if (isgst === true) {
          const tmpFinalAmnt: any = parseInt(afterGstAmount) - tdsamount
          setFinalAmount(tmpFinalAmnt)
        } else {
          setFinalAmount(afteramount)
        }
      }
      if (event.target.checked === false) {
        setTdsAmount('')
        setAfterTDSAmount('')
        setTds('0')
        if (isgst === true) {
          const tmpFinalAmnt: any = parseInt(afterGstAmount)
          setFinalAmount(tmpFinalAmnt)
        } else {
          setFinalAmount(amount)
        }
      }
    } else if (elementId === 'isgst') {
      if (parseInt(amount) > 0.0) {
        setIsgst(event.target.checked)
      } else {
        toast.error('Please Enter Amount')
      }
      if (event.target.checked === false) {
        setIsgst(event.target.checked)
        setState({...state, selGstTypeID: 0})
        setGstAmount('')
        setAfterGstAmount('')
        setCgstPer('')
        setCgstVal('')
        setSgstVal('')
        setSgstPer('')
        setIgstVal('')
        setIgstPer('')
        if (isTdsDeduct === true) {
          const tmpFinalAmnt: any = parseInt(amount) - parseInt(tdsAmount)
          setFinalAmount(tmpFinalAmnt)
        } else {
          setFinalAmount(amount)
        }
      }
    }
  }
  //-----------------------------------------------

  function handleChange(event: any) {
    const tmpValue = event.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      const tdsamount: any = (parseInt(amount) * parseInt(tmpValue)) / 100
      const afteramount: any = parseInt(amount) - tdsamount
      setTdsAmount(tdsamount)
      if (isTdsDeduct === true) {
        const tmpFinalAmnt: any = parseInt(amount) - tdsamount
        setFinalAmount(tmpFinalAmnt)
        setAfterTDSAmount(afteramount)
      }
      if (isgst === true) {
        const tmpFinalAmnt: any = parseInt(afterGstAmount) - tdsamount
        setFinalAmount(tmpFinalAmnt)
        setAfterTDSAmount(afteramount)
      }
      setTds(tmpValue)
    } else if (tmpValue === '') {
      formik.setFieldValue('tdsAmount', 0)
      setAfterTDSAmount('')
      setTds('0')
    }
  }

  function handleAmtChange(event: any) {
    const tmpValue = event.target.value
    const tmpID = event.target.id
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      if (tmpID === 'amount') {
        if (tmpValue === '') {
          setAmount('')
          setTdsAmount('')
          setAfterTDSAmount('')
        } else {
          const tdsamount: any = (parseInt(tmpValue) * parseInt(Tds)) / 100
          const afteramount: any = parseInt(tmpValue) - tdsamount
          setAmount(tmpValue)
          setTdsAmount(tdsamount)
          setAfterTDSAmount(afteramount)
          setFinalAmount(tmpValue)
          if (isTdsDeduct === true) {
            if (isTdsDeduct === true) {
              const tdsamount: any = (parseInt(tmpValue) * parseInt(Tds)) / 100
              const afteramount: any = parseInt(tmpValue) - tdsamount
              setAmount(tmpValue)
              setTdsAmount(tdsamount)
              setAfterTDSAmount(afteramount)
              setFinalAmount(afteramount)
            }
          }
          if (isgst == true) {
            if (state.selGstTypeID === 1) {
              const tmpCgstVal: any = (parseInt(tmpValue) * parseInt(cgstPer)) / 100
              setCgstVal(tmpCgstVal)
              const tmpSgstVal: any = (parseInt(tmpValue) * parseInt(sgstPer)) / 100
              setSgstVal(tmpSgstVal)
              const tmpGstAmnt: any = tmpCgstVal + tmpSgstVal
              setGstAmount(tmpGstAmnt)
              const tmpAftGstAmnt: any = parseInt(tmpValue) + tmpGstAmnt
              setAfterGstAmount(tmpAftGstAmnt)
              setFinalAmount(tmpAftGstAmnt)
            } else if (state.selGstTypeID === 2) {
              const tmpIgstVal: any = (parseInt(tmpValue) * parseInt(igstPer)) / 100
              setIgstVal(tmpIgstVal)
              const tmpGstAmnt: any = tmpIgstVal
              setGstAmount(tmpGstAmnt)
              const tmpAftGstAmnt: any = parseInt(tmpValue) + tmpGstAmnt
              setAfterGstAmount(tmpAftGstAmnt)
              setFinalAmount(tmpAftGstAmnt)
            } else {
              setGstAmount('')
              setAfterGstAmount('')
              setCgstPer('')
              setCgstVal('')
              setSgstVal('')
              setSgstPer('')
              setIgstVal('')
              setIgstPer('')
            }
          }
        }
      } else if (tmpID === 'cgstPer') {
        setCgstPer(tmpValue)
        const tmpCgstVal: any = (parseInt(amount) * parseInt(tmpValue)) / 100
        setCgstVal(tmpCgstVal)
        setGstAmount(tmpCgstVal)
        const tmpAftGstAmnt: any = parseInt(amount) + tmpCgstVal
        setAfterGstAmount(tmpAftGstAmnt)
        const tmpFinlAmnt: any = parseInt(amount) + tmpAftGstAmnt
        setFinalAmount(tmpFinlAmnt)
      } else if (tmpID === 'sgstPer') {
        setSgstPer(tmpValue)
        const tmpSgstVal: any = (parseInt(amount) * parseInt(tmpValue)) / 100
        setSgstVal(tmpSgstVal)
        const tmpGstAmnt: any = tmpSgstVal + cgstVal
        setGstAmount(tmpGstAmnt)
        const tmpAftGstAmnt: any = parseInt(amount) + tmpGstAmnt
        setAfterGstAmount(tmpAftGstAmnt)
        const tmpFinlAmnt: any = parseInt(amount) + tmpGstAmnt
        setFinalAmount(tmpFinlAmnt)
      } else if (tmpID === 'igstPer') {
        setIgstPer(tmpValue)
        const tmpIgstVal: any = (parseInt(amount) * parseInt(tmpValue)) / 100
        setIgstVal(tmpIgstVal)
        const tmpGstAmnt: any = tmpIgstVal
        setGstAmount(tmpGstAmnt)
        const tmpAftGstAmnt: any = parseInt(amount) + tmpGstAmnt
        setAfterGstAmount(tmpAftGstAmnt)
        setFinalAmount(tmpAftGstAmnt)
      } else if (tmpValue === '') {
        setTdsAmount('')
        setAfterTDSAmount('')
        setAmount('')
        setFinalAmount('')
        setGstAmount('')
        setAfterGstAmount('')
        setCgstPer('')
        setCgstVal('')
        setSgstVal('')
        setSgstPer('')
        setIgstVal('')
        setIgstPer('')
      }
    } else {
      setTdsAmount('')
      setAfterTDSAmount('')
      setAmount('')
      setFinalAmount('')
      setGstAmount('')
      setAfterGstAmount('')
      setCgstPer('')
      setCgstVal('')
      setSgstVal('')
      setSgstPer('')
      setIgstVal('')
      setIgstPer('')
    }
  }
  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IPurchasetModel[] = state.purchaseData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  // ===================== For Project Filter =====================
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temPurchaseData.filter((user) => {
        return (
          user.vendorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.itemDescr.toLowerCase().includes(keyword.toLowerCase()) ||
          user.totalAmount.toString().includes(keyword.toString()) ||
          user.remainingAmount.toString().includes(keyword.toString()) ||
          user.paidAmount.toString().includes(keyword.toString()) ||
          user.voucherNo.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, purchaseData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, purchaseData: state.temPurchaseData})
      setTotal(state.temPurchaseData.length)
      setPage(1)
    }
    setName(keyword)
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'cashAccountID') {
      const typeId = event.target.selectedOptions[0].id
      const empID = event.target.selectedOptions[0].lang
      formik.setFieldValue('cashAccountID', parseInt(value))
      setState({
        ...state,
        selCashAccountTypeID: parseInt(value),
        selTypeID: parseInt(typeId),
        selEmpId: parseInt(empID),
        selEmployeeBankID: 0,
        selpaymentID: 0,
      })
      if (parseInt(value) === 0) {
        return
      } else {
        getAllEmpBankDetailsDataByEmpID(parseInt(empID))
      }
    } else if (elementId === 'transactionModeID') {
      formik.setFieldValue('transactionModeID', parseInt(value))
      setState({...state, selpaymentID: parseInt(value), selEmployeeBankID: 0})
    } else if (elementId === 'cashAccountBankID') {
      formik.setFieldValue('cashAccountBankID', parseInt(value))
      setState({...state, selEmployeeBankID: parseInt(value)})
    } else if (elementId === 'vendorTypeID') {
      formik.setFieldValue('vendorTypeID', parseInt(value))
      setState({...state, selVendorTypeID: 0})
      getVenderByVendorTypeIDData(parseInt(value))
    } else if (elementId === 'gstTypeID') {
      formik.setFieldValue('gstTypeID', parseInt(value))
      setCgstPer('')
      setCgstVal('')
      setGstAmount('')
      setAfterGstAmount('')
      setSgstPer('')
      setSgstVal('')
      setIgstPer('')
      setIgstVal('')
      setState({...state, selGstTypeID: parseInt(value)})
    }
  }

  const formik = useFormik<IPayFundModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        let temCheckNo: string = ''
        let temBankName: string = ''
        let temBranchName: string = ''
        let temCheckDate: string = ''
        let temCheckAmnt: number = 0
        let temSGSTVal: any = 0
        let temCGSTVal: any = 0
        let temIGSTVal: any = 0
        let temSGSTPer: any = 0
        let temCGSTPer: any = 0
        let temIGSTPer: any = 0
        let temGSTAmnt: any = 0
        let temAfteGSTAmnt: any = 0
        let temTdsPer: any = 0
        let temTdsAmnt: any = 0
        let temAfteTdsAmnt: any = 0
        if (values.paymentDate > moment(new Date()).format('YYYY-MM-DD')) {
          toast.error(`Date should be less than or Equal to today's date`)
          return setLoading(false)
        }
        if (state.selpaymentID === 2) {
          // if (values.chequeAmount === 0) {
          //   toast.error(`Check Amount is required.`)
          //   return setLoading(false)
          // } else {
          temCheckAmnt = values.chequeAmount
          // }
          // if (values.chequeBankName === '') {
          //   toast.error(`Bank Name is required.`)
          //   return setLoading(false)
          // } else {
          temBankName = values.chequeBankName
          // }
          // if (values.chequeBankBranch === '') {
          //   toast.error(`Branch Name is required.`)
          //   return setLoading(false)
          // } else {
          temBranchName = values.chequeBankBranch
          // }
          // if (values.chequeDate === '') {
          //   toast.error(`Check Date is required.`)
          //   return setLoading(false)
          // } else {
          temCheckDate = values.chequeDate
          // }
          if (values.chequeNumber === '') {
            toast.error(`Check Number is required.`)
            return setLoading(false)
          } else {
            temCheckNo = values.chequeNumber
          }
        }

        if (isgst === true) {
          if (state.selGstTypeID == 1) {
            temCGSTVal = cgstVal
            temSGSTVal = sgstVal
            temCGSTPer = cgstPer
            temSGSTPer = sgstPer
            temGSTAmnt = gstAmount
            temAfteGSTAmnt = afterGstAmount
          } else {
            temIGSTVal = igstVal
            temIGSTPer = igstPer
            temGSTAmnt = gstAmount
            temAfteGSTAmnt = afterGstAmount
          }
        }

        if (isTdsDeduct === true) {
          temTdsPer = Tds
          temTdsAmnt = tdsAmount
          temAfteTdsAmnt = afterTDSAmount
        }

        if (parseInt(amount) > state.selRemAmnt) {
          toast.error('Plese Enter Sub Total Amount Less Then Equal To Remening Amount')
          return setLoading(false)
        }

        UpdatePurchaseFundPayDetails(
          parseInt(purchasePaymentID),
          state.selVendorID,
          state.selPurchaseID,
          values.paymentDate,
          parseInt(amount),
          values.cashAccountID,
          values.transactionModeID,
          values.transactionID,
          temBankName,
          temBranchName,
          temCheckDate,
          temCheckAmnt,
          temCheckNo,
          values.cashAccountBankID,
          values.vendorInvoiceNo,
          values.description,
          quotationFilePath,
          isTdsDeduct,
          isgst,
          values.gstTypeID,
          temCGSTVal,
          temSGSTVal,
          temIGSTVal,
          temGSTAmnt,
          temTdsPer,
          user.employeeID,
          '192.168.0.1',
          temTdsAmnt,
          temSGSTPer,
          temCGSTPer,
          temIGSTPer,
          temAfteTdsAmnt,
          temAfteGSTAmnt,
          parseInt(finalAmount)
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/accounts/pay-for-purchase/list',
                state: {Search: state.mainSearch},
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
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9 ms-6'>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'> Select Vendor Type:</span>
                </label>
                <div className='col-lg-3 fv-row'>
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
              </div>
              <div className='row mb-6'>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Vendor:
                </label>
                <div className={state.selVendorID > 0 ? 'col-lg-3 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Select Vendor'
                    disabled
                    {...formik.getFieldProps('companyName')}
                  />
                </div>
                <div className='col-lg-1 fv-row'>
                  <div
                    className='btn btn-icon btn-bg-success bg-hover-dark text-hover-inverse-dark btn-md me-1 p-5 ms-6'
                    onClick={handleShowVendor}
                  >
                    <KTSVG
                      path='/media/icons/duotune/general/gen004.svg'
                      className='svg-icon-3 svg-icon-white'
                    />
                  </div>
                </div>
              </div>
              <div className={state.selVendorID === 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Contact Person:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Contact Person'
                    disabled
                    {...formik.getFieldProps('contactPerson')}
                  />
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Contact Number:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Contact Number'
                    disabled
                    {...formik.getFieldProps('contactNumber')}
                  />
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Purchase:
                </label>
                <div className={state.selPurchaseID > 0 ? 'col-lg-3 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Select Purchase'
                    disabled
                    {...formik.getFieldProps('voucherNumber')}
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

                <label
                  className={
                    state.selPurchaseID === 0 ? 'd-none' : 'col-lg-2 col-form-label fw-bold fs-6'
                  }
                >
                  <span className=''>PO Amount:</span>
                </label>
                <div className={state.selPurchaseID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Purchase Amount'
                    disabled
                    {...formik.getFieldProps('totalAmount')}
                  />
                </div>
              </div>
              <div
                className={
                  state.selPurchaseID === 0 && state.selPurchaseID === 0 ? 'd-none' : 'row mb-6'
                }
              >
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Paid Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Paid Amount'
                    disabled
                    {...formik.getFieldProps('paidAmount')}
                  />
                </div>
                <label
                  className={
                    state.selPurchaseID === 0 ? 'd-none' : 'col-lg-3 col-form-label fw-bold fs-6'
                  }
                >
                  <span className=''>Remening Amount:</span>
                </label>
                <div className={state.selPurchaseID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg  border-0 bg-white'
                    placeholder='Remening Amount'
                    disabled
                    {...formik.getFieldProps('remainingAmount')}
                  />
                </div>
              </div>

              <div className={state.selPurchaseID > 0 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Sub Total:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Amount'
                    value={amount}
                    id='amount'
                    onChange={handleAmtChange}
                  />
                </div>
              </div>

              <div className={state.selPurchaseID > 0 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>IS GST:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      id='isgst'
                      checked={isgst}
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
                <label
                  className={isgst === true ? 'col-lg-3 col-form-label  fw-bold fs-6' : 'd-none'}
                >
                  GST Type :
                </label>
                <div className={isgst === true ? 'col-lg-3 fv-row' : 'd-none'}>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='gstTypeID'
                  >
                    <option selected={state.selGstTypeID === 0 ? true : false} value={0}>
                      Select GST Type
                    </option>
                    {gstTypeData.length > 0 &&
                      gstTypeData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.gstTypeID}
                            selected={state.selGstTypeID == data.gstTypeID ? true : false}
                          >
                            {data.gstTypeName}
                          </option>
                        )
                      })}
                  </select>
                </div>
                {formik.touched.gstTypeID && formik.errors.gstTypeID && (
                  <div className='fv-plugins-message-container text-danger'>
                    <div className='fv-help-block'>{formik.errors.gstTypeID}</div>
                  </div>
                )}
              </div>
              <div
                className={
                  state.selPurchaseID > 0 && state.selGstTypeID === 1 && isgst === true
                    ? 'row mb-6'
                    : 'd-none'
                }
              >
                <label className={'col-lg-3 col-form-label fw-bold fs-6'}>CGST Percentage:</label>
                <div className={'col-lg-2 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='CGST Percentage'
                    id='cgstPer'
                    value={cgstPer}
                    onChange={handleAmtChange}
                  />
                </div>
                <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
                <label className={'col-lg-3 col-form-label fw-bold fs-6'}>CGST Amount:</label>
                <div className={'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='CGST Amount'
                    value={cgstVal}
                    disabled
                  />
                </div>
              </div>
              <div
                className={
                  state.selPurchaseID > 0 && state.selGstTypeID === 1 && isgst === true
                    ? 'row mb-6'
                    : 'd-none'
                }
              >
                <label className={'col-lg-3 col-form-label fw-bold fs-6'}>SGST Percentage:</label>
                <div className={'col-lg-2 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='SGST Percentage'
                    id='sgstPer'
                    value={sgstPer}
                    onChange={handleAmtChange}
                  />
                </div>
                <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
                <label className={'col-lg-3 col-form-label fw-bold fs-6'}>SGST Amount:</label>
                <div className={'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='SGST Amount'
                    value={sgstVal}
                    disabled
                  />
                </div>
              </div>
              <div
                className={
                  state.selPurchaseID > 0 && state.selGstTypeID === 2 && isgst === true
                    ? 'row mb-6'
                    : 'd-none'
                }
              >
                <label className={'col-lg-3 col-form-label fw-bold fs-6'}>IGST Percentage:</label>
                <div className={'col-lg-2 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='IGST Amount'
                    id='igstPer'
                    value={igstPer}
                    onChange={handleAmtChange}
                  />
                </div>
                <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
                <label className={'col-lg-3 col-form-label fw-bold fs-6'}>IGST Amount:</label>
                <div className={'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='IGST Amount'
                    value={igstVal}
                    disabled
                  />
                </div>
              </div>
              <div
                className={
                  state.selPurchaseID > 0 && state.selGstTypeID > 0 ? 'row mb-6' : 'd-none'
                }
              >
                <label className={'col-lg-3 col-form-label fw-bold fs-6'}>GST Amount:</label>
                <div className={'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='GST Amount'
                    value={gstAmount}
                    disabled
                  />
                </div>
                <label className={'col-lg-3 col-form-label fw-bold fs-6'}>After GST Amount:</label>
                <div className={'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='After GST Amount'
                    value={afterGstAmount}
                    disabled
                  />
                </div>
              </div>
              <div className={state.selPurchaseID > 0 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>IS TDS Deduct:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      id='isTdsDeduct'
                      checked={isTdsDeduct}
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
                <label
                  className={
                    isTdsDeduct === true
                      ? 'col-lg-3 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  TDS:
                </label>
                <div className={isTdsDeduct === true ? 'col-lg-2 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='tdsAmount'
                    value={Tds}
                    onChange={handleChange}
                  />
                </div>
                <span
                  className={
                    isTdsDeduct === true
                      ? 'col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'
                      : 'd-none'
                  }
                >
                  %
                </span>
              </div>
              <div
                className={state.selPurchaseID > 0 && isTdsDeduct === true ? 'row mb-6' : 'd-none'}
              >
                <label
                  className={
                    isTdsDeduct === true
                      ? 'col-lg-3 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  TDS Amount:
                </label>
                <div className={isTdsDeduct === true ? 'col-lg-3 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='tdsAmount'
                    disabled
                    value={tdsAmount}
                  />
                </div>
                <label
                  className={
                    isTdsDeduct === true
                      ? 'col-lg-3 col-form-label required fw-bold fs-6'
                      : 'd-none'
                  }
                >
                  After TDS Amount:
                </label>
                <div className={isTdsDeduct === true ? 'col-lg-3 fv-row' : 'd-none'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='afterTDSAmount'
                    value={afterTDSAmount}
                    disabled
                  />
                </div>
              </div>
              <div className={state.selPurchaseID > 0 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Final Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Final Amount'
                    value={finalAmount}
                    disabled
                  />
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Cash Account:
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='cashAccountID'
                  >
                    <option selected={state.selCashAccountTypeID === 0 ? true : false} value={0}>
                      Select Account Type
                    </option>
                    {state.cashAccountData.length > 0 &&
                      state.cashAccountData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.cashAccountID}
                            id={`${data.cashAccountTypeID}`}
                            lang={`${data.employeeID}`}
                            selected={
                              data.cashAccountID === state.selCashAccountTypeID ? true : false
                            }
                          >
                            {data.accountName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.cashAccountID && formik.errors.cashAccountID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.cashAccountID}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                  Select Payment Mode:
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='transactionModeID'
                  >
                    <option selected={state.selpaymentID === 0 ? true : false} value={0}>
                      Select Payment Mode
                    </option>
                    {state.selCashAccountTypeID === 0 ? (
                      'd-none'
                    ) : (
                      <option selected={state.selpaymentID === 1 ? true : false} value={1}>
                        Online
                      </option>
                    )}
                    {state.selCashAccountTypeID === 0 ? (
                      'd-none'
                    ) : (
                      <option selected={state.selpaymentID === 2 ? true : false} value={2}>
                        Cheque
                      </option>
                    )}
                    {state.selTypeID === 1 || state.selCashAccountTypeID === 0 ? (
                      'd-none'
                    ) : (
                      <option selected={state.selpaymentID === 3 ? true : false} value={3}>
                        Cash
                      </option>
                    )}
                  </select>
                  {formik.touched.transactionModeID && formik.errors.transactionModeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.transactionModeID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={
                  state.selTypeID === 2 && (state.selpaymentID === 1 || state.selpaymentID === 2)
                    ? 'row mb-6'
                    : 'd-none'
                }
              >
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  Select Employee Bank:
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='cashAccountBankID'
                  >
                    <option selected={state.selEmployeeBankID === 0 ? true : false} value={0}>
                      Select Employee Bank
                    </option>
                    {empBankData.length > 0 &&
                      empBankData.map((data, index) => {
                        return (
                          <option
                            key={index}
                            value={data.employeeBankID}
                            selected={
                              data.employeeBankID === state.selEmployeeBankID ? true : false
                            }
                          >
                            {data.bankName}
                          </option>
                        )
                      })}
                  </select>
                  {formik.touched.cashAccountBankID && formik.errors.cashAccountBankID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.cashAccountBankID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selpaymentID === 2 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'>Cheque No:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Cheque No'
                    {...formik.getFieldProps('chequeNumber')}
                  />
                  {formik.touched.chequeNumber && formik.errors.chequeNumber && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.chequeNumber}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span>Bank Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Bank Name'
                    {...formik.getFieldProps('chequeBankName')}
                  />
                  {formik.touched.chequeBankName && formik.errors.chequeBankName && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.chequeBankName}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selpaymentID === 2 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span>Branch Name:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Branch Name'
                    {...formik.getFieldProps('chequeBankBranch')}
                  />
                  {formik.touched.chequeBankBranch && formik.errors.chequeBankBranch && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.chequeBankBranch}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span>Cheque Amount:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Cheque Amount'
                    {...formik.getFieldProps('chequeAmount')}
                  />
                  {formik.touched.chequeAmount && formik.errors.chequeAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.chequeAmount}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selpaymentID === 2 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span>Cheque Date:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Cheque Date'
                    {...formik.getFieldProps('chequeDate')}
                  />
                  {formik.touched.chequeDate && formik.errors.chequeDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.chequeDate}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={state.selpaymentID === 1 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Transaction ID:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Transaction ID'
                    {...formik.getFieldProps('transactionID')}
                  />
                  {formik.touched.transactionID && formik.errors.transactionID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.transactionID}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>Payment Date:</label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Vendor Invoice No'
                    {...formik.getFieldProps('paymentDate')}
                  />
                  {formik.touched.paymentDate && formik.errors.paymentDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.paymentDate}</div>
                    </div>
                  )}
                </div>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>Vendor Invoice No.:</label>
                <div className='col-lg-3 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Vendor Invoice No'
                    {...formik.getFieldProps('vendorInvoiceNo')}
                  />
                  {formik.touched.vendorInvoiceNo && formik.errors.vendorInvoiceNo && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.vendorInvoiceNo}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className=''>Description:</span>
                </label>
                <div className='col-lg-9 fv-row'>
                  <textarea
                    rows={2}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Description'
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.description}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
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
                <div
                  className={
                    quotationFilePath === '' ? 'col-lg-9 fv-row mt-3' : 'col-lg-7 fv-row mt-3'
                  }
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
              <Link
                className='btn btn-danger ms-3'
                to={{
                  pathname: '/accounts/pay-for-purchase/list',
                  state: {Search: state.mainSearch},
                }}
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
                  onChange={filterVendor}
                  value={nameVendor}
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
                  {state.vendorData.length > 0 &&
                    state.vendorData.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          // className={
                          //   data.isActive === false
                          //     ? 'd-none'
                          //     : 'bg-hover-light-primary text-hover-primary'
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
                    length={currentPostsVendor.length}
                    loading={state.loading}
                    colSpan={9}
                  />
                </tbody>
              </table>
            </div>
            <div className='text-center'>
              <Pagination
                onChange={(value: any) => setPageVendor(value)}
                pageSize={postPerPageVendor}
                total={totalVendor}
                current={pageVendor}
                showSizeChanger
                showQuickJumper
                onShowSizeChange={onShowSizeChangeVendor}
                showTotal={(totalVendor) => `Total ${totalVendor} items`}
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
      {/* ----------------------------Project Selection Model---------------------- */}
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
                      <span className='d-block mb-1 ps-1'>Purchase Date</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Voucher Number</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Vendor Name</span>
                    </th>
                    {/*<th className='min-w-150px'>
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
                  {currentPosts.length > 0 &&
                    currentPosts.map((data, index) => {
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
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default EditPayPurchase
