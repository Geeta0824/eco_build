import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {IDocumentTypeModel} from '../../../models/master-page/IDocumentTypeModel'
import {
  deleteDocumentType,
  getDocumentType,
  isActiveDocument,
} from '../../../modules/master-page/document-type-page/NewDocumentTypeCRUD'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {DocumentTypeCard} from './DocumentTypeCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'

type Props = {}

interface IDocumentType {
  loading: boolean
  documentTypeData: IDocumentTypeModel[]
  temDocumentTypeData: IDocumentTypeModel[]
  SearchText: string
  selDocumentTypeId: number
  activeID: number
  activeType: any
}

const DocumentType: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IDocumentType>({
    loading: false,
    documentTypeData: [] as IDocumentTypeModel[],
    temDocumentTypeData: [] as IDocumentTypeModel[],
    SearchText: '',
    selDocumentTypeId: 0,
    activeID: 0,
    activeType: false,
  })
  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getDocumentTypeData(mainSearch)
    })
  }, [])

  function getDocumentTypeData(mainSearch: string) {
    getDocumentType()
      .then((response) => {
        // let responseData = response.data.responseObject
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          let responseData = resp.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return user.documentTypeName.toLowerCase().includes(mainSearch.toLowerCase())
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              documentTypeData: results,
              temDocumentTypeData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              documentTypeData: responseData,
              temDocumentTypeData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${resp.message}`)
          setState({...state, documentTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, documentTypeData: [], loading: false})
      })
  }

  // =================Is Active Function Model Call==============

  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)

  function handleShowActive(event: any) {
    const Cid = event.target.id
    const tmpIsActive = event.target.checked
    setState({
      ...state,
      activeID: Cid,
      activeType: tmpIsActive,
      loading: false,
    })
    setShowActive(true)
  }

  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    let value = {documentTypeID: temEmpId,isActive:temIsAct}
    var objDocument = btoa(JSON.stringify(value))
    isActiveDocument(`${objDocument}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          getDocumentTypeData(state.SearchText)
          setShowActive(false)
        } else {
          toast.error(`${resp.massege}`)
          setShowActive(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }
  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (documentTypeID: number) => {
    setState({
      ...state,
      selDocumentTypeId: documentTypeID,
      loading: false,
    })
    setShow(true)
  }

  function deleteDocumentTypeItem(documentTypeId: number) {
    let value = {documentTypeID: documentTypeId}
    var objDocument = btoa(JSON.stringify(value))
    deleteDocumentType(`${objDocument}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          toast.success('Deleted Successfully')
          getDocumentTypeData(state.SearchText)
          setShow(false)
        } else {
          toast.error(`${resp.massege}`)
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
      const results = state.temDocumentTypeData.filter((user) => {
        return user.documentTypeName.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, documentTypeData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, documentTypeData: state.temDocumentTypeData})
      // If the text field is empty, show all users
      setTotal(state.temDocumentTypeData.length)
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
  const currentPosts: IDocumentTypeModel[] = state.documentTypeData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      {' '}
      <div className={`card `}>
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/documenttype/add'}
          title='Click to add a Document Type'
        />
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
                  <th className='min-w-150px'>Document Type Name</th>
                  <th className='min-w-25px'>Active</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
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
                      <DocumentTypeCard
                        data={data}
                        handleShowActive={(e) => handleShowActive(e)}
                        handleShow={() => handleShow(data.documentTypeID)}
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <a href='#' className='text-dark text-hover-primary fs-6'>
                      //           {data.documentTypeName}
                      //         </a>
                      //       </div>
                      //     </div>
                      //   </td>

                      //   <td>
                      //     <div className='form-check form-switch'>
                      //       <input
                      //         className='form-check-input'
                      //         type='checkbox'
                      //         id={`${data.documentTypeID}`}
                      //         checked={data.isActive}
                      //         onChange={(e) => handleShowActive(e)}
                      //       />
                      //     </div>
                      //   </td>

                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/master/documenttype/edit/${data.documentTypeID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.documentTypeID)}
                      //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/general/gen027.svg'
                      //           className='ssvg-icon-3 svg-icon-danger'
                      //         />
                      //       </div>
                      //     </div>
                      //   </td>
                      // </tr>
                    )
                  })}
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={5}
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
        id={state.selDocumentTypeId}
        pageName={'Document Type'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDocumentTypeItem(state.selDocumentTypeId)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Document Type'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default DocumentType
