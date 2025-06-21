'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(product?.image || null)
  const [formData, setFormData] = useState({
    name: product?.name ?? '',
    price: product?.price?.toString() ?? '',
    desc: product?.desc ?? '',
    image: product?.image ?? ''
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: uploadFormData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setFormData({ ...formData, image: url })
      } else {
        throw new Error('Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading image')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    setFormData({ ...formData, image: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="cursor-pointer"
              />
              {uploading && (
                <p className="text-sm text-blue-600">Uploading image...</p>
              )}
              
              {preview && (
                <div className="relative">
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={preview}
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
                Supported formats: JPG, PNG, GIF. Max size: 5MB
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
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}