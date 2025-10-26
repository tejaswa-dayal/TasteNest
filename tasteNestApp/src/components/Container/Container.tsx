


type ContainerProps = {
  children: React.ReactNode,
  className? : string
}

const Container:React.FC<ContainerProps> = ({children,className}) => {
  return (
    <div className={`max-sm:px-10 sm:px-20 lg:px-30 py-6 w-full ${className}`}>
      {children}
    </div>
  )
}

export default Container
