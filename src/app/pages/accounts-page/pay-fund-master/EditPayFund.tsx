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
import {IProjectModel, IProjectVendorMapModel} from '../../../models/projects-page/IProjectsModel'
import {ICashAccountModel} from '../../../models/organization-page/cashaccount/ICashAccountModel'
import {GetCashAccountListAPI} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {IEmployeeBankDetailsModel} from '../../../models/organization-page/Employee/IEmployeeBankDetailsModel'
import {getEmpBankDetailsByEmpID} from '../../../modules/organization-page/employee-master-page/bank-details/EmployeeBankDetailsCRUD'
import {getVenderListByVendorTypeID} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {
  GetPayFundByProjectPaymentID,
  GetProjectListByVendorID,
  GetProjectListByVendorID_For_PayPaymentAPI,
  UpdateProjectFundPayDetails,
} from '../../../modules/account-page/pay-fund-master-page/PayFundCRUD'
import Loader from '../../common-pages/Loader'
import moment from 'moment'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'

const profileDetailsSchema = Yup.object().shape({
  vendorTypeID: Yup.number().required('Field is required').min(1, 'Field is required'),
  cashAccountID: Yup.number().required('Field is required').min(1, 'Field is required'),
  projectID: Yup.number().required('Field is required').min(1, 'Field is required'),
  transactionModeID: Yup.number().required('Field is required').min(1, 'Field is required'),
  // cashAccountBankID: Yup.number().required('Field is required').min(1, 'Field is required'),
  // amount: Yup.number().required('Field is required').min(1, 'Field is required'),
})

interface IDepartment {
  selCashAccountTypeID: number
  selTraModeID: number
  selCustomerId: number
  selcashBankID: number
  selProjectID: number
  loading: boolean
  projectData: IProjectModel[]
  temProjectData: IProjectModel[]
  cashAccountData: ICashAccountModel[]
  vendorData: IVenderModel[]
  tmpVendorData: IVenderModel[]
  proVendroMapData: IProjectVendorMapModel[]
  selVendorTypeID: number
  selpaymentID: number
  selEmployeeBankID: number
  selTypeID: number
  selEmpId: number
  selVendorID: number
  selGstTypeID: number
  mainVenderID: number
  mainStartTime: string
  mainEndTime: string
  mainSearch: string
}

