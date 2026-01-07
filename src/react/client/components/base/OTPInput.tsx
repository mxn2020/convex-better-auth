// src/react/client/components/base/OTPInput.tsx

import { Input } from '@tanstack-app/ui'
import { Label } from '@tanstack-app/ui'

export interface OTPInputProps {
  id: string
  label?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  className?: string
}

export function OTPInput({
  id,
  label,
  value,
  onChange,
  placeholder = 'Enter verification code',
  required,
  disabled,
  maxLength = 6,
  className,
}: OTPInputProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        pattern="[0-9]*"
        inputMode="numeric"
        maxLength={maxLength}
        className={className}
      />
    </div>
  )
}
