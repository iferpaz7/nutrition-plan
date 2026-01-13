import { CustomerForm } from '@/components/CustomerForm'

export default function NewCustomerPage() {
  return (
    <div className="container mx-auto py-6 sm:py-10 px-4 max-w-3xl">
      <CustomerForm mode="create" />
    </div>
  )
}
