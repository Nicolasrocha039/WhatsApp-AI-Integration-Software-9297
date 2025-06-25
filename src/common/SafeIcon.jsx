import React from 'react'

const SafeIcon = ({ icon: IconComponent, className = '', ...props }) => {
  if (!IconComponent) {
    return <span className={`inline-block w-4 h-4 ${className}`} {...props}>⚠️</span>
  }
  
  return <IconComponent className={className} {...props} />
}

export default SafeIcon