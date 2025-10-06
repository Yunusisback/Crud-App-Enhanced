import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const validate = (formData) => {
    const newErrors = {};

    if (!formData.name.trim()) {
        newErrors.name = 'İsim alanı zorunlu';

    } else if (formData.name.trim().length < 2) {
        newErrors.name = 'İsim en az 2 karakter olmalı';
    }

    if (!formData.email.trim()) {
        newErrors.email = 'Email zorunlu';

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Geçerli bir email gir';
    }

    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        newErrors.age = 'Yaş 18-100 arasında olmalı';
    }

    return newErrors;
};


const Form = ({ addUser, editUser, userToEdit, setUserToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: ''
    });
    
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name,
                email: userToEdit.email,
                age: userToEdit.age
            });
        } else {
            setFormData({ name: '', email: '', age: '' });
        }
    }, [userToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const validationErrors = validate(formData);
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Formda hatalar var!');
            return;
        }

        if (userToEdit) {
            editUser({ ...formData, id: userToEdit.id });
        } else {
            addUser(formData);
        }

        setFormData({ name: '', email: '', age: '' });
        setErrors({});
    };

    const handleCancel = () => {
        setUserToEdit(null);
        setFormData({ name: '', email: '', age: '' });
    };
    
    // Dinamik input sınıfı
    const getInputClass = (name) => {
        return `w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 focus:shadow-lg focus:shadow-purple-500/10 ${
            errors[name] ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300'
        }`;
    };

    
    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100 transform hover:scale-[1.005] transition-transform duration-300">
            <h3 className="text-3xl font-extrabold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-pink-600">
                {userToEdit ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Oluştur'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* İsim Input */}
                <div className="group">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Adı Soyadı</label>
                    <div className="relative">
                        {/* İkon */}
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${errors.name ? 'text-red-500' : 'text-gray-400 group-hover:text-purple-500'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className={getInputClass('name')} placeholder="Ad Soyad" />
                    </div>
                    {errors.name && (<p className="text-red-500 text-sm font-medium mt-1.5 flex items-center"><span className="text-lg mr-1">⚠️</span>{errors.name}</p>)}
                </div>

                {/* Email Input */}
                <div className="group">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">E-posta Adresi</label>
                    <div className="relative">
                        
                         {/* İkon */}
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${errors.email ? 'text-red-500' : 'text-gray-400 group-hover:text-purple-500'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <input id="email" type="text" name="email" value={formData.email} onChange={handleChange} className={getInputClass('email')} placeholder="örnek@site.com" />
                    </div>
                    {errors.email && (<p className="text-red-500 text-sm font-medium mt-1.5 flex items-center"><span className="text-lg mr-1">⚠️</span>{errors.email}</p>)}
                </div>

                {/* Yaş Input */}
                <div className="group">
                    <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">Yaşınız</label>
                    <div className="relative">

                        {/* İkon */}
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${errors.age ? 'text-red-500' : 'text-gray-400 group-hover:text-purple-500'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <input id="age" type="number" name="age" value={formData.age} onChange={handleChange} className={getInputClass('age')} placeholder="18 - 100 arası" />
                    </div>
                    {errors.age && (<p className="text-red-500 text-sm font-medium mt-1.5 flex items-center"><span className="text-lg mr-1">⚠️</span>{errors.age}</p>)}
                </div>

                {/* Submit ve İptal Butonları */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className={`w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-md transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] ${
                            userToEdit 
                                ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'
                                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg shadow-purple-500/50'
                        }`}
                    >
                        {userToEdit ? 'Kullanıcıyı Güncelle' : 'Kullanıcı Ekle'}
                    </button>

                    {userToEdit && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-shrink-0 px-6 py-3.5 rounded-xl font-medium text-gray-600 border border-gray-300 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                        >
                            İptal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Form;