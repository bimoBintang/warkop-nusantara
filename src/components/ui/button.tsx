import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  asChild?: boolean
  children?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button'
    
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
            'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
            'border border-gray-300 bg-white hover:bg-gray-50': variant === 'outline',
            'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
          },
          className
        )}
        ref={asChild ? undefined : ref}
        {...(asChild ? {} : props)}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button }