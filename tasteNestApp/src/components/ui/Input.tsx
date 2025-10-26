import type { ReactElement, ReactNode } from "react";
import React from "react";
import {useId } from "react";


type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    type?: string;
    placeholder?:string;
    className?:string;
    label?: string;
    labelCss?: string;
    children? : ReactNode | string ;
}

const Input = ({type = "text", placeholder ='', className ='', label,labelCss,children, ...props}: InputProps, ref: React.Ref<HTMLInputElement> | undefined ) : ReactElement => {
    const inputId = useId();
  return (
    <div className="w-full flex flex-col gap-1 relative">
        {
            label && <label htmlFor={inputId} className={`block text-sm font-medium text-(--navbar-black) ${labelCss}`}>
                {label} </label>
        }
      <input type={type} placeholder={placeholder} className={`p-2 outline-(--gray-dark) outline-2 focus:outline-(--primary-color) text-(--black-color) rounded-lg transition-colors duration-300 ${className}`}  {...props} ref={ref} id={inputId}/>
      {children}
    </div>
  )
}

export default React.forwardRef(Input);
