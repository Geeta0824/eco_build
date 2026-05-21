import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  deleteVenderDetails,
  getAgencyGetListByVendorIDApi,
  getAgencyTypeWithVendorTypeID,
  getProjectListByAgencyIdOpenApi,
  getVenderWebList,
  updateVendorIsactive,
} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import Search from 'antd/es/transfer/search'
import {ModelPopUpProdCategoryMap} from '../../product-pages/agency-type-pages/ModelPopUpProdCategoryMap'

import {GetProductCategoryWithAgencyTypeIDApi} from '../../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import {ModelPopUpAgencyType} from './ModelPopUpAgencyType'
import {IOpenProjectListModel} from '../../../models/master-page/IVenderModel'
import Loader from '../../common-pages/Loader'
type Props = {}

interface IDesignation {
  loading: boolean
  agencyOpenListData: IOpenProjectListModel[]
  temAgencyOpenListData: IOpenProjectListModel[]
  SearchText: string
  agencyID: number
  vendorTypeID: number
  agencyTypeName: string
  agencyName: string
  companyName: string
}

const OpenProjectListPage: React.FC<Props> = () => {
  const {vendorID} = useParams<{vendorID: string}>()
  const location = useLocation()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    agencyOpenListData: [] as IOpenProjectListModel[],
    temAgencyOpenListData: [] as IOpenProjectListModel[],
    SearchText: '',
    vendorTypeID: 0,
    agencyID: 0,
    agencyTypeName: '',
    agencyName: '',
    companyName: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let agencyID: any = lc.agencyID
      let agencyTypeName: any = lc.agencyTypeName
      let agencyName: any = lc.agencyName
      let companyName: any = lc.companyName
      getAgencyListByVendorID(agencyID, agencyTypeName, agencyName, companyName)
    }, 100)
  }, [])

  function getAgencyListByVendorID(tmpAgencyID: number,agencyTypeName: string, agencyName: string, companyName: string) {
    getProjectListByAgencyIdOpenApi(tmpAgencyID)
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            agencyOpenListData: responseData,
            temAgencyOpenListData: responseData,
            agencyTypeName: agencyTypeName,
            agencyName: agencyName,
            companyName: companyName,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, agencyOpenListData: [], loading: false})
        toast.error(`${error}`)
      })
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temAgencyOpenListData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.bhkName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.carpetArea.toLowerCase().includes(keyword.toLowerCase()) ||
          user.mobileNumber.toLowerCase().includes(keyword.toLowerCase()) ||
          user.customerName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, agencyOpenListData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, agencyOpenListData: state.temAgencyOpenListData})
      // If the text field is empty, show all users
      setTotal(state.temAgencyOpenListData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IOpenProjectListModel[] = state.agencyOpenListData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
     <Loader loading={state.loading} />
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header row border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          {/* <div className='row text-start'>
            <label className='col-3 text-start text-white fs-6 fw-bolder '>Company Name : </label>
            <span className='col-9 text-primary fw-bolder fs-6'>{state.companyName} </span>
            </div> */}
            <div className='row text-start'>
            <label className='col-2 text-white fs-6 fw-bolder '>Agency Type : </label>
            <span className='col-4 text-primary fw-bolder fs-6'>{state.agencyTypeName} </span>
            <label className='col-2 text-end text-white fs-6  fw-bolder '>Agency Name : </label>
            <span className='col-4 text-primary fw-bolder fs-6'>{state.agencyName}</span>
          </div>
          <div className='text-start row mb-4 col-xl-3 mt-2 col-sm-6'>
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search placeholder='input search text' onChange={filter} value={name} />
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-5'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Project Name</th>
                  <th className='min-w-150px'>Customer Name</th>
                  <th className='min-w-150px'>Contact Number</th>
                  <th className='min-w-150px'>Project type</th>
                  <th className='min-w-150px'>Project Category Name</th>
                  <th className='min-w-150px'>BHK<span className='fs-7'> (Carpet Area)</span></th>
                  <th className='min-w-150px text-end'>Status</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {state.agencyOpenListData.length > 0 &&
                  state.agencyOpenListData.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className='text-dark text-hover-primary fs-6 mb-1'>{data.projectName}</td>
                        <td className='text-dark text-hover-primary fs-6 mb-1'>{data.customerName}</td>
                        <td className='text-dark text-hover-primary fs-6 mb-1'>{data.mobileNumber}</td>
                        <td className='text-dark text-hover-primary fs-6 mb-1'>{data.projectType}</td>
                        <td className='text-dark text-hover-primary fs-6 mb-1'>{data.projectCategoryName}</td>
                        <td className='text-dark text-hover-primary fs-6 mb-1'>{data.bhkName} {'('} {data.carpetArea}{')'}</td>
                        <td className='text-dark text-hover-primary fs-6 mb-1 text-end'>{data.projectStatusName}</td>
                      </tr>
                    )
                  })}
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
            ></Pagination>
          </div>
        </div>
      </div>
    </>
  )
}

export {OpenProjectListPage}
