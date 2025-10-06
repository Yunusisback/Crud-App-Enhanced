import toast from 'react-hot-toast';

const List = ({ users, deleteUser, setUserToEdit }) => {
    
    if (users.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Kayıt Defteri Boş</h3>
                <p className="text-gray-500">
                    Hemen yukarıdaki formu kullanarak bir kullanıcı ekle
                </p>
            </div>
        );
    }

    const handleDelete = (user) => {
 
        if (window.confirm(`${user.name} kullanıcısını silmek istediğinden emin misin?`)) {
            deleteUser(user.id);
        } else {
            toast.error('Silme işlemi iptal edildi.');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                <h3 className="text-xl font-semibold text-white">
                    Kullanıcı Listesi ({users.length} kişi)
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">İsim</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">E-mail</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Yaş</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody data-testid="body" id="body" className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr 
                                key={user.id} 
                                className="hover:bg-gray-50 transition-all duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">{user.age} yaş</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <button
                                            // KESİN ÇÖZÜM: Düzenleme modunu açar ve formu doldurur
                                            onClick={() => setUserToEdit(user)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                            aria-label={`${user.name} kullanıcısını düzenle`}
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            // KESİN ÇÖZÜM: Silme işlemini başlatır
                                            onClick={() => handleDelete(user)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                            aria-label={`${user.name} kullanıcısını sil`}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default List;