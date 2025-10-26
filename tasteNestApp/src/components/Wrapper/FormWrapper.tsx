import React from 'react'
import FormImage from '/FormImage.png'

type FormWrapperProps = {
    children?: React.ReactNode | null | string;
}

const FormWrapper = ({children}:FormWrapperProps) => {
  return (
    <div className='grid max-sm:grid-rows-2 sm:grid-cols-2 rounded-lg bg-white shadow-md min-h-[20rem]' data-aos="fade-right">
      <div className='col-span-1 max-sm:rounded-t-lg sm:rounded-l-lg'>
        <img src={FormImage} alt="" className='h-full object-cover max-sm:rounded-t-lg sm:rounded-l-lg'/>
    </div>
    <div className='col-span-1 grow w-full place-self-center px-4 py-4'>
      {children}
        </div>  
    </div>
  )
}


export default FormWrapper
