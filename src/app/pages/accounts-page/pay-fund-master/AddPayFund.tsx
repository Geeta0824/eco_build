import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Button, Modal} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {gstTypeData, venderTypeData} from '../../other-dropDowns/otherDropDowns'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {
  IFundProjectModel,
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
  AddProjectFundPayToVendor,
  AddProjectFundPayToVendorMultipleApi,
  GetProjectListByVendorID,
  GetProjectListByVendorID_For_PayPaymentAPI,
} from '../../../modules/account-page/pay-fund-master-page/PayFundCRUD'
import moment from 'moment'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import ModelProjectList from './ModelProjectList'

const profileDetailsSchema = Yup.object().shape({
  vendorTypeID: Yup.number().required('Field is required').min(1, 'Field is required'),
  cashAccountID: Yup.number().required('Field is required').min(1, 'Field is required'),
  transactionModeID: Yup.number().required('Field is required').min(1, 'Field is required'),
  projectModeID: Yup.number()
    .required('Project Mode is required')
    .min(1, 'Project Mode is required'),
})

interface IDepartment {
  selCashAccountTypeID: number
  selCustomerId: number
  selProjectID: number
  loading: boolean
  projectData: IProjectModel[]
  temProjectData: IProjectModel[]
  tmpVendorProjectData: any
  tmpSingleProjectData: IProjectModel[]
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
  selProjectVendorID: number
  selGstTypeID: number
  vendorID: number
  selProjectModeID: number
  mainVenderID: number
  mainStartTime: string
  mainEndTime: string
  mainSearch: string
  totalProjectAmount: number
  totalPaidAmount: number
  totalRemAmount: number
  totalDueAmount: number
  totalAmount: number
}