const EditPayFund: React.FC = () => {
  const [data, setData] = useState<IPayFundModel>(initialValues)
  const [isTdsDeduct, setIsTdsDeduct] = useState(false)
  const {projectPaymentID} = useParams<{projectPaymentID: string}>()
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [Tds, setTds] = useState<string>('0')
  const [amount, setAmount] = useState<string>('')
  const [quotationFilePath, setQuotationFilePath] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [isgst, setIsgst] = useState(false)
  const history = useHistory()
  const [empBankData, setEmpBankData] = useState<IEmployeeBankDetailsModel[]>(
    [] as IEmployeeBankDetailsModel[]
  )
  const updateData = (fieldsToUpdate: Partial<IPayFundModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const location = useLocation()
  const [state, setState] = useState<IDepartment>({
    loading: false,
    selCustomerId: 0,
    selCashAccountTypeID: 0,
    selProjectID: 0,
    selTraModeID: 0,
    selcashBankID: 0,
    projectData: [] as IProjectModel[],
    temProjectData: [] as IProjectModel[],
    cashAccountData: [] as ICashAccountModel[],
    proVendroMapData: [] as IProjectVendorMapModel[],
    vendorData: [] as IVenderModel[],
    tmpVendorData: [] as IVenderModel[],
    selVendorTypeID: 0,
    selpaymentID: 0,
    selEmployeeBankID: 0,
    selTypeID: 0,
    selEmpId: 0,
    selVendorID: 0,
    selGstTypeID: 0,
    mainVenderID: 0,
    mainStartTime: '',
    mainEndTime: '',
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      // let mainVenderID: number = 0
      // let mainStartTime: string = ''
      // let mainEndTime: string = ''
      // let mainSearch: string = ''
      // if (
      //   lc.mainVenderID !== undefined ||
      //   lc.mainStartTime !== undefined ||
      //   lc.mainEndTime !== undefined ||
      //   lc.mainSearch !== undefined
      // ) {
      //   mainVenderID = lc.selVenderID
      //   mainStartTime = lc.selStartTime
      //   mainEndTime = lc.selEndTime
      //   mainSearch = lc.SearchText
      // }
      let mainVenderID: any = lc.VendorID
      let mainStartTime: any = lc.StartDate
      let mainEndTime: any = lc.EndTime
      let mainSearch: any = lc.SearchText
      getCashAccountData(mainVenderID, mainStartTime, mainEndTime, mainSearch)
    }, 100)
  }, [])

  function getCashAccountData(
    mainVenderID: number,
    mainStartTime: string,
    mainEndTime: string,
    mainSearch: string
  ) {
    GetCashAccountListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getProjectDataByProjectID(
            responseData,
            mainVenderID,
            mainStartTime,
            mainEndTime,
            mainSearch
          )
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, cashAccountData: [], projectData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, cashAccountData: [], projectData: [], loading: false})
      })
  }

  function getProjectDataByProjectID(
    cashAccountData: ICashAccountModel[],
    mainVenderID: number,
    mainStartTime: string,
    mainEndTime: string,
    mainSearch: string
  ) {
    GetPayFundByProjectPaymentID(parseInt(projectPaymentID))
      .then((response) => {
        if (response.data.isSuccess == true) {
          let temVendorID = response.data.vendorID
          let temProjectID = response.data.projectID
          let temVendorTypeID = response.data.vendorTypeID
          let temCasAccID = response.data.cashAccountID
          let temCasAccBankID = response.data.cashAccountBankID
          let temTrnsModeID = response.data.transactionModeID
          let temProjectVendorID = response.data.projectVendorID
          let temGstTypeID = response.data.gstTypeID
          formik.setFieldValue('projectName', response.data.projectName)
          formik.setFieldValue('vendorTypeID', temVendorTypeID)
          formik.setFieldValue('projectID', temProjectID)
          formik.setFieldValue('projectVendorID', temProjectVendorID)
          formik.setFieldValue('transactionModeID', temTrnsModeID)
          formik.setFieldValue('description', response.data.description)
          formik.setFieldValue('projectInvoiceNo', response.data.projectInvoiceNo)
          formik.setFieldValue('cashAccountBankID', temCasAccBankID)
          formik.setFieldValue('transactionID', response.data.transactionID)
          formik.setFieldValue('cashAccountID', temCasAccID)
          formik.setFieldValue('vendorID', temVendorID)
          formik.setFieldValue('vendorInvoiceNo', response.data.vendorInvoiceNo)
          formik.setFieldValue('chequeBankName', response.data.chequeBankName)
          formik.setFieldValue('chequeNumber', response.data.chequeNumber)
          formik.setFieldValue('chequeBankBranch', response.data.chequeBankBranch)
          formik.setFieldValue('chequeDate', response.data.chequeDate)
          formik.setFieldValue('paymentDate', response.data.paymentDate)
          formik.setFieldValue('chequeAmount', response.data.chequeAmount)
          formik.setFieldValue('tdsPercentage', response.data.tdsPercentage)
          formik.setFieldValue('gstTypeID', response.data.gstTypeID)
          formik.setFieldValue('cgstVal', response.data.cgstVal)
          formik.setFieldValue('sgstVal', response.data.sgstVal)
          formik.setFieldValue('igstVal', response.data.igstVal)
          formik.setFieldValue('sgstPer', response.data.sgstPer)
          formik.setFieldValue('cgstPer', response.data.cgstPer)
          formik.setFieldValue('igstPer', response.data.igstPer)
          formik.setFieldValue('gstAmount', response.data.gstAmount)
          formik.setFieldValue('tdsAmount', response.data.tdsAmount)
          formik.setFieldValue('afterTDSAmount', response.data.afterTDSAmount)
          formik.setFieldValue('afterGSTAmount', response.data.afterGSTAmount)
          formik.setFieldValue('finalAmount', response.data.finalAmount)
          setAmount(response.data.amount)
          setIsgst(response.data.isgst)
          setQuotationFilePath(response.data.filePath)
          setIsTdsDeduct(response.data.isTdsDeduct)
          getProjectDataByAndVendorID(
            cashAccountData,
            mainVenderID,
            mainStartTime,
            mainEndTime,
            mainSearch,
            temVendorID,
            temProjectID,
            temProjectVendorID,
            temVendorTypeID,
            temCasAccID,
            temCasAccBankID,
            temTrnsModeID,
            temGstTypeID
          )
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

  // --------For Model Data onClick Function-------
  function getProjectDataByAndVendorID(
    cashAccountData: ICashAccountModel[],
    mainVenderID: number,
    mainStartTime: string,
    mainEndTime: string,
    mainSearch: string,
    temVendorID: number,
    temProjectID: number,
    temProjectVendorID: number,
    temVendorTypeID: number,
    temCasAccID: number,
    temCasAccBankID: number,
    temTrnsModeID: number,
    temGstTypeID: number
  ) {
    GetProjectListByVendorID_For_PayPaymentAPI(temVendorID).then((resp) => {
      const responseData = resp.data.responseObject
      getVenderByVendorTypeIDDataList(
        cashAccountData,
        mainVenderID,
        mainStartTime,
        mainEndTime,
        mainSearch,
        temVendorID,
        temProjectID,
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
    mainVenderID: number,
    mainStartTime: string,
    mainEndTime: string,
    mainSearch: string,
    temVendorID: number,
    temProjectID: number,
    temProjectVendorID: number,
    temVendorTypeID: number,
    temCasAccID: number,
    temCasAccBankID: number,
    temTrnsModeID: number,
    temGstTypeID: number,
    projectData: IProjectModel[]
  ) {
    getVenderListByVendorTypeID(temVendorTypeID)
      .then((response) => {
        const responseData = response.data.responseObject
        let tmpProjectID: number = 0
        let tmpvendorID: number = 0
        let tmpProjectVendorID: number = 0
        if (response.data.isSuccess == true) {
          const Rows = projectData
          for (let key in Rows) {
            if (Rows[key].projectID === temProjectID) {
              formik.setFieldValue('projectID', Rows[key].projectID)
              formik.setFieldValue('projectName', Rows[key].projectName)
              formik.setFieldValue('projectCategoryName', Rows[key].projectCategoryName)
              formik.setFieldValue('vendorCost', Rows[key].projectAmount)
              formik.setFieldValue('paidAmount', Rows[key].paidAmount)
              formik.setFieldValue('remeningAmount', Rows[key].remainingAmount)
              formik.setFieldValue('projectStatusName', Rows[key].projectStatusName)
              tmpProjectID = Rows[key].projectID
              break
            }
          }

          const Row = responseData
          for (let key in Row) {
            if (Row[key].vendorID === temVendorID) {
              formik.setFieldValue('vendorID', Row[key].vendorID)
              formik.setFieldValue('companyName', Row[key].companyName)
              formik.setFieldValue('contactPerson', Row[key].contactPerson)
              formik.setFieldValue('contactNumber', Row[key].contactNumber)
              tmpvendorID = Row[key].vendorID
              break
            }
          }

          setState({
            ...state,
            cashAccountData: cashAccountData,
            mainVenderID,
            mainStartTime,
            mainEndTime,
            mainSearch,
            vendorData: responseData,
            tmpVendorData: responseData,
            selpaymentID: temTrnsModeID,
            selEmployeeBankID: temCasAccBankID,
            selVendorTypeID: temVendorTypeID,
            selTraModeID: temTrnsModeID,
            selCashAccountTypeID: temCasAccID,
            selProjectID: tmpProjectID,
            selVendorID: tmpvendorID,
            selGstTypeID: temGstTypeID,
            projectData: projectData,
            temProjectData: projectData,
            // temProjectData:projectData,
            loading: false,
          })
          setTotalVendor(responseData.length)
          setTotal(projectData.length)
          setPageVendor(1)
          setPage(1)
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
    formik.setFieldValue('vendorCost', '')
    formik.setFieldValue('paidAmount', '')
    formik.setFieldValue('remeningAmount', '')
    formik.setFieldValue('vendorID', tmpVendorData.vendorID)
    formik.setFieldValue('companyName', tmpVendorData.companyName)
    formik.setFieldValue('contactPerson', tmpVendorData.contactPerson)
    formik.setFieldValue('contactNumber', tmpVendorData.contactNumber)
    getAllProjectData(tmpVendorData.vendorID)
    setShowVendor(false)
  }

  function getAllProjectData(temVendorID: number) {
    GetProjectListByVendorID_For_PayPaymentAPI(temVendorID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            projectData: responseData,
            temProjectData: responseData,
            selVendorID: temVendorID,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            vendorData: [],
            projectData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectData: [],
          loading: false,
        })
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

  // --------For Model Data onClick Function-------
  function selectProject(tmpProjectData: IProjectModel) {
    formik.setFieldValue('projectID', tmpProjectData.projectID)
    formik.setFieldValue('projectName', tmpProjectData.projectName)
    formik.setFieldValue('projectCategoryName', tmpProjectData.projectCategoryName)
    formik.setFieldValue('vendorCost', tmpProjectData.projectAmount)
    formik.setFieldValue('paidAmount', tmpProjectData.paidAmount)
    formik.setFieldValue('remeningAmount', tmpProjectData.remainingAmount)
    formik.setFieldValue('projectStatusName', tmpProjectData.projectStatusName)
    setState({...state, selProjectID: tmpProjectData.projectID})
    setShow(false)
  }

  // ===============================================
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

  // =================-------------------------- Pagination --------------------------===================
  const [total, setTotal] = useState(state.projectData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectModel[] = state.projectData.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  // ===================== For Project Filter =====================
  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temProjectData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectStatusName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectAmount.toString().includes(keyword.toString()) ||
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectCategoryName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, projectData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, projectData: state.temProjectData})
      setTotal(state.temProjectData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // -----------------upload File ----------------------
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/Fund/AddPayFundFilePath', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setQuotationFilePath(data)
        setFileLoader(false)
      })
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
        const tdsamount: number = (parseInt(amount) * parseInt(Tds)) / 100
        //  console.log(tdsamount)
        const afteramount: number = parseInt(amount) - tdsamount
        // console.log(afteramount)
        formik.setFieldValue('tdsAmount', tdsamount)
        formik.setFieldValue('afterTDSAmount', afteramount)
      } else {
        formik.setFieldValue('tdsAmount', 0)
        formik.setFieldValue('afterTDSAmount', 0)
      }
      if (event.target.checked === false) {
        formik.setFieldValue('tdsAmount', 0)
        formik.setFieldValue('afterTDSAmount', 0)
      }
    } else if (elementId === 'isgst') {
      setIsgst(event.target.checked)
      if (event.target.checked === false) {
        setState({...state, selGstTypeID: 0})
        setState({...state, selGstTypeID: 0})
        formik.setFieldValue('cgstVal', 0)
        formik.setFieldValue('cgstPer', 0)
        formik.setFieldValue('sgstVal', 0)
        formik.setFieldValue('sgstPer', 0)
        formik.setFieldValue('igstval', 0)
        formik.setFieldValue('igstPer', 0)
        formik.setFieldValue('gstAmount', 0)
        formik.setFieldValue('afterGSTAmount', 0)
      }
    }
  }

  function handleChange(event: any) {
    const tmpValue = event.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      // const tmpamount: any = formik.getFieldProps('amount').value
      const tdsamount: number = (parseInt(amount) * parseInt(tmpValue)) / 100
      const afteramount: number = parseInt(amount) - tdsamount
      formik.setFieldValue('tdsAmount', tdsamount)
      formik.setFieldValue('afterTDSAmount', afteramount)
      formik.setFieldValue('tdsPercentage', tmpValue)
      setTds(tmpValue)
    } else if (tmpValue === '') {
      formik.setFieldValue('tdsAmount', 0)
      formik.setFieldValue('afterTDSAmount', 0)
      formik.setFieldValue('tdsPercentage', '0')
      setTds('0')
    } else {
      formik.setFieldValue('tdsAmount', 0)
      formik.setFieldValue('afterTDSAmount', 0)
      formik.setFieldValue('tdsPercentage', '0')
      setTds('0')
    }
  }

  function handleAmtChange(event: any) {
    const tmpValue = event.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      const tdsamount: number = (parseInt(tmpValue) * parseInt(Tds)) / 100
      const afteramount: number = parseInt(tmpValue) - tdsamount
      formik.setFieldValue('tdsAmount', tdsamount)
      formik.setFieldValue('afterTDSAmount', afteramount)
      formik.setFieldValue('finalAmount', tmpValue)
      setAmount(tmpValue)
    } else if (tmpValue === '') {
      formik.setFieldValue('tdsAmount', 0)
      formik.setFieldValue('afterTDSAmount', 0)
      setAmount('')
    } else {
      formik.setFieldValue('tdsAmount', 0)
      formik.setFieldValue('afterTDSAmount', 0)
      setAmount('')
    }
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
      // setState({...state, selVendorTypeID: 0})
      getVenderByVendorTypeIDData(parseInt(value))
    } else if (elementId === 'gstTypeID') {
      formik.setFieldValue('gstTypeID', parseInt(value))
      setState({...state, selGstTypeID: parseInt(value)})
    }
  }

  function getVenderByVendorTypeIDData(temVendorTypeID: number) {
    getVenderListByVendorTypeID(temVendorTypeID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            vendorData: responseData,
            tmpVendorData: responseData,
            selVendorTypeID: temVendorTypeID,
            loading: false,
          })
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
        let temEmpCashBankID: number = 0
        let temSGST: number = 0
        let temCGST: number = 0
        let temIGST: number = 0

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
          // if (values.cashAccountBankID === 0) {
          //   toast.error(`Employee Bank is required.`)
          //   return setLoading(false)
          // } else {
          //   temEmpCashBankID = values.cashAccountBankID
          // }
        }

        // if (state.selpaymentID === 2) {
        //   if (values.cashAccountBankID === 0) {
        //     toast.error(`Employee Bank is required.`)
        //     return setLoading(false)
        //   } else {
        //     temEmpCashBankID = values.cashAccountBankID
        //   }
        // }
        if (state.selGstTypeID == 1) {
          temCGST = values.cgstVal
          temSGST = values.sgstVal
        } else {
          temIGST = values.igstVal
        }

        UpdateProjectFundPayDetails(
          parseInt(projectPaymentID),
          state.selVendorID,
          state.selProjectID,
          values.paymentDate,
          amount == null ? 0 : parseInt(amount),
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
          temCGST,
          temSGST,
          temIGST,
          values.gstAmount,
          values.tdsPercentage,
          values.sgstPer,
          values.cgstPer,
          values.igstPer,
          user.employeeID,
          '192.168.0.1',
          values.tdsAmount,
          values.afterTDSAmount,
          values.afterGSTAmount,
          values.finalAmount
        )
          .then((response) => {
            if (response.data.isSuccess == true) {
              toast.success('Updated Successfull')
              history.push({
                pathname: '/accounts/pay-for-project/list',
                state: {
                  mainVenderID: state.mainVenderID,
                  mainStartTime: state.mainStartTime,
                  mainEndTime: state.mainEndTime,
                  mainSearch: state.mainSearch,
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
          {state.loading ? (
            <Loader loading={state.loading} />
          ) : (
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
                      <option selected={state.selVendorTypeID === 0 ? true : false} value={0}>
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
                  <div className='col-lg-3 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg border-0 bg-white'
                      placeholder='Select Vendor'
                      disabled
                      {...formik.getFieldProps('companyName')}
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
                <div className='row mb-6'>
                  <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                    Select Project:
                  </label>
                  <div className='col-lg-3 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg border-0 bg-white'
                      placeholder='Select Project'
                      disabled
                      {...formik.getFieldProps('projectName')}
                    />
                    {formik.touched.projectName && formik.errors.projectName && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.projectName}</div>
                      </div>
                    )}
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

                  <label
                    className={
                      state.selProjectID === 0 ? 'd-none' : 'col-lg-2 col-form-label fw-bold fs-6'
                    }
                  >
                    <span className=''>Vendor Cost:</span>
                  </label>
                  <div className={state.selProjectID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                    <input
                      type='text'
                      className='form-control form-control-lg  border-0 bg-white'
                      placeholder='Vendor Cost'
                      disabled
                      {...formik.getFieldProps('vendorCost')}
                    />
                  </div>
                </div>
                <div className={state.selProjectID === 0 ? 'd-none' : 'row mb-6'}>
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
                      state.selProjectID === 0 ? 'd-none' : 'col-lg-3 col-form-label fw-bold fs-6'
                    }
                  >
                    <span className=''>Remening Amount:</span>
                  </label>
                  <div className={state.selProjectID === 0 ? 'd-none' : 'col-lg-3 fv-row'}>
                    <input
                      type='text'
                      className='form-control form-control-lg  border-0 bg-white'
                      placeholder='Remening Amount'
                      disabled
                      {...formik.getFieldProps('remeningAmount')}
                    />
                  </div>
                </div>
                <div className={'row mb-6'}>
                  <label className='col-lg-3 col-form-label fw-bold fs-6'>
                    <span className='required'>Sub Total:</span>
                  </label>
                  <div className='col-lg-3 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter Amount'
                      value={amount}
                      // {...formik.getFieldProps('amount')}
                      onChange={handleAmtChange}
                    />
                    {formik.touched.amount && formik.errors.amount && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.amount}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='row mb-6'>
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
                <div className={state.selGstTypeID === 1 && isgst === true ? 'row mb-6' : 'd-none'}>
                  <label className={'col-lg-3 col-form-label fw-bold fs-6'}>CGST Percentage:</label>
                  <div className={'col-lg-2 fv-row'}>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='CGST Percentage'
                      {...formik.getFieldProps('cgstPer')}
                    />
                    {formik.touched.cgstPer && formik.errors.cgstPer && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.cgstPer}</div>
                      </div>
                    )}
                  </div>
                  <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
                  <label className={'col-lg-3 col-form-label fw-bold fs-6'}>CGST Amount:</label>
                  <div className={'col-lg-3 fv-row'}>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='CGSTAmount'
                      {...formik.getFieldProps('cgstVal')}
                    />
                    {formik.touched.cgstVal && formik.errors.cgstVal && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.cgstVal}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={state.selGstTypeID === 1 && isgst === true ? 'row mb-6' : 'd-none'}>
                  <label className={'col-lg-3 col-form-label fw-bold fs-6'}>SGST Percentage:</label>
                  <div className={'col-lg-2 fv-row'}>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='SGST Percentage'
                      {...formik.getFieldProps('sgstPer')}
                    />
                    {formik.touched.sgstPer && formik.errors.sgstPer && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.sgstPer}</div>
                      </div>
                    )}
                  </div>
                  <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
                  <label className={'col-lg-3 col-form-label fw-bold fs-6'}>SGST Amount:</label>
                  <div className={'col-lg-3 fv-row'}>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='SGST Amount'
                      {...formik.getFieldProps('sgstVal')}
                    />
                    {formik.touched.sgstVal && formik.errors.sgstVal && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.sgstVal}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={state.selGstTypeID === 2 && isgst === true ? 'row mb-6' : 'd-none'}>
                  <label className={'col-lg-3 col-form-label fw-bold fs-6'}>IGST Percentage:</label>
                  <div className={'col-lg-2 fv-row'}>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='IGST Amount'
                      {...formik.getFieldProps('igstPer')}
                    />
                    {formik.touched.igstPer && formik.errors.igstPer && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.igstPer}</div>
                      </div>
                    )}
                  </div>
                  <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>%</span>
                  <label className={'col-lg-3 col-form-label fw-bold fs-6'}>IGST Amount:</label>
                  <div className={'col-lg-3 fv-row'}>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='IGST Amount'
                      {...formik.getFieldProps('igstVal')}
                    />
                    {formik.touched.igstVal && formik.errors.igstVal && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.igstVal}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={state.selGstTypeID > 0 ? 'row mb-6' : 'd-none'}>
                  <label className={'col-lg-3 col-form-label fw-bold fs-6'}>GST Amount:</label>
                  <div className={'col-lg-3 fv-row'}>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='GST Amount'
                      {...formik.getFieldProps('gstAmount')}
                    />
                    {formik.touched.gstAmount && formik.errors.gstAmount && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.gstAmount}</div>
                      </div>
                    )}
                  </div>
                  <label className={'col-lg-3 col-form-label fw-bold fs-6'}>
                    After GST Amount:
                  </label>
                  <div className={'col-lg-3 fv-row'}>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='After GST Amount'
                      {...formik.getFieldProps('afterGSTAmount')}
                    />
                    {formik.touched.afterGSTAmount && formik.errors.afterGSTAmount && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.afterGSTAmount}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
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
                      // value={Tds}
                      {...formik.getFieldProps('tdsPercentage')}
                      onChange={handleChange}
                    />
                    {formik.touched.tdsPercentage && formik.errors.tdsPercentage && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.tdsPercentage}</div>
                      </div>
                    )}
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

                <div className={isTdsDeduct === true ? 'row mb-6' : 'd-none'}>
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
                      {...formik.getFieldProps('tdsAmount')}
                    />
                    {formik.touched.tdsAmount && formik.errors.tdsAmount && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.tdsAmount}</div>
                      </div>
                    )}
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
                      disabled
                      {...formik.getFieldProps('afterTDSAmount')}
                    />
                    {formik.touched.afterTDSAmount && formik.errors.afterTDSAmount && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.afterTDSAmount}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={'row mb-6'}>
                  <label className='col-lg-3 col-form-label fw-bold fs-6'>
                    <span className=''>Final Amount:</span>
                  </label>
                  <div className='col-lg-3 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid bg-light-primary'
                      placeholder='Enter Final Amount'
                      {...formik.getFieldProps('finalAmount')}
                    />
                    {formik.touched.finalAmount && formik.errors.finalAmount && (
                      <div className='fv-plugins-message-container text-danger'>
                        <div className='fv-help-block'>{formik.errors.finalAmount}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='row mb-6'>
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
                    <span className=''>Bank Name:</span>
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
                    <span className=''>Branch Name:</span>
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
                    <span className=''>Cheque Amount:</span>
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
                    <span className=''>Cheque Date:</span>
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
                  {/* </div>
              <div className={'row mb-6'}> */}
                  <label className='col-lg-3 col-form-label fw-bold fs-6'>
                    Vendor Invoice No.:
                  </label>
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
                <div className='row mb-6'>
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
                <div className='row mb-6'>
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
                      <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
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
                    pathname: '/accounts/pay-for-project/list',
                    state: {
                      mainVenderID: state.mainVenderID,
                      mainStartTime: state.mainStartTime,
                      mainEndTime: state.mainEndTime,
                      mainSearch: state.mainSearch,
                    },
                  }}
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
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
                  {currentPostsVendor.length > 0 &&
                    currentPostsVendor.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          // className={
                          //   data.isActive === false
                          //     ? 'd-none'
                          //     : 'bg-hover-light-primary text-hover-primary'
                          // }
                          className='bg-hover-light-primary text-hover-primary'
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
            <Modal.Title style={{color: 'white'}}>Project Data</Modal.Title>
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
                      <span className='d-block mb-1 ps-1'>Project Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1 ps-2'>Customer Name</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Category Name</span>
                    </th>
                    <th className='min-w-128px'>
                      <span className='d-block mb-1 ps-2'>Work Name</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Project Amount</span>
                    </th>
                    <th className='min-w-150px'>
                      <span className='d-block mb-1'>Paid Amount</span>
                    </th>
                    <th className='min-w-155px'>
                      <span className='d-block mb-1'>Remaining Amount</span>
                    </th>
                    <th className='min-w-155px'>
                      <span className='d-block mb-1'>Due Amount</span>
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
                          className={
                            data.isActive === false
                              ? 'd-none'
                              : 'bg-hover-light-primary text-hover-primary'
                          }
                          onClick={() => selectProject(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.projectName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.firstName + ' ' + data.lastName}
                            </span>
                          </td>

                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectCategoryName}
                            </span>
                          </td>
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.workName}
                            </span>
                          </td>
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectAmount}
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
                          <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.dueAmount}
                            </span>
                          </td>
                          {/* <td className=''>
                            <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                              {data.projectStatusName}
                            </span>
                          </td> */}
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
export default EditPayFund
