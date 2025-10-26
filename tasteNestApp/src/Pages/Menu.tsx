import { useEffect, useState } from 'react'
import { Container, DishCard } from '../components'
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store/store';
import { getAllDishes } from '../redux/features/Dishes/DishesSlice';


const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Breakfast': '🌅',
    'Lunch': '☀️',
    'Dinner': '🌙',
  };
  return icons[category] || '🍴';
};

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Dishes");
  const handleCategoryChange = (selectedCategory : string) => {
    setSelectedCategory(selectedCategory);
  }
  const {dishes} = useSelector((state : RootState)=> state.dishes)
  const dispatch = useDispatch<AppDispatch>();
  const getDishes = async() => {
    await dispatch(getAllDishes())
  }
  useEffect(()=>{
   getDishes();
  },[])
   const categories = dishes ? ['All Dishes', ...Object.keys(dishes)] : ['All Dishes'];
  return (
    <div className='min-h-[80vh] py-18'>
      <Container>
          <div className='flex flex-col items-center gap-4'>
               <h1 className='text-center text-6xl text-(--primary-color) relative' data-aos="fade-down">Me<span className='before:content-[""] before:w-18 before:h-1 before:absolute before:-bottom-1 before:bg-(--secondary-color) before:rounded-lg'>nu</span>
            </h1>
            <p className='text-(--gray-dark) text-center text-lg max-sm:text-base max-w-2xl mx-auto' data-aos="fade-up" ata-aos-delay="200">
              Discover our delicious selection of dishes crafted with love and fresh ingredients
            </p>

              <div className='w-full  py-3 flex rounded-xl justify-evenly gap-2 gap-y-4 max-md:flex-wrap' data-aos="zoom-in" data-aos-delay="500">
              {
               dishes && categories.map((category)=>(
                  <button key={category} className={`flex gap-1.5 max-md:grow max-md:justify-center lg:text-xl text-lg font-semibold items-center px-4 max-md:px-2 py-1 max-sm:py-0.5 rounded-full  hover:bg-(--secondary-color)/70 shadow-xl ${selectedCategory === category ? 'bg-(--primary-color) text-white' : 'bg-(--gray-light)/30 text-(--black-color)'} transition-all duration-500 hover:text-(--black-color)`} onClick={()=> handleCategoryChange(category)}>
                    <span className='text-2xl'>{getCategoryIcon(category)}</span> {category}
                  </button>
                ))}

              </div>

            <div className='grid justify-items-center gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {
                !dishes ? <p className='flex gap-1 justify-center justify-self-center col-span-1 md:col-span-2 lg:col-span-3  items-center text-xl md:text-2xl lg:text-4xl '><span className=' animate-bounce md:text-6xl text-4xl'>🍽️</span>
    Delicious dishes are being prepared...
    </p> : selectedCategory === 'All Dishes' ? (
      Object.values(dishes).flat().map((dish)=>(
        <DishCard dish={dish} bigCard={true} key={dish.dish_id}/>
      ))
    ) : (
      dishes[selectedCategory]?.map(dish => <>
                    <DishCard dish={dish} bigCard={true} key={dish.dish_id}/>
                  </>
                ) 
    )
              }
            </div>
          </div>
        </Container>
    </div>
  )
}

export default Menu
