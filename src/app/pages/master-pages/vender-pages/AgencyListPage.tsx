import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation, useParams} from 'react-router-dom'
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
  getVenderWebList,
  updateVendorIsactive,
} from '../../../modules/master-page/vender-master-page/VenderCRUD'
import Search from 'antd/es/transfer/search'
import {ModelPopUpProdCategoryMap} from '../../product-pages/agency-type-pages/ModelPopUpProdCategoryMap'

import {GetProductCategoryWithAgencyTypeIDApi} from '../../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import {ModelPopUpAgencyType} from './ModelPopUpAgencyType'
import {IAgencyListModel} from '../../../models/master-page/IVenderModel'
import Loader from '../../common-pages/Loader'
type Props = {}

interface IDesignation {
  loading: boolean
  agencyListData: IAgencyListModel[]
  temAgencyListData: IAgencyListModel[]
  SearchText: string
  custName: string
  companyName: string
  mainSearch: string
  selVenderID: number
}

const AgencyListPage: React.FC<Props> = () => {
  const location = useLocation()
  const history = useHistory()
  const {vendorID} = useParams<{vendorID: string}>()
  const [state, setState] = useState<IDesignation>({
    loading: false,
    agencyListData: [] as IAgencyListModel[],
    temAgencyListData: [] as IAgencyListModel[],
    SearchText: '',
    custName: '',
    companyName: '',
    mainSearch: '',
    selVenderID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let vendorID: any = lc.vendorID
      let custName: any = lc.custName
      let companyName: any = lc.companyName
      let mainSearch: string = ''
      let agencySearchText: string = ''
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
        agencySearchText = lc.agencySearchText
      }
      getAgencyListByVendorID(vendorID, custName, companyName, mainSearch, agencySearchText)
    }, 100)
  }, [])

  function getAgencyListByVendorID(
    tmpVendorID: number,
    custName: string,
    companyName: string,
    mainSearch: string,
    agencySearchText: string
  ) {
    getAgencyGetListByVendorIDApi(parseInt(vendorID))
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            agencyListData: responseData,
            temAgencyListData: responseData,
            selVenderID: tmpVendorID,
            custName: custName,
            companyName: companyName,
            mainSearch,
            SearchText: agencySearchText,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
          setName(agencySearchText)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        setState({...state, agencyListData: [], loading: false})
        toast.error(`${error}`)
      })
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.temAgencyListData.filter((user) => {
        return (
          user.agencyTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(keyword.toLowerCase()) ||
          user.agencyName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.contactNumber.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, agencyListData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, agencyListData: state.temAgencyListData})
      // If the text field is empty, show all users
      setTotal(state.temAgencyListData.length)
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
  const currentPosts: IAgencyListModel[] = state.agencyListData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className='text-end mb-4'>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-7 btn btn-rounded'
          onClick={() =>
            history.push({pathname: '/vender/list', state: {search: state.mainSearch}})
          }
          title='Vendor List'
        >
          Back To Main List
        </span>
      </div>
      <Loader loading={state.loading} />
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='mb-2 col-xl-3 col-sm-6'>
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
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Agency Type</th>
                  <th className='min-w-150px'>Agency Name</th>
                  <th className='min-w-150px'>Contact Person</th>
                  <th className='min-w-150px'>Contact Number</th>
                  <th className='min-w-150px'>Email</th>
                  <th className='min-w-140px'>Project</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className='text-dark text-hover-primary fs-6'>{data.agencyTypeName}</td>
                        <td className='text-dark text-hover-primary fs-6'>{data.agencyName}</td>
                        <td className='text-dark text-hover-primary fs-6'>{data.contactPerson}</td>
                        <td className='text-dark text-hover-primary fs-6'>{data.contactNumber}</td>
                        <td className='text-dark text-hover-primary fs-6'>{data.email}</td>

                        <td className='text-center'>
                          <Link
                            to={{
                              pathname: `/vender/project/${state.selVenderID}/open`,
                              state: {
                                agencyID: data.agencyID,
                                agencyTypeName: data.agencyTypeName,
                                agencyName: data.agencyName,
                                companyName: state.companyName,
                                contactPerson: data.contactPerson,
                                searchText: state.mainSearch,
                                AgencySearchText: name,
                              },
                            }}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                          >
                            <KTSVG
                              path='/media/icons/duotune/abstract/abs027.svg'
                              className='svg-icon-4 svg-icon-danger'
                            />
                          </Link>
                        </td>
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

export default AgencyListPage
