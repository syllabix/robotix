import { ReactNode } from 'react';

type AlertKind = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  kind: AlertKind;
  icon?: ReactNode;
  children: ReactNode;
}

const typeClasses: Record<AlertKind, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

export const Alert = ({ kind: type, children, icon }: AlertProps) => {
  return (
    <div className={`alert ${typeClasses[type]}`}>
      {icon && <div className="alert-icon">{icon}</div>}
      <div className="alert-content">{children}</div>
    </div>
  );
}; 