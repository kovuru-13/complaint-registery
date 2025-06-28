import React from 'react'
import { MDBFooter } from 'mdb-react-ui-kit'

const FooterC = () => {
  return (
    <MDBFooter
      bgColor='dark'
      className='text-center text-lg-left text-light'
      style={{ height: '112px', marginTop: '101px' }}
    >
      <div className='text-center p-3'>
        <p className='mb-1' style={{ fontSize: '1.1rem' }}>
          <strong>ComplaintCare</strong>
        </p>
        <p className='mb-0'>&copy; {new Date().getFullYear()} All rights reserved</p>
      </div>
    </MDBFooter>
  )
}

export default FooterC
