'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface DeleteProductButtonProps {
  id: string
}

export default function DeleteProductButton({ id }: DeleteProductButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error deleting product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  )
}