// hooks/use-product-form.ts
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct, type Product } from '@/lib/action/product'
import { validateCreateProductForm, validateUpdateProductForm } from '@/types/validation'
import { 
  handleProductError, 
  getErrorToastMessage,
  mapErrorsToFields,
  getSuccessMessage,
  validateField,
  type ErrorResponse
} from '@/lib/utils/error-handler'

interface ProductFormData {
  name: string
  price: string
  desc: string
  image: string
}

interface UseProductFormOptions {
  initialData?: Product
  isEdit?: boolean
  onSuccess?: (product: Product) => void
  onError?: (error: ErrorResponse) => void
  redirectPath?: string
}

interface UseProductFormReturn {
  // Form state
  formData: ProductFormData
  errors: Record<string, string>
  loading: boolean
  submitError: string
  successMessage: string
  
  // Form actions
  updateField: (field: keyof ProductFormData, value: string) => void
  validateForm: () => boolean
  validateSingleField: (field: keyof ProductFormData, value: string) => boolean
  clearMessages: () => void
  clearErrors: () => void
  resetForm: () => void
  
  // Submit handlers
  handleSubmit: (e: React.FormEvent) => Promise<void>
  
  // Form status
  isFormValid: boolean
  hasChanges: boolean
  canSubmit: boolean
}

export function useProductForm(options: UseProductFormOptions = {}): UseProductFormReturn {
  const {
    initialData,
    isEdit = false,
    onSuccess,
    onError,
    redirectPath = '/dashboard/products'
  } = options

  const router = useRouter()

  // Initial form data
  const initialFormData: ProductFormData = {
    name: initialData?.name ?? '',
    price: initialData?.price?.toString() ?? '',
    desc: initialData?.desc ?? '',
    image: initialData?.image ?? ''
  }

  // Form state
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  // Clear messages
  const clearMessages = useCallback(() => {
    setSubmitError('')
    setSuccessMessage('')
  }, [])

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setErrors({})
    clearMessages()
  }, [initialFormData, clearMessages])

  // Update single field
  const updateField = useCallback((field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    clearMessages()
  }, [errors, clearMessages])

  // Validate single field
  const validateSingleField = useCallback((field: keyof ProductFormData, value: string): boolean => {
    const isRequired = field === 'name' || field === 'price'
    const error = validateField(field, value, isRequired)
    
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }))

    return !error
  }, [])

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    clearMessages()
    setErrors({})

    const schema = isEdit ? validateUpdateProductForm : validateCreateProductForm
    const result = schema(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return false
    }

    return true
  }, [formData, isEdit, clearMessages])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setSubmitError('Please fix the validation errors before submitting.')
      return
    }

    setLoading(true)
    clearMessages()

    try {
      const productData = {
        name: formData.name.trim(),
        price: Number(formData.price),
        desc: formData.desc.trim() || undefined,
        image: formData.image.trim() || undefined
      }

      let result: Product
      if (isEdit && initialData?.id) {
        result = await updateProduct(initialData.id, productData)
      } else {
        result = await createProduct(productData)
      }

      const successMsg = getSuccessMessage(isEdit ? 'update' : 'create', result.name)
      setSuccessMessage(successMsg)

      // Call success callback if provided
      onSuccess?.(result)

      // Redirect after a short delay to show success message
      if (redirectPath) {
        setTimeout(() => {
          router.push(redirectPath)
          router.refresh()
        }, 1500)
      }

    } catch (error) {
      console.error('Error submitting form:', error)
      
      const errorResponse = handleProductError(error)
      const fieldErrors = mapErrorsToFields(errorResponse)
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...fieldErrors }))
      }
      
      const errorMessage = getErrorToastMessage(errorResponse)
      setSubmitError(errorMessage)

      // Call error callback if provided
      onError?.(errorResponse)
    } finally {
      setLoading(false)
    }
  }, [
    validateForm, 
    formData, 
    isEdit, 
    initialData?.id, 
    onSuccess, 
    onError, 
    redirectPath, 
    router, 
    clearMessages
  ])

  // Computed properties
  const isFormValid = Boolean(formData.name.trim()) && 
                     Boolean(formData.price) && 
                     Number(formData.price) > 0 &&
                     Object.values(errors).every(error => !error)

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData)

  const canSubmit = isFormValid && !loading && (hasChanges || !isEdit)

  return {
    // Form state
    formData,
    errors,
    loading,
    submitError,
    successMessage,
    
    // Form actions
    updateField,
    validateForm,
    validateSingleField,
    clearMessages,
    clearErrors,
    resetForm,
    
    // Submit handlers
    handleSubmit,
    
    // Form status
    isFormValid,
    hasChanges,
    canSubmit
  }
}

// Additional hook for image upload functionality
interface UseImageUploadOptions {
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
  cloudName?: string
  uploadPreset?: string
}

interface UseImageUploadReturn {
  uploading: boolean
  uploadError: string
  uploadFile: (file: File) => Promise<void>
  uploadFromWidget: (result: CloudinaryWidgetResult) => void
  clearUploadError: () => void
}

// Proper Cloudinary types
interface CloudinaryWidgetResultInfo {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
  type: string
  url: string
  [key: string]: unknown
}

interface CloudinaryWidgetResult {
  event: 'success' | 'close' | 'error'
  info: CloudinaryWidgetResultInfo | string
}

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
  type: string
  url: string
  error?: {
    message: string
  }
}

export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const {
    onSuccess,
    onError,
    cloudName = 'dikyoapkt',
    uploadPreset = 'next_unsigned'
  } = options

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')

  const clearUploadError = useCallback(() => {
    setUploadError('')
  }, [])

  const uploadFile = useCallback(async (file: File) => {
    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      const error = 'Please select a valid image file (JPG, PNG, GIF, WebP)'
      setUploadError(error)
      onError?.(error)
      return
    }

    if (file.size > 5000000) {
      const error = 'File size must be less than 5MB'
      setUploadError(error)
      onError?.(error)
      return
    }

    setUploading(true)
    setUploadError('')

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('upload_preset', uploadPreset)
    uploadFormData.append('cloud_name', cloudName)

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const data: CloudinaryUploadResponse = await response.json()
        onSuccess?.(data.secure_url)
      } else {
        const errorData: CloudinaryUploadResponse = await response.json()
        throw new Error(errorData.error?.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = `Upload failed: ${error instanceof Error ? error.message : 'Please try again.'}`
      setUploadError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setUploading(false)
    }
  }, [cloudName, uploadPreset, onSuccess, onError])

  // Type guard function to check if info is CloudinaryWidgetResultInfo
  const isCloudinaryWidgetResultInfo = (info: CloudinaryWidgetResultInfo | string): info is CloudinaryWidgetResultInfo => {
    return typeof info === 'object' && info !== null && 'secure_url' in info
  }

  const uploadFromWidget = useCallback((result: CloudinaryWidgetResult) => {
    if (result.event === 'success' && isCloudinaryWidgetResultInfo(result.info)) {
      onSuccess?.(result.info.secure_url)
    }
  }, [onSuccess])

  return {
    uploading,
    uploadError,
    uploadFile,
    uploadFromWidget,
    clearUploadError
  }
}