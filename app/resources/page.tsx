'use client'

import { ResourceList } from '@/components/resources/ResourceList'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/auth/AuthContext'
import { useEffect, useState } from 'react'

import CreateResourceForm from '@/components/resources/CreateResourceForm'
export default function ResourcesPage() {
  const [resources, setResources] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/resources')
        if (response.ok) {
          const data = await response.json()
          setResources(data)
        } else {
          console.error('Failed to fetch resources')
        }
      } catch (error) {
        console.error('Error fetching resources:', error)
      }
    }

    fetchResources()
  }, [])

  return (
    <div className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Resources Sharing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Browse and share helpful resources with other students.</p>
          {user && (
            <CreateResourceForm />
          )}
          <ResourceList resources={resources} />
        </CardContent>
      </Card>
    </div>
  )
}
