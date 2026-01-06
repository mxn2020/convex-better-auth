// src/client/components/base/PasswordInput.tsx

import { Input } from '@tanstack-app/ui'
import { Label } from '@tanstack-app/ui'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export interface PasswordInputProps {
  id: string
  label?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  className?: string
}

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  autoComplete,
  className,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={className}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}
