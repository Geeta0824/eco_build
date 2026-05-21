import React, {useEffect, useState} from 'react'
import {Pagination} from 'antd'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {getAllDNCTypeList} from '../../../modules/master-page/dnc-type-master-page/DNCTypeCRUD'
import {IDNCTypeModel} from '../../../models/master-page/IDNCTypeModel'
import {DNCTypeCrad} from './DNCTypeCrad'

type Props = {}

interface IDNCType {
  loading: boolean
  dncTypeData: IDNCTypeModel[]
  tmpdncTypeData: IDNCTypeModel[]
  SearchText: string
}

const DNCTypeList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IDNCType>({
    loading: false,
    dncTypeData: [] as IDNCTypeModel[],
    tmpdncTypeData: [] as IDNCTypeModel[],
    SearchText: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.search
      }
      getAlldncTypeData(mainSearch)
    }, 100)
  }, [])

  function getAlldncTypeData(mainSearch: string) {
    getAllDNCTypeList()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.dncTypeName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.amountPerSqft.toString().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({...state, dncTypeData: results, tmpdncTypeData: responseData, loading: false})
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              dncTypeData: responseData,
              tmpdncTypeData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, dncTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, dncTypeData: [], loading: false})
      })
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpdncTypeData.filter((user) => {
        return (
          user.dncTypeName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.amountPerSqft.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, dncTypeData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, dncTypeData: state.tmpdncTypeData})
      // If the text field is empty, show all users
      setTotal(state.tmpdncTypeData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.dncTypeData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IDNCTypeModel[] = state.dncTypeData.slice(indexOfFirstPage, indexOfLastPage)
  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
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
                  <th className='min-w-150px'>DNC Type Name</th>
                  <th className='min-w-150px'>Amount Per Sqft</th>
                  <th className='min-w-100px text-end'>Edit</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <DNCTypeCrad data={data} name={name} />
                      // <tr key={index}>
                      //     <td>
                      //         <div className='d-flex align-items-center'>
                      //             <div className='d-flex justify-content-start flex-column'>
                      //                 <span className='text-dark text-hover-primary fs-6'>
                      //                     {data.dncTypeName}
                      //                 </span>
                      //             </div>
                      //         </div>
                      //     </td>
                      //     <td>
                      //         <div className='d-flex align-items-center'>
                      //             <div className='d-flex justify-content-start flex-column'>
                      //                 <span className='text-dark text-hover-primary fs-6'>
                      //                     {data.amountPerSqft}
                      //                 </span>
                      //             </div>
                      //         </div>
                      //     </td>
                      //     <td>
                      //         <div className='d-flex justify-content-end flex-shrink-0'>
                      //             <Link
                      //                 to={`/master/dnc-type/edit/${data.dncTypeID}`}
                      //                 className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //             >
                      //                 <KTSVG
                      //                     path='/media/icons/duotune/art/art005.svg'
                      //                     className='svg-icon-3 svg-icon-primary'
                      //                 />
                      //             </Link>

                      //         </div>
                      //     </td>
                      // </tr>
                    )
                  })}
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
    </>
  )
}

export default DNCTypeList
