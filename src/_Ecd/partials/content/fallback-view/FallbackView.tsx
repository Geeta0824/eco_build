import {toAbsoluteUrl} from '../../../helpers'

export function FallbackView() {
  return (
    <div className='splash-screen'>
      {/* <img src={toAbsoluteUrl('/media/logos/Montdor_2.png')} alt='Start logo' /> */}
      <span>Loading ...</span>
    </div>
  )
}
