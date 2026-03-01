import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionLink,
  onAction,
  secondaryActionLabel,
  secondaryActionLink,
  secondaryOnAction
}) => (
  <div className="card-glass p-12 text-center rounded-2xl border-dashed border-white/10">
    {Icon && (
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
        <Icon className="text-gray-500" size={36} />
      </div>
    )}
    <h3 className="text-2xl text-white font-bold mb-3">{title}</h3>
    {description && (
      <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">{description}</p>
    )}
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {actionLabel && (
        actionLink ? (
          <Link to={actionLink} className="btn-primary px-8 py-3">
            {actionLabel}
          </Link>
        ) : (
          <button onClick={onAction} className="btn-primary px-8 py-3">
            {actionLabel}
          </button>
        )
      )}
      {secondaryActionLabel && (
        secondaryActionLink ? (
          <Link to={secondaryActionLink} className="btn-secondary px-8 py-3">
            {secondaryActionLabel}
          </Link>
        ) : (
          <button onClick={secondaryOnAction} className="btn-secondary px-8 py-3">
            {secondaryActionLabel}
          </button>
        )
      )}
    </div>
  </div>
);

export default EmptyState;
