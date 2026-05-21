import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {IEduCategoryModel} from '../../../models/master-page/IEducationCategoryModel'
import {
  deleteEduCategory,
  getAllEduCategory,
  isActiveEduCategory,
} from '../../../modules/master-page/education-category-master-page/EducationCategoryCRUD'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {EducationCategoryCard} from './EducationCategoryCard'

interface IEduCategory {
  loading: boolean
  eduCategory: IEduCategoryModel[]
  tmpEduCategory: IEduCategoryModel[]
  SearchText: string
  selEduCateId: number
  isActiveID: number
  isActiveType: any
}

type Props = {}

const EducationCategory: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IEduCategory>({
    loading: false,
    eduCategory: [] as IEduCategoryModel[],
    tmpEduCategory: [] as IEduCategoryModel[],
    SearchText: '',
    selEduCateId: 0,
    isActiveID: 0,
    isActiveType: false,
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
      getEduCategory(mainSearch)
    }, 100)
  }, [])

  function getEduCategory(mainSearch: string) {
    getAllEduCategory()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return user.eduCategoryName.toLowerCase().includes(mainSearch.toLowerCase())
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({...state, eduCategory: results, tmpEduCategory: responseData, loading: false})
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              eduCategory: responseData,
              tmpEduCategory: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, eduCategory: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, eduCategory: [], loading: false})
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
      isActiveID: Cid,
      isActiveType: tmpIsActive,
      loading: false,
    })
    setShowActive(true)
  }

  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    isActiveEduCategory(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getEduCategory(state.SearchText)
          setShowActive(false)
        } else {
          toast.error(`${response.data.message}`)
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
  const handleShow = (eduCategoryID: number) => {
    setState({
      ...state,
      selEduCateId: eduCategoryID,
      loading: false,
    })
    setShow(true)
  }

  const deleteEducateItem = (eduCategoryId: number) => {
    deleteEduCategory(eduCategoryId)
      .then((res) => {
        if (res.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getEduCategory(state.SearchText)
          setShow(false)
        } else {
          toast.error(`${res.data.message}`)
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
      const results = state.tmpEduCategory.filter((user) => {
        return user.eduCategoryName.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, eduCategory: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, eduCategory: state.tmpEduCategory})
      // If the text field is empty, show all users
      setTotal(state.tmpEduCategory.length)
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
  const currentPosts: IEduCategoryModel[] = state.eduCategory.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        {/* <div className='card-header border-0 py-2 ' style={{ backgroundColor: '#000000' }}> */}
        {/* <h3 className='card-title align-items-start flex-column'> */}
        {/* <span className='card-label fw-bolder fs-3 mb-1'>EducationCategory</span>
          <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Cities</span> */}
        {/* </h3> */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/eduCategory/add'}
          title='Click to add a Education Category'
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
                  <th className='min-w-150px'>Education Category Name</th>
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
                      <EducationCategoryCard
                        data={data}
                        handleShowActive={(e) => handleShowActive(e)}
                        handleShow={() => handleShow(data.eduCategoryID)}
                        name={name}
                      />
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
              // itemRender={itemRender}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selEduCateId}
        pageName={'Education Category'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteEducateItem(state.selEduCateId)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.isActiveID}
        activeType={state.isActiveType}
        pageName={'Education Category'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.isActiveID, state.isActiveType)}
      />
    </>
  )
}

export default EducationCategory
