'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CldUploadWidget } from 'next-cloudinary'
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
  const [formData, setFormData] = useState({
    name: product?.name ?? '',
    price: product?.price?.toString() ?? '',
    desc: product?.desc ?? '',
    image: product?.image ?? ''
  })

  const [uploading, setUploading] = useState(false)

  const handleUpload = (result: any) => {
    const url = result?.info?.secure_url
    if (url) {
      setFormData({ ...formData, image: url })
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('upload_preset', 'next_unsigned')
    uploadFormData.append('cloud_name', 'dikyoapkt')

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dikyoapkt/image/upload`,
        {
          method: 'POST',
          body: uploadFormData
        }
      )

      if (response.ok) {
        const data = await response.json()
        setFormData({ ...formData, image: data.secure_url })
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, GIF, WebP)')
        return
      }

      // Validate file size (5MB)
      if (file.size > 5000000) {
        alert('File size must be less than 5MB')
        return
      }

      handleFileUpload(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' })
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
        throw new Error('Failed to save product')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving product')
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (IDR)</label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              type="text"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <div className="space-y-2">
              {/* Cloudinary Widget Option */}
              <CldUploadWidget
                uploadPreset="next_unsigned"
                options={{
                  cloudName: 'dikyoapkt',
                  showPoweredBy: false,
                  sources: ['local', 'url', 'camera'],
                  maxFiles: 1,
                  maxFileSize: 5000000, // 5MB
                  resourceType: 'image',
                  clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                  singleUploadAutoClose: false, // Prevent auto-close after upload
                  showAdvancedOptions: false,
                  showCompletedButton: true,
                  showUploadMoreButton: false,
                  multiple: false,
                  autoMinimize: false,
                  theme: 'minimal',
                  styles: {
                    palette: {
                      window: '#FFFFFF',
                      windowBorder: '#90A0B3',
                      tabIcon: '#0078FF',
                      menuIcons: '#5A616A',
                      textDark: '#000000',
                      textLight: '#FFFFFF',
                      link: '#0078FF',
                      action: '#FF620C',
                      inactiveTabIcon: '#0E2F5A',
                      error: '#F44235',
                      inProgress: '#0078FF',
                      complete: '#20B832',
                      sourceBg: '#E4EBF1'
                    }
                  }
                }}
                onError={(error: any) => {
                  console.error('Upload error:', error)
                  alert('Upload failed. Please try again.')
                }}
                onSuccess={(result: any) => {
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
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : formData.image ? 'Change Image' : 'Upload Image (Widget)'}
                  </Button>
                )}
              </CldUploadWidget>

              {/* Alternative: Manual File Upload */}
              <div className="text-center text-sm text-gray-500">or</div>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={uploading}
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
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}