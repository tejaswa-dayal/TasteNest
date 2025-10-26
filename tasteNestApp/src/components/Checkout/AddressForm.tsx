import { useFormContext } from "react-hook-form";
import { type CheckoutFormData } from '../../Pages/Checkout';

const AddressForm = () => {
    const {register, formState:{errors}} = useFormContext<CheckoutFormData>();

  return (
    <>
     <div className='space-y-4'>
      <div className='w-full space-y-1'>

        <label htmlFor="street" className=' block font-semibold text-(--black-color) px-2'>Street address<span className='text-red-600'>*</span></label>
        <textarea className='rounded-xl px-4 py-3 w-full border-2 border-(--gray-light) focus:border-(--primary-color) focus:outline-none transition-all resize-none ' id="street" rows={3} placeholder='House/Flat No., Building, Landmark' {...register('address.street')}/>
        <p className={`text-red-500 text-sm ${errors.address?.street ? 'block' : 'hidden'}`}><span className='text-xl'>⚠️</span>{errors.address?.street && errors.address?.street.message}</p>
      </div>
     <div className='flex gap-4 items-center justify-between w-full max-sm:flex-col max-sm:justify-center'>
        <div className='w-full space-y-1'>
            <label htmlFor="city" className=' block font-semibold text-(--black-color) px-2'>City<span className='text-red-600'>*</span></label>
        <input type='text' className='rounded-xl px-4 py-3 w-full border-2 border-(--gray-light) focus:border-(--primary-color) focus:outline-none transition-all' id="city" placeholder='City' {...register('address.city')}/>
        <p className={`text-red-500 text-sm ${errors.address?.city ? 'block' : 'hidden'}`}><span className='text-xl'>⚠️</span>{errors.address?.city && errors.address?.city.message}</p>
        </div>
        <div className='w-full space-y-1'>
            <label htmlFor="pincode" className=' block font-semibold text-(--black-color) px-2'>Pincode<span className='text-red-600'>*</span></label>
        <input type='number' className='rounded-xl px-4 py-3 w-full border-2 border-(--gray-light) focus:border-(--primary-color) focus:outline-none transition-all' id="pincode" placeholder='6-digit code' {...register('address.pincode')}/>
          <p className={`text-red-500 text-sm ${errors.address?.pincode ? 'block' : 'hidden'}`}><span className='text-xl'>⚠️</span>{errors.address?.pincode && errors.address?.pincode.message}</p>
        </div>
     </div>
     <div className='w-full space-y-1'>
            <label htmlFor="note" className=' block font-semibold text-(--black-color) px-2'>Delivery Note (optional)</label>
        <textarea rows={2}  className='rounded-xl px-4 py-3 w-full border-2 border-(--gray-light) focus:border-(--primary-color) focus:outline-none transition-all resize-none ' id="note" placeholder='Any special instructions?' {...register('address.note')}/>
       <p className={`text-red-500 text-sm ${errors.address?.note ? 'block' : 'hidden'}`}><span className='text-xl'>⚠️</span>{errors.address?.note && errors.address?.note.message}</p>
        </div>
        </div>
        </>
  )
}

export default AddressForm
