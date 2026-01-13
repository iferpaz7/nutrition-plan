import { CustomerForm } from '@/components/CustomerForm'

export default function NewCustomerPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <CustomerForm mode="create" />
    </div>
  )
}