const AddPayFund: React.FC = () => {
  const [data, setData] = useState<IPayFundModel>(initialValues)
  const [Tds, setTds] = useState<string>('1')
  const [amount, setAmount] = useState<string>('')
  const [gstAmount, setGstAmount] = useState<string>('')
  const [tdsAmount, setTdsAmount] = useState<string>('')
  const [isgst, setIsgst] = useState(false)
  const [isTdsDeduct, setIsTdsDeduct] = useState(false)
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const [quotationFilePath, setQuotationFilePath] = useState<string>('')
  const [mainLoading, setMainLoading] = useState(false)
  const [loading, setLoading] = useState(false)
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
    projectData: [] as IProjectModel[],
    temProjectData: [] as IProjectModel[],
    tmpVendorProjectData: [],
    tmpSingleProjectData: [] as IProjectModel[],
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
    selProjectVendorID: 0,
    selGstTypeID: 0,
    vendorID: 0,
    selProjectModeID: 0,
    mainVenderID: 0,
    mainStartTime: '',
    mainEndTime: '',
    mainSearch: '',
    totalProjectAmount: 0,
    totalPaidAmount: 0,
    totalRemAmount: 0,
    totalDueAmount: 0,
    totalAmount: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      // console.log(lc)
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
      //   mainVenderID = lc.VenderID
      //   mainStartTime = lc.StartTime
      //   mainEndTime = lc.EndTime
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
          setState({
            ...state,
            cashAccountData: responseData,
            mainVenderID,
            mainStartTime,
            mainEndTime,
            mainSearch,
            loading: false,
          })
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

  function getVenderByVendorTypeIDData(temVendorTypeID: number) {
    state.selVendorTypeID = 0
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

  function getAllProjectData(vendorID: number) {
    GetProjectListByVendorID_For_PayPaymentAPI(vendorID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          let proTtlAmt: any = 0
          let paidTtlAmt: any = 0
          let remTtlAmt: any = 0
          let dueTtlAmt: any = 0
          for (let key in responseData) {
            proTtlAmt = parseInt(proTtlAmt) + parseInt(responseData[key].projectAmount)
            paidTtlAmt = parseInt(paidTtlAmt) + parseInt(responseData[key].paidAmount)
            remTtlAmt = parseInt(remTtlAmt) + parseInt(responseData[key].remainingAmount)
            dueTtlAmt = parseInt(dueTtlAmt) + parseInt(responseData[key].dueAmount)
          }

          setState({
            ...state,
            projectData: responseData,
            temProjectData: responseData,
            tmpVendorProjectData: responseData,
            selVendorID: vendorID,
            totalProjectAmount: proTtlAmt,
            totalPaidAmount: paidTtlAmt,
            totalRemAmount: remTtlAmt,
            totalDueAmount: dueTtlAmt,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectData: [],
            temProjectData: [],
            tmpVendorProjectData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectData: [],
          temProjectData: [],
          tmpVendorProjectData: [],
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
      setState({...state, selProjectModeID: 0})
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

  // ======================= Project Model PopUp ======================
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }

  function selectProject(tmpProjectData: IProjectModel) {
    formik.setFieldValue('projectID', tmpProjectData.projectID)
    formik.setFieldValue('projectVendorID', tmpProjectData.projectVendorID)
    formik.setFieldValue('projectName', tmpProjectData.projectName)
    formik.setFieldValue('projectCategoryName', tmpProjectData.projectCategoryName)
    formik.setFieldValue('projectStatusName', tmpProjectData.projectStatusName)
    formik.setFieldValue('vendorCost', tmpProjectData.projectAmount)
    formik.setFieldValue('paidAmount', tmpProjectData.paidAmount)
    formik.setFieldValue('remeningAmount', tmpProjectData.remainingAmount)
    setState({
      ...state,
      selProjectID: tmpProjectData.projectID,
      selProjectVendorID: tmpProjectData.projectVendorID,
    })
    setShow(false)
  }

  // --------For Model Data onClick Function-------
  // function getProjectDataByProjectIDAndVendorID(temPojectID: number) {
  //   GetProjectVendorMapDataByProjectIDVendorIDAPI(temPojectID, state.selVendorID).then((resp) => {
  //     const responseData = resp.data.responseObject
  //     setState({...state, proVendroMapData: responseData, selProjectID: temPojectID})
  //     formik.setFieldValue('vendorCost', responseData[0].vendorCost)
  //     formik.setFieldValue('paidAmount', responseData[0].paidAmount)
  //     formik.setFieldValue('remeningAmount', responseData[0].remainingAmount)
  //   })
  //   setShow(false)
  // }

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
        //  console.log(afteramount)
        formik.setFieldValue('tdsAmount', tdsamount)
        formik.setFieldValue('afterTDSAmount', afteramount)
      } else {
        formik.setFieldValue('tdsAmount', 0)
        formik.setFieldValue('afterTDSAmount', 0)
        setTds('0')
      }
    } else if (elementId === 'isgst') {
      if (parseInt(amount) > 0.0) {
        setIsgst(event.target.checked)
      } else {
        toast.error('Please Enter Amount')
      }
      if (event.target.checked === false) {
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
  //-----------------------------------------------

  function handleChange(event: any) {
    const tmpValue = event.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      // const tmpamount: any = formik.getFieldProps('amount').value
      const tdsamount: any = (parseInt(amount) * parseInt(tmpValue)) / 100
      const afteramount: number = parseInt(amount) - tdsamount
      setTdsAmount(tdsamount)
      formik.setFieldValue('afterTDSAmount', afteramount)
      setTds(tmpValue)
    } else if (tmpValue === '') {
      formik.setFieldValue('tdsAmount', 0)
      formik.setFieldValue('afterTDSAmount', 0)
      setTds('0')
    }
  }

  function handleAmtChange(event: any) {
    const tmpValue = event.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      const tdsamount: any = (parseInt(tmpValue) * parseInt(Tds)) / 100
      const afteramount: number = parseInt(tmpValue) - tdsamount
      setTdsAmount(tdsamount)
      formik.setFieldValue('afterTDSAmount', afteramount)
      const finalAmount: number = parseInt(tmpValue)
      formik.setFieldValue('finalAmount', finalAmount)
      setAmount(tmpValue)
    } else if (tmpValue === '') {
      formik.setFieldValue('tdsAmount', 0)
      formik.setFieldValue('afterTDSAmount', 0)
      formik.setFieldValue('finalAmount', 0)
      setAmount('')
    } else {
      formik.setFieldValue('tdsAmount', 0)
      formik.setFieldValue('afterTDSAmount', 0)
      formik.setFieldValue('finalAmount', 0)
      setAmount('')
    }
  }

  // ------------------------- GSTAmont Change-------------------------
  function handleChangeGstAmount(event: any) {
    const tmpValue = event.target.value
    const re = /^[0-9\b.]+$/
    if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
      setGstAmount(tmpValue)
      const finalAmount: number = parseInt(tmpValue) + parseInt(amount)
      const finalAmountWitTds: number = parseInt(tmpValue) + parseInt(amount) - parseInt(tdsAmount)
      if (isTdsDeduct === true) {
        formik.setFieldValue('finalAmount', finalAmountWitTds)
      } else if (isgst === true) {
        formik.setFieldValue('finalAmount', finalAmount)
      } else {
        formik.setFieldValue('finalAmount', parseInt(amount))
      }
    } else if (tmpValue === '') {
      formik.setFieldValue('finalAmount', 0)
      formik.setFieldValue('afterTDSAmount', 0)
      formik.setFieldValue('finalAmount', parseInt(amount))
      setGstAmount('')
    } else {
      formik.setFieldValue('tdsAmount', 0)
      formik.setFieldValue('afterTDSAmount', 0)
      formik.setFieldValue('finalAmount', parseInt(amount))
      setGstAmount('')
    }
  }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(state.projectData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IProjectModel[] = state.projectData.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
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
      setState({...state, selGstTypeID: parseInt(value)})
      // ------------------------ project Mode ---------------------
    } else if (elementId === 'projectModeID') {
      formik.setFieldValue('projectModeID', parseInt(value))
      if (parseInt(value) == 1) {
        setState({...state, selProjectModeID: parseInt(value), projectData: state.temProjectData})
      } else if (parseInt(value) == 2) {
        state.tmpVendorProjectData = []
        formik.setFieldValue('projectID', 0)
        formik.setFieldValue('projectName', '')
        formik.setFieldValue('projectCategoryName', '')
        formik.setFieldValue('projectStatusName', '')
        formik.setFieldValue('vendorCost', 0)
        formik.setFieldValue('paidAmount', 0)
        formik.setFieldValue('remeningAmount', 0)
        formik.setFieldValue('amount', 0)
        formik.setFieldValue('isgst', 0)
        formik.setFieldValue('gstTypeID', 0)
        formik.setFieldValue('cgstPer', 0)
        formik.setFieldValue('cgstVal', 0)
        formik.setFieldValue('cgstPer', 0)
        formik.setFieldValue('cgstVal', 0)
        formik.setFieldValue('igstPer', 0)
        formik.setFieldValue('igstVal', 0)
        formik.setFieldValue('gstAmount', 0)
        formik.setFieldValue('afterGSTAmount', 0)
        formik.setFieldValue('tdsAmount', 0)
        formik.setFieldValue('afterTDSAmount', 0)
        formik.setFieldValue('finalAmount', 0)
        setAmount('')
        setGstAmount('')
        setTds('')
        setTdsAmount('')
        setIsgst(false)
        setIsTdsDeduct(false)
        let tmplstCheckedOutputData = [] as IProjectModel[]
        let resultOptputObj: IProjectModel[] = state.temProjectData
        // console.log(resultOptputObj)
        for (let k in resultOptputObj) {
          let tmpCheckedOutputData: IProjectModel = {
            customerID: resultOptputObj[k]['customerID'],
            projectStageID: resultOptputObj[k]['projectStageID'],
            customerName: resultOptputObj[k]['customerName'],
            projecStatus: resultOptputObj[k]['projecStatus'],
            projectID: resultOptputObj[k]['projectID'],
            projectVendorID: resultOptputObj[k]['projectVendorID'],
            projectName: resultOptputObj[k]['projectName'],
            projectAmount: resultOptputObj[k]['projectAmount'],
            paidAmount: resultOptputObj[k]['paidAmount'],
            remainingAmount: resultOptputObj[k]['remainingAmount'],
            dueAmount: resultOptputObj[k]['dueAmount'],
            PMCCost: resultOptputObj[k]['PMCCost'],
            latitude: resultOptputObj[k]['latitude'],
            longitude: resultOptputObj[k]['longitude'],
            projectFilePath: resultOptputObj[k]['projectFilePath'],
            quetFilePath: resultOptputObj[k]['quetFilePath'],
            bhkName: resultOptputObj[k]['bhkName'],
            carpetArea: resultOptputObj[k]['carpetArea'],
            projectCategoryName: resultOptputObj[k]['projectCategoryName'],
            projectStatusName: resultOptputObj[k]['projectStatusName'],
            projectType: resultOptputObj[k]['projectType'],
            firstName: resultOptputObj[k]['firstName'],
            lastName: resultOptputObj[k]['lastName'],
            email: resultOptputObj[k]['email'],
            isActive: resultOptputObj[k]['isActive'],
            mobileNumber: resultOptputObj[k]['mobileNumber'],
            terminalCode: resultOptputObj[k]['terminalCode'],
            quotationCategoryID: resultOptputObj[k]['quotationCategoryID'],
            projectTypeID: resultOptputObj[k]['projectTypeID'],
            bhkid: resultOptputObj[k]['bhkid'],
            carpetAreaID: resultOptputObj[k]['carpetAreaID'],
            projectStatusID: resultOptputObj[k]['projectStatusID'],
            entryDate: resultOptputObj[k]['entryDate'],
            description: resultOptputObj[k]['description'],
            createBy: resultOptputObj[k]['createBy'],
            updateBy: resultOptputObj[k]['updateBy'],
            ipAddress: resultOptputObj[k]['ipAddress'],
            contactPerson: resultOptputObj[k]['contactPerson'],
            amt: '',
            isSelected: 0,
            isShow: 0,
            projectCategoryID: resultOptputObj[k]['projectCategoryID'],
            paymentDate: moment(new Date()).format('YYYY-MM-DD'),
            workName: resultOptputObj[k]['workName'],
          }
          tmplstCheckedOutputData.push(tmpCheckedOutputData)
        }
        // console.log(tmplstCheckedOutputData)

        // // Create a set to store unique projectIds
        // const uniqueProjects: any = Array.from(
        //   new Set(tmplstCheckedOutputData.map((project) => project.projectID))
        // ).map((projectId) => {
        //   return tmplstCheckedOutputData.find((project) => project.projectID === projectId)
        // })
        // console.log(uniqueProjects)

        // Grouping projects and their vendors by projectId
        const groupedProjects: any[] = tmplstCheckedOutputData.reduce((acc: any, current: any) => {
          // console.log('=====')
          // console.log(current)
          const {
            customerID,
            projectStageID,
            customerName,
            projecStatus,
            projectID,
            projectVendorID,
            projectName,
            projectAmount,
            paidAmount,
            remainingAmount,
            dueAmount,
            PMCCost,
            projectFilePath,
            quetFilePath,
            bhkName,
            carpetArea,
            projectCategoryName,
            projectStatusName,
            projectType,
            firstName,
            lastName,
            email,
            isActive,
            mobileNumber,
            terminalCode,
            quotationCategoryID,
            projectTypeID,
            bhkid,
            carpetAreaID,
            projectStatusID,
            entryDate,
            description,
            createBy,
            updateBy,
            ipAddress,
            contactPerson,
            amt,
            isSelected,
            isShow,
            projectCategoryID,
            paymentDate,
            workName,
          } = current
          // Check if the project already exists in the accumulator
          if (!acc[projectID]) {
            acc[projectID] = {
              customerID,
              projectStageID,
              customerName,
              projecStatus,
              projectID,
              projectVendorID,
              projectName,
              projectAmount,
              paidAmount,
              remainingAmount,
              dueAmount,
              PMCCost,
              projectFilePath,
              quetFilePath,
              bhkName,
              carpetArea,
              projectCategoryName,
              projectStatusName,
              projectType,
              firstName,
              lastName,
              email,
              isActive,
              mobileNumber,
              terminalCode,
              quotationCategoryID,
              projectTypeID,
              bhkid,
              carpetAreaID,
              projectStatusID,
              entryDate,
              description,
              createBy,
              updateBy,
              ipAddress,
              contactPerson,
              amt,
              isSelected,
              isShow,
              projectCategoryID,
              paymentDate,
              workName,
              vendors: [], // Initialize vendors array
            }
          }
          // console.log(projectID)
          // console.log(workName)
          // Add the vendor to the corresponding project
          acc[projectID].vendors.push({
            projectID,
            projectVendorID,
            workName,
            paymentDate,
            projectAmount,
            paidAmount,
            remainingAmount,
            dueAmount,
            isSelected,
            amt,
          })
          return acc
        }, {})
        // Convert the object back to an array to use in rendering
        const projectVendorList = Object.values(groupedProjects)
        // console.log(projectVendorList)

        setState({
          ...state,
          selProjectModeID: parseInt(value),
          selProjectID: 0,
          selGstTypeID: 0,
          projectData: tmplstCheckedOutputData,
          // tmpSingleProjectData: uniqueProjects,
          tmpVendorProjectData: projectVendorList,
        })
      } else {
        setState({
          ...state,
          selProjectModeID: parseInt(value),
          projectData: state.temProjectData,
        })
      }
    }
    // ------------------------ project Mode ---------------------
  }

  function ShowVendorMap(data: any) {
    const {tmpVendorProjectData} = state // Destructure state for readability
    const uid: number = data.projectID

    // Create a new array to avoid mutating the original state directly
    const updatedProjects = tmpVendorProjectData.map((project: any) => {
      if (uid === project.projectID) {
        // Toggle isShow value between 0 and 1
        return {...project, isShow: project.isShow === 1 ? 0 : 1}
      }
      return project
    })

    // Update state with a new copy of tmpVendorProjectData
    setState((prevState) => ({
      ...prevState,
      tmpVendorProjectData: updatedProjects,
    }))
  }

  // =================== For Selection ==============
  function setSelectedHandle(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpProjData = state.projectData
    for (let k in tmpProjData) {
      if (uid == tmpProjData[k].projectVendorID) {
        if (isChecked) {
          tmpProjData[k].isSelected = 1
        } else {
          tmpProjData[k].isSelected = 0
        }
        break
      }
    }
    setState({...state, projectData: tmpProjData})
  }

  function setSelectedHandleNew(e: React.ChangeEvent<HTMLInputElement>, data: any) {
    const uid: number = parseInt(e.target.id) // Get vendor ID
    const isChecked = e.target.checked // Get checkbox state

    // Destructure the required state values
    const {tmpVendorProjectData, totalAmount} = state

    let newTotalAmount = totalAmount

    // Create an updated copy of tmpVendorProjectData
    const updatedVendorProjData = tmpVendorProjectData.map((project: any) => {
      if (data.projectID === project.projectID) {
        const updatedVendors = project.vendors.map((vendor: any) => {
          if (vendor.projectVendorID === uid) {
            // Adjust the total amount based on selection state
            const amtValue = parseFloat(vendor.amt) || 0
            if (isChecked) {
              newTotalAmount += amtValue // Add the vendor's amount to total when selected
            } else {
              newTotalAmount -= amtValue // Subtract the vendor's amount from total when unselected
            }
            return {...vendor, isSelected: isChecked ? 1 : 0} // Update the vendor's selection state
          }
          return vendor
        })
        return {...project, vendors: updatedVendors}
      }
      return project
    })

    // Update the state with the new project data and updated total amount
    setState((prevState) => ({
      ...prevState,
      tmpVendorProjectData: updatedVendorProjData,
      totalAmount: newTotalAmount, // Update totalAmount in state
    }))
  }

  // =================== For Selection Date ==============
  function onChangeDate(e: React.ChangeEvent<HTMLInputElement>) {
    const newDate = moment(new Date(e.target.value)).format('YYYY-MM-DD')
    const uid: number = parseInt(e.target.id) // Ensure `id` is parsed as a number

    // Destructure tmpVendorProjectData from the state
    const {tmpVendorProjectData} = state

    // Create a new copy of tmpVendorProjectData to avoid direct mutation
    const updatedProjData = tmpVendorProjectData.map((project: any) => {
      const updatedVendors = project.vendors.map((vendor: any) =>
        vendor.projectVendorID === uid ? {...vendor, paymentDate: newDate} : vendor
      )

      return {...project, vendors: updatedVendors}
    })

    // Update the state with the new project data
    setState((prevState) => ({
      ...prevState,
      tmpVendorProjectData: updatedProjData,
    }))
  }

  // =================== For Item Meter Input Selection ==============
  function setInputAmt(e: React.ChangeEvent<HTMLInputElement>) {
    const uid: number = parseInt(e.target.id) // Parse vendor ID
    const tmpValue: string = e.target.value
    const re = /^[0-9\b.]+$/ // Regex for number validation

    const isValidAmt = re.test(tmpValue) && !isNaN(parseFloat(tmpValue))
    const newAmt = isValidAmt ? tmpValue : '' // If invalid, set to an empty string

    // Calculate updated vendor project data and total amount in one pass
    const {tmpVendorProjectData} = state
    let amtTotal = 0

    const updatedProjData = tmpVendorProjectData.map((project: any) => ({
      ...project,
      vendors: project.vendors.map((vendor: any) => {
        if (vendor.projectVendorID === uid) {
          vendor.amt = newAmt
        }
        amtTotal += parseFloat(vendor.amt) || 0 // Recalculate the total
        return vendor
      }),
    }))

    setState({
      ...state,
      tmpVendorProjectData: updatedProjData,
      totalAmount: amtTotal, // Update the total in the state
    })
  }

  // function setInputAmt(e: any) {
  //   let uid: number = e.target.id
  //   let tmpValue: string = e.target.value
  //   console.log('--------------')
  //   console.log(tmpValue)
  //   const re = /^[0-9\b.]+$/
  //   if (!isNaN(parseInt(tmpValue)) && re.test(tmpValue)) {
  //     let tmpProjctData = state.projectData
  //     let amtTotal: number = state.totalAmount
  //     console.log(amtTotal)
  //     for (let k in tmpProjctData) {
  //       if (uid == tmpProjctData[k].projectVendorID) {
  //         tmpProjctData[k].amt = tmpValue
  //         amtTotal = amtTotal + parseInt(tmpValue)
  //         break
  //       }
  //     }
  //     console.log(amtTotal)
  //     setState({...state, projectData: tmpProjctData, totalAmount: amtTotal})
  //   } else if (tmpValue === '') {
  //     let tmpProjctData = state.projectData
  //     let amtTotal: number = state.totalAmount
  //     for (let k in tmpProjctData) {
  //       if (uid == tmpProjctData[k].projectVendorID) {
  //         tmpProjctData[k].amt = ''
  //         break
  //       }
  //     }
  //     setState({...state, projectData: tmpProjctData, totalAmount: amtTotal})
  //   }
  // }

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
          // }
          // else {
          temCheckAmnt = values.chequeAmount
          //  }
          // if (values.chequeBankName === '') {
          //   toast.error(`Bank Name is required.`)
          //   return setLoading(false)
          // }
          // else {
          temBankName = values.chequeBankName
          //}
          // if (values.chequeBankBranch === '') {
          //   toast.error(`Branch Name is required.`)
          //   return setLoading(false)
          // }
          // else {
          temBranchName = values.chequeBankBranch
          // }
          // if (values.chequeDate === '') {
          //   toast.error(`Check Date is required.`)
          //   return setLoading(false)
          // }
          // else {
          temCheckDate = values.chequeDate
          //}
          if (values.chequeNumber === '') {
            toast.error(`Check Number is required.`)
            return setLoading(false)
          } else {
            temCheckNo = values.chequeNumber
          }
        }
        if (values.projectModeID == 1) {
          if (state.selProjectID == 0) {
            toast.error(`Project is Required`)
            return setLoading(false)
          }
          if (state.selGstTypeID == 1) {
            temCGST = values.cgstVal
            temSGST = values.sgstVal
          } else {
            temIGST = values.igstVal
          }
          AddProjectFundPayToVendor(
            state.selProjectVendorID,
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
            parseInt(Tds),
            user.employeeID,
            '192.168.0.1',
            values.tdsAmount,
            values.sgstPer,
            values.cgstPer,
            values.igstPer,
            values.afterTDSAmount,
            values.afterGSTAmount,
            values.finalAmount
          )
            .then((response) => {
              if (response.data.isSuccess == true) {
                toast.success('Created Successfull')
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
        } else if (values.projectModeID == 2) {
          let tmplstCheckedOutputData: IFundProjectModel[] = []

          // Destructure the state to get tmpVendorProjectData
          const {tmpVendorProjectData} = state

          // Loop through each project and its vendors
          tmpVendorProjectData.forEach((project: any) => {
            project.vendors.forEach((vendor: any) => {
              if (vendor.isSelected === 1) {
                // Collect only selected vendors
                const tmpCheckedData: IFundProjectModel = {
                  projectID: project.projectID, // Get project ID from the project
                  amount: vendor.amt, // Get the vendor's amount
                  projectVendorID: vendor.projectVendorID, // Vendor ID
                  paymentDate: vendor.paymentDate, // Vendor's payment date
                }
                tmplstCheckedOutputData.push(tmpCheckedData)
              }
            })
          })

          // Output the selected vendors
          //console.log(tmplstCheckedOutputData)

          AddProjectFundPayToVendorMultipleApi(
            tmplstCheckedOutputData,
            state.selVendorID,
            // state.selProjectID,
            values.paymentDate,
            // amount == null ? 0 : parseInt(amount),
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
            0,
            user.employeeID,
            '192.168.0.1',
            values.tdsAmount,
            values.sgstPer,
            values.cgstPer,
            values.igstPer,
            values.afterTDSAmount,
            values.afterGSTAmount,
            values.finalAmount
          )
            .then((response) => {
              if (response.data.isSuccess == true) {
                toast.success('Created Successfull')
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
        } else {
          setLoading(false)
        }
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
                <div className='col-lg-3 fv-row'>
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
              <div className={state.selVendorID === 0 ? 'd-none' : 'row mb-6'}>
                <label className='col-lg-3 col-form-label fw-bold fs-6'>
                  <span className='required'> Select Project Mode:</span>
                </label>
                <div className='col-lg-3 fv-row'>
                  <select
                    className='form-select'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='projectModeID'
                  >
                    <option selected value={0}>
                      Select Project Mode
                    </option>
                    <option value={1} selected={state.selProjectModeID == 1 ? true : false}>
                      Single
                    </option>
                    <option value={2} selected={state.selProjectModeID == 2 ? true : false}>
                      Multiple
                    </option>
                  </select>
                  {formik.touched.projectModeID && formik.errors.projectModeID && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.projectModeID}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* ----------------------------- Start :: Single Project ---------------------------- */}
              <div className={state.selProjectModeID === 1 ? 'row mb-6' : 'd-none'}>
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
              <div
                className={
                  state.selProjectID === 0 && state.selProjectModeID !== 1 ? 'd-none' : 'row mb-6'
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

              <div
                className={
                  state.selProjectID > 0 && state.selProjectModeID === 1 ? 'row mb-6' : 'd-none'
                }
              >
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

              <div
                className={
                  state.selProjectID > 0 && state.selProjectModeID === 1 ? 'row mb-6' : 'd-none'
                }
              >
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
                  state.selProjectID > 0 &&
                  state.selProjectModeID === 1 &&
                  state.selGstTypeID === 1 &&
                  isgst === true
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
                    placeholder='CGST Amount'
                    {...formik.getFieldProps('cgstVal')}
                  />
                  {formik.touched.cgstVal && formik.errors.cgstVal && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.cgstVal}</div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={
                  state.selProjectID > 0 &&
                  state.selProjectModeID === 1 &&
                  state.selGstTypeID === 1 &&
                  isgst === true
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
              <div
                className={
                  state.selProjectID > 0 &&
                  state.selProjectModeID === 1 &&
                  state.selGstTypeID === 2 &&
                  isgst === true
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
              <div
                className={
                  state.selProjectID > 0 && state.selProjectModeID === 1 && state.selGstTypeID > 0
                    ? 'row mb-6'
                    : 'd-none'
                }
              >
                <label className={'col-lg-3 col-form-label fw-bold fs-6'}>GST Amount:</label>
                <div className={'col-lg-3 fv-row'}>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='GST Amount'
                    value={gstAmount}
                    onChange={handleChangeGstAmount}
                  />
                </div>
                <label className={'col-lg-3 col-form-label fw-bold fs-6'}>After GST Amount:</label>
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
              <div
                className={
                  state.selProjectID > 0 && state.selProjectModeID === 1 ? 'row mb-6' : 'd-none'
                }
              >
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
                className={
                  state.selProjectID > 0 && state.selProjectModeID === 1 && isTdsDeduct === true
                    ? 'row mb-6'
                    : 'd-none'
                }
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
                    // {...formik.getFieldProps('tdsAmount')}
                  />
                  {/* {formik.touched.tdsAmount && formik.errors.tdsAmount && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.tdsAmount}</div>
                    </div>
                  )} */}
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
              <div
                className={
                  state.selProjectID > 0 && state.selProjectModeID === 1 ? 'row mb-6' : 'd-none'
                }
              >
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
              {/* ----------------------------- End :: Single Project ---------------------------- */}

              {/* ----------------------------- Start :: Multiple Project ---------------------------- */}
              <div className={state.selProjectModeID === 2 ? 'row mb-6' : 'd-none'}>
                <div className='d-flex justify-content-start mb-2 text-center'>
                  <label className='fs-3 fw-bolder text-success'> Select Projects : </label>
                </div>
                <div className='card'>
                  <div className='py-3'>
                    {/* begin::Table container */}
                    <div className='table-responsive'>
                      {/* begin::Table */}
                      <table className='table align-middle g-2'>
                        {/* begin::Table head */}
                        <thead className='bg-success'>
                          <tr className='fw-bolder fs-5 text-white'>
                            {/* <th className='w-25px'></th> */}
                            <th className='min-w-150x text-start '>
                              <span className='d-block  mb-1'>Project Name </span>
                              <span className=' fw-bold d-block  fs-7'>Project Category Name</span>
                            </th>
                            <th className='min-w-25px'>Customer Name</th>
                            {/* <th className='min-w-25px'>Work Name</th> */}
                            <th className='min-w-25px text-center'>Vendor Cost</th>
                            {/* <th className='min-w-25px'>Payment Date</th> */}
                            {/* <th className='min-w-25px'>Paid Amount</th>
                            <th className='min-w-25px'>Remaining Amount</th>
                            <th className='min-w-25px'>Due Amount</th> */}
                            {/* <th className='min-w-25px'>Amount</th> */}
                            <th className='min-w-25px text-end'>View</th>
                          </tr>
                        </thead>
                        {/* end::Table head */}
                        {/* begin::Table body */}
                        <tbody className="border-bottom">
                          {mainLoading ? (
                            <LoaderInTable loading={mainLoading} column={15} />
                          ) : (
                            <>
                              {state.tmpVendorProjectData.length > 0 &&
                                state.selProjectModeID === 2 &&
                                state.tmpVendorProjectData.map((data: any, index: any) => {
                                  // console.log(data)
                                  return (
                                    <>
                                      <tr
                                        key={index}
                                        className={
                                          data.isShow === 1
                                            ? 'bg-secondary'
                                            : 'bg-hover-light-primary'
                                        }
                                      >
                                        {/* <td>
                                        <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                          <input
                                            className='form-check-input widget-9-check'
                                            type='checkbox'
                                            id={`${data.projectVendorID}`}
                                            onChange={(e) => setSelectedHandle(e)}
                                          />
                                        </div>
                                        </td> */}
                                        <td>
                                          <span className='fw-bolder text-dark text-hover-primary d-block mb-1 fs-5  text-start'>
                                            {data.projectName}
                                          </span>
                                          <span className='fw-bolder text-muted d-block fs-6 text-start'>
                                            {data.projectCategoryName}
                                          </span>
                                        </td>
                                        <td className='fw-bolder min-w-25px fs-5'>
                                          <span className='mb-1'>
                                            {data.firstName} {data.lastName}
                                          </span>
                                        </td>
                                        {/* <td className='min-w-25px'>
                                        <span className='mb-1'>{data.workName}</span>
                                      </td> */}
                                        <td className='fw-bolder min-w-25px fs-5 text-center'>
                                          <span className='mb-1'>{data.projectAmount}</span>
                                        </td>
                                        {/* <td className='w-100px'>
                                        <span className='mb-1'>
                                          <input
                                            className='form-control form-control-sm text-center'
                                            type='date'
                                            name='amt'
                                            id={`${data.projectVendorID}`}
                                            disabled={data.isSelected === 1 ? false : true}
                                            onChange={(e) => onChangeDate(e)}
                                            value={data.paymentDate}
                                          />
                                        </span>
                                      </td> */}
                                        {/* <td className='min-w-25px text-center'>
                                        <span className='mb-1'>{data.paidAmount}</span>
                                      </td>
                                      <td className='w-25px text-center'>
                                        <span className='mb-1'>{data.remainingAmount}</span>
                                      </td>
                                      <td className='w-25px text-center'>
                                        <span className='mb-1'>{data.dueAmount}</span>
                                      </td> */}
                                        {/* <td className='w-100px'>
                                          <span className='mb-1'>
                                            <input
                                              className='form-control form-control-sm text-end'
                                              type='text'
                                              name='amt'
                                              id={`${data.projectVendorID}`}
                                              // disabled={data.isSelected === 1 ? false : true}
                                              disabled
                                              // onChange={(e) => setInputAmt(e)}
                                              value={data.amt}
                                            />
                                          </span>
                                        </td> */}
                                        <td className='text-end'>
                                          <span
                                            onClick={() => ShowVendorMap(data)}
                                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary  text-hover-light'
                                            data-bs-toggle='tooltip'
                                            data-bs-placement='top'
                                            title='View'
                                          >
                                            <span className='fa fa-eye fs-2'></span>
                                          </span>
                                        </td>
                                      </tr>
                                      {data.isShow == 1 && (
                                        <tr>
                                          <td colSpan={6}>
                                            <div className='table-responsive'>
                                              {/* begin::Table */}
                                              <table className='table border border-2 border-primary rounded table-bordered align-middle g-2'>
                                                {/* begin::Table head */}
                                                <thead className='bg-primaryMain'>
                                                  <tr className='fw-bolder fs-5 text-white'>
                                                    <th className='w-25px'></th>
                                                    <th className='min-w-25px'>Work Name</th>
                                                    <th className='min-w-25px'>Vendor Cost</th>
                                                    <th className='min-w-25px'>Payment Date</th>
                                                    <th className='min-w-25px'>Paid Amount</th>
                                                    <th className='min-w-25px'>Remaining Amount</th>
                                                    <th className='min-w-25px'>Due Amount</th>
                                                    <th className='min-w-25px'>Amount</th>
                                                  </tr>
                                                </thead>
                                                {/* end::Table head */}
                                                {/* begin::Table body */}
                                                <tbody className="border-bottom">
                                                  {data.vendors.length > 0 &&
                                                    data.vendors.map((vendor: any) => (
                                                      <tr
                                                        key={vendor.vendorId}
                                                        className={'bg-light-primary fs-5'}
                                                      >
                                                        <td>
                                                          <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                                            <input
                                                              className='form-check-input widget-9-check'
                                                              type='checkbox'
                                                              checked={
                                                                vendor.isSelected === 1
                                                                  ? true
                                                                  : false
                                                              }
                                                              id={`${vendor.projectVendorID}`}
                                                              onChange={(e) =>
                                                                setSelectedHandleNew(e, data)
                                                              }
                                                            />
                                                          </div>
                                                        </td>
                                                        <td className='min-w-25px'>
                                                          <span className='mb-1'>
                                                            {vendor.workName}
                                                          </span>
                                                        </td>
                                                        <td className='min-w-25px'>
                                                          <span className='mb-1'>
                                                            {vendor.projectAmount}
                                                          </span>
                                                        </td>
                                                        <td className='w-100px'>
                                                          <span className='mb-1'>
                                                            <input
                                                              className='form-control form-control-sm text-center'
                                                              type='date'
                                                              name='amt'
                                                              id={`${vendor.projectVendorID}`}
                                                              disabled={
                                                                vendor.isSelected === 1
                                                                  ? false
                                                                  : true
                                                              }
                                                              onChange={(e) => onChangeDate(e)}
                                                              value={vendor.paymentDate}
                                                            />
                                                          </span>
                                                        </td>
                                                        <td className='min-w-25px text-center'>
                                                          <span className='mb-1'>
                                                            {vendor.paidAmount}
                                                          </span>
                                                        </td>
                                                        <td className='w-25px text-center'>
                                                          <span className='mb-1'>
                                                            {vendor.remainingAmount}
                                                          </span>
                                                        </td>
                                                        <td className='w-25px text-center'>
                                                          <span className='mb-1'>
                                                            {vendor.dueAmount}
                                                          </span>
                                                        </td>
                                                        <td className='w-100px'>
                                                          <span className='mb-1'>
                                                            <input
                                                              className='form-control form-control-sm text-end'
                                                              type='text'
                                                              name='amt'
                                                              autoComplete='off'
                                                              id={`${vendor.projectVendorID}`}
                                                              disabled={
                                                                vendor.isSelected === 1
                                                                  ? false
                                                                  : true
                                                              }
                                                              onChange={(e) => setInputAmt(e)}
                                                              value={vendor.amt}
                                                            />
                                                          </span>
                                                        </td>
                                                      </tr>
                                                    ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </>
                                  )
                                })}
                              <tr className='text-dark'>
                                <td
                                  className='border-top border-dark text-start fw-bolder fs-5'
                                  colSpan={2}
                                >
                                  Total :
                                </td>
                                <td className='border-top border-dark text-end text-center fw-bolder fs-6'>
                                  {state.totalProjectAmount}
                                </td>
                                {/* <td className='text-start'></td> */}
                                {/* <td className='border-top border-dark text-end fw-bolder fs-6'>
                                  {state.totalPaidAmount}
                                </td>
                                <td className='border-top border-dark text-end fw-bolder fs-6'>
                                  {state.totalRemAmount}
                                </td>
                                <td className='border-top border-dark text-end fw-bolder fs-6'>
                                  {state.totalDueAmount}
                                </td> */}
                                <td className='border-top border-dark text-end text-danger fw-bolder fs-6'>
                                  {state.totalAmount}
                                </td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* ----------------------------- End :: Multiple Project ---------------------------- */}
              <div className={state.selProjectModeID === 0 ? 'd-none' : 'row mb-6'}>
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
                  state.selProjectModeID > 0 &&
                  state.selTypeID === 2 &&
                  (state.selpaymentID === 1 || state.selpaymentID === 2)
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
              <div
                className={
                  state.selProjectModeID > 0 && state.selpaymentID === 2 ? 'row mb-6' : 'd-none'
                }
              >
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
              <div
                className={
                  state.selProjectModeID > 0 && state.selpaymentID === 2 ? 'row mb-6' : 'd-none'
                }
              >
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
              <div
                className={
                  state.selProjectModeID > 0 && state.selpaymentID === 2 ? 'row mb-6' : 'd-none'
                }
              >
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
              <div
                className={
                  state.selProjectModeID > 0 && state.selpaymentID === 1 ? 'row mb-6' : 'd-none'
                }
              >
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
              <div className={state.selProjectModeID > 0 ? 'row mb-6' : 'd-none'}>
                <label
                  className={
                    state.selProjectModeID == 2 ? 'd-none' : 'col-lg-3 col-form-label fw-bold fs-6'
                  }
                >
                  Payment Date:
                </label>
                <div className={state.selProjectModeID == 2 ? 'd-none' : 'col-lg-3 fv-row'}>
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
              <div className={state.selProjectModeID > 0 ? 'row mb-6' : 'd-none'}>
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
              <div className={state.selProjectModeID > 0 ? 'row mb-6' : 'd-none'}>
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
                    <th className='min-w-100px'>
                      <span className='d-block mb-1 ps-2'>Customer Name</span>
                    </th>
                    <th className='min-w-100px'>
                      <span className='d-block mb-1 ps-2'>Category Name</span>
                    </th>
                    <th className='min-w-100px'>
                      <span className='d-block mb-1 ps-2'>Work Name</span>
                    </th>
                    <th className='min-w-75px'>
                      <span className='d-block mb-1'>Project Amount</span>
                    </th>
                    <th className='min-w-75px'>
                      <span className='d-block mb-1'>Paid Amount</span>
                    </th>
                    <th className='min-w-75px'>
                      <span className='d-block mb-1'>Remaining Amount</span>
                    </th>
                    <th className='min-w-75px'>
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
                        <ModelProjectList
                          key={index}
                          data={data}
                          selectProject={() => selectProject(data)}
                        />
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
export default AddPayFund
