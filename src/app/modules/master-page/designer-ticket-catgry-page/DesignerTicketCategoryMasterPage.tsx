import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageTitle} from '../../../../_Ecd/layout/core'
import DiscountListPage from '../../../pages/master-pages/discount-pages/DiscountListPage'
import {EditDiscount} from '../../../pages/master-pages/discount-pages/EditDiscount'
import {AddDiscount} from '../../../pages/master-pages/discount-pages/AddDiscount'
import AddDesignerTicketCategory from '../../../pages/master-pages/designer-ticket-catgry-pages/AddDesignerTicketCategory'
import EditDesignerTicketCategory from '../../../pages/master-pages/designer-ticket-catgry-pages/EditDesignerTicketCategory'
import DesignerTicketCategoryList from '../../../pages/master-pages/designer-ticket-catgry-pages/DesignerTicketCategoryList'

const DesignerTicketCategoryMasterPage: React.FC = () => {
  return (
    <Switch>
      <Route path='/master/designer-ticket-catgry/list'>
        <PageTitle>Designer Ticket Category List</PageTitle>
        <DesignerTicketCategoryList />
      </Route>
      <Route path='/master/designer-ticket-catgry/add'>
        <PageTitle>Add Designer Ticket Category</PageTitle>
        <AddDesignerTicketCategory />
      </Route>
      <Route path='/master/designer-ticket-catgry/edit/:designerTicketId'>
        <PageTitle>Edit Designer Ticket Category</PageTitle>
        <EditDesignerTicketCategory />
      </Route>
      <Redirect from='/master/designer-ticket-catgry' exact={true} to='/master/designer-ticket-catgry/list' />
      <Redirect to='/master/designer-ticket-catgry/list' />
    </Switch>
  )
}

export default DesignerTicketCategoryMasterPage
