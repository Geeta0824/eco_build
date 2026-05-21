import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_Ecd/layout/core'
import PDFPhotoMasterList from '../../../pages/master-pages/pdf-photo-mst-pages/PDFPhotoMasterList'
import AddPDFPhotoMaster from '../../../pages/master-pages/pdf-photo-mst-pages/AddPDFPhotoMaster'
import EditPDFPhotoMaster from '../../../pages/master-pages/pdf-photo-mst-pages/EditPDFPhotoMaster'



const PDFPhotoMasterPage: React.FC = () => {
    return (
        <Switch>
            <Route path='/master/pdf-photo-mst/list'>
                <PageTitle>PDF Photo List</PageTitle>
                <PDFPhotoMasterList />
            </Route>
            <Route path='/master/pdf-photo-mst/add'>
                <PageTitle>Add PDF Photo</PageTitle>
                <AddPDFPhotoMaster />
            </Route>
            <Route path='/master/pdf-photo-mst/edit/:pdfPhotoID'>
                <PageTitle>Edit PDF Photo</PageTitle>
                <EditPDFPhotoMaster />
            </Route>
            <Redirect from='/master/pdf-photo-mst' exact={true} to='/master/pdf-photo-mst/list' />
            <Redirect to='/master/pdf-photo-mst/list' />
        </Switch>
    )
}

export default PDFPhotoMasterPage;

    
   
