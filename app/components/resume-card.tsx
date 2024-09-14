'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface ResumeCardProps {
  logoUrl: string
  altText: string
  title: string
  features: readonly string[]
  subtitle?: string
  href?: string
  badges?: readonly string[]
  period: string
  description?: string
}
export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  features,
  badges,
  period,
  description,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description) {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <Link
      href={href || '#'}
      className=' cursor-pointer bg-secondary-foreground/10 rounded-md dark:bg-transparent'
      onClick={handleClick}
    >
      <Card className='flex p-6 font-sans bg-transparent border-4'>
        <div className=''>
          <Avatar className='border size-16 bg-white'>
            <AvatarImage src={logoUrl} alt={altText} className='object-contain' />
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className='flex items-center flex-col group'>
          <CardHeader>
            <div className='flex items-center justify-between gap-x-2 text-base'>
              <h3 className='inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm'>
                {title}

                <ChevronRightIcon
                  className={cn(
                    'size-9 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-blue-500',
                    isExpanded ? 'rotate-90' : 'rotate-0'
                  )}
                />
              </h3>
              <div className='text-xs text-muted-foreground text-right'>{period}</div>
            </div>
            {subtitle && <div className='font-sans text-xs'>{subtitle}</div>}
          </CardHeader>
          {description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isExpanded ? 1 : 0,

                height: isExpanded ? 'auto' : 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className='mt-2 text-xs  font-sans'
            >
              {description}
              <Separator className='my-3' />
              {features && (
                <ul className='flex w-full flex-col text-left flex-wrap gap-3  '>
                  {features.map((feature, index) => (
                    <>
                      <Badge
                        className='bg-transparent text-foreground dark:text-primary/80'
                        key={feature + index}
                      >
                        {feature}
                      </Badge>
                      <Separator />
                    </>
                  ))}
                </ul>
              )}
            </motion.div>
          )}

          {badges && (
            <span className='justify-end w-full inline-flex gap-x-3 font-sans text-xs'>
              {badges.map((badge, index) => (
                <Badge
                  variant='default'
                  className='text-[9px] leading-tight tracking-tighter'
                  key={index}
                >
                  {badge}
                </Badge>
              ))}
            </span>
          )}
        </div>
      </Card>
    </Link>
  )
}
