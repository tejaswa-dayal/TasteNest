import { type ReactElement } from 'react'

type FooterCardProps = {
    className?: string;
    children?: ReactElement | string | null;
}

const FooterCard = ({children, className,...props}:FooterCardProps):ReactElement => {
  return (
    <div className={`flex flex-col gap-4 px-4 py-4 rounded-lg bg-(--primary-color) border-b-4 border-r-4 border-(--secondary-color) max-w-65 ${className}`} {...props}>
        {children}
    </div>
  )
}

export default FooterCard
