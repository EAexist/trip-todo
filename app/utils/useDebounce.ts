import {useEffect, useState} from 'react'

export const useDebounce = (value: string | undefined, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const debouncedTimer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(debouncedTimer)
    }
  }, [value, delay])

  return debouncedValue
}
