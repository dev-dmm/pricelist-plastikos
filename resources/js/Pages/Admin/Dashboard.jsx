import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

export default function Dashboard({ auth, submissions, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Διαχείριση
                    </h2>
                </div>
            }
        >
            <Head title="Διαχείριση" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-900">
                                <h3 className="text-lg font-semibold">Συνολικές Υποβολές</h3>
                                <p className="text-3xl font-bold mt-2">{stats.total}</p>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-900">
                                <h3 className="text-lg font-semibold">Σε Αναμονή</h3>
                                <p className="text-3xl font-bold mt-2 text-yellow-600">{stats.pending}</p>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-900">
                                <h3 className="text-lg font-semibold">Επικοινωνία</h3>
                                <p className="text-3xl font-bold mt-2 text-blue-600">{stats.contacted}</p>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-900">
                                <h3 className="text-lg font-semibold">Ολοκληρωμένες</h3>
                                <p className="text-3xl font-bold mt-2 text-green-600">{stats.completed}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Γρήγορες Ενέργειες</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    href={route('admin.services.create')}
                                    className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <h3 className="font-semibold text-blue-700">Νέα Υπηρεσία</h3>
                                    <p className="text-sm text-blue-600 mt-1">Προσθήκη νέας υπηρεσίας</p>
                                </Link>

                                <Link
                                    href={route('admin.categories.create')}
                                    className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <h3 className="font-semibold text-green-700">Νέα Κατηγορία</h3>
                                    <p className="text-sm text-green-600 mt-1">Προσθήκη νέας κατηγορίας</p>
                                </Link>

                                <Link
                                    href={route('admin.materials.create')}
                                    className="block p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                                >
                                    <h3 className="font-semibold text-orange-700">Νέο Υλικό</h3>
                                    <p className="text-sm text-orange-600 mt-1">Προσθήκη νέου υλικού</p>
                                </Link>

                                <Link
                                    href={route('admin.pricing-types.create')}
                                    className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <h3 className="font-semibold text-purple-700">Νέος Τύπος Τιμολόγησης</h3>
                                    <p className="text-sm text-purple-600 mt-1">Προσθήκη νέου τύπου τιμολόγησης</p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Submissions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Πρόσφατες Υποβολές</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Όνομα
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Υπηρεσία
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Κατάσταση
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ημερομηνία
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {submissions.data.map((submission) => (
                                            <tr key={submission.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {submission.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {submission.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {submission.procedure}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        submission.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : submission.status === 'contacted'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {submission.status === 'pending'
                                                            ? 'Σε Αναμονή'
                                                            : submission.status === 'contacted'
                                                            ? 'Επικοινωνία'
                                                            : 'Ολοκληρώθηκε'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(submission.created_at).toLocaleDateString('el-GR')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}