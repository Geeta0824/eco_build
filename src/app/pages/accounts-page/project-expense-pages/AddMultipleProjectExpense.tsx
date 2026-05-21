import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {ICashAccountModel} from '../../../models/organization-page/cashaccount/ICashAccountModel'
import {IEmployeeBankDetailsModel} from '../../../models/organization-page/Employee/IEmployeeBankDetailsModel'
import {getEmpBankDetailsByEmpID} from '../../../modules/organization-page/employee-master-page/bank-details/EmployeeBankDetailsCRUD'
import {GetCashAccountListAPI} from '../../../modules/organization-page/cash-account-master-page/CashAccountCRUD'
import {IEmployeePageModel} from '../../../models/organization-page/Employee/IEmployeeModel'
import {getEmployeeSearchDropDown} from '../../../modules/organization-page/employee-master-page/EmployeeCRUD'
import moment from 'moment'
import {IProjectModel} from '../../../models/projects-page/IProjectsModel'
import {getAllProjectListAPI} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {
  IProjectExpMulModel,
  IProjectExpenseModel,
  ProjectExpenseInitValues as initialValues,
} from '../../../models/master-page/IProjectExpenseModel'
import {addMultipleProjectExpenseAPI} from '../../../modules/account-page/project-expense-master-page/ProjectExpenseCRUD'
import {Button, Modal} from 'react-bootstrap-v5'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'

const profileDetailsSchema = Yup.object().shape({
  title: Yup.string().required('Title is Required'),
  expenseDate: Yup.string().required('Title is Required'),
  cashAccountID: Yup.number().required('Field is required').min(1, 'Field is required'),
  transactionModeID: Yup.number().required('Field is required').min(1, 'Field is required'),
})

interface IProjExp {
  loading: boolean
  employeeData: IEmployeePageModel[]
  tmpEmployeeData: IEmployeePageModel[]
  projectData: IProjectModel[]
  temProjectData: IProjectModel[]
  temSearchProjectData: IProjectModel[]
  selCashAccountTypeID: number
  cashAccountData: ICashAccountModel[]
  cashAccountID: number
  selpaymentID: number
  selProjectID: number
  selEmployeeBankID: number
  selEmpId: number
  selExpenseTypeID: number
  selEmployeeID: number
  selGstTypeID: number
  mainSearch: string
  totalProjectAmount: number
  totalPaidAmount: number
  totalRemAmount: number
  totalDueAmount: number
  totalAmount: number
  totalLength: number
}

