'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Product } from '@/types'
import Image from 'next/image'
import { createProduct, updateProduct } from '@/lib/action/product'
import { validateCreateProductForm, validateUpdateProductForm } from '@/types/validation'
import { 
  handleProductError, 
  getErrorToastMessage,
  mapErrorsToFields,
  getSuccessMessage,
  validateField
} from '@/lib/utils/error-handler'

interface ProductFormProps {
  product?: Product
  isEdit?: boolean
}

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name ?? '',
    price: product?.price?.toString() ?? '',
    desc: product?.desc ?? '',
    image: product?.image ?? ''
  })

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  const clearMessages = () => {
    setSubmitError('')
    setSuccessMessage('')
  }

  const validateFormData = () => {
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
  }

  const validateSingleField = (field: string, value: string) => {
    const isRequired = field === 'name' || field === 'price'
    const error = validateField(field, value, isRequired)
    
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }))

    return !error
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Real-time validation
    if (errors[field] || value.trim()) {
      validateSingleField(field, value)
    }
    
    clearMessages()
  }

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info !== 'string') {
      const url = result.info.secure_url
      if (url) {
        setFormData(prev => ({ ...prev, image: url }))
        // Validate image URL
        validateSingleField('image', url)
        clearMessages()
      }
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    clearMessages()

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('upload_preset', 'next_unsigned')
    uploadFormData.append('cloud_name', 'dikyoapkt')

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dikyoapkt/image/upload`, {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const data: { secure_url: string } = await response.json()
        setFormData(prev => ({ ...prev, image: data.secure_url }))
        validateSingleField('image', data.secure_url)
        setSuccessMessage('Image uploaded successfully!')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setSubmitError(`Upload failed: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setSubmitError('Please select a valid image file (JPG, PNG, GIF, WebP)')
        return
      }

      if (file.size > 5000000) {
        setSubmitError('File size must be less than 5MB')
        return
      }

      handleFileUpload(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }))
    setErrors(prev => ({ ...prev, image: '' }))
    clearMessages()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateFormData()) {
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
      if (isEdit && product?.id) {
        result = await updateProduct(product.id, productData)
      } else {
        result = await createProduct(productData)
      }

      const successMsg = getSuccessMessage(isEdit ? 'update' : 'create', result.name)
      setSuccessMessage(successMsg)

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/dashboard/products')
        router.refresh()
      }, 1500)

    } catch (error) {
      console.error('Error submitting form:', error)
      
      const errorResponse = handleProductError(error)
      const fieldErrors = mapErrorsToFields(errorResponse)
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...fieldErrors }))
      }
      
      setSubmitError(getErrorToastMessage(errorResponse))
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.name.trim() && 
           formData.price && 
           Number(formData.price) > 0 &&
           Object.values(errors).every(error => !error)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Product' : 'Create Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Success Message */}
          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {submitError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              disabled={loading}
              className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Price (IDR) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              required
              disabled={loading}
              min="0"
              step="0.01"
              className={errors.price ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              type="text"
              value={formData.desc}
              onChange={(e) => handleInputChange('desc', e.target.value)}
              disabled={loading}
              className={errors.desc ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter product description (optional)"
              maxLength={500}
            />
            {errors.desc && (
              <p className="mt-1 text-sm text-red-600">{errors.desc}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.desc.length}/500 characters
            </p>
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <div className="space-y-2">
              {/* Cloudinary Widget */}
              <CldUploadWidget
                uploadPreset="next_unsigned"
                options={{
                  cloudName: 'dikyoapkt',
                  showPoweredBy: false,
                  sources: ['local', 'url', 'camera'],
                  maxFiles: 1,
                  maxFileSize: 5000000,
                  resourceType: 'image',
                  clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                  singleUploadAutoClose: false,
                  showAdvancedOptions: false,
                  showCompletedButton: true,
                  showUploadMoreButton: false,
                  multiple: false,
                  autoMinimize: false,
                  theme: 'minimal',
                  cropping: false,
                  folder: 'products'
                }}
                onError={(error) => {
                  console.error('Upload error:', error)
                  setSubmitError('Upload failed. Please try again.')
                }}
                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                  console.log('Upload successful:', result)
                  handleUpload(result)
                }}
                onUpload={handleUpload}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    onClick={() => open()}
                    variant="outline"
                    className="w-full"
                    disabled={uploading || loading}
                  >
                    {uploading ? 'Uploading...' : formData.image ? 'Change Image' : 'Upload Image (Widget)'}
                  </Button>
                )}
              </CldUploadWidget>

              <div className="text-center text-sm text-gray-500">or</div>

              {/* Manual Upload */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading || loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={uploading || loading}
                >
                  {uploading ? 'Uploading...' : formData.image ? 'Change Image' : 'Upload Image (Manual)'}
                </Button>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="relative">
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={formData.image}
                      alt="Product preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                    disabled={loading}
                  >
                    Remove
                  </Button>
                </div>
              )}

              {errors.image && (
                <p className="text-sm text-red-600">{errors.image}</p>
              )}

              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={loading || uploading || !isFormValid()}
              className="flex-1"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEdit ? 'Update Product' : 'Create Product'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          {/* Form Status */}
          {!isFormValid() && (
            <p className="text-xs text-gray-500 text-center">
              Please fill in all required fields with valid data
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}