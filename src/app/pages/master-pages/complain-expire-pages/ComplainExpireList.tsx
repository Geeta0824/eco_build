import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {getAllDiscount} from '../../../modules/master-page/discount-master-page/DiscountCRUD'
import {IComplainExpireModel} from '../../../models/master-page/IComplainExpireModel'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  deleteComplainExpireAPI,
  getGetComplainExpireWebListAPI,
} from '../../../modules/master-page/complain-expire-page/NewComplainExpireCRUD'
import {ComplainExpireCard} from './ComplainExpireCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'

type Props = {}

interface IUnit {
  loading: boolean
  complainExpireData: IComplainExpireModel[]
  tmpComplainExpireData: IComplainExpireModel[]
  SearchText: string
  selunitID: number
  selComplainExpID: number
  activeType: any
}

const ComplainExpireList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IUnit>({
    loading: false,
    complainExpireData: [] as IComplainExpireModel[],
    tmpComplainExpireData: [] as IComplainExpireModel[],
    SearchText: '',
    selunitID: 0,
    selComplainExpID: 0,
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
      getAllcomplainExpireData(mainSearch)
    }, 100)
  }, [])

  function getAllcomplainExpireData(mainSearch: string) {
    getGetComplainExpireWebListAPI()
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          const responseData = resp.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user:any) => {
              return (
                user.categoryName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.maintenanceDays.toString().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              complainExpireData: results,
              tmpComplainExpireData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              complainExpireData: responseData,
              tmpComplainExpireData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${resp.message}`)
          setState({...state, complainExpireData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, complainExpireData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (complainExpireID: number) => {
    setState({
      ...state,
      selComplainExpID: complainExpireID,
      loading: false,
    })
    setShow(true)
  }

  function deleteComplainExpItem(complainExpireID: number) {
    let value = {complainExpireID: complainExpireID}
    var objComplainExpire = btoa(JSON.stringify(value))
    deleteComplainExpireAPI(`${objComplainExpire}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllcomplainExpireData(state.SearchText)
          setShow(false)
        } else {
          toast.error(`${resp.message}`)
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
      const results = state.tmpComplainExpireData.filter((user) => {
        return (
          user.categoryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.maintenanceDays.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, complainExpireData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, complainExpireData: state.tmpComplainExpireData})
      // If the text field is empty, show all users
      setTotal(state.tmpComplainExpireData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.complainExpireData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IComplainExpireModel[] = state.complainExpireData.slice(
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
          pathName={'/master/expire-complaint/add'}
          title='Click to add a complain-expire'
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
            <Link
              to='/master/complain-expire/add'
              className='btn btn-sm btn-light-primary bg-white'
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
                  <th className='min-w-150px'>Category Type</th>
                  <th className='min-w-150px'>Maintenance Day</th>
                  <th className='min-w-100px text-center'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <ComplainExpireCard
                        data={data}
                        handleShow={() => handleShow(data.complainExpireID)}
                        key={index}
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <span className='text-dark text-hover-primary fs-6'>
                      //           {data.categoryName}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <span className='text-dark text-hover-primary fs-6'>
                      //           {data.maintenanceDays + ' '+'Day'}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td className='text-end'>
                      //     <div className='d-flex justify-content-center flex-shrink-0'>
                      //       <Link
                      //         to={`/master/complain-expire/edit/${data.complainExpireID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>{' '}
                      //       <div
                      //         onClick={() => handleShow(data.complainExpireID)}
                      //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
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
          {/* =====================Delete Model PopUp=============== */}
          <ModelPopUpDelete
            id={state.selComplainExpID}
            pageName={'Complain Expire'}
            show={show}
            handleClose={handleClose}
            deleteData={() => deleteComplainExpItem(state.selComplainExpID)}
          />
        </div>
      </div>
    </>
  )
}

export default ComplainExpireList
