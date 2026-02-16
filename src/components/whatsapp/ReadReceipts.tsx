import { Check, CheckCheck } from 'lucide-react';

interface ReadReceiptsProps {
  status: 'sent' | 'delivered' | 'read';
}

export default function ReadReceipts({ status }: ReadReceiptsProps) {
  if (status === 'sent') {
    return <Check size={14} className="text-gray-400" />;
  }
  return (
    <CheckCheck
      size={14}
      className={status === 'read' ? 'text-blue-400' : 'text-gray-400'}
    />
  );
}
