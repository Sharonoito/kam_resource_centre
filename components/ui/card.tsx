"use client"

import React from "react"

// Helper to join class names together
const CardClassName = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')

interface CardProps {
  children: React.ReactNode
  className?: string
  header?: React.ReactNode
  title?: string
}

export function Card({ children, className = '', header, title }: CardProps) {
  return (
    <div className={CardClassName("bg-white rounded-lg shadow-md border border-gray-200", className)}>
      {header || title ? (
        <div className="p-6 border-b border-gray-200">
          {title ? <h3 className="text-lg font-semibold text-gray-900">{title}</h3> : header}
        </div>
      ) : null}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={CardClassName("p-6 border-b border-gray-200", className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={CardClassName("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={CardClassName("p-6 pt-0", className)}>
      {children}
    </div>
  )
}