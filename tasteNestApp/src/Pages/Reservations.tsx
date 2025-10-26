import  { useEffect, useState } from 'react'
import { Button, Container } from '../components'
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store/store';
import { getReservations } from '../redux/features/Reservation/reservationSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const dateFormatter = (date:string)=>{
    return date.split('-').reverse().join('-')
}


const Reservations = () => {
    
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage,setCurrentPage] = useState(1);
    const dispatch = useDispatch<AppDispatch>();
    const {reservationsList} = useSelector((state:RootState)=>state.reservation)
    const {user_id} = useSelector((state:RootState)=>state.logIn)
    const [customPageNumber,setCustomPageNumber] = useState('1');
    
    const fetchReservations = async(user_id : string | null)=>{
        await dispatch(getReservations(user_id))
    }
    const [data, setData] = useState<Record<string, string | number>[] | null | []>(reservationsList);
    useEffect(()=>{
        if (user_id){
            fetchReservations(user_id);
        }
    },[])
    useEffect(()=>{
        if(reservationsList){
            setData(reservationsList)
        }
    },[reservationsList])
const handleSort = (column :string) => {
      const newSortDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
      setSortColumn(column);
      setSortDirection(newSortDirection);

      if(data){
      const sortedData = [...data].sort((a, b) => {
        if (a[column] < b[column]) return newSortDirection === 'asc' ? -1 : 1;
        if (a[column] > b[column]) return newSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
      setData(sortedData);
    }
    };
    const totalItems:number = data?.length as number;
    const indexOfLastItemOnPage = currentPage * 10 
    const indexOfFirstItemOnPage = indexOfLastItemOnPage - 10;
    const totalPages = Math.ceil(totalItems/10)

    const handleNext = ()=>{
        setCurrentPage((prev)=> prev+1)
    }

    const handlePrevious = ()=>{
        setCurrentPage((prev)=> prev-1)
    }

    const handleCustomPageNumber = ()=>{
            if(Number(customPageNumber) > totalPages){
                toast.error("Enter page number less than total pages.")
                setCustomPageNumber(String(currentPage));
            }
            else if(Number(customPageNumber)<1){
                toast.error("Enter page number greater than 1.")
                setCustomPageNumber(String(currentPage));
            }
            else{
                setCurrentPage(Number(customPageNumber));
        }
    }

  return (
    <div className='min-h-[80vh] py-18'>
        <Container>
      <div className='flex flex-col gap-8'>

        <h1 className='text-center text-6xl text-(--primary-color) relative max-sm:text-4xl'  data-aos="fade-down">Reser<span className='before:content-[""] before:w-51 max-sm:before:w-31 before:h-1 before:absolute before:-bottom-1 before:bg-(--secondary-color) before:rounded-lg'>vations</span> </h1>
        {
            user_id ? (
                typeof(reservationsList) !== 'string' && typeof(data) !== 'string'?
                (<div className='overflow-x-auto shadow-lg rounded-xl'  data-aos="fade-up">
                    <table className='w-full border-collapse rounded-xl overflow-hidden'>
                    <thead className='bg-(--primary-color) text-white'>
                    <tr className='font-Oswald'>
                        <th className='py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider max-sm:px-3 max-sm:text-xs'>
                            Sl. No.
                        </th>
                        <th className='py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider max-sm:px-3 max-sm:text-xs cursor-pointer hover:bg-(--primary-color)/90 transition-colors' onClick={() => handleSort('no_of_guests')}>
                            <div className='flex items-center gap-2'>
                                <span>No. of Guests</span>
                                <span className='text-xs opacity-70'>{(sortColumn === 'no_of_guests' && (sortDirection === 'asc' ? '▲' : '▼')) || "⇅"}</span>
                            </div>
                        </th>
                        <th className='py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider max-sm:px-3 max-sm:text-xs cursor-pointer hover:bg-(--primary-color)/90 transition-colors' onClick={() => handleSort('booked_on_date')}>
                            <div className='flex items-center gap-2'>
                                <span>Reserved On</span>
                                <span className='text-xs opacity-70'>{(sortColumn === 'booked_on_date' && (sortDirection === 'asc' ? '▲' : '▼')) || "⇅"}</span>
                            </div>
                        </th>
                        <th className='py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider max-sm:px-3 max-sm:text-xs cursor-pointer hover:bg-(--primary-color)/90 transition-colors' onClick={() => handleSort('booked_for_date')}>
                            <div className='flex items-center gap-2'>
                                <span>Reserved For</span>
                                <span className='text-xs opacity-70'>{(sortColumn === 'booked_for_date' && (sortDirection === 'asc' ? '▲' : '▼')) || "⇅"}</span>
                            </div>
                        </th>
                        <th className='py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider max-sm:px-3 max-sm:text-xs cursor-pointer hover:bg-(--primary-color)/90 transition-colors' onClick={() => handleSort('time')}>
                            <div className='flex items-center gap-2'>
                                <span>Time</span>
                                <span className='text-xs opacity-70'>{(sortColumn === 'time' && (sortDirection === 'asc' ? '▲' : '▼')) || "⇅"}</span>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody className='bg-white'>
                    {
                        data?.slice(indexOfFirstItemOnPage,indexOfLastItemOnPage).map((reservation,index)=>(
                            <tr className='border-b border-(--gray-light) hover:bg-(--secondary-color)/10 transition-all duration-300 group' key={reservation.reservation_id}>
                                <td className='py-4 px-6 text-(--black-color) font-medium max-sm:px-3 max-sm:text-xs'>
                                    <div className='flex items-center justify-center w-8 h-8 rounded-full bg-(--gray-light) group-hover:bg-(--secondary-color) transition-colors duration-300 text-sm font-bold'>
                                        {indexOfFirstItemOnPage + index + 1}
                                    </div>
                                </td>
                                <td className='py-4 px-6 text-(--gray-dark) max-sm:px-3 max-sm:text-xs'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-2xl max-sm:text-lg'>👥</span>
                                        <span className='font-semibold text-(--black-color)'>{reservation?.no_of_guests}</span>
                                    </div>
                                </td>
                                <td className='py-4 px-6 text-(--gray-dark) max-sm:px-3 max-sm:text-xs'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xl max-sm:text-base'>📅</span>
                                        <span>{dateFormatter(reservation?.booked_on_date as string)}</span>
                                    </div>
                                </td>
                                <td className='py-4 px-6 text-(--gray-dark) max-sm:px-3 max-sm:text-xs'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xl max-sm:text-base'>📆</span>
                                        <span className='font-semibold text-(--black-color)'>{dateFormatter(reservation?.booked_for_date as string)}</span>
                                    </div>
                                </td>
                                <td className='py-4 px-6 text-(--gray-dark) max-sm:px-3 max-sm:text-xs'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xl max-sm:text-base'>🕐</span>
                                        <span className='font-medium text-(--black-color)'>{reservation?.time}</span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                </div>) :
                (
                    <div className='flex flex-col items-center justify-center py-16 px-4'>
                        <div className='text-8xl mb-4'  data-aos="fade-right">📋</div>
                        <h1 className='text-2xl text-(--gray-dark) text-center font-Oswald'  data-aos="fade-left">No reservations found.</h1>
                        <p className='text-(--gray-dark) text-center mt-2'  data-aos="fade-up">Your reservation history will appear here.</p>
                    </div>
                )
            ) :
            (
                <div className='flex flex-col items-center justify-center py-16 px-4 bg-(--gray-light)/30 rounded-xl'>
                    <div className='text-8xl mb-4'  data-aos="fade-right">🔒</div>
                    <h2 className='text-2xl text-(--gray-dark) font-Oswald mb-2'  data-aos="fade-left">
                       Login to see previous reservations.
                    </h2>
                    <Link to='/login' className='mt-4 px-6 py-3 bg-(--primary-color) text-white rounded-lg font-semibold hover:bg-(--primary-color)/90 transition-all duration-300 hover:scale-105'  data-aos="fade-up">
                                        Login Now
                                    </Link>
                </div>
            )
        }
        {
            user_id && (
                typeof(reservationsList) !== 'string' && (
                    <div className='flex gap-4 items-center max-sm:flex-col max-sm:justify-center bg-white p-4 rounded-xl shadow-md'>
            <div className='w-full flex sm:justify-end gap-3 max-sm:justify-center items-center'  data-aos="fade-up">
        <button className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === 1 ? 'bg-(--gray-light) text-(--gray-dark) cursor-not-allowed' : 'bg-(--primary-color) text-white hover:bg-(--primary-color)/90 hover:scale-105'}`} disabled={currentPage === 1} onClick={handlePrevious}>
            {'← Previous'}
        </button>
        <div className='px-4 py-2 bg-(--secondary-color) rounded-lg'>
            <h2 className='text-lg font-bold text-(--black-color)'>
                Page {currentPage} of {totalPages}
            </h2>
        </div>
        <button className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === totalPages ? 'bg-(--gray-light) text-(--gray-dark) cursor-not-allowed' : 'bg-(--primary-color) text-white hover:bg-(--primary-color)/90 hover:scale-105'}`} onClick={handleNext} disabled={currentPage === totalPages}>
            {'Next →'}
        </button>
            </div>
        <div className='flex gap-3 sm:place-content-end w-full items-center max-sm:justify-center max-sm:flex-col' data-aos="fade-up">
        <div className='flex gap-2 items-center'>
            <span className='text-(--gray-dark) font-medium'>Go to:</span>
        <input type="text" value={customPageNumber} className={`px-3 py-2 w-16 max-sm:w-14 text-center border-2 border-(--gray-dark) rounded-lg focus:outline-none focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/20 transition-all`} onChange={e => setCustomPageNumber(e.target.value)}/>
        <Button type='submit' className='bg-(--primary-color) px-4 py-2 text-white rounded-lg font-semibold hover:bg-(--primary-color)/90 hover:scale-105 transition-all duration-300 shadow-md' onClick={handleCustomPageNumber}>
            Go
        </Button>
        </div>
        <p className='text-sm text-(--gray-dark) font-medium'>
            Total: {totalPages} {totalPages === 1 ? 'page' : 'pages'}
        </p>
        </div>
        </div>
                )
            )
        }
        
        </div>
      </Container>
    </div>
  )
}

export default Reservations