import Form from "./components/Form";
import List from "./components/List";
import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid'; 


const initialData = [
    { id: uuidv4(), name: "Mehmet Yılmaz", email: "mehmet.yilmaz@gmail.com", age: "30" },
    { id: uuidv4(), name: "Ali Kaya", email: "ali.kaya@gmail.com", age: "40" },
    { id: uuidv4(), name: "Ayşe Demir", email: "ayse.demir@gmail.com", age: "29" },
    { id: uuidv4(), name: "Kerem Can", email: "kerem.can@example.com", age: "29" },
    { id: uuidv4(), name: "Elif Su", email: "elif.su@example.com", age: "35" },
    { id: uuidv4(), name: "Burak Mert", email: "burak.mert@example.com", age: "24" },
    { id: uuidv4(), name: "Okan Güneş", email: "okan.gunes@example.com", age: "45" },
    { id: uuidv4(), name: "Deniz Arı", email: "deniz.ari@example.com", age: "38" },
    { id: uuidv4(), name: "Hakan Avcı", email: "hakan.avci@example.com", age: "50" },
    { id: uuidv4(), name: "Gizem Çam", email: "gizem.cam@example.com", age: "27" },
    { id: uuidv4(), name: "Furkan Öz", email: "furkan.oz@example.com", age: "33" },
    { id: uuidv4(), name: "Ece Bal", email: "ece.bal@example.com", age: "26" },
    { id: uuidv4(), name: "Tuna Alp", email: "tuna.alp@example.com", age: "41" },
    { id: uuidv4(), name: "Ali Demir", email: "demirali@example.com", age: "34" },
];

const App = () => {
    

    const [users, setUsers] = useState(() => {
        const localStorageKey = 'crud-users';
        

        if (import.meta.env.DEV) {
            console.log('DEV MODU: Local Storage temizlendi.');
            localStorage.removeItem(localStorageKey);
            return initialData;
        }

     
        const storedUsers = localStorage.getItem(localStorageKey);
        return storedUsers ? JSON.parse(storedUsers) : initialData;
    });

    const [userToEdit, setUserToEdit] = useState(null);

    // Veri kalıcılığını sağla (Her değişiklikte LocalStoragea kaydet)

    useEffect(() => {
        localStorage.setItem('crud-users', JSON.stringify(users));
    }, [users]);


    const addUser = (newUser) => {
        const userWithId = {
            ...newUser,
            id: uuidv4(), 
        };
        setUsers([...users, userWithId]);
        toast.success('Kullanıcı eklendi');
    };

    const deleteUser = (id) => {
        setUsers(users.filter((user) => user.id !== id));
        toast.success('Kullanıcı silindi');
    };

    const editUser = (updatedUser) => {
        setUsers(
            users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setUserToEdit(null);
        toast.success('Kullanıcı güncellendi');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                    Kullanıcı Yönetimi CRUD
                    </h1>
                </div>

                <Form 
                    addUser={addUser} 
                    editUser={editUser}
                    userToEdit={userToEdit}
                    setUserToEdit={setUserToEdit}
                />

                <List 
                    users={users} 
                    deleteUser={deleteUser}
                    setUserToEdit={setUserToEdit}
                />
            </div>
        </div>
    );
};

export default App;