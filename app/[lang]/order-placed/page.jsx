'use client'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getDictionary } from '@/app/[lang]/dictionaries.js'

const OrderPlaced = () => {
  const { router, language } = useAppContext()
  const [dict, setDict] = useState({})

  useEffect(() => {
    (async () => {
      const d = await getDictionary(language)
      setDict(d)
    })()
  }, [language])

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/${language}/my-orders`)
    }, 5000)
    return () => clearTimeout(timer)
  }, [router, language])

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='checkmark' />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">
        {dict.orderPlacedSuccessfully || "Order Placed Successfully"}
      </div>
    </div>
  )
}

export default OrderPlaced
