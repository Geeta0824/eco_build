import clsx from 'clsx'
import React, {FC, useEffect, useState} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {
  HeaderNotificationsMenu,
  MyHeaderNotificationsMenu,
  HeaderUserMenu,
  QuickLinks,
} from '../../../partials'
import {useLayout} from '../../core'
import {UserModel} from '../../../../app/modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  INotificationModel,
  ISearchQuotationModel,
} from '../../../../app/models/dashboard-page/IDashboardModel'
import {
  GetNotification_DiscountReq_ListApi,
  searchFilterListApi,
} from '../../../../app/modules/dashboard-page/DashboardCRUD'
import {toast} from 'react-toastify'
import Search from 'antd/es/input/Search'
import {Button, Modal} from 'react-bootstrap-v5'
import BlankDataImageInTable from '../../../../app/pages/common-pages/BlankDataImageInTable'
import LoaderInTable from '../../../../app/pages/common-pages/LoaderInTable'
import {getTurnkeyProductListByFilter} from '../../../../app/modules/carpetry-master-page/carpetry-product-master-master-page/CarpetryProductMasterCRUD'
import {Link, useHistory} from 'react-router-dom'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px',
  toolbarButtonIconSizeClass = 'svg-icon-1'

interface IState {
  loading: boolean
  list: INotificationModel[]
  searchDiscountReq: ISearchQuotationModel[]
  searchText: string
  pathUrl: any
}

