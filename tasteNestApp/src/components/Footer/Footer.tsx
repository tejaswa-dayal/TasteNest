import footerImage from '/footerImage.png'
import footerImage2 from '/footerImage2.png'
import {Container} from '../index'
import FooterCard from './FooterCard'
import { Link } from 'react-router-dom'

const footerQuickLinks:Record<string,string>[] = [{'About Us': '/#about'}, {'Menu':'/menu'}, {'Cart': '/cart'},{'Reservations':'/reservations'}, {'Orders':'/orders'},];
const Footer = () => {
  return (
    <footer className={`w-full relative bg-[#F5F8FD] font-Oswald `}>
      <img src={footerImage} alt="" className='absolute bottom-0 right-0 w-40 z-1'/>
      <img src={footerImage2} alt="" className='absolute bottom-0 left-0 w-40 max-sm:bottom-[50%] max-sm:translate-y-[50%] z-1'/>
      <Container>
     <div className='w-full flex flex-col gap-8 items-center justify-center z-2'>
        <h1 className='sm:text-6xl text-4xl text-(--secondary-color) font-Oswald font-bold z-2' data-aos="zoom-in">Let's Talk With Us</h1>
        <div className='flex max-sm:flex-col gap-10 justify-center items-center z-2' data-aos="fade-down">
            <FooterCard className='text-center min-h-37 min-w-60'>
              <>
              <h2 className='text-xl text-white'>Contact Info</h2>
              <hr  className=' text-(--secondary-color) '/>
              <div>
              <p className='text-white'>
                Phone: +1234567890, +0987654321
              </p>
              <p className='text-white'>
                Email: info@tastenest.com
              </p>
              </div>
              </>
            </FooterCard>
            <FooterCard className='text-center min-h-37 min-w-60'>
              <>
              <h2 className='text-xl text-white'>Quick Links</h2>
              <hr  className=' text-(--secondary-color) '/>
              <div className='flex flex-wrap gap-x-2 justify-center'>
                {
                  footerQuickLinks.map((link,index)=>{                    
                      return (
                        <div key={index} className='cursor-pointer hover:scale-110 transition-all duration-300'>
                          <Link to={link[Object.keys(link)[0]]}>
                          <span className='flex gap-2 justify-center text-white '>
                            <h6>
                              {Object.keys(link)[0]}
                            </h6>
                            <p>{index !== footerQuickLinks.length-1 ? '-' : ''}</p>
                          </span>
                          </Link>
                        </div>
                      )
                  })
                }
              </div>
              </>
            </FooterCard>
        </div>
     </div>
      </Container>
    </footer>
  )
}

export default Footer
