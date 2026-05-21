import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../common-pages/LoaderInTable'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {IQuotationMstModel} from '../../models/quo-mst/IQuotationMstModel'
import {getAllQuoMasterApi} from '../../modules/quo-mst/NewQuotationMstCRUD'

interface IQuoMst {
  loading: boolean
  quotationMstData: IQuotationMstModel[]
  tmpQuotationMstData: IQuotationMstModel[]
  SearchText: string
}

type Props = {}

const QuotationMstListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IQuoMst>({
    loading: false,
    quotationMstData: [] as IQuotationMstModel[],
    tmpQuotationMstData: [] as IQuotationMstModel[],
    SearchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getquotationMstData(mainSearch)
    }, 100)
  }, [])

  // ==================== Get Country API Call===================

  function getquotationMstData(mainSearch: string) {
    getAllQuoMasterApi()
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        // let responseData = response.data.responseObject
        if (resp.isSuccess === true) {
          let responseData = resp.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return user.quotationCategoryName.toLowerCase().includes(mainSearch.toLowerCase())
            })
            setState({
              ...state,
              quotationMstData: results,
              tmpQuotationMstData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              quotationMstData: responseData,
              tmpQuotationMstData: responseData,
              loading: false,
            })
            // If the text field is empty, show all users
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${resp.message}`)
          setState({...state, quotationMstData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, quotationMstData: [], loading: false})
      })
  }
  // ============== Search Function =======================
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value
    if (keyword !== '') {
      const results = state.tmpQuotationMstData.filter((user) => {
        return user.quotationCategoryName.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, quotationMstData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, quotationMstData: state.tmpQuotationMstData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpQuotationMstData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ----------------------pagination---------------------------------------------
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IQuotationMstModel[] = state.quotationMstData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 bg-dark'>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
            <span className='w-100 position-relative'>
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
            </span>
          </div>

          {/* <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a Quotation'
          >
            <Link
              to='/master/quotation-mst/add'
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div> */}
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-secondary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-125px'>Quotaion Category Name</th>
                  {/* <th className='min-w-40px'>Category Type</th>
                  <th className='min-w-40px'>Remarks</th> */}
                  <th className='w-50px text-center me-1'>Edit</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className='text-dark text-hover-primary fs-6'>
                          {data.quotationCategoryName}
                        </td>
                        {/* <td className='text-dark text-hover-primary fs-6'>{data.remarksTypeName}</td>
                        <td className='text-dark text-hover-primary fs-6'>{data.remarks}</td> */}
                        <td className='text-end'>
                          {/* <div className='d-flex flex-shrink-0'> */}
                          <Link
                            to={{
                              pathname: `/master/quotation-mst/edit/${data.quotationCategoryID}`,
                              state: {mainSearch: name},
                            }}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                          >
                            <KTSVG
                              path='/media/icons/duotune/art/art005.svg'
                              className='svg-icon-3 svg-icon-primary'
                            />
                          </Link>
                          {/* <div
                              onClick={() => handleShow(data.agencyRemarksID)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='svg-icon-3 svg-icon-danger'
                              />
                            </div> */}
                          {/* </div> */}
                        </td>
                      </tr>
                    )
                  })}
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={15}
                />
              </tbody>
            </table>
          </div>
          {/* <div className='text-center'>
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
          </div> */}
        </div>
      </div>
    </>
  )
}

export default QuotationMstListPage
