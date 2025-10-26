import type { ReactElement } from "react"

type ButtonProps = {
    className?: string;
    type?: "button" | "submit" | "reset" | undefined;
    children?: ReactElement | string | null;
    style?: Record<string,string>;
    onClick? : React.MouseEventHandler | undefined;
    disabled?:boolean;

}
const Button = ({className, type='button', children,onClick,disabled,...props}:ButtonProps):ReactElement => {
  return (
    <button className={`rounded-lg cursor-pointer  ${className}`} type={type} {...props} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
