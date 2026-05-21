import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IDiscountModel} from '../../../models/master-page/IDiscountModel '
import {getAllDiscount} from '../../../modules/master-page/discount-master-page/DiscountCRUD'
import {DiscountCard} from './DiscountCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'

type Props = {}

interface IUnit {
  loading: boolean
  discountData: IDiscountModel[]
  tmpDiscountData: IDiscountModel[]
  SearchText: string
  selunitID: number
  activeID: number
  activeType: any
}

const DiscountListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IUnit>({
    loading: false,
    discountData: [] as IDiscountModel[],
    tmpDiscountData: [] as IDiscountModel[],
    SearchText: '',
    selunitID: 0,
    activeID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.search
      }
      getAllDiscountData(mainSearch)
    }, 100)
  }, [])

  function getAllDiscountData(mainSearch: string) {
    getAllDiscount()
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.branchName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.discountPercentage.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              discountData: results,
              tmpDiscountData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              discountData: responseData,
              tmpDiscountData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, discountData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, discountData: [], loading: false})
      })
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpDiscountData.filter((user) => {
        return (
          user.branchName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.discountPercentage.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, discountData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, discountData: state.tmpDiscountData})
      // If the text field is empty, show all users
      setTotal(state.tmpDiscountData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.discountData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IDiscountModel[] = state.discountData.slice(indexOfFirstPage, indexOfLastPage)

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/discount/add'}
          title='Click to add a Discount'
        />
        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
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

          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link to='/master/discount/add' className='btn btn-sm btn-light-primary bg-white'>
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
                  <th className='min-w-150px'>Discount(%)</th>
                  <th className='min-w-150px'>Branch Name</th>
                  <th className='min-w-100px text-center'>Edit</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <DiscountCard data={data} name={name} />
                      // <tr key={index}>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <span className='text-dark text-hover-primary fs-6'>
                      //           {data.discountPercentage + '%'}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <span className='text-dark text-hover-primary fs-6'>
                      //           {data.branchName}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td className='text-end'>
                      //     <div className='d-flex justify-content-center flex-shrink-0'>
                      //       <Link
                      //         to={`/master/discount/edit/${data.discountID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //     </div>
                      //   </td>
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
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
    </>
  )
}

export default DiscountListPage