const AddMultipleProjectExpense: React.FC = () => {
  const [data, setData] = useState<IProjectExpenseModel>(initialValues)
  const [fileLoader, setFileLoader] = useState(false)
  const [file, setFile] = useState('')
  const [amount, setAmount] = useState<string>('')
  const [finalAmount, setFinalAmount] = useState<string>('')
  const updateData = (fieldsToUpdate: Partial<IProjectExpenseModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const [empBankData, setEmpBankData] = useState<IEmployeeBankDetailsModel[]>(
    [] as IEmployeeBankDetailsModel[]
  )
  const history = useHistory()
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IProjExp>({
    loading: false,
    employeeData: [] as IEmployeePageModel[],
    tmpEmployeeData: [] as IEmployeePageModel[],
    projectData: [] as IProjectModel[],
    temProjectData: [] as IProjectModel[],
    temSearchProjectData: [] as IProjectModel[],
    cashAccountData: [] as ICashAccountModel[],
    selCashAccountTypeID: 0,
    cashAccountID: 0,
    selpaymentID: 0,
    selProjectID: 0,
    selEmployeeBankID: 0,
    selEmpId: 0,
    selExpenseTypeID: 0,
    selEmployeeID: 0,
    selGstTypeID: 0,
    mainSearch: '',
    totalProjectAmount: 0,
    totalPaidAmount: 0,
    totalRemAmount: 0,
    totalDueAmount: 0,
    totalAmount: 0,
    totalLength: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var mainSearch: string = ''
      if (lc.mainSearch != undefined) {
        mainSearch = lc.mainSearch
      }
      getAllProjectData(mainSearch)
    }, 100)
  }, [])

  // -----------------upload file----------------------
  const fileUpload = (e: any) => {
    if (e.target.files[0].size > 20971520) {
      return toast.error('File size has exceeded it max limit of 20MB')
    }
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + `/ProjectExpense/UploadProjectExpenseDocument`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFile(data)
        setFileLoader(false)
      })
      .catch((err) => {
        setFileLoader(false)
        toast.error(`${err}`)
      })
  }

  function getAllProjectData(mainSearch: string) {
    getAllProjectListAPI()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getCashAccountData(responseData, mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            projectData: [],
            temSearchProjectData: [],
            temProjectData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectData: [],
          temSearchProjectData: [],
          temProjectData: [],
          loading: false,
        })
      })
  }

  function getCashAccountData(projectData: IProjectModel[], mainSearch: string) {
    GetCashAccountListAPI()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          getAllEmployeeSearchDropdownData(projectData, mainSearch, responseData)
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

  function getAllEmployeeSearchDropdownData(
    projectData: IProjectModel[],
    mainSearch: string,
    cashAccountData: ICashAccountModel[]
  ) {
    getEmployeeSearchDropDown()
      .then((response) => {
        const responseData = response.data
        setState({
          ...state,
          projectData: projectData,
          temProjectData: projectData,
          temSearchProjectData: projectData,
          mainSearch,
          cashAccountData: cashAccountData,
          employeeData: responseData,
          loading: false,
        })
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          projectData: [],
          cashAccountData: [],
          employeeData: [],
          loading: false,
        })
      })
  }

  function getAllEmpBankDetailsDataByEmpID(empID: number) {
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

  // ======================= Project Model PopUp ======================
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }

  // =================== For Selection ==============
  function setSelectedHandle(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpProjData = [...state.projectData] // Create a copy

    for (let k in tmpProjData) {
      if (uid == tmpProjData[k].projectID) {
        tmpProjData[k] = {
          ...tmpProjData[k], // Ensure immutability for individual object
          isSelected: isChecked ? 1 : 0,
        }
        break
      }
    }
    let tmpSearchProjData = [...state.temSearchProjectData] // Create a copy

    for (let k in tmpSearchProjData) {
      if (uid == tmpSearchProjData[k].projectID) {
        tmpSearchProjData[k] = {
          ...tmpSearchProjData[k], // Ensure immutability for individual object
          isSelected: isChecked ? 1 : 0,
        }
        break
      }
    }

    const checkedCount = tmpProjData.filter((project) => project.isSelected === 1).length
    // console.log(checkedCount)
    // Set state with new copies to trigger re-render
    setState({
      ...state,
      projectData: [...tmpProjData],
      totalLength: checkedCount,
      temSearchProjectData: [...tmpSearchProjData],
    })
  }

  // =================== For Item Meter Input Selection ==============
  function setInputAmt(e: any) {
    let uid: number = e.target.id
    let tmpValue: string = e.target.value
    const re = /^[0-9\b.]+$/

    // Only process if it's a valid number or empty input
    if ((!isNaN(parseFloat(tmpValue)) && re.test(tmpValue)) || tmpValue === '') {
      let tmpProjctData = [...state.projectData] // Copy array
      let tmpSearchProjctData = [...state.temSearchProjectData] // Copy array
      let amtTotal: number = 0

      for (let k in tmpProjctData) {
        if (uid == tmpProjctData[k].projectID) {
          let previousAmt = parseFloat(tmpProjctData[k].amt) || 0
          tmpProjctData[k] = {
            ...tmpProjctData[k], // Ensure immutability for individual object
            amt: tmpValue,
          }
          // amtTotal += parseFloat(tmpValue) || 0 // Add new value
        } else {
          // amtTotal += parseFloat(tmpProjctData[k].amt) || 0 // Sum up existing values
        }
      }

      for (let k in tmpSearchProjctData) {
        if (uid == tmpSearchProjctData[k].projectID) {
          let previousAmt = parseFloat(tmpSearchProjctData[k].amt) || 0
          tmpSearchProjctData[k] = {
            ...tmpSearchProjctData[k], // Ensure immutability for individual object
            amt: tmpValue,
          }
          amtTotal += parseFloat(tmpValue) || 0 // Add new value
        } else {
          amtTotal += parseFloat(tmpSearchProjctData[k].amt) || 0 // Sum up existing values
        }
      }

      setState({
        ...state,
        projectData: [...tmpProjctData],
        temSearchProjectData: [...tmpSearchProjctData],
        totalAmount: amtTotal,
      })
    }
  }

  // ======================== For Account Management===========================================
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
        //  selProjectID: parseInt(typeId), comment by paresh
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
    }
  }

  // --------Search For Project -------
  const [name, setName] = useState('')

  const filter = (e: any) => {
    const keyword = e.target.value.toLowerCase()

    if (keyword !== '') {
      const results = state.temSearchProjectData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword) ||
          user.projectStatusName.toLowerCase().includes(keyword) ||
          user.projectAmount.toString().includes(keyword) ||
          user.firstName.toLowerCase().includes(keyword) ||
          user.lastName.toLowerCase().includes(keyword) ||
          user.projectCategoryName.toLowerCase().includes(keyword)
        )
      })
      // Create a new copy of the filtered results and set it to projectData
      setState((prevState) => ({
        ...prevState,
        projectData: [...results], // Spread to create a new array
      }))
    } else {
      // Reset to the original data if no keyword
      setState((prevState) => ({
        ...prevState,
        projectData: [...prevState.temSearchProjectData], // Create a new copy
      }))
    }
    setName(keyword) // Update the keyword state
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IProjectExpenseModel>({
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

        if (values.expenseDate > moment(new Date()).format('YYYY-MM-DD')) {
          toast.error(`Date should be less than or Equal to today's date`)
          return setLoading(false)
        }

        // without Valaidation
        // let tmplstCheckedOutputData = [] as IProjectExpMulModel[]
        // let resultOptputObj: IProjectModel[] = state.temSearchProjectData
        // for (let k in resultOptputObj) {
        //   if (resultOptputObj[k].isSelected == 1) {
        //     let tmpCheckedData: IProjectExpMulModel = {
        //       projectID: resultOptputObj[k]['projectID'],
        //       amount: resultOptputObj[k]['amt'],
        //     }
        //     tmplstCheckedOutputData.push(tmpCheckedData)
        //   }
        // }

        // with Valaidation
        let tmplstCheckedOutputData = [] as IProjectExpMulModel[]
        let resultOptputObj: IProjectModel[] = state.temSearchProjectData

        for (let k in resultOptputObj) {
          if (resultOptputObj[k].isSelected === 1) {
            let amount = resultOptputObj[k]['amt']
            // Validate amount: Ensure it's a number, greater than 0, and not empty
            if (
              amount === undefined ||
              amount === null ||
              isNaN(parseFloat(amount)) ||
              parseFloat(amount) <= 0
            ) {
              toast.error(`Please Enter Amount In Project: ${resultOptputObj[k]['projectName']}`)
              setLoading(false)
              return
            }

            let tmpCheckedData: IProjectExpMulModel = {
              projectID: resultOptputObj[k]['projectID'],
              amount: amount,
            }

            tmplstCheckedOutputData.push(tmpCheckedData)
          }
        }

        // valaidate whole object Empty
        if (tmplstCheckedOutputData.length === 0) {
          toast.error('Please Select Project.')
          setLoading(false)
          return
        }

        addMultipleProjectExpenseAPI(
          tmplstCheckedOutputData,
          values.title,
          values.expenseDate,
          file,
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
          values.employeeID,
          values.description,
          false,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          false,
          0,
          0,
          0,
          0,
          0,
          user.employeeID,
          '192.168.0.1'
        )
          .then((response) => {
            if (response.data.isSuccess === true) {
              toast.success('Created Successfull')
              history.push({
                pathname: '/accounts/project-expense/list',
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
      <div className='text-end'>
        <span>
          <Link
            className='btn btn-sm btn-light-primary bg-success text-white fs-6 mb-2 btn btn-rounded'
            to={{pathname: '/accounts/project-expense/list', state: {Search: state.mainSearch}}}
            title='Click Here'
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
                <label className='col-lg-1 col-form-label fw-bold fs-6'>
                  <span className='required'>Title:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Title'
                    {...formik.getFieldProps('title')}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.title}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className='card-body py-3'>
                <div className='card-header border-0' style={{backgroundColor: '#000000'}}>
                  <div className='border-0 pt-4' id='kt_chat_contacts_header'>
                    <form className='w-100 position-relative' autoComplete='off'>
                      <KTSVG
                        path='/media/icons/duotune/general/gen021.svg'
                        className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
                      />
                      <input
                        type='text'
                        className='form-control form-control-solid px-15 bg-white'
                        placeholder='Search'
                        onChange={filter}
                        value={name}
                      />
                    </form>
                  </div>
                </div>
                <div className='table-responsive'>
                  <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                    <thead>
                      <tr className='fw-bolder fs-5 text-dark'>
                        <th className='w-25px'></th>
                        <th className='min-w-150x text-start '>
                          <span className='d-block  mb-1'>Project Name </span>
                        </th>
                        <th className='min-w-25px'>Amount</th>
                      </tr>
                    </thead>
                    <tbody className="border-bottom">
                      {state.projectData.length > 0 &&
                        state.projectData.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                  <input
                                    className='form-check-input widget-9-check'
                                    type='checkbox'
                                    id={`${data.projectID}`}
                                    checked={data.isSelected === 1}
                                    onChange={(e) => setSelectedHandle(e)}
                                  />
                                </div>
                              </td>
                              <td>
                                <span className='text-dark text-hover-primary d-block mb-1 fs-6  text-start'>
                                  {data.projectName}
                                </span>
                              </td>
                              <td className='w-100px'>
                                <span className='mb-1'>
                                  <input
                                    className='form-control form-control-sm text-end'
                                    type='text'
                                    name='amt'
                                    autoComplete='off'
                                    id={`${data.projectID}`}
                                    disabled={data.isSelected !== 1}
                                    onChange={(e) => setInputAmt(e)}
                                    value={data.amt || ''}
                                  />
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      <tr className='text-dark'>
                        <td className='text-start'></td>
                        <td className='border-top border-dark text-start fw-bolder fs-5'>
                          Total :
                        </td>
                        <td className='border-top border-dark text-end text-danger fw-bolder fs-6'>
                          {state.totalAmount}
                        </td>
                        <td className='text-start' colSpan={5}></td>
                      </tr>
                      <BlankDataImageInTable
                        length={state.projectData.length}
                        loading={state.loading}
                        colSpan={9}
                      />
                    </tbody>
                  </table>
                </div>
              </div> */}
              <div className={'row mb-6'}>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Select Project:
                </label>
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>No Of Project:</label>
                <div className='col-lg-1 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='No Of Porject'
                    disabled
                    value={state.totalLength}
                  />
                </div>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Total Amount:</label>
                <div className='col-lg-2 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg border-0 bg-white'
                    placeholder='Total Amount'
                    disabled
                    value={state.totalAmount}
                  />
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Date:</span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Enter Date'
                    {...formik.getFieldProps('expenseDate')}
                  />
                  {formik.touched.expenseDate && formik.errors.expenseDate && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.expenseDate}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Select Account:
                </label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='cashAccountID'
                  >
                    <option selected={state.selCashAccountTypeID === 0 ? true : false} value={0}>
                      Select Cassh Account Type
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
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                  Select Mode:
                </label>
                <div className='col-lg-4 fv-row'>
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
                    {state.selpaymentID === 1 || state.selCashAccountTypeID === 0 ? (
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
              <div className={'row mb-6'}>
                <label
                  className={
                    state.selProjectID === 2 &&
                    (state.selpaymentID === 1 || state.selpaymentID === 2)
                      ? 'col-lg-2 col-form-label fw-bold fs-6 required'
                      : 'd-none'
                  }
                >
                  Select Employee Bank Name:
                </label>
                <div
                  className={
                    state.selProjectID === 2 &&
                    (state.selpaymentID === 1 || state.selpaymentID === 2)
                      ? 'col-lg-4 fv-row'
                      : 'd-none'
                  }
                >
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
                <label
                  className={
                    state.selpaymentID === 2 ? 'col-lg-2 col-form-label fw-bold fs-6' : 'd-none'
                  }
                >
                  <span className=''>Cheque Date:</span>
                </label>
                <div className={state.selpaymentID === 2 ? 'col-lg-4 fv-row' : 'd-none'}>
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
              <div className={state.selpaymentID === 2 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Bank Name:</span>
                </label>
                <div className='col-lg-4 fv-row'>
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Branch Name:</span>
                </label>
                <div className='col-lg-4 fv-row'>
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
              </div>
              <div className={state.selpaymentID === 2 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className='required'>Cheque No:</span>
                </label>
                <div className='col-lg-4 fv-row'>
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Cheque Amount:</span>
                </label>
                <div className='col-lg-4 fv-row'>
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
              <div className={state.selpaymentID === 1 ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Transaction ID:</span>
                </label>
                <div className='col-lg-4 fv-row'>
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Vendor Invoice No.:</label>
                <div className='col-lg-4 fv-row'>
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
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Document Attach:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <input
                    type='file'
                    accept='.pdf'
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    onChange={(e) => fileUpload(e)}
                  />
                  <span className='text-danger'>Allow maximum 20MB file size </span>
                </div>
              </div>
              <div className={file !== '' ? 'row mb-6' : 'd-none'}>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''></span>
                </label>
                <div className='col-lg-4 fv-row'>
                  <div className='symbol symbol-75px me-5'>
                    <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='' />
                  </div>
                </div>
              </div>{' '}
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>Description:</span>
                </label>
                <div className='col-lg-10 fv-row'>
                  <textarea
                    rows={2}
                    className='form-control form-control-lg form-control-solid bg-light-primary'
                    placeholder='Description...'
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className='fv-plugins-message-container text-danger'>
                      <div className='fv-help-block'>{formik.errors.description}</div>
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
                to={{pathname: '/accounts/project-expense/list', state: {Search: state.mainSearch}}}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
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
                    <tr className='fw-bolder fs-5 text-dark'>
                      <th className='w-25px'></th>
                      <th className='min-w-150x text-start '>
                        <span className='d-block  mb-1'>Project Name </span>
                      </th>
                      <th className='min-w-25px'>Amount</th>
                    </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody className="border-bottom">
                    {state.projectData.length > 0 &&
                      state.projectData.map((data, index) => {
                        return (
                          //
                          <tr key={index}>
                            <td>
                              <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input
                                  className='form-check-input widget-9-check'
                                  type='checkbox'
                                  id={`${data.projectID}`}
                                  checked={data.isSelected === 1}
                                  onChange={(e) => setSelectedHandle(e)}
                                />
                              </div>
                            </td>
                            <td>
                              <span className='text-dark text-hover-primary d-block mb-1 fs-6  text-start'>
                                {data.projectName}
                              </span>
                            </td>
                            <td className='w-100px'>
                              <span className='mb-1'>
                                <input
                                  className='form-control form-control-sm text-end'
                                  type='text'
                                  name='amt'
                                  autoComplete='off'
                                  id={`${data.projectID}`}
                                  disabled={data.isSelected !== 1}
                                  onChange={(e) => setInputAmt(e)}
                                  value={data.amt || ''}
                                />
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    {/* <tr className='text-dark'>
                      <td className='text-start'></td>
                      <td className='border-top border-dark text-start fw-bolder fs-5'>Total :</td>
                      <td className='border-top border-dark text-end text-danger fw-bolder fs-6'>
                        {state.totalAmount}
                      </td>
                      <td className='text-start' colSpan={5}></td>
                    </tr> */}
                    {/* =================== Loading get Api Data ============== */}
                    <BlankDataImageInTable
                      length={state.projectData.length}
                      loading={state.loading}
                      colSpan={9}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <table>
              <tbody className="border-bottom">
                <tr className='text-dark'>
                  <td className='text-start'></td>
                  <td className='border-top border-dark text-start fw-bolder fs-5'>Total :</td>
                  <td className='border-top border-dark text-end text-danger fw-bolder fs-6'>
                    {state.totalAmount}
                  </td>
                  <td className='text-start' colSpan={5}></td>
                </tr>
              </tbody>
            </table>
            <Button variant='danger' onClick={handleClose}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}

export {AddMultipleProjectExpense}
