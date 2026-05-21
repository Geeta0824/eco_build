import React, {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {toast} from 'react-toastify'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {Button, Modal} from 'react-bootstrap-v5'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import Loader from '../../common-pages/Loader'
import {IVenderModel} from '../../../models/master-page/IVenderModel'
import {
  getVenderListByVendorTypeID,
} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import {
  agencyTypeDataForModular,
  gstTypeData,
  venderTypeData,
} from '../../other-dropDowns/otherDropDowns'
import {
  IAgencyTypeDownModel,
  IAgencyTypeObjModel,
  IProjectVendorModel,
  projectVendorInitValues as initialValues,
} from '../../../models/projects-page/IProjectVendorModel'
import {
  addMultpleAgecyProjectVendorDetails_WithGSTAPI,
  addProjectVendorDetails_WithGSTAPI,
  getAgencyTypeByProjectIDApi,
} from '../../../modules/project-master-page/vendor-Master-page/ProjectVendorCRUD'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'

const profileDetailsSchema = Yup.object().shape({
  vendorTypeID: Yup.string().required('Vendor Type Is Required').min(1, 'Vendor Type Is Required'),
  remarks: Yup.string().required('Remarks Is Required'),
})

interface IProjectVendor {
  loading: boolean
  vendorData: IVenderModel[]
  tmpVendorData: IVenderModel[]
  projectVendorData: IProjectVendorModel[]
  agencyTypeData: IAgencyTypeDownModel[]
  action: string
  selVendorID: number
  selVendorTypeID: number
  projectCategoryID: number
  selAgencyTypeID: number
  ProjectName: string
  totalAmount: number
  totalAgencyCost: number
  selGstTypeID: number
  totalCGSTPer: number
  totalCGSTVal: number
  totalSGSTPer: number
  totalSGSTVal: number
  totalIGSTPer: number
  totalIGSTVal: number
  totalGSTAmount: number
  totalSubAmount: number
}

const AddProjectVendor: React.FC = () => {
  const [isgst, setIsgst] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const [projectFilePath, setProjectFilePath] = useState<string>('')
  const [fileLoader, setFileLoader] = useState<boolean>(false)
  const {projectID} = useParams<{projectID: string}>()
  const [mainLoading, setMainLoading] = useState(false)
  const {vendorID} = useParams<{vendorID: string}>()
  // const [agencyGst, setAgencyGst] = useState({
  //   GSTTypeName: '',
  //   cgstPer: 0,
  //   cgstVal: 0,
  //   sgstPer: 0,
  //   sgstVal: 0,
  //   igstPer: 0,
  //   igstVal: 0,
  //   gstAmount: 0,
  //   subAmount: 0,
  // })
  const [amount, setAmount] = useState({
    vendorCost: 0,
    paidAmount: 0,
    remainingAmount: 0,
  })
  const [data, setData] = useState<IProjectVendorModel>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IProjectVendorModel>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IProjectVendor>({
    loading: true,
    vendorData: [] as IVenderModel[],
    tmpVendorData: [] as IVenderModel[],
    projectVendorData: [] as IProjectVendorModel[],
    agencyTypeData: [] as IAgencyTypeDownModel[],
    action: 'ProjInfo',
    selVendorID: 0,
    selVendorTypeID: 0,
    projectCategoryID: 0,
    selAgencyTypeID: 0,
    ProjectName: '',
    totalAmount: 0,
    totalAgencyCost: 0,
    selGstTypeID: 0,
    totalCGSTPer: 0,
    totalCGSTVal: 0,
    totalSGSTPer: 0,
    totalSGSTVal: 0,
    totalIGSTPer: 0,
    totalIGSTVal: 0,
    totalGSTAmount: 0,
    totalSubAmount: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      // let projectID: any = lc.projectID
      let ProjectName: any = lc.projectName
      let projectCategoryID: any = lc.projectCategoryID
      getVenderData(ProjectName, projectCategoryID, state.selVendorTypeID)
    }, 100)
  }, [])

  function getVenderData(ProjectName: string, projectCategoryID: number, temVendorTypeID: number) {
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
            tmpVendorData: responseData,
            ProjectName: ProjectName,
            selVendorTypeID: temVendorTypeID,
            selAgencyTypeID: 0,
            projectCategoryID,
            loading: false,
          })
          setTotal(responseData.length)
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

  function getAgencyTypeData(vendorID: number) {
    getAgencyTypeByProjectIDApi(parseInt(projectID))
      .then((response) => {
        const responseData = response.data.responseObject
        let tmplstCheckedOutputData = [] as IAgencyTypeDownModel[]
        //console.log(tmplstCheckedOutputData)
        let resultOptputObj: IAgencyTypeDownModel[] = responseData
        for (let k in resultOptputObj) {
          let tmpCheckedOutputData: IAgencyTypeDownModel = {
            agencyTypeID: resultOptputObj[k]['agencyTypeID'],
            agencyCost: resultOptputObj[k]['agencyCost'],
            agencyTypeName: resultOptputObj[k]['agencyTypeName'],
            sgstVal: resultOptputObj[k]['sgstVal'],
            cgstVal: resultOptputObj[k]['cgstVal'],
            igstVal: resultOptputObj[k]['igstVal'],
            sgstPer: resultOptputObj[k]['sgstPer'],
            cgstPer: resultOptputObj[k]['cgstPer'],
            igstPer: resultOptputObj[k]['igstPer'],
            gstAmount: resultOptputObj[k]['gstAmount'],
            subAmount: resultOptputObj[k]['subAmount'],
            isSelected: 0,
            // isShow: 0,
            // amt: resultOptputObj[k]['agencyCost'],
            amt: '',
          }
          tmplstCheckedOutputData.push(tmpCheckedOutputData)
        }
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            agencyTypeData: tmplstCheckedOutputData,
            selVendorID: vendorID,
            totalAgencyCost: response.data.totalAgencyCost,
            // totalAmount: response.data.totalAgencyCost,
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

  function handleChange(e: any) {
    const {id, value} = e.target
    const re = /^[0-9\b.]+$/

    console.log(`Input Changed — ID: ${id}, Value: ${value}`)

    if (!re.test(value) && value !== '') return // Block invalid input (except empty)

    let parsedValue = parseFloat(value) || 0
    console.log(`Parsed Value: ${parsedValue}`)

    // Vendor Cost
    if (id === 'vendorCost') {
      const paidAmount = parseFloat(amount.paidAmount.toString()) || 0
      const remainingAmount = parsedValue - paidAmount

      console.log(`Paid Amount: ${paidAmount}`)
      console.log(`Calculated Remaining Amount: ${remainingAmount}`)

      setAmount({...amount, vendorCost: value, remainingAmount})

      const gstRate = 18
      const gstAmount = (parsedValue * gstRate) / 100
      const subAmount = parsedValue - gstAmount
      const TaxableValue = parsedValue / (1 + gstRate / 100)
      const GSTAmounts = parsedValue - TaxableValue

      console.log(`GST Rate: ${gstRate}%`)
      console.log(`GST Amount: ${gstAmount}`)
      console.log(`Taxable Value: ${TaxableValue}`)
      console.log(`Sub Amount: ${subAmount}`)

      if (state.selGstTypeID === 1) {
        // State GST (SGST + CGST)
        const sgstVal = GSTAmounts / 2
        const cgstVal = GSTAmounts / 2

        console.log('GST Type: SGST + CGST')
        console.log(`SGST: ${sgstVal}, CGST: ${cgstVal}`)

        formik.setFieldValue('sgstPer', 9)
        formik.setFieldValue('sgstVal', sgstVal.toFixed(2))
        formik.setFieldValue('cgstPer', 9)
        formik.setFieldValue('cgstVal', cgstVal.toFixed(2))
        formik.setFieldValue('igstPer', 0)
        formik.setFieldValue('igstVal', 0)
      } else if (state.selGstTypeID === 2) {
        // Central GST (IGST)
        console.log('GST Type: IGST')
        console.log(`IGST: ${gstAmount}`)

        formik.setFieldValue('igstPer', gstRate)
        // formik.setFieldValue('igstVal', gstAmount)
        formik.setFieldValue('igstVal', GSTAmounts.toFixed(2))
        formik.setFieldValue('sgstPer', 0)
        formik.setFieldValue('sgstVal', 0)
        formik.setFieldValue('cgstPer', 0)
        formik.setFieldValue('cgstVal', 0)
      } else {
        // No GST
        console.log('GST Type: None')

        formik.setFieldValue('igstPer', 0)
        formik.setFieldValue('igstVal', 0)
        formik.setFieldValue('sgstPer', 0)
        formik.setFieldValue('sgstVal', 0)
        formik.setFieldValue('cgstPer', 0)
        formik.setFieldValue('cgstVal', 0)
      }

      // formik.setFieldValue('gstAmount', gstAmount)
      // formik.setFieldValue('subAmount', subAmount)
      formik.setFieldValue('gstAmount', GSTAmounts.toFixed(2))
      formik.setFieldValue('subAmount', TaxableValue.toFixed(2))
    }

    // Paid Amount
    if (id === 'paidAmount') {
      const vendorCost = parseFloat(amount.vendorCost.toString()) || 0
      const remainingAmount = vendorCost - parsedValue

      console.log(`Vendor Cost: ${vendorCost}`)
      console.log(`New Paid Amount: ${parsedValue}`)
      console.log(`Updated Remaining Amount: ${remainingAmount}`)

      setAmount({...amount, paidAmount: value, remainingAmount})
    }

    // Remaining Amount
    if (id === 'remainingAmount') {
      console.log(`Manual Remaining Amount Set: ${value}`)
      setAmount({...amount, remainingAmount: value})
    }
  }

  function checkedFunction(event: any) {
    const isChecked = event.target.checked

    if (isChecked) {
      const tmpvendorCost = parseFloat((amount.vendorCost || "0").toString());
      if (tmpvendorCost > 0) {
        setIsgst(true);
      
        const vendorCost = parseFloat(amount.vendorCost.toFixed(2));
        const gstRate = 18;
        const gstAmountRaw = vendorCost / (1 + gstRate / 100);
        const gstAmount = vendorCost - parseFloat(gstAmountRaw.toFixed(2));
      
        console.log("Vendor Cost:", vendorCost);
        console.log("GST Amount (18%):", gstAmount);
      
        if (state.selGstTypeID === 1) {
          // State GST (CGST + SGST)
          const sgstVal = parseFloat((gstAmount / 2).toFixed(2));
          const cgstVal = parseFloat((gstAmount / 2).toFixed(2));
      
          formik.setFieldValue('sgstPer', 9);
          formik.setFieldValue('sgstVal', sgstVal);
          formik.setFieldValue('cgstPer', 9);
          formik.setFieldValue('cgstVal', cgstVal);
          formik.setFieldValue('gstAmount', gstAmount.toFixed(2));
      
          console.log("SGST:", sgstVal, "CGST:", cgstVal);
        } else if (state.selGstTypeID === 2) {
          // Central GST (IGST)
          const igstVal = gstAmount;
      
          formik.setFieldValue('igstPer', 18);
          formik.setFieldValue('igstVal', igstVal);
          formik.setFieldValue('gstAmount', gstAmount.toFixed(2));
          formik.setFieldValue('subAmount', gstAmountRaw.toFixed(2));
      
          console.log("IGST:", igstVal);
        } 
        // Optional fallback:
        // else {
        //   toast.error('Please select a GST Type');
        // }
      } else {
        toast.error('Please Enter Vendor Cost')
      }
    } else {
      // Reset GST values when unchecked
      formik.setFieldValue('cgstVal', 0)
      formik.setFieldValue('cgstPer', 0)
      formik.setFieldValue('sgstVal', 0)
      formik.setFieldValue('sgstPer', 0)
      formik.setFieldValue('igstVal', 0)
      formik.setFieldValue('igstPer', 0)
      formik.setFieldValue('gstAmount', 0)
      setIsgst(false)
      setState({...state, selGstTypeID: 0})
    }
  }

  // -----------------upload photo----------------------
  const imageUploadQuotation = (e: any) => {
    setFileLoader(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)
    fetch(process.env.REACT_APP_API_URL + '/Project/SaveProjectPhoto', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setProjectFilePath(data)
        setFileLoader(false)
      })
  }

  const selectChange = (event: any) => {
    const value = parseInt(event.target.value)
    const elementId = event.target.id

    if (elementId === 'vendorTypeID') {
      formik.setFieldValue('vendorTypeID', value)
      getVenderData(state.ProjectName, state.projectCategoryID, value)
    } else if (elementId === 'selAgencyTypeID') {
      formik.setFieldValue('selAgencyTypeID', value)
      setState({...state, selAgencyTypeID: value})
    } else if (elementId === 'gstTypeID') {
      formik.setFieldValue('gstTypeID', value)

      if (amount.vendorCost > 0) {
        const gstRate = 18;
        const gstAmountRaw = amount.vendorCost / (1 + gstRate / 100);
        const gstAmount = amount.vendorCost - parseFloat(gstAmountRaw.toFixed(2));

        if (value === 1) {
          // CGST + SGST
          formik.setFieldValue('sgstPer', 9)
          formik.setFieldValue('sgstVal', gstAmount / 2)
          formik.setFieldValue('cgstPer', 9)
          formik.setFieldValue('cgstVal', gstAmount / 2)
          formik.setFieldValue('igstPer', 0)
          formik.setFieldValue('igstVal', 0)
        } else if (value === 2) {
          // IGST
          formik.setFieldValue('igstPer', 18)
          formik.setFieldValue('igstVal', gstAmount)
          formik.setFieldValue('sgstPer', 0)
          formik.setFieldValue('sgstVal', 0)
          formik.setFieldValue('cgstPer', 0)
          formik.setFieldValue('cgstVal', 0)
        } else {
          // No GST
          formik.setFieldValue('igstPer', 0)
          formik.setFieldValue('igstVal', 0)
          formik.setFieldValue('sgstPer', 0)
          formik.setFieldValue('sgstVal', 0)
          formik.setFieldValue('cgstPer', 0)
          formik.setFieldValue('cgstVal', 0)
        }

        formik.setFieldValue('gstAmount', gstAmount.toFixed(2))
        formik.setFieldValue('subAmount', gstAmountRaw.toFixed(2))
      } else {
        toast.error('Please Enter Vendor Cost First')
      }

      // Update agencies
      const tmpAgencyData = [...state.agencyTypeData]
      let amtTotal = 0
      let cgstPerTotal = 0,
        cgstValTotal = 0
      let sgstPerTotal = 0,
        sgstValTotal = 0
      let igstPerTotal = 0,
        igstValTotal = 0
      let gstAmountTotal = 0,
        subAmountTotal = 0

      const updatedAgencyData = tmpAgencyData.map((agency) => {
        if (agency.isSelected === 1) {
          const vendorCost = parseFloat(agency.agencyCost || '0')
          const gstAmount = (vendorCost * 18) / 100

          agency.amt = vendorCost.toString()
          agency.gstAmount = gstAmount
          agency.subAmount = vendorCost - gstAmount

          if (value === 1) {
            agency.cgstPer = 9
            agency.sgstPer = 9
            agency.cgstVal = gstAmount / 2
            agency.sgstVal = gstAmount / 2
            agency.igstPer = 0
            agency.igstVal = 0
          } else if (value === 2) {
            agency.cgstPer = 0
            agency.sgstPer = 0
            agency.cgstVal = 0
            agency.sgstVal = 0
            agency.igstPer = 18
            agency.igstVal = gstAmount
          } else {
            agency.cgstPer = 0
            agency.sgstPer = 0
            agency.igstPer = 0
            agency.cgstVal = 0
            agency.sgstVal = 0
            agency.igstVal = 0
            agency.gstAmount = 0
            agency.subAmount = 0
          }

          amtTotal += vendorCost
          cgstPerTotal += agency.cgstPer
          cgstValTotal += agency.cgstVal
          sgstPerTotal += agency.sgstPer
          sgstValTotal += agency.sgstVal
          igstPerTotal += agency.igstPer
          igstValTotal += agency.igstVal
          gstAmountTotal += agency.gstAmount
          subAmountTotal += agency.subAmount

          return agency
        } else {
          // If not selected, keep as-is
          return agency
        }
      })

      setState({
        ...state,
        selGstTypeID: value,
        agencyTypeData: updatedAgencyData,
        totalAmount: amtTotal,
        totalCGSTPer: cgstPerTotal,
        totalCGSTVal: cgstValTotal,
        totalSGSTPer: sgstPerTotal,
        totalSGSTVal: sgstValTotal,
        totalIGSTPer: igstPerTotal,
        totalIGSTVal: igstValTotal,
        totalGSTAmount: gstAmountTotal,
        totalSubAmount: subAmountTotal,
      })
    }
  }

  // ======================= Vendor Model PopUp ======================
  const [showVendor, setShowVendor] = useState(false)
  function handleCloseVendor() {
    setShowVendor(false)
  }
  function handleShowVendor() {
    setShowVendor(true)
  }

  // --------For Model Data onClick Function-------
  function selectVendor(tmpVendorData: IVenderModel) {
    getAgencyTypeData(tmpVendorData.vendorID)
    formik.setFieldValue('vendorID', tmpVendorData.vendorID)
    formik.setFieldValue('companyName', tmpVendorData.companyName)
    formik.setFieldValue('contactPerson', tmpVendorData.contactPerson)
    formik.setFieldValue('contactNumber', tmpVendorData.contactNumber)
    // setState({...state, selVendorID: tmpVendorData.vendorID})
    setShowVendor(false)
  }

  // ===================== For vendor Filter =====================
  const [name, setName] = useState('')

  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpVendorData.filter((user) => {
        return (
          user.vendorTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.email.toLowerCase().includes(keyword.toLowerCase()) ||
          user.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
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

  // function setSelectedHandle(e: any) {
  //   let uid: number = e.target.id
  //   let isChecked = e.target.checked
  //   let tmpAgencyData = state.agencyTypeData
  //   let amtTotal: number = 0
  //   for (let k in tmpAgencyData) {
  //     if (uid == tmpAgencyData[k].agencyTypeID) {
  //       if (isChecked) {
  //         tmpAgencyData[k].isSelected = 1
  //         tmpAgencyData[k].amt = tmpAgencyData[k]['agencyCost']
  //         amtTotal += parseInt(tmpAgencyData[k].amt)
  //       } else {
  //         tmpAgencyData[k].isSelected = 0
  //         tmpAgencyData[k].amt = ''
  //       }
  //       break
  //     }
  //   }
  //   setState({...state, agencyTypeData: tmpAgencyData, totalAmount: amtTotal})
  // }

  // function setSelectedHandle(e: any) {
  //   let uid: number = e.target.id
  //   let isChecked = e.target.checked
  //   let tmpAgencyData = state.agencyTypeData
  //   let amtTotal: number = 0

  //   // Loop through agency data and update the relevant item
  //   for (let k in tmpAgencyData) {
  //     if (uid == tmpAgencyData[k].agencyTypeID) {
  //       if (isChecked) {
  //         tmpAgencyData[k].isSelected = 1
  //         tmpAgencyData[k].amt = tmpAgencyData[k].agencyCost
  //       } else {
  //         tmpAgencyData[k].isSelected = 0
  //         tmpAgencyData[k].amt = '' // Clear the amount when unchecked
  //       }
  //       break
  //     }
  //   }

  //   // Recalculate the total amount for all selected items
  //   for (let k in tmpAgencyData) {
  //     if (tmpAgencyData[k].isSelected) {
  //       amtTotal += parseInt(tmpAgencyData[k].amt) || 0 // Add selected amounts to the total
  //     }
  //   }

  //   // Update the state with the new agency data and total amount
  //   setState({...state, agencyTypeData: tmpAgencyData, totalAmount: amtTotal})
  // }

  const setSelectedHandle = (e: any) => {
    const uid: number = e.target.id
    const isChecked = e.target.checked
    const tmpAgencyData = [...state.agencyTypeData]
    let amtTotal: number = 0

    let cgstPerTotal = 0
    let cgstValTotal: number = 0
    let sgstPerTotal: number = 0
    let sgstValTotal: number = 0
    let igstPerTotal: number = 0
    let igstValTotal: number = 0
    let gstAmountTotal: number = 0
    let subAmountTotal: number = 0

    for (let k in tmpAgencyData) {
      const agency = tmpAgencyData[k]
      if (uid == agency.agencyTypeID) {
        agency.isSelected = isChecked ? 1 : 0
        if (isChecked) {
          const vendorCost = parseFloat(agency.agencyCost) || 0;
          const gstRate = 18;
        
          const taxableValue = vendorCost / (1 + gstRate / 100); // Taxable base
          const gstAmount = vendorCost - taxableValue; // GST portion
        
          agency.amt = vendorCost.toString();
          agency.subAmount = taxableValue;
          agency.gstAmount = gstAmount;
        
          // Reset all GST values first
          agency.cgstPer = 0;
          agency.sgstPer = 0;
          agency.igstPer = 0;
          agency.cgstVal = 0;
          agency.sgstVal = 0;
          agency.igstVal = 0;
        
          if (state.selGstTypeID === 1) {
            // State GST (CGST + SGST)
            agency.cgstPer = 9;
            agency.sgstPer = 9;
            agency.cgstVal = gstAmount / 2;
            agency.sgstVal = gstAmount / 2;
          } else if (state.selGstTypeID === 2) {
            // Central GST (IGST)
            agency.igstPer = gstRate;
            agency.igstVal = gstAmount;
          } else {
            // No GST
            agency.gstAmount = 0;
            agency.subAmount = vendorCost;
          }
        }
         else {
          // Unchecked
          agency.amt = ''
          agency.gstAmount = 0
          agency.subAmount = 0
          agency.cgstPer = 0
          agency.sgstPer = 0
          agency.igstPer = 0
          agency.cgstVal = 0
          agency.sgstVal = 0
          agency.igstVal = 0
        }
        break
      }
    }

    for (let a of tmpAgencyData) {
      if (a.isSelected) amtTotal += parseFloat(a.amt) || 0

      cgstPerTotal += a.cgstPer || 0
      sgstPerTotal += a.sgstPer || 0
      cgstValTotal += a.cgstVal || 0
      sgstValTotal += a.sgstVal || 0
      igstPerTotal += a.igstPer || 0
      igstValTotal += a.igstVal || 0
      gstAmountTotal += a.gstAmount || 0
      subAmountTotal += a.subAmount || 0
    }

    setState({
      ...state,
      agencyTypeData: tmpAgencyData,
      totalAmount: amtTotal,
      totalCGSTPer: cgstPerTotal,
      totalCGSTVal: cgstValTotal,
      totalSGSTPer: sgstPerTotal,
      totalSGSTVal: sgstValTotal,
      totalIGSTPer: igstPerTotal,
      totalIGSTVal: igstValTotal,
      totalGSTAmount: gstAmountTotal,
      totalSubAmount: subAmountTotal,
    })
  }

  // ------------new function for input amount------------------
  const setInputAmt = (e: any) => {
    const uid: number = e.target.id
    const tmpValue: string = e.target.value
    const re = /^[0-9\b.]+$/
    const tmpAgencyData = [...state.agencyTypeData]
    let amtTotal = 0

    let cgstPerTotal = 0
    let cgstValTotal = 0
    let sgstPerTotal = 0
    let sgstValTotal = 0
    let igstPerTotal = 0
    let igstValTotal = 0
    let gstAmountTotal = 0
    let subAmountTotal = 0

    for (let agency of tmpAgencyData) {
      if (uid == agency.agencyTypeID) {
        if (re.test(tmpValue)) {
          agency.amt = tmpValue

          if (agency.isSelected) {
            const value = parseFloat(tmpValue) || 0;
            const gstRate = 18;
          
            const taxableValue = value / (1 + gstRate / 100);
            const gstAmount = value - taxableValue;
          
            agency.gstAmount = gstAmount;
            agency.subAmount = taxableValue;
          
            // Reset all GST fields first
            agency.cgstPer = 0;
            agency.sgstPer = 0;
            agency.igstPer = 0;
            agency.cgstVal = 0;
            agency.sgstVal = 0;
            agency.igstVal = 0;
          
            if (state.selGstTypeID === 1) {
              // CGST + SGST
              agency.cgstPer = 9;
              agency.sgstPer = 9;
              agency.cgstVal = gstAmount / 2;
              agency.sgstVal = gstAmount / 2;
            } else if (state.selGstTypeID === 2) {
              // IGST only
              agency.igstPer = gstRate;
              agency.igstVal = gstAmount;
            } else {
              // No GST
              agency.gstAmount = 0;
              agency.subAmount = value;
            }
          }          
        } else if (tmpValue === '') {
          agency.amt = ''
          agency.gstAmount = 0
          agency.subAmount = 0
          agency.cgstVal = 0
          agency.sgstVal = 0
          agency.igstVal = 0
          agency.cgstPer = 0
          agency.sgstPer = 0
          agency.igstPer = 0
        }
      }
      if (agency.isSelected) {
        amtTotal += parseFloat(agency.amt) || 0
        cgstPerTotal += agency.cgstPer || 0
        sgstPerTotal += agency.sgstPer || 0
        cgstValTotal += agency.cgstVal || 0
        sgstValTotal += agency.sgstVal || 0
        igstPerTotal += agency.igstPer || 0
        igstValTotal += agency.igstVal || 0
        gstAmountTotal += agency.gstAmount || 0
        subAmountTotal += agency.subAmount || 0
      }
    }

    setState({
      ...state,
      agencyTypeData: tmpAgencyData,
      totalAmount: amtTotal,
      totalCGSTPer: cgstPerTotal,
      totalCGSTVal: cgstValTotal,
      totalSGSTPer: sgstPerTotal,
      totalSGSTVal: sgstValTotal,
      totalIGSTPer: igstPerTotal,
      totalIGSTVal: igstValTotal,
      totalGSTAmount: gstAmountTotal,
      totalSubAmount: subAmountTotal,
    })
  }

  // // ========================================================
  // function setInputAmt(e: any) {
  //   let uid: number = e.target.id
  //   let tmpValue: string = e.target.value
  //   //console.log('--------------')
  //   //console.log(tmpValue)
  //   const re = /^[0-9\b.]+$/
  //   if (!isNaN(parseFloat(tmpValue)) && re.test(tmpValue)) {
  //     let tmpAgencyData = [...state.agencyTypeData] // make sure you create a copy
  //     // console.log(tmpAgencyData)
  //     let amtTotal: number = 0 // reset the total amount

  //     // Update the relevant project data and recalculate total
  //     for (let k in tmpAgencyData) {
  //       if (uid == tmpAgencyData[k].agencyTypeID) {
  //         // Subtract the old value if present, and add the new one
  //         let previousAmt = parseFloat(tmpAgencyData[k].amt) || 0
  //         tmpAgencyData[k].amt = tmpValue
  //         amtTotal += parseFloat(tmpValue)
  //       } else {
  //         // If it's not the selected one, just sum up existing values
  //         amtTotal += parseFloat(tmpAgencyData[k].amt) || 0
  //       }
  //     }

  //     //console.log(amtTotal)
  //     setState({...state, agencyTypeData: tmpAgencyData, totalAmount: amtTotal})
  //   } else if (tmpValue === '') {
  //     let tmpAgencyData = [...state.agencyTypeData]
  //     let amtTotal: number = 0 // reset total

  //     for (let k in tmpAgencyData) {
  //       if (uid == tmpAgencyData[k].agencyTypeID) {
  //         tmpAgencyData[k].amt = ''
  //       }
  //       amtTotal += parseFloat(tmpAgencyData[k].amt) || 0 // recalculate total
  //     }

  //     setState({...state, agencyTypeData: tmpAgencyData, totalAmount: amtTotal})
  //   }
  // }

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IVenderModel[] = state.vendorData.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IProjectVendorModel>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        // let temAgencyTypeID: number = 0

        // if (
        //   state.selVendorTypeID == 1 &&
        //   (state.projectCategoryID == 3 ||
        //     state.projectCategoryID == 8 ||
        //     state.projectCategoryID == 9 ||
        //     state.projectCategoryID == 10)
        // ) {
        //   temAgencyTypeID = state.selAgencyTypeID
        // } else {
        //   temAgencyTypeID = state.selAgencyTypeID
        // }
        let tmplstCheckedOutputData: IAgencyTypeObjModel[] = []

        const {agencyTypeData} = state

        // Loop through each project and its vendors
        agencyTypeData.forEach((agencysTyp: any) => {
          if (agencysTyp.isSelected === 1) {
            // Collect only selected agencysTyps
            const tmpCheckedData: IAgencyTypeObjModel = {
              agencyTypeID: agencysTyp.agencyTypeID, // Get agencysTyp ID from the agencysTyp
              vendroCost: agencysTyp.amt, // Get the vendor's amount
            }
            tmplstCheckedOutputData.push(tmpCheckedData)
          }
        })

        // console.log(
        //   'If Block',
        //   tmplstCheckedOutputData,
        //   parseInt(projectID),
        //   values.vendorID,
        //   values.assignDate,
        //   values.workCompleteDate,
        //   values.remarks,
        //   projectFilePath,
        //   user.employeeID,
        //   '192.66.22'
        // )
        //console.log(amount.vendorCost + '||' + state.totalAmount)
        if (state.projectCategoryID == 2 && state.selVendorTypeID == 1) {
          if (amount.vendorCost == 0) {
            setLoading(false)
            return toast.error('Please Enter Vendor Cost')
          }
          if (amount.vendorCost == state.totalAmount) {
            // AddMultpleAgecyProjectVendorDetailsAPI(
            addMultpleAgecyProjectVendorDetails_WithGSTAPI(
              tmplstCheckedOutputData,
              parseInt(projectID),
              values.vendorID,
              values.assignDate,
              values.workCompleteDate,
              values.remarks,
              projectFilePath,
              isgst,
              values.gstTypeID,
              values.cgstPer,
              values.cgstVal,
              values.sgstPer,
              values.sgstVal,
              values.igstPer,
              values.igstVal,
              values.gstAmount,
              amount.vendorCost,
              values.subAmount,
              amount.vendorCost,
              user.employeeID,
              '192.66.22'
            )
              .then((response) => {
                if (response.data.isSuccess == true) {
                  toast.success('Created Successfull')
                  history.push({
                    pathname: `/projects/project/edit/${parseInt(projectID)}/vendor/list`,
                    state: {
                      projName: state.ProjectName,
                      projectCategoryID: state.projectCategoryID,
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
            toast.error('Vendor Cost And Vendor Total Cost Not Match')
            return setLoading(false)
          }
        } else {
          if (amount.vendorCost == 0) {
            setLoading(false)
            return toast.error('Please Enter Vendor Cost')
          }
          // AddProjectVendorDetailsAPI(
          addProjectVendorDetails_WithGSTAPI(
            parseInt(projectID),
            values.vendorID,
            values.assignDate,
            values.workCompleteDate,
            values.remarks,
            projectFilePath,
            amount.vendorCost,
            user.employeeID,
            '192.66.22',
            amount.paidAmount,
            amount.remainingAmount,
            state.selAgencyTypeID,
            isgst,
            values.gstTypeID,
            values.cgstPer,
            values.cgstVal,
            values.sgstPer,
            values.sgstVal,
            values.igstPer,
            values.igstVal,
            values.gstAmount,
            amount.vendorCost,
            values.subAmount,
            amount.vendorCost
          )
            .then((response) => {
              if (response.data.isSuccess == true) {
                toast.success('Created Successfull')
                history.push({
                  pathname: `/projects/project/edit/${parseInt(projectID)}/vendor/list`,
                  state: {projName: state.ProjectName, projectCategoryID: state.projectCategoryID},
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
        }
        setLoading(false)
      }, 1000)
    },
  })

  return (
    <>
      <div className='text-end'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-7 mb-2 btn btn-rounded'
          onClick={() =>
            history.push({
              pathname: `/projects/project/edit/${parseInt(projectID)}/vendor/list`,
              state: {projName: state.ProjectName, projectCategoryID: state.projectCategoryID},
            })
          }
        >
          Back To List
        </span>
      </div>
      <div className='card mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          {state.loading === true ? (
            <Loader loading={state.loading} />
          ) : (
            <>
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
                                    selected={
                                      state.selVendorTypeID == data.vendorTypeID ? true : false
                                    }
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
                        <label className='col-lg-2 col-form-label required fw-bold fs-6'>
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
                        {/* <label
                          className={
                            state.selVendorID > 0 &&
                            state.selVendorTypeID == 1 &&
                            state.projectCategoryID == 2
                              ? 'col-lg-2 col-form-label required fw-bold fs-6'
                              : 'd-none'
                          }
                        >
                          Select Agency:
                        </label>
                        <div
                          className={
                            state.selVendorID > 0 &&
                            state.selVendorTypeID == 1 &&
                            state.projectCategoryID == 2
                              ? 'col-lg-3 fv-row'
                              : 'd-none'
                          }
                        >
                          <select
                            className='form-select'
                            aria-label='Default select example'
                            onChange={selectChange}
                            id='selAgencyTypeID'
                          >
                            <option selected value={0}>
                              Select Agency
                            </option>
                            {state.agencyTypeData.length > 0 &&
                              state.agencyTypeData.map((data, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={data.agencyTypeID}
                                    selected={
                                      state.selAgencyTypeID == data.agencyTypeID ? true : false
                                    }
                                  >
                                    {data.agencyTypeName}
                                  </option>
                                )
                              })}
                          </select>
                          {formik.touched.agencyTypeID && formik.errors.agencyTypeID && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.agencyTypeID}</div>
                            </div>
                          )} */}
                        {/* </div> */}

                        <label
                          className={
                            state.selVendorTypeID == 1 &&
                            (state.projectCategoryID == 3 ||
                              state.projectCategoryID == 8 ||
                              state.projectCategoryID == 9 ||
                              state.projectCategoryID == 10)
                              ? 'col-lg-2 col-form-label required fw-bold fs-6'
                              : 'd-none'
                          }
                        >
                          Select Agency:
                        </label>
                        <div
                          className={
                            state.selVendorTypeID == 1 &&
                            (state.projectCategoryID == 3 ||
                              state.projectCategoryID == 8 ||
                              state.projectCategoryID == 9 ||
                              state.projectCategoryID == 10)
                              ? 'col-lg-3 fv-row'
                              : 'd-none'
                          }
                        >
                          <select
                            className='form-select'
                            aria-label='Default select example'
                            onChange={selectChange}
                            id='selAgencyTypeID'
                          >
                            <option selected value={0}>
                              Select Agency
                            </option>
                            {agencyTypeDataForModular.length > 0 &&
                              agencyTypeDataForModular.map((data, index) => {
                                return (
                                  <option key={index} value={data.agencyTypeID}>
                                    {data.agencyTypeName}
                                  </option>
                                )
                              })}
                          </select>
                          {formik.touched.agencyTypeID && formik.errors.agencyTypeID && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.agencyTypeID}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={state.selVendorID === 0 ? 'd-none' : 'row mb-6'}>
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className=''>Contact Person:</span>
                        </label>
                        <div className='col-lg-4 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg  border-0 bg-white'
                            placeholder='Contact Person'
                            disabled
                            {...formik.getFieldProps('contactPerson')}
                          />
                        </div>
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className=''>Contact Number:</span>
                        </label>
                        <div className='col-lg-4 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg  border-0 bg-white'
                            placeholder='Contact Number'
                            disabled
                            {...formik.getFieldProps('contactNumber')}
                          />
                        </div>
                      </div>
                      {/* <div className={state.selVendorTypeID === 1 ? 'row mb-6' : 'd-none'}> */}
                      <div className={'row mb-6'}>
                        <label className={'col-lg-2 col-form-label required fw-bold fs-6'}>
                          Vendor Cost:
                        </label>
                        <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='Vendor Cost'
                            id='vendorCost'
                            autoComplete='off'
                            value={amount.vendorCost}
                            onChange={handleChange}
                          />
                          {formik.touched.vendorCost && formik.errors.vendorCost && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.vendorCost}</div>
                            </div>
                          )}
                        </div>
                        <label
                          className={
                            state.projectCategoryID !== 2 || state.selVendorTypeID != 1
                              ? 'col-lg-2 col-form-label fw-bold fs-6'
                              : 'd-none'
                          }
                        >
                          Paid Amount:
                        </label>
                        <div
                          className={
                            state.projectCategoryID !== 2 || state.selVendorTypeID != 1
                              ? 'col-lg-2 fv-row'
                              : 'd-none'
                          }
                        >
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='Paid Amount'
                            id='paidAmount'
                            value={amount.paidAmount}
                            onChange={handleChange}
                          />
                          {formik.touched.paidAmount && formik.errors.paidAmount && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.paidAmount}</div>
                            </div>
                          )}
                        </div>
                        <label
                          className={
                            state.projectCategoryID !== 2 || state.selVendorTypeID != 1
                              ? 'col-lg-2 col-form-label fw-bold fs-6'
                              : 'd-none'
                          }
                        >
                          Rem Amount:
                        </label>
                        <div
                          className={
                            state.projectCategoryID !== 2 || state.selVendorTypeID != 1
                              ? 'col-lg-2 fv-row'
                              : 'd-none'
                          }
                        >
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='Remening Amount'
                            disabled
                            id='remainingAmount'
                            value={amount.remainingAmount}
                            onChange={handleChange}
                          />
                          {formik.touched.remainingAmount && formik.errors.remainingAmount && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.remainingAmount}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* --------------------------------- */}

                      <div
                        className={
                          // state.selProjectID > 0 && state.selProjectModeID === 1?
                          'row mb-6'
                          //   : 'd-none'
                        }
                      >
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className=''>Is GST:</span>
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
                          className={
                            isgst === true ? 'col-lg-3 col-form-label  fw-bold fs-6' : 'd-none'
                          }
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
                                    selected={state.selGstTypeID === data.gstTypeID ? true : false}
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
                          // state.selProjectID > 0 &&
                          // state.selProjectModeID === 1 &&
                          state.selGstTypeID === 1 && isgst === true ? 'row mb-6' : 'd-none'
                        }
                      >
                        <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                          CGST Percentage:
                        </label>
                        <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='CGST Percentage'
                            {...formik.getFieldProps('cgstPer')}
                            disabled
                          />
                          {formik.touched.cgstPer && formik.errors.cgstPer && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.cgstPer}</div>
                            </div>
                          )}
                        </div>
                        <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>
                          %
                        </span>
                        <label className={'col-lg-3 col-form-label fw-bold fs-6'}>
                          CGST Amount:
                        </label>
                        <div className={'col-lg-3 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='CGST Amount'
                            {...formik.getFieldProps('cgstVal')}
                            disabled
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
                          // state.selProjectID > 0 &&
                          // state.selProjectModeID === 1 &&
                          state.selGstTypeID === 1 && isgst === true ? 'row mb-6' : 'd-none'
                        }
                      >
                        <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                          SGST Percentage:
                        </label>
                        <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='SGST Percentage'
                            {...formik.getFieldProps('sgstPer')}
                            disabled
                          />
                          {formik.touched.sgstPer && formik.errors.sgstPer && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.sgstPer}</div>
                            </div>
                          )}
                        </div>
                        <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>
                          %
                        </span>
                        <label className={'col-lg-3 col-form-label fw-bold fs-6'}>
                          SGST Amount:
                        </label>
                        <div className={'col-lg-3 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='SGST Amount'
                            {...formik.getFieldProps('sgstVal')}
                            disabled
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
                          // state.selProjectID > 0 &&
                          // state.selProjectModeID === 1 &&
                          state.selGstTypeID === 2 && isgst === true ? 'row mb-6' : 'd-none'
                        }
                      >
                        <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                          IGST Percentage:
                        </label>
                        <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='IGST Amount'
                            {...formik.getFieldProps('igstPer')}
                            disabled
                          />
                          {formik.touched.igstPer && formik.errors.igstPer && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.igstPer}</div>
                            </div>
                          )}
                        </div>
                        <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'>
                          %
                        </span>
                        <label className={'col-lg-3 col-form-label fw-bold fs-6'}>
                          IGST Amount:
                        </label>
                        <div className={'col-lg-3 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='IGST Amount'
                            {...formik.getFieldProps('igstVal')}
                            disabled
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
                          // state.selProjectID > 0 &&
                          // state.selProjectModeID === 1 &&
                          state.selGstTypeID > 0 ? 'row mb-6' : 'd-none'
                        }
                      >
                        <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                          GST Amount:
                        </label>
                        <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='GST Amount'
                            // value={gstAmount}
                            {...formik.getFieldProps('gstAmount')}
                            disabled
                            // onChange={handleChangeGstAmount}
                          />{' '}
                          {formik.touched.gstAmount && formik.errors.gstAmount && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.gstAmount}</div>
                            </div>
                          )}
                        </div>
                        <span className='col-lg-1 mt-3 text-hover-primary ps-0 text-dark fs-3'></span>
                        {/* <label className={'col-lg-2 col-form-label fw-bold fs-6'}>
                          After GST Amount:
                        </label> */}
                        {/* <div className={'col-lg-2 fv-row'}>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='After GST Amount'
                            {...formik.getFieldProps('afterGSTAmount')}
                            disabled
                          />
                          {formik.touched.afterGSTAmount && formik.errors.afterGSTAmount && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.afterGSTAmount}</div>
                            </div>
                          )}
                        </div> */}
                        <label className='col-lg-3 col-form-label fw-bold fs-6'>
                          <span className='required'>Taxable Value:</span>
                        </label>
                        <div className='col-lg-3 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='Enter Sub Amount'
                            // value={subAmount}
                            id='subAmount'
                            {...formik.getFieldProps('subAmount')}
                            disabled
                            // onChange={handleAmtChange}
                          />
                          {formik.touched.subAmount && formik.errors.subAmount && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.subAmount}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* <div
                        className={
                          // state.selProjectID > 0 && state.selProjectModeID === 1?
                          'row mb-6'
                          // : 'd-none'
                        }
                      >
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className=''>Final Amount:</span>
                        </label>
                        <div className='col-lg-3 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='Enter Final Amount'
                            {...formik.getFieldProps('finalAmount')}
                            disabled
                          />
                          {formik.touched.finalAmount && formik.errors.finalAmount && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.finalAmount}</div>
                            </div>
                          )}
                        </div>
                      </div> */}

                      {/* ---------------------------- */}
                      <div
                        className={
                          state.selVendorID > 0 &&
                          state.selVendorTypeID == 1 &&
                          state.projectCategoryID == 2
                            ? 'row mb-6'
                            : 'd-none'
                        }
                      >
                        <div className='d-flex justify-content-start mb-2 text-center'>
                          <label className='fs-3 fw-bolder text-success'>Select Agency : </label>
                        </div>
                        <div className='card'>
                          <div className='py-3'>
                            {/* begin::Table container */}
                            <div className='table-responsive'>
                              {/* begin::Table */}
                              <table className='table table-bordered align-middle g-2'>
                                {/* begin::Table head */}
                                <thead className='bg-success'>
                                  <tr className='fw-bolder fs-5 text-white'>
                                    <th className='w-25px'></th>
                                    {/* <th className='min-w-150x text-start '>
                                      <span className='d-block  mb-1'>Project Name </span>
                                      <span className='text-muted fw-bold d-block  fs-7'>
                                        Project Category Name
                                      </span>
                                    </th> */}
                                    <th className='min-w-150x text-start'>Agency Name</th>
                                    <th className='min-w-25px'>Agency Cost</th>
                                    <th className='w-25px text-center'>Vendor Cost</th>
                                    {/* {state.selGstTypeID > 0 ? (
                                      <th className='min-w-25px'>GST Type</th>
                                    ) : null} */}
                                    <>
                                      {state.selGstTypeID == 1 ? (
                                        <>
                                          {/* <th className='min-w-25px'>CGST Per</th>
                                          <th className='min-w-25px'>SGST Per</th> */}
                                          <th className='min-w-50px'>CGST Amount</th>
                                          <th className='min-w-25px'>SGST Amount</th>
                                        </>
                                      ) : state.selGstTypeID == 2 ? (
                                        <>
                                          {/* <th className='min-w-25px'>IGST Per</th> */}
                                          <th className='min-w-25px'>IGST Amount</th>
                                        </>
                                      ) : null}
                                    </>
                                    {state.selGstTypeID > 0 ? (
                                      <>
                                        <th className='min-w-25px'>GST Amount</th>
                                        <th className='min-w-25px'>Sub Amount</th>{' '}
                                      </>
                                    ) : null}
                                  </tr>
                                </thead>
                                {/* end::Table head */}
                                {/* begin::Table body */}
                                <tbody className='border-bottom'>
                                  {mainLoading ? (
                                    <LoaderInTable loading={mainLoading} column={16} />
                                  ) : (
                                    <>
                                      {state.agencyTypeData.length > 0 &&
                                        state.agencyTypeData.map((data, index) => {
                                          return (
                                            <tr key={index}>
                                              <td>
                                                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                                  <input
                                                    className='form-check-input widget-9-check'
                                                    type='checkbox'
                                                    id={`${data.agencyTypeID}`}
                                                    onChange={(e) => setSelectedHandle(e)}
                                                    checked={data.isSelected ? true : false}
                                                  />
                                                </div>
                                              </td>
                                              <td>
                                                <span className='text-dark text-hover-primary d-block mb-1 fs-6  text-start'>
                                                  {data.agencyTypeName}
                                                </span>
                                              </td>
                                              <td className='justify-content-center'>
                                                <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                                                  {data.agencyCost}
                                                </span>
                                              </td>
                                              <th className='justify-content-center'>
                                                <span className='mb-1'>
                                                  <input
                                                    className='form-control form-control-sm text-center w-100px'
                                                    type='text'
                                                    name='amt'
                                                    autoComplete='off'
                                                    id={`${data.agencyTypeID}`}
                                                    disabled={data.isSelected === 1 ? false : true}
                                                    onChange={(e) => setInputAmt(e)}
                                                    value={data.amt}
                                                  />
                                                </span>
                                              </th>
                                              {/* <>
                                                {state.selGstTypeID === 1 &&
                                                data.isSelected === 1 ? (
                                                  <>
                                                    <td>
                                                      <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-start'>
                                                      
                                                        State Tax
                                                      </span>
                                                    </td>
                                                  </>
                                                ) : state.selGstTypeID === 2 &&
                                                  data.isSelected === 1 ? (
                                                  <>
                                                    <td>
                                                      <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-start'>
                                                       Centrol Tax
                                                      </span>
                                                    </td>
                                                  </>
                                                ) : (
                                                  <td>
                                                    <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-start'>
                                                    -
                                                    </span>
                                                  </td>
                                                )}
                                              </> */}

                                              <>
                                                {state.selGstTypeID == 1 ? (
                                                  <>
                                                    {/* <td>
                                                      <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-start'>
                                                        {data.cgstPer || 0}
                                                      </span>
                                                    </td>
                                                    <td>
                                                      <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-start'>
                                                        {data.sgstPer || 0}
                                                      </span>
                                                    </td> */}
                                                    <td>
                                                      <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-start'>
                                                        {/* {data.cgstVal.toFixed(2) || 0}  */}
                                                        {(data.cgstVal ?? 0).toFixed(2)}
                                                      </span>
                                                    </td>
                                                    <td>
                                                      <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-start'>
                                                        {/* {data.sgstVal.toFixed(2) || 0} */}
                                                        {(data.sgstVal ?? 0).toFixed(2)}
                                                      </span>
                                                    </td>
                                                  </>
                                                ) : state.selGstTypeID === 2 ? (
                                                  <>
                                                    {/* <td>
                                                      <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-start'>
                                                        {data.igstPer || 0}
                                                      </span>
                                                    </td> */}
                                                    <td>
                                                      <span className='text-dark text-hover-primary d-block mb-1 fs-6 text-start'>
                                                        {/* {data.igstVal.toFixed(2) || 0} */}
                                                        {(data.igstVal ?? 0).toFixed(2)}
                                                      </span>
                                                    </td>
                                                  </>
                                                ) : null}
                                              </>
                                              {state.selGstTypeID > 0 ? (
                                                <>
                                                  <td>
                                                    <span className='text-dark text-hover-primary d-block mb-1 fs-6  text-start'>
                                                      {(data.gstAmount ?? 0).toFixed(2)}
                                                    </span>
                                                  </td>
                                                  <td>
                                                    <span className='text-dark text-hover-primary d-block mb-1 fs-6  text-start'>
                                                      {(data.subAmount ?? 0).toFixed(2)}
                                                    </span>
                                                  </td>
                                                </>
                                              ) : null}
                                            </tr>
                                          )
                                        })}
                                      <tr className='text-dark'>
                                        <td className='text-start'></td>{' '}
                                        <td className='border-top border-dark text-start fw-bolder fs-5'>
                                          Total Cost:
                                        </td>
                                        <td className='border-top border-dark  text-success fw-bolder fs-6'>
                                          {state.totalAgencyCost}
                                        </td>{' '}
                                        <td className='border-top border-dark text-center text-danger fw-bolder fs-6'>
                                          {state.totalAmount}
                                        </td>
                                        {/* {state.selGstTypeID > 0 ? (
                                          <td className='border-top border-dark text-start fw-bolder fs-5'></td>
                                        ) : null} */}
                                        {state.selGstTypeID == 1 ? (
                                          <>
                                            {/* <td className='border-top border-dark text-start fw-bolder fs-5'>
                                              {state.totalCGSTPer}
                                            </td>
                                            <td className='border-top border-dark text-start fw-bolder fs-5'>
                                              {state.totalSGSTPer}
                                            </td> */}
                                            <td className='border-top border-dark text-start fw-bolder fs-5'>
                                              {(state.totalCGSTVal ?? 0).toFixed(2)}
                                            </td>
                                            <td className='border-top border-dark text-start fw-bolder fs-5'>
                                              {(state.totalSGSTVal ?? 0).toFixed(2)}
                                            </td>
                                          </>
                                        ) : state.selGstTypeID == 2 ? (
                                          <>
                                            {/* <td className='border-top border-dark text-start fw-bolder fs-5'>
                                              {state.totalIGSTPer}
                                            </td> */}
                                            <td className='border-top border-dark text-start fw-bolder fs-5'>
                                              {/* {state.totalIGSTVal.toFixed(2)} */}
                                              {(state.totalIGSTVal ?? 0).toFixed(2)}
                                            </td>
                                          </>
                                        ) : null}
                                        {state.selGstTypeID > 0 ? (
                                          <>
                                            <td className='border-top border-dark text-start fw-bolder fs-5'>
                                              {/* {state.totalGSTAmount.toFixed(2)} */}
                                              {(state.totalGSTAmount ?? 0).toFixed(2)}
                                            </td>
                                            <td className='border-top border-dark text-start fw-bolder fs-5'>
                                              {/* {state.totalSubAmount?.toFixed(2)} */}

                                              {(state.totalSubAmount ?? 0).toFixed(2)}
                                            </td>{' '}
                                          </>
                                        ) : null}
                                        {/* <td className='text-start' colSpan={5}></td> */}
                                      </tr>
                                    </>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={'row mb-6'}>
                        <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                          Assign Date:
                        </label>
                        <div className='col-lg-4 fv-row'>
                          <input
                            type='date'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            {...formik.getFieldProps('assignDate')}
                          />
                          {formik.touched.assignDate && formik.errors.assignDate && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.assignDate}</div>
                            </div>
                          )}
                        </div>
                        <label className='col-lg-2 col-form-label required fw-bold fs-6'>
                          Work Order Complete Date:
                        </label>
                        <div className='col-lg-4 fv-row'>
                          <input
                            type='date'
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            {...formik.getFieldProps('workCompleteDate')}
                          />
                          {formik.touched.workCompleteDate && formik.errors.workCompleteDate && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.workCompleteDate}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='row mb-6'>
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className='required'>Remarks:</span>
                        </label>
                        <div className='col-lg-10 fv-row'>
                          <textarea
                            rows={2}
                            className='form-control form-control-lg form-control-solid bg-light-primary'
                            placeholder='Remarks'
                            {...formik.getFieldProps('remarks')}
                          />
                          {formik.touched.remarks && formik.errors.remarks && (
                            <div className='fv-plugins-message-container text-danger'>
                              <div className='fv-help-block'>{formik.errors.remarks}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='row mb-6'>
                        <label className='col-lg-2 col-form-label fw-bold fs-6'>
                          <span className='d-block'>Attached Document:</span>
                          <p className='text-muted fs-7'> (allow only .pdf files)</p>
                        </label>
                        <div
                          className={
                            projectFilePath === '' ? 'd-none' : 'col-lg-2 d-flex align-items-center'
                          }
                        >
                          <div className='symbol symbol-45px me-5 cursor-pointer'>
                            {/* <img src={process.env.REACT_APP_API_URL + file} alt='img' /> */}
                            <img src={toAbsoluteUrl('/media/svg/files/pdf.svg')} alt='pdf' />
                          </div>
                        </div>
                        <div
                          className={
                            projectFilePath === '' ? 'col-lg-10 fv-row' : 'col-lg-8 fv-row'
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
                    <div className='card-footer d-flex justify-content-end py-9'>
                      <button type='submit' className='btn btn-success me-5' disabled={loading}>
                        {!loading && 'Submit'}
                        {loading && (
                          <span className='indicator-progress' style={{display: 'block'}}>
                            Please wait...{' '}
                            <span className='spinner-border spinner-border-sm align-middle ms-5'></span>
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* ----------------------------Vendor Model PopUp---------------------- */}
      <Modal size='xl' scrollable={true} show={showVendor} onHide={handleCloseVendor}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'white'}}>Vendor Data</Modal.Title>
            <div className='border-0 pt-4' id='kt_chat_contacts_header'>
              <span className='w-100 position-relative'>
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
              </span>
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
                <tbody className='border-bottom'>
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
                          onClick={() => selectVendor(data)}
                        >
                          <td>
                            <span className='text-dark text-hover-primary d-block ps-1 mb-1 fs-6'>
                              {data.vendorTypeName}
                            </span>
                          </td>
                          <td>
                            {/* {data.vendorTypeID === 1 || data.vendorTypeID === 2 ? ( */}
                            <div className='d-flex align-items-center'>
                              <div className='text-dark text-hover-primary fs-6'>
                                {data.companyName}
                              </div>
                            </div>
                            {/* ) : (
                              <div className='text-dark text-hover-primary fs-6'>N.A</div>
                            )} */}
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

export {AddProjectVendor}
