import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const dummyUsers = [
  {
    id: 'USR-001',
    name: 'Sharon Admin',
    email: 'sharon.admin@kam.co.ke',
    role: 'SUPERADMIN',
    status: 'Active',
    lastLogin: '2026-03-27 09:12',
  },
  {
    id: 'USR-002',
    name: 'Content Editor',
    email: 'editor@kam.co.ke',
    role: 'ADMIN',
    status: 'Active',
    lastLogin: '2026-03-26 16:40',
  },
  {
    id: 'USR-003',
    name: 'Research Analyst',
    email: 'analyst@kam.co.ke',
    role: 'PUBLIC',
    status: 'Pending',
    lastLogin: 'Never',
  },
]

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-kam-navy mb-2">Users</h1>
        <p className="text-slate-600">Monitor access roles and account status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="text-2xl font-semibold text-kam-navy">567</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Admins</p>
            <p className="text-2xl font-semibold text-kam-navy">14</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Pending Invites</p>
            <p className="text-2xl font-semibold text-kam-navy">6</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-kam-navy">User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="bg-kam-blue/5 text-left text-sm text-slate-700">
                  <th className="p-3 border-b border-slate-200">ID</th>
                  <th className="p-3 border-b border-slate-200">Name</th>
                  <th className="p-3 border-b border-slate-200">Email</th>
                  <th className="p-3 border-b border-slate-200">Role</th>
                  <th className="p-3 border-b border-slate-200">Status</th>
                  <th className="p-3 border-b border-slate-200">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {dummyUsers.map((user) => (
                  <tr key={user.id} className="text-sm hover:bg-slate-50">
                    <td className="p-3 border-b border-slate-100 text-slate-600">{user.id}</td>
                    <td className="p-3 border-b border-slate-100 font-medium text-slate-800">{user.name}</td>
                    <td className="p-3 border-b border-slate-100 text-slate-600">{user.email}</td>
                    <td className="p-3 border-b border-slate-100 text-slate-600">{user.role}</td>
                    <td className="p-3 border-b border-slate-100">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 border-b border-slate-100 text-slate-600">{user.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
