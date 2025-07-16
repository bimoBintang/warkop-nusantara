'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Product } from '@/types'
import Image from 'next/image'

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

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info !== 'string') {
      const url = result.info.secure_url
      if (url) {
        setFormData(prev => ({ ...prev, image: url }))
      }
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)

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
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, GIF, WebP)')
        return
      }

      if (file.size > 5000000) {
        alert('File size must be less than 5MB')
        return
      }

      handleFileUpload(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit ? `/api/products/${product?.id}` : '/api/products'
      const method = isEdit ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/dashboard/products')
        router.refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`Error saving product: ${error instanceof Error ? error.message : 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Product' : 'Create Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (IDR)</label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
              disabled={loading}
              min="0"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              type="text"
              value={formData.desc}
              onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
              disabled={loading}
            />
          </div>

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
                  alert('Upload failed. Please try again.')
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

              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || uploading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}