
export function getMethodLabel(method: string): string {
  switch (method) {
    case 'cash': return 'Cash';
    case 'card': return 'Card';
    case 'shop2shop': return 'Shop2Shop';
    case 'account': return 'Account';
    default: return method;
  }
}
