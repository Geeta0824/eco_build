import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
// import {
//   deleteDesignerTicketCategoryStructure,
//   getDesignerTicketCategoryStructure,
// } from '../../../modules/master-page/pmc-work-stage-master-page/DesignerTicketCategoryCRUD'
import {DesignerTicketCategoryCard} from './DesignerTicketCategoryCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import { IDesignerTicketCategoryModel} from '../../../models/master-page/IDesignerTicketCategoryModel'
import { deleteDesignerTicketCategoryDetails, getAllDesignerTicketCategory } from '../../../modules/master-page/designer-ticket-catgry-page/DesignerTicketCategoryCRUD'

type Props = {}

interface IDesignerTicketCategory {
  loading: boolean
  DesignerTicketCategoryData: IDesignerTicketCategoryModel[]
  tmpDesignerTicketCategoryData: IDesignerTicketCategoryModel[]
  searchText: string
  sequenceNo: number
  stageName: string
  amtPercentage: number
  designerTicketID: number
}

const DesignerTicketCategoryList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IDesignerTicketCategory>({
    loading: false,
    DesignerTicketCategoryData: [] as IDesignerTicketCategoryModel[],
    tmpDesignerTicketCategoryData: [] as IDesignerTicketCategoryModel[],
    searchText: '',
    sequenceNo: 0,
    stageName: '',
    amtPercentage: 0,
    designerTicketID: 0,
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getDesignerTicketCategoryData(mainSearch)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  function getDesignerTicketCategoryData(mainSearch: string) {
    getAllDesignerTicketCategory()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.responseObject.filter((user: any) => {
              return (
                user.title.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.sequenceNo.toString().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              DesignerTicketCategoryData: results,
              searchText: mainSearch,
              tmpDesignerTicketCategoryData: responseData.responseObject,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          }else{
          setState({
            ...state,
            DesignerTicketCategoryData: responseData.responseObject,
            tmpDesignerTicketCategoryData: responseData.responseObject,
            loading: false,
          })
          setTotal(responseData.responseObject.length)
          setPage(1)
        }
        setName(mainSearch)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, DesignerTicketCategoryData: [], loading: true})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, DesignerTicketCategoryData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (designerTicketid: number) => {
    setState({
      ...state,
      loading: false,
      designerTicketID: designerTicketid,
    })
    setShow(true)
  }

  // ========================Delete Department=====================
  function deleteDesignerTicketCategoryItem(designerTicketID: number) {
    deleteDesignerTicketCategoryDetails(designerTicketID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getDesignerTicketCategoryData(state.searchText)
          setShow(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpDesignerTicketCategoryData.filter((user) => {
        return (
          user.title.toLowerCase().includes(keyword.toLowerCase()) ||
          user.sequenceNo.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, DesignerTicketCategoryData: results, searchText: keyword})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, DesignerTicketCategoryData: state.tmpDesignerTicketCategoryData, searchText: keyword})
      // If the text field is empty, show all users
      setTotal(state.tmpDesignerTicketCategoryData.length)
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
  const currentPosts: IDesignerTicketCategoryModel[] = state.DesignerTicketCategoryData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/designer-ticket-catgry/add'}
          title='Click to add a PMC Work Stage'
        />
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='border-0 pt-2' id='kt_chat_contacts_header'>
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
                // placeholder={intl.formatMessage({id: 'PEOPLE.SEARCH'})}
                onChange={filter}
                value={name}
              />
            </span>
          </div>

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to='/master/pmc-work-stage/add'
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div> */}
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
                  <th className='min-w-150px'>Title</th>
                  {/* <th className='min-w-25px'>Payment Percentage</th> */}
                  <th className='min-w-140px'>Sequence No.</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <DesignerTicketCategoryCard
                        data={data}
                        handleShow={() => handleShow(data.designerTicketCategoryID)}
                        name={name}
                      />
                    )
                  })}
                {/* =================== Image no data ============== */}
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
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.designerTicketID}
        pageName={'Designer Ticket Category'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDesignerTicketCategoryItem(state.designerTicketID)}
      />
    </>
  )
}

export default DesignerTicketCategoryList
