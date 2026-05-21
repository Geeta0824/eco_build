import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {IWorkHistoryModel} from '../../../models/Reports-page/IWorkHistoryModel'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {KTSVG} from '../../../../_Ecd/helpers'
import {getWorkHistoryList} from '../../../modules/reports-page/work-history-page/WorkHistoryCRUD'

type Props = {}
interface IHISTORY {
  loading: boolean
  workHistoryData: IWorkHistoryModel[]
  tmpWorkHistoryData: IWorkHistoryModel[]
  SearchText: string
}

const WorkHistoryList: React.FC<Props> = () => {
  const [state, setState] = useState<IHISTORY>({
    loading: false,
    workHistoryData: [] as IWorkHistoryModel[],
    tmpWorkHistoryData: [] as IWorkHistoryModel[],
    SearchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      getWorkHistoryData()
    }, 100)
  }, [])

  function getWorkHistoryData() {
    getWorkHistoryList()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          setState({
            ...state,
            workHistoryData: responseData,
            tmpWorkHistoryData: responseData,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, workHistoryData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, workHistoryData: [], loading: false})
      })
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpWorkHistoryData.filter((user) => {
        return (
          user.historyDate.toLowerCase().includes(keyword.toLowerCase()) ||
          user.action.toLowerCase().includes(keyword.toLowerCase()) ||
          user.actionBy.toLowerCase().includes(keyword.toLowerCase()) ||
          user.moduleName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.historyDescription.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, workHistoryData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, workHistoryData: state.tmpWorkHistoryData})

      setTotal(state.tmpWorkHistoryData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.workHistoryData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IWorkHistoryModel[] = state.workHistoryData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 bg_dark' style={{backgroundColor: '#000000'}}>
          <div className='border-0 p-2' id=''>
            <span className='w-100 position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                name='search'
                placeholder='Search'
                onChange={filter}
                value={name}
              />
            </span>
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
                  <th className='min-w-150px'>Date</th>
                  <th className='min-w-150px'>Module Name</th>
                  <th className='min-w-150px'>Action</th>
                  <th className='min-w-150px '>Description</th>
                  <th className='min-w-100px'>Action By</th>
                </tr>
               
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading ============== */}

                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.historyDate}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.moduleName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.action}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.historyDescription}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.actionBy}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                {/* =================== Blank Api Data ============== */}
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
              // itemRender={itemRender}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkHistoryList
