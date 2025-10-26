
import { Container, LoginForm, FormWrapper } from '../components'


const Login = () => {
  return (
    <div className='min-h-[80vh] bg-gradient-to-br from-(--gray-dark)/10 via-(--gray-light) to-(--secondary-color)/40 py-18 transition-all duration-500'>
      <Container>
        <div className='flex flex-col gap-8'>
        
        <h1 className='text-center text-6xl text-(--primary-color) relative' data-aos="fade-down">Log <span className='before:content-[""] before:w-12 before:h-1 before:absolute before:-bottom-1 before:bg-(--secondary-color) before:rounded-lg'>In</span> </h1>
        <FormWrapper>
        <LoginForm/>
        </FormWrapper>
        </div>
      </Container>
    </div>
  )
}

export default Login
