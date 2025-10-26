
import { Container, SignUpForm, FormWrapper } from '../components'
const SignUp = () => {
  return (
     <div className='min-h-[80vh] bg-gradient-to-br from-(--gray-dark)/10 via-(--gray-light) to-(--secondary-color)/40 py-18 transition-all duration-700'>
      <Container>
        <div className='flex flex-col gap-8'>

        <h1 className='text-center text-6xl text-(--primary-color) relative' data-aos="fade-down">Sign <span className='before:content-[""] before:w-15.5 before:h-1 before:absolute before:-bottom-1 before:bg-(--secondary-color) before:rounded-lg'>Up</span> </h1>
        <FormWrapper>
        <SignUpForm/>
        </FormWrapper>
        </div>
      </Container>
    </div>
  )
}

export default SignUp

