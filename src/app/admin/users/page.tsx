import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import database from '@/db/'
import { formatCurrency, forematNumber } from '@/lib/formatters'
import { PageHeader } from '../_components/pageHeader'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import { DeleteDropDownItem } from './_components/UserActions'

// Fetch users from the database
async function getUsers() {
  return database.user.findMany({
    select: {
      id: true,
      email: true,
      Orders: {
        select: {
          pricePaidInCents: true,
          createdAt: true,
        },
      },
    },
  })
}

// Component for the Users page
export default async function UsersPage() {
  const users = await getUsers()

  // Sort users based on the most recent order date
  const sortedUsers = users.sort(
    (
      a: { Orders: { createdAt: Date }[] },
      b: { Orders: { createdAt: Date }[] }
    ) => {
      const aLatestOrder = a.Orders?.[0]?.createdAt || new Date(0)
      const bLatestOrder = b.Orders?.[0]?.createdAt || new Date(0)
      return new Date(bLatestOrder).getTime() - new Date(aLatestOrder).getTime()
    }
  )

  return (
    <>
      <PageHeader>Customers</PageHeader>
      <UsersTable users={sortedUsers} />
    </>
  )
}

// Table component for displaying user data
function UsersTable({
  users,
}: {
  users: { id: string; email: string | null; Orders: any[] }[]
}) {
  if (users.length === 0) return <p>No customers found</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((_user) => (
          <TableRow key={_user.id}>
            <TableCell>{_user.email || 'N/A'}</TableCell>{' '}
            {/* Fallback for null email */}
            <TableCell>{forematNumber(_user.Orders.length)}</TableCell>
            <TableCell>
              {formatCurrency(
                _user.Orders.reduce(
                  (sum: number, o: { pricePaidInCents: number }) =>
                    o.pricePaidInCents + sum,
                  0
                ) / 100
              )}
            </TableCell>
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropDownItem id={_user.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
