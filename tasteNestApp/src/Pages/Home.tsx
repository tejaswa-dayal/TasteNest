import { useEffect, useState, useRef } from 'react'
import { Container,DishCard,ReservationForm } from '../components'
import heroImage2 from '/heroImage2.jpg?url';
import heroImage3 from '/heroImage3.jpg?url';
import heroFreeDeliveryImage from '/heroFreeDeliveryImage.png?url'
import Slider from "react-slick";
import { useDispatch, useSelector} from 'react-redux';
import { type AppDispatch, type RootState } from '../redux/store/store';
import { getFeaturedDishes } from '../redux/features/Dishes/DishesSlice';

const sponsorSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  slidesToScroll: 1,
  slidesToShow: 4,
  speed: 2000,
  autoplaySpeed: 2000,
  cssEase: "linear",
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

const featuredDishesSettings = {
  dots: true,
  slidesToScroll: 1,
  // slidesToShow will be overridden with computedSlidesToShow
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 870, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 551, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};


const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {featuredDishes} = useSelector((state:RootState)=> state.dishes)
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sliderRef = useRef<any>(null);
  const [computedSlidesToShow, setComputedSlidesToShow] = useState<number>(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    if (w <= 551) return 1;
    if (w <= 870) return 2;
    if (w <= 1024) return 3;
    return 4;
  });

  useEffect(()=>{
    const featured:boolean = true;
    dispatch(getFeaturedDishes({featured}));
    // mark mounted and force a recalculation on next tick
    setMounted(true);
    // ensure slider measures after layout settles
    setTimeout(() => {
      sliderRef.current?.innerSlider?.onWindowResized?.();
    }, 100);
  },[dispatch])

  // Debounced handler to force react-slick to re-measure when window size changes
  useEffect(() => {
    let t: number | undefined;
    const onResize = () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => {
        // update computed slidesToShow based on breakpoints (this will remount Slider when it changes)
        const w = window.innerWidth;
        const newCount = w <= 551 ? 1 : w <= 870 ? 2 : w <= 1024 ? 3 : 4;
        if (newCount !== computedSlidesToShow) setComputedSlidesToShow(newCount);
        sliderRef.current?.innerSlider?.onWindowResized?.();
      }, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      if (t) window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, [computedSlidesToShow]);

  return (
    <>
    <div className='w-full pt-18'>
      <Container className={` w-full bg-[url(/heroImage.jpg)] bg-cover bg-center bg-no-repeat grid sm:grid-cols-3 xl:grid-cols-2 max-lg:place-items-center xl:pb-30`}>
      <div className='flex flex-col z-10 max-sm:text-center sm:col-span-2 xl:col-span-1 relative'>
        <img src={heroFreeDeliveryImage} alt="" className='md:hidden object-contain max-sm:w-28 absolute max-sm:left-36 max-sm:-top-4 max-md:w-58 max-md:left-80 max-md:-top-4'/>
        <h1 className='max-lg:text-4xl text-6xl max-sm:text-xl text-(--navbar-black) font-semibold z-10 'data-aos="zoom-in-right">
          Best Food <br/> <span className="pt-2 z-10 relative ">Best Restaurants
            <span className="max-lg:w-75 w-125 h-14 max-lg:h-12 absolute max-sm:h-6 max-sm:w-45  bg-(--secondary-color) rounded-full top-4.5 max-lg:top-2 -left-5 max-lg:-left-3 -z-10"></span>
          </span>
          </h1>
          <p className='text-sm text-(--gray-dark) font-semibold uppercase tracking-widest sm:mt-1 lg:mt-0' data-aos="zoom-out-left">Arriving from India.</p>
          <div className='w-full pt-3'>
            <ReservationForm/>
          </div>
      </div>
      <div className='relative w-full max-md:hidden'>
          <div className='xl:w-45 absolute xl:left-55 xl:top-2 lg:w-30 lg:left-15 lg:top-4 sm:w-28 sm:-top-32'>
            <img src={heroImage3} alt="" className='object-contain rounded-t-full rounded-b-full'/>
          </div>
          <div className='xl:w-45 absolute xl:left-115 xl:top-20 lg:w-30 lg:left-60 lg:top-20 sm:w-28 sm:-top-20 sm:left-35'>
            <img src={heroImage2} alt="" className='object-contain rounded-t-full rounded-b-full'/>
          </div>
          <div className='absolute xl:left-105 xl:-top-7 lg:left-48 xl:w-60 lg:w-48 lg:-top-4 sm:w-40 sm:-top-38 sm:left-30'>
              <img src={heroFreeDeliveryImage} alt="" className='object-contain'/>
          </div>
      </div>
      </Container>
    </div>
      <Container className='w-full'>
        <div className='text-center w-full' >
            <h4 className='text-(--primary-color) text-sm font-semibold font-Oswald' data-aos="fade-down" id="about">About TasteNest</h4>
            <p className='font-semibold text-(--black-color) lg:text-4xl text-2xl' data-aos="fade-up">Perfect Place For An Exceptional <br className='max-md:hidden'/>Experience</p>
            <div className='flex justify-around max-md:flex-col max-md:items-center'>
              <div className='w-full flex justify-end max-md:justify-center shrink pr-10' data-aos="fade-right">
                <img src="/homeAboutImage.png" alt="" className='object-contain w-72'/>
              </div>
              <div className='w-full py-7 max-md:pl-8' data-aos="fade-left">
                <p className='md:max-w-90 text-start text-lg'>
                  Welcome to TasteNest, where flavor meets comfort. We’re passionate about serving fresh, high-quality dishes made with love and the finest ingredients. Whether you’re here for a quick bite, a family dinner, or a special celebration, we promise great taste, warm hospitality, and an unforgettable dining experience.
                </p>
              </div>
            </div>
          <div>
            <h2 className='uppercase text-(--black-color) font-semibold pt-10 text-xl font-Oswald' data-aos="zoom-in">Highly Trusted Sponsors</h2>
            <div className='py-6' data-aos="zoom-in-down">
            <Slider {...sponsorSettings}>
              <div className='item'>
                <img src="/sponsors/sponsor1.png" alt="sponsor image" className='object-contain'/>
              </div>
              <div className='item'>
                <img src="/sponsors/sponsor2.png" alt="sponsor image" className='object-contain'/>
              </div>
              <div className='item'>
                <img src="/sponsors/sponsor3.png" alt="sponsor image" className='object-contain'/>
              </div>
              <div className='item'>
                <img src="/sponsors/sponsor4.png" alt="sponsor image" className='object-contain'/>
              </div>
              <div className='item'>
                <img src="/sponsors/sponsor5.png" alt="sponsor image" className='object-contain'/>
              </div>
              <div className='item'>
                <img src="/sponsors/sponsor6.png" alt="sponsor image" className='object-contain'/>
              </div>
              
            </Slider>
            </div>
          </div>
        </div>
      </Container>
      <Container>
        <div className='flex flex-col items-center gap-6 py-6'>
            <h1 className='sm:text-5xl max-sm:text-3xl text-3xl relative before:content-[""] before:absolute before:w-full  before:h-1 before:rounded-lg before:bg-(--secondary-color) before:-bottom-1 font-Oswald font-bold' data-aos="fade-up">Featured <span className='text-(--primary-color)'>Dishes</span></h1>
            <div className='w-full'>
              {mounted && (
                // key forces a remount only when slidesToShow changes (keeps reflows minimal)
                <Slider
                  key={computedSlidesToShow}
                  ref={sliderRef}
                  {...featuredDishesSettings}
                  slidesToShow={computedSlidesToShow}
                  className=''
                >
                  {featuredDishes?.map((featuredDish)=> (
                    <DishCard key={featuredDish.dish_id} className="item" dish={featuredDish}/>
                  ))}
                </Slider>
              )}
              </div>
            
        
        </div>
      </Container>
      <Container>
        <></>
      </Container>
    </>
  )
}

export default Home
