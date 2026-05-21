export interface IAlbumImageModel {
    projectID: number
    projectAlbumID: number
    projectAlbumDtlID: number
    photoTitle: string
    photoPath: string
  }
  
  export const albumImageInitValues: IAlbumImageModel = {
    projectID:0,
    projectAlbumID:0,
    projectAlbumDtlID:0,
    photoTitle: '',
    photoPath: '',
  }
  