const Topbar: FC = () => {
  const {config} = useLayout()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const history = useHistory()
  let [state, setState] = useState<IState>({
    loading: false,
    list: [] as INotificationModel[],
    searchDiscountReq: [] as ISearchQuotationModel[],
    searchText: '',
    pathUrl: process.env.REACT_APP_API_URL,
  })

  useEffect(() => {
    // if (user.roleID == 2) {
      GetNotificationDiscountReqList()
      setInterval(() => {
        GetNotificationDiscountReqList()
      }, 300000)
    // }
  }, state.list)

  function GetNotificationDiscountReqList() {
    GetNotification_DiscountReq_ListApi(user.employeeID)
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess === true) {
          setState({...state, list: responseData.responseObject, loading: false})
        } else {
          // toast.error(`${responseData.message}`)
          setState({...state, list: [] as INotificationModel[], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, list: [] as INotificationModel[], loading: false})
      })
  }
  //------------------- the search field----------------
  const [show, setShow] = useState(false)
  function handleClose() {
    setShow(false)
  }
  function handleShow() {
    setShow(true)
  }
  // api call
  function getAllproductMasterData(searchText: string) {
    if (searchText == '') {
      setState({...state, loading: false})
      return toast.error('Please Enter Text')
    } else {
      searchFilterListApi(searchText)
        .then((response) => {
          if (response.data.isSuccess == true) {
            const responseData = response.data.responseObject
            setState({
              ...state,
              searchText: searchText,
              searchDiscountReq: responseData,
              loading: false,
            })
            setShow(true)
            setName(searchText)
            setTotal(responseData.length)
            setPage(1)
          } else {
            toast.error(`${response.data.message}`)
            setState({
              ...state,
              searchDiscountReq: [],
              searchText: '',
              loading: false,
            })
            setShow(true)
          }
        })
        .catch((error) => {
          toast.error(`${error}`)
          setState({
            ...state,
            searchDiscountReq: [],
            searchText: '',
            loading: false,
          })
        })
    }
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState<string>('')

  async function openSearchPage() {
    setName('')
    setShow(false)
    setState({...state, loading: false})
  }
  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.searchDiscountReq.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ISearchQuotationModel[] = state.searchDiscountReq.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <div className='d-flex align-items-stretch flex-shrink-0'>
      <div
        className='header-menu align-items-stretch'
        data-kt-drawer='true'
        data-kt-drawer-name='header-menu'
        data-kt-drawer-activate='{default: true, lg: false}'
        data-kt-drawer-overlay='true'
        data-kt-drawer-width="{default:'200px', '300px': '250px'}"
        data-kt-drawer-direction='end'
        data-kt-drawer-toggle='#kt_header_menu_mobile_toggle'
        data-kt-swapper='true'
        data-kt-swapper-mode='prepend'
        data-kt-swapper-parent="{default: '#kt_body', lg: '#kt_header_nav'}"
      >
        {/* //search */}
        {user.roleID == 2 ? (
          <>
            <div className='col-lg-2 col-md-3 col-sm-3 col-6'>
              <div className={state.searchText !== '' ? 'fw-bold text-white px-1' : 'd-none'}>
                Search By :{' '}
                <span
                  className={state.searchText !== '' ? 'text-primary mt-2 fw-bold fs-6' : 'd-none'}
                >
                  {state.searchText}
                </span>
              </div>
            </div>
            <div className='col-lg-4 col-md-6 col-sm-6 px-2'>
              <label className='form-label fw-bold text-white'>Search :</label>
              <Search
                placeholder='Search'
                value={name}
                // allowClear
                onChange={(e) => setName(e.target.value)} // Update name state on input change
                onSearch={(value) => getAllproductMasterData(value)} // Trigger searchFilter on enter or search click
              />
            </div>
          </>
        ) : null}
        {/* NOTIFICATIONS */}
        {/* {user.roleID == 2 ? ( */}
          <div className={clsx('d-flex align-items-center ps-2', toolbarButtonMarginClass)}>
            {/* begin::Menu- wrapper ------*/}
            <div
              className={clsx(
                'btn btn-icon btn-active-light-primary btn-custom symbol symbol-50px position-relative',
                toolbarButtonHeightClass
              )}
              data-kt-menu-trigger='click'
              data-kt-menu-attach='parent'
              data-kt-menu-placement='bottom-end'
              data-kt-menu-flip='bottom'
            >
              <KTSVG
                path='/media/icons/duotune/general/gen007.svg'
                className={toolbarButtonIconSizeClass}
              />
              {state.list.length == 0 ? null : (
                <span className='badge badge-circle badge-primary position-absolute top-0 start-100 translate-middle'>
                  {state.list.length}
                </span>
              )}
            </div>
            <MyHeaderNotificationsMenu data={state.list} />
            {/* end::Menu wrapper ------*/}
          </div>
        {/* ) : null} */}

        <div
          className='menu menu-lg-rounded menu-column menu-lg-row menu-state-bg menu-title-gray-700 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-400 fw-bold my-5 my-lg-0 align-items-stretch'
          id='#kt_header_menu'
          data-kt-menu='true'
        >
          <div className='menu-item me-lg-1 ps-3'>
            <span className='menu-link py-3 text-white text-hover-dark'>
              Welcome to &nbsp;
              <span className='menu-title fs-5 text-primary'>
                {user.firstName}&nbsp;{user.lastName}
              </span>
            </span>
          </div>
        </div>
      </div>
      {/* Search */}
      {/* <div className={clsx('d-flex align-items-stretch', toolbarButtonMarginClass)}>
        <Search />
      </div> */}
      {/* Activities */}
      {/* <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
        {/* begin::Drawer toggle ---
        <div
          className={clsx('btn btn-icon btn-active-light-primary btn-custom', toolbarButtonHeightClass)}
          id='kt_activities_toggle'
        >
          <KTSVG
            path='/media/icons/duotune/general/gen032.svg'
            className={toolbarButtonIconSizeClass}
          />
        </div>
        {/* end::Drawer toggle ----
      </div> */}

      {/* NOTIFICATIONS */}
      {/* <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
        {/* begin::Menu- wrapper ------
        <div
          className={clsx(
            'btn btn-icon btn-active-light-primary btn-custom',
            toolbarButtonHeightClass
          )}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          <KTSVG
            path='/media/icons/duotune/general/gen007.svg'
            className={toolbarButtonIconSizeClass}
          />
        </div>
        <HeaderNotificationsMenu />
        {/* end::Menu wrapper ------
      </div> */}

      {/* CHAT */}
      {/* <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
        {/* begin::Menu wrapper -----
        <div
          className={clsx(
            'btn btn-icon btn-active-light-primary btn-custom position-relative',
            toolbarButtonHeightClass
          )}
          id='kt_drawer_chat_toggle'
        >
          <KTSVG
            path='/media/icons/duotune/communication/com012.svg'
            className={toolbarButtonIconSizeClass}
          />

          <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink'></span>
        </div>
        {/* end::Menu wrapper ----
      </div> */}

      {/* Quick links */}
      {/* <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
            {/* begin::Menu wrapper ---------
            <div
                className={clsx('btn btn-icon btn-active-light-primary btn-custom', toolbarButtonHeightClass)}
                data-kt-menu-trigger='click'
                data-kt-menu-attach='parent'
                data-kt-menu-placement='bottom-end'
                data-kt-menu-flip='bottom'
            >
                <KTSVG
                    path='/media/icons/duotune/general/gen025.svg'
                    className={toolbarButtonIconSizeClass}
                />
            </div>
            <QuickLinks />
            {/* end::Menu wrapper ---------
        </div> */}

      {/* begin::User */}
      <div
        className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}
        id='kt_header_user_menu_toggle'
      >
        {/* begin::Toggle */}
        <div
          className={clsx('cursor-pointer symbol', toolbarUserAvatarHeightClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          {user.photoPath !== '' ? (
            <img src={process.env.REACT_APP_API_URL + user.photoPath} alt='metronic' />
          ) : (
            <img src={toAbsoluteUrl('/media/avatars/300-16.jpg')} alt='metronic' />
          )}
          {/* <img src={toAbsoluteUrl('/media/avatars/300-16.jpg')} alt='metronic' /> */}
        </div>
        <HeaderUserMenu />
        {/* end::Toggle */}
      </div>
      {/* end::User */}
      {/* -------------------  For  Filter Data ------------------------- */}
      <Modal size='xl' show={show} onHide={handleClose}>
        <div style={{backgroundColor: '#2a3952'}}>
          <Modal.Header closeButton>
            <div className='border-0 text-white fs-5 fw-bolder' id='kt_chat_contacts_header'>
              Filter Data
            </div>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='card-body p-0'>
            <div className='table-responsive'>
              <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
                <thead className='bg-light-primary'>
                  <tr className='fw-bolder fs-5'>
                    <th className='min-w-50px ps-3'>Sr.No.</th>
                    <th className='min-w-150px'>Title</th>
                    {/* <th className='min-w-25px'>Description</th> */}
                    <th className='min-w-50px'>Page Path</th>
                    <th className='min-w-50px text-end pe-3'>View</th>
                  </tr>
                </thead>
                <tbody>
                  <LoaderInTable loading={state.loading} column={15} />
                  <>
                    {currentPosts.length > 0 &&
                      currentPosts.map((data, index) => {
                        return (
                          <tr
                            key={index}
                            // className={data.isCompleted === true ? 'text-success' : ''}
                          >
                            <td>
                              <span className='text-hover-primary ps-3 fs-6'>{index + 1}.</span>
                            </td>{' '}
                            <td>
                              <span className='text-hover-primary fs-6'>{data.title}</span>
                            </td>
                            {/* <td>
                              <span className='text-hover-primary fs-6'>{data.descriptions}</span>
                            </td> */}
                            <td>
                              <span className='text-hover-primary fs-6'>{data.pagePath}</span>
                            </td>
                            <td className='text-end'>
                              <Link
                                to={`/${data.link}`}
                                // {{
                                //   pathname: `/${data.link}`,
                                // }}
                                className='btn btn-sm btn-bg-light bg-hover-primary text-hover-inverse-primary text-primary text-hover-light'
                              >
                                <span
                                  className='fa fa-eye fs-2'
                                  onClick={() => openSearchPage()}
                                ></span>
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    <BlankDataImageInTable
                      length={currentPosts.length}
                      loading={state.loading}
                      colSpan={9}
                    />
                  </>
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* begin::Aside Toggler */}
      {config.header.left === 'menu' && (
        <div className='d-flex align-items-center d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
            id='kt_header_menu_mobile_toggle'
          >
            <KTSVG path='/media/icons/duotune/text/txt001.svg' className='svg-icon-1' />
          </div>
        </div>
      )}
    </div>
  )
}

export {Topbar}
