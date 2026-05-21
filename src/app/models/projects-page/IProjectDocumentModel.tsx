export interface IProjectDocumentModel {
    projectID: number
    projectDocID: number,
    docName: string,
    docPath: string
    createDate: string
  }
  
  export const projectDocumentInitValues: IProjectDocumentModel = {
    projectID: 0,
    projectDocID: 0,
    docName: '',
    docPath: '',
    createDate: '',
  }
  
export interface IProjectAlbumModel {
    projectID: number
    projectAlbumID: number,
    albumName: string
    createDate: string
  }
  
export interface IProjectAlbumModel {
    projectID: number
    projectAlbumID: number,
    albumName: string
    createDate: string
  }
  
  export const projectAlbumInitValues: IProjectAlbumModel = {
    projectID: 0,
    projectAlbumID: 0,
    albumName: '',
    createDate: '',
  }
  