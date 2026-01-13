import { PlanForm } from '@/components/PlanForm'

export default function NewPlanPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <PlanForm mode="create" />
    </div>
  )
}
