'use client'

import React, { useState, type KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface DynamicListProps {
  advertisements: string[]
  onTextChange: (newText: string[]) => void
  isEditing: boolean
}

export default function DynamicList({
  advertisements,
  onTextChange,
  isEditing,
}: DynamicListProps) {
  const [inputValue, setInputValue] = useState('')

  const addItem = () => {
    if (inputValue.trim() !== '') {
      onTextChange([...advertisements, inputValue.trim()])
      setInputValue('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addItem()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de anuncios</h2>
      {isEditing && (
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ingresa un elemento"
            className="flex-grow"
          />
          <Button onClick={addItem}>Agregar</Button>
        </div>
      )}
      <div className="w-full rounded-md border p-4 max-h-[300px] overflow-y-auto">
        <ul className="space-y-2">
          {advertisements.map((item, index) => (
            <li
              key={index}
              className="bg-gray-100 p-2 rounded break-words mb-2"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
